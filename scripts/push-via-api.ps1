# Sube el árbol actual a GitHub SOLO por REST API (sin usar `git`).
# Uso (tu terminal o el agente con $env:GH_TOKEN ya exportado):
#   $env:GH_TOKEN="ghp_..."; .\scripts\push-via-api.ps1
# Crea blobs + tree + commit + ref heads/main. Idempotente: si la ref ya existe, apila encima.
param(
  [string]$Owner = "Kratos561",
  [string]$Repo = "teamdocs-platform",
  [string]$Branch = "main",
  [string]$Message = "feat: scaffold Fase 1 teamdocs-platform (web+collab+db, health, CI) + docs + scripts (via API)"
)
$ErrorActionPreference = "Stop"
$token = $env:GH_TOKEN
if (-not $token) { throw "Falta GH_TOKEN en env." }
$base = "https://api.github.com/repos/$Owner/$Repo"
$headers = @{
  Authorization = "Bearer $token"
  Accept = "application/vnd.github+json"
  "X-GitHub-Api-Version" = "2022-11-28"
}

# Ref actual (si existe, será parent; si 404/409, commit inicial en repo vacío)
$parentSha = $null
try {
  $ref = Invoke-RestMethod -Uri "$base/git/ref/heads/$Branch" -Headers $headers -Method Get
  $parentSha = $ref.object.sha
  Write-Host "Ref existe: $Branch -> $parentSha (se apilará encima)"
} catch {
  $code = 0
  try { $code = [int]$_.Exception.Response.StatusCode.value__ } catch { $code = 0 }
  $body = ""
  try { $body = $_.ErrorDetails.Message } catch { $body = "" }
  if ($code -eq 404 -or $code -eq 409 -or $body -match "empty") {
    Write-Host "Ref no existe (repo vacío): commit inicial en $Branch"
  } else { throw }
}

$root = Split-Path -Parent $PSScriptRoot
$files = Get-ChildItem -Path $root -Recurse -File | Where-Object {
  $_.FullName -notmatch '\\\.(git|next|swc-cache)\\|\\node_modules\\'
} | Sort-Object FullName

# Repo vacío: Git Data API devuelve 409 hasta el primer commit.
# Crear README.md por Contents API (crea commit inicial + ref), luego seguir con Data API.
if (-not $parentSha) {
  $first = $files | Where-Object { $_.FullName -match 'README\.md$' } | Select-Object -First 1
  if (-not $first) { $first = $files[0] }
  $rel1 = $first.FullName.Substring($root.Length + 1) -replace '\\', '/'
  Write-Host "Repo vacío: commit inicial vía Contents API ($rel1)"
  $b1 = [System.Convert]::ToBase64String([System.IO.File]::ReadAllBytes($first.FullName))
  $putBody = @{ message = "init: $rel1 (via API)"; content = $b1; branch = $Branch } | ConvertTo-Json
  Invoke-RestMethod -Uri "$base/contents/$rel1" -Headers $headers -Method Put `
    -ContentType "application/json" -Body $putBody | Out-Null
  $ref = Invoke-RestMethod -Uri "$base/git/ref/heads/$Branch" -Headers $headers -Method Get
  $parentSha = $ref.object.sha
  Write-Host "Commit inicial OK -> $parentSha"
}

$tree = @()
$i = 0
foreach ($f in $files) {
  $i++
  $rel = $f.FullName.Substring($root.Length + 1) -replace '\\', '/'
  Write-Host "[$i/$($files.Count)] blob $rel"
  $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
  $b64 = [System.Convert]::ToBase64String($bytes)
  $blob = Invoke-RestMethod -Uri "$base/git/blobs" -Headers $headers -Method Post `
    -ContentType "application/json" `
    -Body (@{ content = $b64; encoding = "base64" } | ConvertTo-Json)
  $tree += @{ path = $rel; mode = "100644"; type = "blob"; sha = $blob.sha }
}

Write-Host "Creando tree con $($tree.Count) entradas..."
$treeRes = Invoke-RestMethod -Uri "$base/git/trees" -Headers $headers -Method Post `
  -ContentType "application/json" `
  -Body (@{ tree = $tree } | ConvertTo-Json -Depth 10)

Write-Host "Creando commit..."
$commitBody = @{ message = $Message; tree = $treeRes.sha }
if ($parentSha) { $commitBody.parents = @($parentSha) } else { $commitBody.parents = @() }
$commit = Invoke-RestMethod -Uri "$base/git/commits" -Headers $headers -Method Post `
  -ContentType "application/json" `
  -Body ($commitBody | ConvertTo-Json -Depth 10)

if ($parentSha) {
  Write-Host "Actualizando ref heads/$Branch -> $($commit.sha)"
  Invoke-RestMethod -Uri "$base/git/refs/heads/$Branch" -Headers $headers -Method Patch `
    -ContentType "application/json" `
    -Body (@{ sha = $commit.sha } | ConvertTo-Json) | Out-Null
} else {
  Write-Host "Creando ref heads/$Branch -> $($commit.sha)"
  Invoke-RestMethod -Uri "$base/git/refs" -Headers $headers -Method Post `
    -ContentType "application/json" `
    -Body (@{ ref = "refs/heads/$Branch"; sha = $commit.sha } | ConvertTo-Json) | Out-Null
}
Write-Host "OK commit $($commit.sha) en $Owner/$Repo@$Branch"
