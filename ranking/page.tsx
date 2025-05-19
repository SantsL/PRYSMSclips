import { UserCard } from "@/components/user-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RankingPage() {
  // Dados simulados para os usuários
  const topUsers = [
    {
      username: "ProGamer123",
      avatar: "/placeholder.svg?height=80&width=80",
      rank: 1,
      followers: 25000,
      clips: 87,
      isFollowing: true,
    },
    {
      username: "GameMaster",
      avatar: "/placeholder.svg?height=80&width=80",
      rank: 2,
      followers: 18500,
      clips: 65,
      isFollowing: false,
    },
    {
      username: "NinjaStreamer",
      avatar: "/placeholder.svg?height=80&width=80",
      rank: 3,
      followers: 15200,
      clips: 54,
      isFollowing: true,
    },
    {
      username: "GamerGirl",
      avatar: "/placeholder.svg?height=80&width=80",
      rank: 4,
      followers: 12800,
      clips: 42,
      isFollowing: false,
    },
    {
      username: "EsportsLegend",
      avatar: "/placeholder.svg?height=80&width=80",
      rank: 5,
      followers: 10500,
      clips: 38,
      isFollowing: false,
    },
    {
      username: "StreamerPro",
      avatar: "/placeholder.svg?height=80&width=80",
      rank: 6,
      followers: 9800,
      clips: 35,
      isFollowing: true,
    },
    {
      username: "GameWizard",
      avatar: "/placeholder.svg?height=80&width=80",
      rank: 7,
      followers: 8600,
      clips: 31,
      isFollowing: false,
    },
    {
      username: "ProPlayer",
      avatar: "/placeholder.svg?height=80&width=80",
      rank: 8,
      followers: 7500,
      clips: 28,
      isFollowing: false,
    },
    {
      username: "GamingGuru",
      avatar: "/placeholder.svg?height=80&width=80",
      rank: 9,
      followers: 6800,
      clips: 25,
      isFollowing: true,
    },
    {
      username: "ClipMaster",
      avatar: "/placeholder.svg?height=80&width=80",
      rank: 10,
      followers: 6200,
      clips: 23,
      isFollowing: false,
    },
  ]

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
        Ranking Semanal
      </h1>

      <Tabs defaultValue="global" className="mb-8">
        <TabsList className="bg-gray-900/60 border border-purple-900/30">
          <TabsTrigger value="global" className="data-[state=active]:bg-purple-900/30">
            Global
          </TabsTrigger>
          <TabsTrigger value="following" className="data-[state=active]:bg-purple-900/30">
            Seguindo
          </TabsTrigger>
          <TabsTrigger value="games" className="data-[state=active]:bg-purple-900/30">
            Por Jogo
          </TabsTrigger>
        </TabsList>
        <TabsContent value="global" className="mt-6">
          <div className="grid grid-cols-1 gap-4">
            {topUsers.map((user) => (
              <UserCard key={user.username} {...user} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="following" className="mt-6">
          <div className="grid grid-cols-1 gap-4">
            {topUsers
              .filter((user) => user.isFollowing)
              .map((user) => (
                <UserCard key={user.username} {...user} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="games" className="mt-6">
          <div className="p-8 text-center text-gray-400">Selecione um jogo para ver o ranking específico</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
