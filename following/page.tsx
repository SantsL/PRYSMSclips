import { ClipCard } from "@/components/clip-card"
import { Sidebar } from "@/components/sidebar"
import { UserCard } from "@/components/user-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FollowingPage() {
  // Dados simulados para os usuários seguidos
  const followingUsers = [
    {
      username: "GameMaster",
      avatar: "/placeholder.svg?height=80&width=80",
      rank: 2,
      followers: 18500,
      clips: 65,
      isFollowing: true,
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
      username: "StreamerPro",
      avatar: "/placeholder.svg?height=80&width=80",
      rank: 6,
      followers: 9800,
      clips: 35,
      isFollowing: true,
    },
    {
      username: "GamingGuru",
      avatar: "/placeholder.svg?height=80&width=80",
      rank: 9,
      followers: 6800,
      clips: 25,
      isFollowing: true,
    },
  ]

  // Dados simulados para os clipes dos usuários seguidos
  const followingClips = [
    {
      id: "1",
      username: "GameMaster",
      avatar: "/placeholder.svg?height=40&width=40",
      game: "Fortnite",
      title: "Vitória épica no último segundo!",
      views: 15420,
      likes: 1200,
      comments: 89,
      thumbnail: "/placeholder.svg?height=720&width=1280",
    },
    {
      id: "2",
      username: "NinjaStreamer",
      avatar: "/placeholder.svg?height=40&width=40",
      game: "Call of Duty",
      title: "Sequência de 10 kills sem morrer",
      views: 8932,
      likes: 754,
      comments: 42,
      thumbnail: "/placeholder.svg?height=720&width=1280",
    },
    {
      id: "3",
      username: "StreamerPro",
      avatar: "/placeholder.svg?height=40&width=40",
      game: "Valorant",
      title: "Clutch 1v5 com a Jett",
      views: 9876,
      likes: 876,
      comments: 54,
      thumbnail: "/placeholder.svg?height=720&width=1280",
    },
    {
      id: "4",
      username: "GamingGuru",
      avatar: "/placeholder.svg?height=40&width=40",
      game: "League of Legends",
      title: "Pentakill com Yasuo mid lane",
      views: 6543,
      likes: 432,
      comments: 28,
      thumbnail: "/placeholder.svg?height=720&width=1280",
    },
    {
      id: "5",
      username: "GameMaster",
      avatar: "/placeholder.svg?height=40&width=40",
      game: "Apex Legends",
      title: "20 kills solo vs squad",
      views: 7654,
      likes: 543,
      comments: 32,
      thumbnail: "/placeholder.svg?height=720&width=1280",
    },
    {
      id: "6",
      username: "NinjaStreamer",
      avatar: "/placeholder.svg?height=40&width=40",
      game: "Rocket League",
      title: "Gol de bicicleta do meio campo",
      views: 8765,
      likes: 765,
      comments: 43,
      thumbnail: "/placeholder.svg?height=720&width=1280",
    },
  ]

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Seguindo
          </h1>

          <Tabs defaultValue="clips" className="w-full mb-8">
            <TabsList className="bg-gray-900/60 border border-purple-900/30">
              <TabsTrigger value="clips" className="data-[state=active]:bg-purple-900/30">
                Clipes
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-purple-900/30">
                Usuários
              </TabsTrigger>
            </TabsList>
            <TabsContent value="clips" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {followingClips.map((clip) => (
                  <ClipCard key={clip.id} {...clip} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="users" className="mt-6">
              <div className="grid grid-cols-1 gap-4">
                {followingUsers.map((user) => (
                  <UserCard key={user.username} {...user} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
