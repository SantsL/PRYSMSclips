import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { AuthProvider } from "@/contexts/auth-context-dev" // Usando a versão de desenvolvimento

export const metadata = {
  title: "PRYSMSCLIPS - Plataforma Gamer de Compartilhamento de Clipes",
  description:
    "Compartilhe seus melhores momentos de gameplay em um feed infinito. Conquiste o ranking semanal e divirta-se com nosso minigame integrado.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head />
      <body className="bg-black text-white">
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <MainNav />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
