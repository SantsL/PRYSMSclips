"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sidebar } from "@/components/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context-dev" // Atualizado para usar a versão de desenvolvimento
import { AuthModal } from "@/components/auth/auth-modal"
import { uploadClip, getCategories, getGames, getPlatforms } from "@/lib/clips"
import type { Category, Game, Platform } from "@/types/database"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function UploadPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [gameId, setGameId] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [platformId, setPlatformId] = useState("")
  const [tags, setTags] = useState("")
  const [visibility, setVisibility] = useState<"public" | "unlisted" | "private">("public")
  const [allowComments, setAllowComments] = useState(true)
  const [shareOnSocial, setShareOnSocial] = useState(true)
  const [participateInRanking, setParticipateInRanking] = useState(true)

  const [categories, setCategories] = useState<Category[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [platforms, setPlatforms] = useState<Platform[]>([])

  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesData, gamesData, platformsData] = await Promise.all([
          getCategories(),
          getGames(),
          getPlatforms(),
        ])

        setCategories(categoriesData)
        setGames(gamesData)
        setPlatforms(platformsData)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      }
    }

    fetchData()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setUploadedFile(files[0])
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setThumbnailFile(files[0])
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      setUploadedFile(files[0])
    }
  }

  const handleSubmit = async () => {
    if (!user) return
    if (!uploadedFile) {
      setUploadError("Por favor, selecione um arquivo de vídeo para enviar.")
      return
    }
    if (!title) {
      setUploadError("Por favor, adicione um título para o clipe.")
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)

      await uploadClip({
        title,
        description,
        videoFile: uploadedFile,
        thumbnailFile: thumbnailFile || undefined,
        gameId: gameId || undefined,
        categoryId: categoryId || undefined,
        platformId: platformId || undefined,
        visibility,
        tags: tagsArray,
      })

      setUploadSuccess(true)

      // Resetar o formulário
      setTimeout(() => {
        router.push("/my-clips")
      }, 2000)
    } catch (error) {
      console.error("Erro ao enviar clipe:", error)
      setUploadError("Ocorreu um erro ao enviar o clipe. Por favor, tente novamente.")
    } finally {
      setIsUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <div className="container py-8">
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <div className="container py-8">
            <div className="bg-gray-900/60 rounded-xl border border-purple-900/30 p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Faça login para enviar clipes</h2>
              <p className="text-gray-300 mb-6">Você precisa estar logado para enviar clipes para a plataforma.</p>
              <AuthModal
                defaultTab="login"
                trigger={
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                    Fazer Login
                  </Button>
                }
              />
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Enviar Novo Clipe
          </h1>

          {uploadSuccess ? (
            <Alert className="mb-6 bg-green-900/30 border-green-500/50">
              <AlertTitle className="text-white">Clipe enviado com sucesso!</AlertTitle>
              <AlertDescription className="text-green-300">
                Seu clipe foi enviado e está sendo processado. Você será redirecionado para seus clipes em instantes.
              </AlertDescription>
            </Alert>
          ) : uploadError ? (
            <Alert className="mb-6 bg-red-900/30 border-red-500/50">
              <AlertTitle className="text-white">Erro ao enviar clipe</AlertTitle>
              <AlertDescription className="text-red-300">{uploadError}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-900/60 rounded-xl border border-purple-900/30 p-6">
                <h2 className="text-xl font-semibold mb-6 text-white">Detalhes do Clipe</h2>

                <div className="space-y-6">
                  {!uploadedFile ? (
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center ${
                        isDragging
                          ? "border-purple-500 bg-purple-900/20"
                          : "border-gray-700 hover:border-purple-500/50 hover:bg-gray-800/30"
                      } transition-all duration-300`}
                      onDragOver={(e) => {
                        e.preventDefault()
                        setIsDragging(true)
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 mb-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                          <Upload className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Arraste e solte seu clipe aqui</h3>
                        <p className="text-gray-400 mb-4 max-w-md">Suporta arquivos MP4, MOV e WebM de até 100MB</p>
                        <Button
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                          onClick={() => document.getElementById("file-upload")?.click()}
                        >
                          Selecionar Arquivo
                        </Button>
                        <input
                          id="file-upload"
                          type="file"
                          accept="video/mp4,video/mov,video/webm"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-xl overflow-hidden">
                      <div className="aspect-video w-full bg-black/60 flex items-center justify-center relative">
                        <div className="text-center p-8">
                          <div className="text-xl font-bold text-purple-400 mb-2">{uploadedFile.name}</div>
                          <div className="text-sm text-gray-400">Clipe carregado com sucesso</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 text-gray-400 hover:text-white bg-black/60 hover:bg-black/80"
                          onClick={() => setUploadedFile(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-gray-300">
                        Título do Clipe
                      </Label>
                      <Input
                        id="title"
                        placeholder="Adicione um título descritivo para seu clipe"
                        className="bg-gray-800/60 border-gray-700 focus:border-purple-500/50"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-gray-300">
                        Descrição
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Descreva o que acontece no seu clipe..."
                        className="bg-gray-800/60 border-gray-700 focus:border-purple-500/50 min-h-[100px]"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="thumbnail" className="text-gray-300">
                        Thumbnail (Opcional)
                      </Label>
                      <div className="flex items-center gap-4">
                        {thumbnailFile ? (
                          <div className="relative w-32 h-18 bg-black rounded overflow-hidden">
                            <img
                              src={URL.createObjectURL(thumbnailFile) || "/placeholder.svg"}
                              alt="Thumbnail"
                              className="w-full h-full object-cover"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-1 right-1 text-gray-400 hover:text-white bg-black/60 hover:bg-black/80 h-6 w-6"
                              onClick={() => setThumbnailFile(null)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            className="border-gray-700 text-gray-300 hover:bg-gray-800/60"
                            onClick={() => document.getElementById("thumbnail-upload")?.click()}
                          >
                            Enviar Thumbnail
                          </Button>
                        )}
                        <input
                          id="thumbnail-upload"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={handleThumbnailChange}
                        />
                        <div className="text-xs text-gray-400">Recomendado: 1280x720px, formato JPG, PNG ou WebP</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="game" className="text-gray-300">
                        Jogo
                      </Label>
                      <select
                        id="game"
                        className="w-full bg-gray-800/60 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-purple-500/50"
                        value={gameId}
                        onChange={(e) => setGameId(e.target.value)}
                      >
                        <option value="">Selecione um jogo</option>
                        {games.map((game) => (
                          <option key={game.id} value={game.id}>
                            {game.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-gray-300">
                        Categoria
                      </Label>
                      <select
                        id="category"
                        className="w-full bg-gray-800/60 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-purple-500/50"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                      >
                        <option value="">Selecione uma categoria</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="platform" className="text-gray-300">
                        Plataforma
                      </Label>
                      <select
                        id="platform"
                        className="w-full bg-gray-800/60 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-purple-500/50"
                        value={platformId}
                        onChange={(e) => setPlatformId(e.target.value)}
                      >
                        <option value="">Selecione uma plataforma</option>
                        {platforms.map((platform) => (
                          <option key={platform.id} value={platform.id}>
                            {platform.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags" className="text-gray-300">
                        Tags
                      </Label>
                      <Input
                        id="tags"
                        placeholder="Adicione tags separadas por vírgula (ex: engraçado, fails, lol)"
                        className="bg-gray-800/60 border-gray-700 focus:border-purple-500/50"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-gray-900/60 rounded-xl border border-purple-900/30 p-6">
                <h2 className="text-xl font-semibold mb-6 text-white">Configurações</h2>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-300">Visibilidade</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="public"
                          name="visibility"
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 bg-gray-800"
                          checked={visibility === "public"}
                          onChange={() => setVisibility("public")}
                        />
                        <Label htmlFor="public" className="text-white">
                          Público
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="unlisted"
                          name="visibility"
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 bg-gray-800"
                          checked={visibility === "unlisted"}
                          onChange={() => setVisibility("unlisted")}
                        />
                        <Label htmlFor="unlisted" className="text-white">
                          Não listado
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="private"
                          name="visibility"
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 bg-gray-800"
                          checked={visibility === "private"}
                          onChange={() => setVisibility("private")}
                        />
                        <Label htmlFor="private" className="text-white">
                          Privado
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gray-800 my-6" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-300">Opções</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">Permitir comentários</div>
                        </div>
                        <input
                          type="checkbox"
                          id="allow-comments"
                          checked={allowComments}
                          onChange={(e) => setAllowComments(e.target.checked)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 bg-gray-800"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">Compartilhar nas redes sociais</div>
                        </div>
                        <input
                          type="checkbox"
                          id="share-social"
                          checked={shareOnSocial}
                          onChange={(e) => setShareOnSocial(e.target.checked)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 bg-gray-800"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">Participar do ranking</div>
                        </div>
                        <input
                          type="checkbox"
                          id="participate-ranking"
                          checked={participateInRanking}
                          onChange={(e) => setParticipateInRanking(e.target.checked)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 bg-gray-800"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      onClick={handleSubmit}
                      disabled={isUploading}
                    >
                      {isUploading ? "Enviando..." : "Publicar Clipe"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
