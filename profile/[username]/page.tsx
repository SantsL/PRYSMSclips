"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShareProfileModal } from "@/components/share-profile-modal"
import { useAuth } from "@/contexts/auth-context-dev"
import {
  Edit,
  Settings,
  Share2,
  Trophy,
  Users,
  Eye,
  Heart,
  MessageSquare,
  Gamepad2,
  Sparkles,
  Coins,
} from "lucide-react"

export default function ProfilePage() {
  const { username } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const [isCurrentUser, setIsCurrentUser] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [profileData, setProfileData] = useState({
    username: username as string,
    displayName: "Gamer Pro",
    avatar: "/placeholder.svg?height=150&width=150",
    banner: "/placeholder.svg?height=300&width=1200",
    bio: "Jogador profissional de FPS. Compartilhando meus melhores momentos!",
    followers: 1245,
    following: 328,
    clips: 87,
    views: 45600,
    likes: 8900,
    comments: 1200,
    level: 42,
    xp: 8500,
    nextLevelXp: 10000,
    badges: [
      { id: "1", name: "Streamer Verificado", icon: "🎮" },
      { id: "2", name: "Top 100 Fortnite", icon: "🏆" },
      { id: "3", name: "Criador de Conteúdo", icon: "📹" },
    ],
    isPremium: true,
    customTheme: "cyber",
    customBadges: true,
    customStats: true,
    prysmsBalance: 2500,
  })

  const [userClips, setUserClips] = useState([
    {
      id: "1",
      title: "Vitória épica no último segundo!",
      game: "Fortnite",
      views: 15420,
      likes: 1200,
      comments: 89,
      thumbnail: "/placeholder.svg?height=720&width=1280",
      featured: true,
    },
    {
      id: "2",
      title: "Sequência de 10 kills sem morrer",
      game: "Call of Duty",
      views: 8932,
      likes: 754,
      comments: 42,
      thumbnail: "/placeholder.svg?height=720&width=1280",
    },
    {
      id: "3",
      title: "Clutch 1v5 com a Jett",
      game: "Valorant",
      views: 9876,
      likes: 876,
      comments: 54,
      thumbnail: "/placeholder.svg?height=720&width=1280",
    },
  ])

  useEffect(() => {
    if (user && user.username === username) {
      setIsCurrentUser(true)
    }
  }, [user, username])

  // Temas personalizados
  const themes = {
    default: {
      gradient: "from-purple-400 to-pink-400",
      buttonGradient: "from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
      statsBackground: "bg-gray-900/60",
      statsBorder: "border-purple-900/30",
    },
    cyber: {
      gradient: "from-cyan-400 to-blue-500",
      buttonGradient: "from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700",
      statsBackground: "bg-blue-900/20",
      statsBorder: "border-blue-500/30",
    },
    neon: {
      gradient: "from-green-400 to-emerald-500",
      buttonGradient: "from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
      statsBackground: "bg-green-900/20",
      statsBorder: "border-green-500/30",
    },
    fire: {
      gradient: "from-red-400 to-orange-500",
      buttonGradient: "from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700",
      statsBackground: "bg-red-900/20",
      statsBorder: "border-red-500/30",
    },
  }

  const currentTheme = themes[profileData.customTheme as keyof typeof themes] || themes.default

  return (
    <div className="container mx-auto py-8">
      {/* Banner e Avatar */}
      <div className="relative mb-20">
        <div className="h-64 rounded-xl overflow-hidden">
          <img src={profileData.banner || "/placeholder.svg"} alt="Banner" className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-16 left-8 flex items-end">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-black overflow-hidden">
              <img
                src={profileData.avatar || "/placeholder.svg"}
                alt={profileData.displayName}
                className="w-full h-full object-cover"
              />
            </div>
            {profileData.isPremium && (
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full p-1.5">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
          <div className="ml-4 mb-4">
            <h1
              className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${currentTheme.gradient}`}
            >
              {profileData.displayName}
            </h1>
            <div className="flex items-center text-gray-400">
              <span>@{profileData.username}</span>
              {profileData.isPremium && (
                <Badge className="ml-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
          {isCurrentUser ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="bg-black/50 border-gray-700 hover:bg-black/70"
                onClick={() => router.push("/settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-black/50 border-gray-700 hover:bg-black/70"
                onClick={() => router.push("/settings/profile")}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="bg-black/50 border-gray-700 hover:bg-black/70"
                onClick={() => setShareOpen(true)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              <Button className={`bg-gradient-to-r ${currentTheme.buttonGradient}`} size="sm">
                <Users className="h-4 w-4 mr-2" />
                Seguir
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Bio e Estatísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-gray-900/60 rounded-xl border border-purple-900/30 p-6 mb-6">
            <h2 className="text-xl font-bold mb-2">Sobre</h2>
            <p className="text-gray-300">{profileData.bio}</p>
          </div>

          {profileData.badges.length > 0 && (
            <div className="bg-gray-900/60 rounded-xl border border-purple-900/30 p-6">
              <h2 className="text-xl font-bold mb-4">Conquistas</h2>
              <div className="flex flex-wrap gap-2">
                {profileData.badges.map((badge) => (
                  <Badge
                    key={badge.id}
                    className={`text-sm py-1.5 px-3 bg-gradient-to-r ${
                      profileData.customBadges ? currentTheme.gradient : "from-purple-400 to-pink-400"
                    } text-white border-0`}
                  >
                    <span className="mr-1">{badge.icon}</span>
                    {badge.name}
                  </Badge>
                ))}
                {profileData.customBadges && (
                  <Button variant="outline" size="sm" className="border-dashed border-gray-700 hover:bg-gray-800/60">
                    <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
                    Mais Conquistas
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className={`rounded-xl border p-6 ${currentTheme.statsBackground} ${currentTheme.statsBorder}`}>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{profileData.followers.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Seguidores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{profileData.following.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Seguindo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{profileData.clips.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Clipes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{profileData.views.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Visualizações</div>
              </div>
            </div>

            {profileData.isPremium && profileData.customStats && (
              <>
                <h3 className="font-semibold mb-2 flex items-center">
                  <Trophy className="h-4 w-4 mr-2 text-yellow-400" />
                  Estatísticas Avançadas
                </h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 flex items-center">
                      <Eye className="h-4 w-4 mr-1" /> Média de visualizações
                    </span>
                    <span className="font-medium">{Math.round(profileData.views / profileData.clips)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 flex items-center">
                      <Heart className="h-4 w-4 mr-1" /> Taxa de engajamento
                    </span>
                    <span className="font-medium">
                      {Math.round(((profileData.likes + profileData.comments) / profileData.views) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" /> Comentários por clipe
                    </span>
                    <span className="font-medium">{Math.round(profileData.comments / profileData.clips)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 flex items-center">
                      <Gamepad2 className="h-4 w-4 mr-1" /> Jogos favoritos
                    </span>
                    <span className="font-medium">Fortnite, Valorant</span>
                  </div>
                </div>
              </>
            )}

            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">Nível {profileData.level}</span>
                  <span className="text-xs text-gray-400">
                    {profileData.xp}/{profileData.nextLevelXp} XP
                  </span>
                </div>
                {profileData.isPremium && (
                  <div className="flex items-center text-yellow-400 text-sm">
                    <Coins className="h-4 w-4 mr-1" />
                    <span>{profileData.prysmsBalance}</span>
                  </div>
                )}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${currentTheme.gradient}`}
                  style={{ width: `${(profileData.xp / profileData.nextLevelXp) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {profileData.isPremium && (
            <div className="mt-4">
              <Button
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600"
                onClick={() => router.push("/store")}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Personalizar Perfil
              </Button>
            </div>
          )}

          {!profileData.isPremium && (
            <div className="mt-4 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-xl border border-yellow-500/30 p-4">
              <h3 className="font-semibold mb-2 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
                Desbloqueie recursos premium
              </h3>
              <p className="text-sm text-gray-300 mb-3">
                Personalize seu perfil, desbloqueie estatísticas avançadas e muito mais!
              </p>
              <Button
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600"
                onClick={() => router.push("/prysms")}
              >
                <Coins className="h-4 w-4 mr-2" />
                Obter PRYSMS
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Clipes */}
      <Tabs defaultValue="clips" className="w-full">
        <TabsList className="bg-gray-900/60 border border-purple-900/30">
          <TabsTrigger value="clips" className="data-[state=active]:bg-purple-900/30">
            Clipes
          </TabsTrigger>
          <TabsTrigger value="liked" className="data-[state=active]:bg-purple-900/30">
            Curtidos
          </TabsTrigger>
          <TabsTrigger value="saved" className="data-[state=active]:bg-purple-900/30">
            Salvos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="clips" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userClips.map((clip) => (
              <Card key={clip.id} className="bg-gray-900/60 border-purple-900/30 overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={clip.thumbnail || "/placeholder.svg"}
                    alt={clip.title}
                    className="w-full h-full object-cover"
                  />
                  {clip.featured && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-medium flex items-center">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Destaque
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1 line-clamp-1">{clip.title}</h3>
                  <div className="text-sm text-gray-400 mb-3">{clip.game}</div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{clip.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      <span>{clip.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span>{clip.comments.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="liked" className="mt-6">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Nenhum clipe curtido</h3>
            <p className="text-gray-400">Os clipes que você curtir aparecerão aqui.</p>
          </div>
        </TabsContent>
        <TabsContent value="saved" className="mt-6">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Nenhum clipe salvo</h3>
            <p className="text-gray-400">Os clipes que você salvar aparecerão aqui.</p>
          </div>
        </TabsContent>
      </Tabs>

      <ShareProfileModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        username={profileData.username}
        displayName={profileData.displayName}
      />
    </div>
  )
}
