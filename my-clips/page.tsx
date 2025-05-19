"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context-dev"
import { Button } from "@/components/ui/button"
import { ClipCard } from "@/components/clip-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserClips } from "@/lib/clips"
import type { Clip } from "@/types/database"

export default function MyClipsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [clips, setClips] = useState<Clip[]>([])
  const [loadingClips, setLoadingClips] = useState(true)

  useEffect(() => {
    // Se não estiver carregando e o usuário não estiver autenticado, redirecionar para a página de login
    if (!loading && !user) {
      router.push("/auth?redirect=/my-clips")
      return
    }

    // Se o usuário estiver autenticado, carregar os clipes
    if (user) {
      const fetchClips = async () => {
        try {
          setLoadingClips(true)
          const userClips = await getUserClips(user.id)
          setClips(userClips)
        } catch (error) {
          console.error("Erro ao carregar clipes:", error)
        } finally {
          setLoadingClips(false)
        }
      }

      fetchClips()
    }
  }, [user, loading, router])

  // Mostrar um estado de carregamento enquanto verificamos a autenticação
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Meus Clipes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-[300px] rounded-lg" />
            ))}
        </div>
      </div>
    )
  }

  // Se não estiver carregando e o usuário não estiver autenticado, não renderizar nada
  // (o redirecionamento será tratado pelo useEffect)
  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Meus Clipes</h1>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="bg-gray-800/60">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="public">Públicos</TabsTrigger>
          <TabsTrigger value="private">Privados</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {loadingClips ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-[300px] rounded-lg" />
                ))}
            </div>
          ) : clips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clips.map((clip) => (
                <ClipCard key={clip.id} clip={clip} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">Você ainda não tem clipes</h3>
              <p className="text-gray-400 mb-6">Comece a compartilhar seus melhores momentos agora!</p>
              <Button
                onClick={() => router.push("/upload")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Fazer Upload
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="public">
          {loadingClips ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-[300px] rounded-lg" />
                ))}
            </div>
          ) : clips.filter((clip) => clip.visibility === "public").length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clips
                .filter((clip) => clip.visibility === "public")
                .map((clip) => (
                  <ClipCard key={clip.id} clip={clip} />
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">Você não tem clipes públicos</h3>
              <p className="text-gray-400 mb-6">Compartilhe seus melhores momentos com a comunidade!</p>
              <Button
                onClick={() => router.push("/upload")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Fazer Upload
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="private">
          {loadingClips ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-[300px] rounded-lg" />
                ))}
            </div>
          ) : clips.filter((clip) => clip.visibility === "private").length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clips
                .filter((clip) => clip.visibility === "private")
                .map((clip) => (
                  <ClipCard key={clip.id} clip={clip} />
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">Você não tem clipes privados</h3>
              <p className="text-gray-400 mb-6">Faça upload de clipes privados para seu uso pessoal!</p>
              <Button
                onClick={() => router.push("/upload")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Fazer Upload
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
