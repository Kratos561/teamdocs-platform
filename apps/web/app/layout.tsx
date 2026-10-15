import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeamDocs",
  description: "Edición colaborativa en tiempo real para equipos"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[#f9fafb] text-zinc-950 antialiased">{children}</body>
    </html>
  );
}
