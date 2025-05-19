"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Sparkles, ImageIcon, Sticker } from "lucide-react"
import { useAuth } from "@/contexts/auth-context-dev"
import { useRouter } from "next/navigation"

export default function StorePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState("avatars")

  if (!user) {
    router.push("/auth?redirect=/store")
    return null
  }

  const avatars = [
    {
      id: "avatar1",
      name: "Cyber Ninja",
      image: "/placeholder.svg?height=200&width=200",
      price: 500,
      rarity: "Raro",
    },
    {
      id: "avatar2",
      name: "Neon Samurai",
      image: "/placeholder.svg?height=200&width=200",
      price: 800,
      rarity: "Épico",
    },
    {
      id: "avatar3",
      name: "Hacker Elite",
      image: "/placeholder.svg?height=200&width=200",
      price: 1200,
      rarity: "Lendário",
    },
    {
      id: "avatar4",
      name: "Gamer Pro",
      image: "/placeholder.svg?height=200&width=200",
      price: 300,
      rarity: "Comum",
    },
  ]

  const stickers = [
    {
      id: "sticker1",
      name: "GG",
      image: "/placeholder.svg?height=100&width=100",
      price: 200,
      animated: false,
    },
    {
      id: "sticker2",
      name: "Poggers",
      image: "/placeholder.svg?height=100&width=100",
      price: 300,
      animated: true,
    },
    {
      id: "sticker3",
      name: "Kappa",
      image: "/placeholder.svg?height=100&width=100",
      price: 250,
      animated: false,
    },
    {
      id: "sticker4",
      name: "Rage Quit",
      image: "/placeholder.svg?height=100&width=100",
      price: 350,
      animated: true,
    },
  ]

  const boosts = [
    {
      id: "boost1",
      name: "Clip Boost",
      description: "Destaque seu clipe por 24 horas",
      price: 500,
      duration: "24 horas",
    },
    {
      id: "boost2",
      name: "Super Boost",
      description: "Destaque seu clipe por 3 dias",
      price: 1200,
      duration: "3 dias",
    },
    {
      id: "boost3",
      name: "Ultra Boost",
      description: "Destaque seu clipe por 7 dias",
      price: 2500,
      duration: "7 dias",
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Loja PRYSMS
        </h1>
        <div className="flex items-center gap-2 bg-gray-800/60 px-4 py-2 rounded-lg border border-purple-900/30">
          <Coins className="h-5 w-5 text-yellow-400" />
          <span className="font-bold text-yellow-400">{user?.prysms_balance || 0} PRYSMS</span>
          <Button
            size="sm"
            className="ml-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600"
          >
            Comprar Mais
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="bg-gray-900/60 border border-purple-900/30 mb-8">
          <TabsTrigger value="avatars" className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-white">
            <ImageIcon className="h-4 w-4 mr-2" />
            Avatares
          </TabsTrigger>
          <TabsTrigger value="stickers" className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-white">
            <Sticker className="h-4 w-4 mr-2" />
            Stickers
          </TabsTrigger>
          <TabsTrigger value="boosts" className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-white">
            <Sparkles className="h-4 w-4 mr-2" />
            Boosts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="avatars" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {avatars.map((avatar) => (
              <Card key={avatar.id} className="bg-gray-900/60 border-purple-900/30 overflow-hidden">
                <div className="aspect-square bg-gray-800 flex items-center justify-center">
                  <img
                    src={avatar.image || "/placeholder.svg"}
                    alt={avatar.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-lg">{avatar.name}</CardTitle>
                  <CardDescription>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        avatar.rarity === "Comum"
                          ? "bg-gray-700 text-gray-300"
                          : avatar.rarity === "Raro"
                            ? "bg-blue-900/50 text-blue-300"
                            : avatar.rarity === "Épico"
                              ? "bg-purple-900/50 text-purple-300"
                              : "bg-yellow-900/50 text-yellow-300"
                      }`}
                    >
                      {avatar.rarity}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardFooter className="p-4 pt-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <Coins className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="font-bold text-yellow-400">{avatar.price}</span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Comprar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stickers" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {stickers.map((sticker) => (
              <Card key={sticker.id} className="bg-gray-900/60 border-purple-900/30 overflow-hidden">
                <div className="aspect-square bg-gray-800 flex items-center justify-center p-6">
                  <img
                    src={sticker.image || "/placeholder.svg"}
                    alt={sticker.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-lg">{sticker.name}</CardTitle>
                  <CardDescription>
                    {sticker.animated ? (
                      <span className="inline-block px-2 py-0.5 rounded bg-blue-900/50 text-blue-300 text-xs font-medium">
                        Animado
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded bg-gray-700 text-gray-300 text-xs font-medium">
                        Estático
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="p-4 pt-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <Coins className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="font-bold text-yellow-400">{sticker.price}</span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Comprar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="boosts" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {boosts.map((boost) => (
              <Card key={boost.id} className="bg-gray-900/60 border-purple-900/30">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Sparkles
                      className={`h-5 w-5 mr-2 ${
                        boost.id === "boost1"
                          ? "text-blue-400"
                          : boost.id === "boost2"
                            ? "text-purple-400"
                            : "text-yellow-400"
                      }`}
                    />
                    {boost.name}
                  </CardTitle>
                  <CardDescription>{boost.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-400">
                    <p>Duração: {boost.duration}</p>
                    <p className="mt-1">Aumenta a visibilidade do seu clipe no feed e nas buscas</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Coins className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="font-bold text-yellow-400">{boost.price}</span>
                  </div>
                  <Button
                    className={`bg-gradient-to-r ${
                      boost.id === "boost1"
                        ? "from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                        : boost.id === "boost2"
                          ? "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          : "from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600"
                    }`}
                  >
                    Comprar Boost
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
