# Ejecutar EN TU TERMINAL (no en el agente: el sandbox bloquea `git remote add`).
# Requiere: repo GitHub ya creado (Kratos561/teamdocs-platform) + credencial (gh auth login o token con scope repo).
git remote add origin https://github.com/Kratos561/teamdocs-platform.git
git branch -M main
git push -u origin main
# Tras el push, habilitar Pages: GitHub -> Settings -> Pages -> Deploy from branch -> main / docs
