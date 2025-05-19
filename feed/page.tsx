"use client"

import { useState } from "react"
import { ClipCard } from "@/components/clip-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Filter, Smartphone, Monitor, Gamepad } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [activePlatformFilter, setActivePlatformFilter] = useState<string | null>(null)

  // Dados simulados para os clipes
  const featuredClips = [
    {
      id: "1",
      username: "ProGamer123",
      avatar: "/placeholder.svg?height=40&width=40",
      game: "Fortnite",
      title: "Vitória épica no último segundo!",
      views: 15420,
      likes: 1200,
      comments: 89,
      thumbnail: "/placeholder.svg?height=720&width=1280",
      featured: true,
      platform: "pc",
      category: "highlights",
    },
    {
      id: "2",
      username: "GameMaster",
      avatar: "/placeholder.svg?height=40&width=40",
      game: "Call of Duty",
      title: "Sequência de 10 kills sem morrer",
      views: 8932,
      likes: 754,
      comments: 42,
      thumbnail: "/placeholder.svg?height=720&width=1280",
      featured: true,
      platform: "xbox",
      category: "highlights",
    },
  ]

  const regularClips = [
    {
      id: "3",
      username: "NinjaStreamer",
      avatar: "/placeholder.svg?height=40&width=40",
      game: "League of Legends",
      title: "Pentakill com Yasuo mid lane",
      views: 6543,
      likes: 432,
      comments: 28,
      thumbnail: "/placeholder.svg?height=720&width=1280",
      platform: "pc",
      category: "highlights",
    },
    {
      id: "4",
      username: "GamerGirl",
      avatar: "/placeholder.svg?height=40&width=40",
      game: "Valorant",
      title: "Clutch 1v5 com a Jett",
      views: 9876,
      likes: 876,
      comments: 54,
      thumbnail: "/placeholder.svg?height=720&width=1280",
      platform: "pc",
      category: "highlights",
    },
    {
      id: "5",
      username: "EsportsLegend",
      avatar: "/placeholder.svg?height=40&width=40",
      game: "CS:GO",
      title: "Ace com AWP na Mirage",
      views: 12543,
      likes: 1100,
      comments: 76,
      thumbnail: "/placeholder.svg?height=720&width=1280",
      platform: "pc",
      category: "highlights",
    },
    {
      id: "6",
      username: "StreamerPro",
      avatar: "/placeholder.svg?height=40&width=40",
      game: "Apex Legends",
      title: "20 kills solo vs squad",
      views: 7654,
      likes: 543,
      comments: 32,
      thumbnail: "/placeholder.svg?height=720&width=1280",
      platform: "xbox",
      category: "highlights",
    },
    {
      id: "7",
      username: "GameWizard",
      avatar: "/placeholder.svg?height=40&width=40",
      game: "Minecraft",
      title: "Construção épica de castelo medieval",
      views: 5432,
      likes: 321,
      comments: 18,
      thumbnail: "/placeholder.svg?height=720&width=1280",
      platform: "pc",
      category: "creative",
    },
    {
      id: "8",
      username: "ProPlayer",
      avatar: "/placeholder.svg?height=40&width=40",
      game: "Rocket League",
      title: "Gol de bicicleta do meio campo",
      views: 8765,
      likes: 765,
      comments: 43,
      thumbnail: "/placeholder.svg?height=720&width=1280",
      platform: "pc",
      category: "highlights",
    },
  ]

  // Clipes engraçados
  const funnyClips = [
    {
      id: "9",
      username: "FunnyGamer",
      avatar: "/placeholder.svg?height=40&width=40",
      game: "Fortnite",
      title: "Tentei construir e caí da montanha 😂",
      views: 18765,
      likes: 1543,
      comments: 98,
      thumbnail: "/placeholder.svg?height=720&width=1280",
      platform: "pc",
      category: "funny",
    },
    {
      id: "10",
      username: "TrollMaster",
      avatar: "/placeholder.svg?height=40&width=40",
      game: "GTA V",
      title: "Trollando jogadores com o helicóptero",
      views: 12432,
      likes: 987,
      comments: 76,
      thumbnail: "/placeholder.svg?height=720&width=1280",
      platform: "xbox",
      category: "funny",
    },
    {
      id: "11",
      username: "FailCompilation",
      avatar: "/placeholder.svg?height=40&width=40",
      game: "Minecraft",
      title: "Tentei fazer parkour e deu tudo errado",
      views: 9876,
      likes: 876,
      comments: 65,
      thumbnail: "/placeholder.svg?height=720&width=1280",
      platform: "pc",
      category: "funny",
    },
    {
      id: "12",
      username: "MobileGamer",
      avatar: "/placeholder.svg?height=40&width=40",
      game: "PUBG Mobile",
      title: "Bug hilário me fez voar pelo mapa inteiro",
      views: 7654,
      likes: 654,
      comments: 43,
      thumbnail: "/placeholder.svg?height=720&width=1280",
      platform: "mobile",
      category: "funny",
    },
  ]

  // Clipes de mobile
  const mobileClips = [
    {
      id: "13",
      username: "MobilePro",
      avatar: "/placeholder.svg?height=40&width=40",
      game: "PUBG Mobile",
      title: "Chicken Dinner com 15 kills no celular",
      views: 8765,
      likes: 765,
      comments: 54,
      thumbnail: "/placeholder.svg?height=720&width=1280",
      platform: "mobile",
      category: "highlights",
    },
    {
      id: "14",
      username: "TabletGamer",
      avatar: "/placeholder.svg?height=40&width=40",
      game: "Call of Duty Mobile",
      title: "Melhor jogada da temporada no tablet",
      views: 6543,
      likes: 543,
      comments: 32,
      thumbnail: "/placeholder.svg?height=720&width=1280",
      platform: "mobile",
      category: "highlights",
    },
  ]

  // Função para filtrar clipes por categoria e plataforma
  const filterClips = (clips: any[], category: string, platform: string | null) => {
    let filtered = clips

    if (category !== "all") {
      filtered = filtered.filter((clip) => clip.category === category)
    }

    if (platform) {
      filtered = filtered.filter((clip) => clip.platform === platform)
    }

    return filtered
  }

  // Combinar todos os clipes para filtragem
  const allClips = [...featuredClips, ...regularClips, ...funnyClips, ...mobileClips]

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Feed de Clipes
        </h1>

        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-950/30">
                <Filter className="h-4 w-4 mr-2" />
                {activePlatformFilter ? `Plataforma: ${activePlatformFilter}` : "Filtrar por Plataforma"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-900 border-purple-900/50">
              <DropdownMenuLabel className="text-gray-300">Plataformas</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className={`hover:bg-gray-800 ${!activePlatformFilter ? "bg-purple-900/30" : ""}`}
                  onClick={() => setActivePlatformFilter(null)}
                >
                  <span className="mr-2">🎮</span>
                  <span>Todas</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`hover:bg-gray-800 ${activePlatformFilter === "pc" ? "bg-purple-900/30" : ""}`}
                  onClick={() => setActivePlatformFilter("pc")}
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  <span>PC</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`hover:bg-gray-800 ${activePlatformFilter === "mobile" ? "bg-purple-900/30" : ""}`}
                  onClick={() => setActivePlatformFilter("mobile")}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  <span>Mobile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`hover:bg-gray-800 ${activePlatformFilter === "xbox" ? "bg-purple-900/30" : ""}`}
                  onClick={() => setActivePlatformFilter("xbox")}
                >
                  <Gamepad className="h-4 w-4 mr-2" />
                  <span>Console</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="bg-gray-900/60 border border-purple-900/30 mb-6">
          <TabsTrigger value="all" className="data-[state=active]:bg-purple-900/30">
            Todos
          </TabsTrigger>
          <TabsTrigger value="highlights" className="data-[state=active]:bg-purple-900/30">
            Destaques
          </TabsTrigger>
          <TabsTrigger value="funny" className="data-[state=active]:bg-purple-900/30">
            Momentos Engraçados
          </TabsTrigger>
          <TabsTrigger value="creative" className="data-[state=active]:bg-purple-900/30">
            Criativos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {!activePlatformFilter && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 text-gray-300">Em Destaque</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredClips.map((clip) => (
                  <ClipCard key={clip.id} {...clip} />
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-300">
              {activePlatformFilter
                ? `Clipes de ${
                    activePlatformFilter === "pc" ? "PC" : activePlatformFilter === "mobile" ? "Mobile" : "Console"
                  }`
                : "Clipes Recentes"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterClips(allClips, "all", activePlatformFilter)
                .filter((clip) => !clip.featured || activePlatformFilter)
                .map((clip) => (
                  <ClipCard key={clip.id} {...clip} />
                ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="highlights">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterClips(allClips, "highlights", activePlatformFilter).map((clip) => (
              <ClipCard key={clip.id} {...clip} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="funny">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-300">
              {activePlatformFilter
                ? `Momentos Engraçados de ${
                    activePlatformFilter === "pc" ? "PC" : activePlatformFilter === "mobile" ? "Mobile" : "Console"
                  }`
                : "Momentos Engraçados"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterClips(funnyClips, "funny", activePlatformFilter).map((clip) => (
                <ClipCard key={clip.id} {...clip} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="creative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterClips(allClips, "creative", activePlatformFilter).map((clip) => (
              <ClipCard key={clip.id} {...clip} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
