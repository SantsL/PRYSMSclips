"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { useAuth } from "@/contexts/auth-context-dev"

export default function AuthPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"
  const [activeTab, setActiveTab] = useState("login")

  useEffect(() => {
    // Se o usuário já estiver autenticado, redirecionar para a página solicitada
    if (!loading && user) {
      router.push(redirect)
    }
  }, [user, loading, router, redirect])

  const handleLoginSuccess = () => {
    router.push(redirect)
  }

  const handleRegisterSuccess = () => {
    // Após o registro bem-sucedido, mudar para a aba de login
    setActiveTab("login")
  }

  // Mostrar um estado de carregamento enquanto verificamos a autenticação
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-8 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Carregando...</h1>
          </div>
        </div>
      </div>
    )
  }

  // Se o usuário já estiver autenticado, não renderizar nada
  // (o redirecionamento será tratado pelo useEffect)
  if (user) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Bem-vindo ao PRYSMS Clips</h1>
          <p className="text-gray-400 mt-2">Entre ou crie uma conta para continuar</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/60">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Criar Conta</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-6">
            <LoginForm onSuccess={handleLoginSuccess} />
          </TabsContent>
          <TabsContent value="register" className="mt-6">
            <RegisterForm onSuccess={handleRegisterSuccess} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
