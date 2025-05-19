import { GameCard } from "@/components/game-card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"

export default function ExplorePage() {
  // Dados simulados para os jogos
  const trendingGames = [
    {
      id: "fortnite",
      name: "Fortnite",
      image: "/placeholder.svg?height=720&width=1280",
      clips: 15420,
      trending: true,
    },
    {
      id: "call-of-duty",
      name: "Call of Duty",
      image: "/placeholder.svg?height=720&width=1280",
      clips: 12543,
      trending: true,
    },
    {
      id: "valorant",
      name: "Valorant",
      image: "/placeholder.svg?height=720&width=1280",
      clips: 9876,
      trending: true,
    },
    {
      id: "league-of-legends",
      name: "League of Legends",
      image: "/placeholder.svg?height=720&width=1280",
      clips: 8932,
      trending: true,
    },
  ]

  const popularGames = [
    {
      id: "minecraft",
      name: "Minecraft",
      image: "/placeholder.svg?height=720&width=1280",
      clips: 7654,
    },
    {
      id: "apex-legends",
      name: "Apex Legends",
      image: "/placeholder.svg?height=720&width=1280",
      clips: 6543,
    },
    {
      id: "cs-go",
      name: "CS:GO",
      image: "/placeholder.svg?height=720&width=1280",
      clips: 5432,
    },
    {
      id: "gta-v",
      name: "GTA V",
      image: "/placeholder.svg?height=720&width=1280",
      clips: 4321,
    },
    {
      id: "rocket-league",
      name: "Rocket League",
      image: "/placeholder.svg?height=720&width=1280",
      clips: 3210,
    },
    {
      id: "overwatch",
      name: "Overwatch",
      image: "/placeholder.svg?height=720&width=1280",
      clips: 2109,
    },
  ]

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
        Explorar
      </h1>

      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Buscar jogos, categorias..."
          className="pl-10 bg-gray-900/60 border-purple-900/30 focus:border-purple-500/50"
        />
      </div>

      <Tabs defaultValue="games" className="mb-8">
        <TabsList className="bg-gray-900/60 border border-purple-900/30">
          <TabsTrigger value="games" className="data-[state=active]:bg-purple-900/30">
            Jogos
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-purple-900/30">
            Categorias
          </TabsTrigger>
          <TabsTrigger value="creators" className="data-[state=active]:bg-purple-900/30">
            Criadores
          </TabsTrigger>
        </TabsList>
        <TabsContent value="games" className="mt-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-300">Em Alta</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {trendingGames.map((game) => (
                <GameCard key={game.id} {...game} />
              ))}
            </div>

            <h2 className="text-lg font-semibold mb-4 text-gray-300">Populares</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularGames.map((game) => (
                <GameCard key={game.id} {...game} />
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="categories" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {["FPS", "Battle Royale", "MOBA", "RPG", "Esportes", "Corrida", "Estratégia", "Simulação"].map(
              (category) => (
                <div
                  key={category}
                  className="bg-gray-900/60 rounded-lg overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 group"
                >
                  <div className="aspect-video w-full bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center p-6">
                    <h3 className="text-xl font-bold text-white">{category}</h3>
                  </div>
                </div>
              ),
            )}
          </div>
        </TabsContent>
        <TabsContent value="creators" className="mt-6">
          <div className="p-8 text-center text-gray-400">Conteúdo de criadores em breve</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
