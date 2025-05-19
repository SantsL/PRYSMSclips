"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, CreditCard, Gift, Zap, Star, TrendingUp, Award, Crown, ShoppingCart } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function PrysmsPage() {
  const [prysmsBalance, setPrysmsBalance] = useState(250)
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [boostDialogOpen, setBoostDialogOpen] = useState(false)
  const [selectedClipToBoost, setSelectedClipToBoost] = useState<number | null>(null)

  const prysmsPackages = [
    { id: 1, amount: 500, price: "R$ 9,90", bonus: 0, popular: false },
    { id: 2, amount: 1000, price: "R$ 18,90", bonus: 50, popular: true },
    { id: 3, amount: 2500, price: "R$ 44,90", bonus: 150, popular: false },
    { id: 4, amount: 5000, price: "R$ 84,90", bonus: 500, popular: false },
    { id: 5, amount: 10000, price: "R$ 159,90", bonus: 1500, popular: false },
  ]

  const userClips = [
    {
      id: 1,
      title: "Vitória épica no último segundo!",
      game: "Fortnite",
      views: 15420,
      likes: 1200,
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 2,
      title: "Sequência de 10 kills sem morrer",
      game: "Call of Duty",
      views: 8932,
      likes: 754,
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 3,
      title: "Clutch 1v5 com a Jett",
      game: "Valorant",
      views: 9876,
      likes: 876,
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
  ]

  const boostOptions = [
    { id: 1, name: "Destaque Básico", price: 100, duration: "24 horas", position: "Feed principal", icon: Zap },
    { id: 2, name: "Destaque Premium", price: 250, duration: "48 horas", position: "Topo do feed", icon: Star },
    { id: 3, name: "Ultra Destaque", price: 500, duration: "72 horas", position: "Banner especial", icon: TrendingUp },
    { id: 4, name: "Destaque Semanal", price: 1000, duration: "7 dias", position: "Fixado na home", icon: Award },
    { id: 5, name: "Destaque Supremo", price: 2500, duration: "15 dias", position: "Todas as páginas", icon: Crown },
  ]

  const handleBuyPrysms = (packageId: number) => {
    setSelectedPackage(packageId)
    setPaymentDialogOpen(true)
  }

  const handleCompletePurchase = () => {
    if (selectedPackage) {
      const selectedPack = prysmsPackages.find((pkg) => pkg.id === selectedPackage)
      if (selectedPack) {
        setPrysmsBalance(prysmsBalance + selectedPack.amount + selectedPack.bonus)
      }
    }
    setPaymentDialogOpen(false)
  }

  const handleBoostClip = (clipId: number) => {
    setSelectedClipToBoost(clipId)
    setBoostDialogOpen(true)
  }

  const handleCompleteBoost = (boostPrice: number) => {
    if (prysmsBalance >= boostPrice) {
      setPrysmsBalance(prysmsBalance - boostPrice)
      setBoostDialogOpen(false)
      // Aqui você adicionaria a lógica para aplicar o boost ao clipe
    }
  }

  const router = useRouter()

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">
        PRYSMS - Moeda Virtual
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="buy" className="w-full">
            <TabsList className="bg-gray-900/60 border border-purple-900/30 mb-6">
              <TabsTrigger value="buy" className="data-[state=active]:bg-yellow-900/30">
                Comprar PRYSMS
              </TabsTrigger>
              <TabsTrigger value="boost" className="data-[state=active]:bg-yellow-900/30">
                Impulsionar Clipes
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-yellow-900/30">
                Histórico
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buy">
              <div className="bg-gray-900/60 rounded-xl border border-yellow-900/30 p-6">
                <h2 className="text-xl font-semibold mb-6 text-white">Escolha um Pacote de PRYSMS</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {prysmsPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`bg-gray-800/60 p-4 rounded-lg border ${
                        pkg.popular ? "border-yellow-500" : "border-gray-700"
                      } hover:border-yellow-500/50 transition-all duration-300 relative`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                          Mais Popular
                        </div>
                      )}
                      <div className="flex items-center justify-center mb-4">
                        <Coins className="h-10 w-10 text-yellow-500" />
                        <span className="text-2xl font-bold text-white ml-2">{pkg.amount.toLocaleString()}</span>
                      </div>
                      {pkg.bonus > 0 && (
                        <div className="text-center text-green-400 text-sm mb-2">+{pkg.bonus} de bônus</div>
                      )}
                      <div className="text-center text-xl font-bold text-white mb-4">{pkg.price}</div>
                      <Button
                        className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white"
                        onClick={() => handleBuyPrysms(pkg.id)}
                      >
                        Comprar
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-gray-800/60 rounded-lg border border-yellow-900/30">
                  <h3 className="text-lg font-semibold text-white mb-2">O que você pode fazer com PRYSMS?</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <Zap className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Impulsionar seus clipes para maior visibilidade no feed</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Destacar seu perfil no ranking semanal</span>
                    </li>
                    <li className="flex items-start">
                      <Gift className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Desbloquear itens cosméticos exclusivos para seu perfil</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Criar salas privadas no PRYSMS Draw com temas personalizados</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="boost">
              <div className="bg-gray-900/60 rounded-xl border border-yellow-900/30 p-6">
                <h2 className="text-xl font-semibold mb-6 text-white">Impulsionar Seus Clipes</h2>

                <div className="space-y-6">
                  <div className="p-4 bg-gray-800/60 rounded-lg border border-yellow-900/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Seus Clipes</h3>

                    <div className="space-y-4">
                      {userClips.map((clip) => (
                        <div
                          key={clip.id}
                          className="flex flex-col md:flex-row items-start md:items-center gap-4 p-3 bg-gray-800 rounded-lg border border-gray-700"
                        >
                          <div className="w-full md:w-auto">
                            <img
                              src={clip.thumbnail || "/placeholder.svg"}
                              alt={clip.title}
                              className="w-full md:w-32 h-18 object-cover rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-white">{clip.title}</h4>
                            <div className="text-sm text-gray-400 mt-1">{clip.game}</div>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                              <span>{clip.views.toLocaleString()} visualizações</span>
                              <span>{clip.likes.toLocaleString()} curtidas</span>
                            </div>
                          </div>
                          <Button
                            className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white"
                            onClick={() => handleBoostClip(clip.id)}
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Impulsionar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800/60 rounded-lg border border-yellow-900/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Opções de Impulso</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {boostOptions.map((option) => (
                        <div
                          key={option.id}
                          className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-yellow-500/50 transition-all duration-300"
                        >
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-900/30 flex items-center justify-center mr-3">
                              <option.icon className="h-5 w-5 text-yellow-500" />
                            </div>
                            <div>
                              <h4 className="font-medium text-white">{option.name}</h4>
                              <div className="text-xs text-gray-400">{option.duration}</div>
                            </div>
                          </div>
                          <div className="text-center text-lg font-bold text-yellow-500 mb-3">
                            {option.price} PRYSMS
                          </div>
                          <div className="text-xs text-gray-400 mb-3">Posição: {option.position}</div>
                          <Button
                            className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white"
                            onClick={() => handleCompleteBoost(option.price)}
                            disabled={prysmsBalance < option.price}
                          >
                            {prysmsBalance >= option.price ? "Aplicar" : "PRYSMS insuficientes"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="bg-gray-900/60 rounded-xl border border-yellow-900/30 p-6">
                <h2 className="text-xl font-semibold mb-6 text-white">Histórico de Transações</h2>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/60 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-white">Compra de PRYSMS</div>
                        <div className="text-sm text-gray-400">15/05/2025 - 14:32</div>
                      </div>
                      <div className="text-green-400 font-bold">+1050 PRYSMS</div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800/60 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-white">Impulso de Clipe - Destaque Premium</div>
                        <div className="text-sm text-gray-400">12/05/2025 - 09:15</div>
                      </div>
                      <div className="text-red-400 font-bold">-250 PRYSMS</div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800/60 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-white">Compra de PRYSMS</div>
                        <div className="text-sm text-gray-400">05/05/2025 - 18:47</div>
                      </div>
                      <div className="text-green-400 font-bold">+500 PRYSMS</div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800/60 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-white">Impulso de Clipe - Destaque Básico</div>
                        <div className="text-sm text-gray-400">01/05/2025 - 11:23</div>
                      </div>
                      <div className="text-red-400 font-bold">-100 PRYSMS</div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800/60 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-white">Bônus de Cadastro</div>
                        <div className="text-sm text-gray-400">28/04/2025 - 15:10</div>
                      </div>
                      <div className="text-green-400 font-bold">+100 PRYSMS</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900/60 rounded-xl border border-yellow-900/30 p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Seu Saldo</h2>

            <div className="flex items-center justify-center mb-6">
              <Coins className="h-12 w-12 text-yellow-500 mr-3" />
              <div className="text-4xl font-bold text-white">{prysmsBalance.toLocaleString()}</div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white"
              onClick={() => router.push("/prysms/store")}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Comprar Mais
            </Button>
          </div>

          <div className="bg-gray-900/60 rounded-xl border border-yellow-900/30 p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Nível de Membro</h2>

            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-white">Nível 3</div>
              <div className="text-sm text-gray-400">Nível 4</div>
            </div>

            <Progress value={65} className="h-2 mb-4 bg-gray-700">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full" />
            </Progress>

            <div className="text-sm text-gray-400 mb-4">650/1000 XP para o próximo nível</div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-gray-800 rounded">
                <div className="text-sm text-gray-300">Desconto em compras</div>
                <div className="text-sm font-medium text-yellow-500">5%</div>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-800 rounded">
                <div className="text-sm text-gray-300">Bônus diário</div>
                <div className="text-sm font-medium text-yellow-500">15 PRYSMS</div>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-800 rounded">
                <div className="text-sm text-gray-300">Próximo benefício (Nível 4)</div>
                <div className="text-sm font-medium text-yellow-500">10% de desconto</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/60 rounded-xl border border-yellow-900/30 p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Bônus Diário</h2>

            <div className="text-center mb-4">
              <div className="w-20 h-20 rounded-full bg-yellow-900/30 flex items-center justify-center mx-auto mb-3">
                <Gift className="h-10 w-10 text-yellow-500" />
              </div>
              <div className="text-lg font-medium text-white">15 PRYSMS</div>
              <div className="text-sm text-gray-400">Disponível em 12:34:56</div>
            </div>

            <Button className="w-full bg-gray-800 text-gray-400" disabled>
              Coletado Hoje
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Pagamento */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border-yellow-900/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Finalizar Compra</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedPackage && (
              <div className="p-4 bg-gray-800/60 rounded-lg border border-yellow-900/30 text-center">
                <Coins className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {prysmsPackages.find((pkg) => pkg.id === selectedPackage)?.amount.toLocaleString()} PRYSMS
                </div>
                {prysmsPackages.find((pkg) => pkg.id === selectedPackage)?.bonus > 0 && (
                  <div className="text-green-400 text-sm">
                    +{prysmsPackages.find((pkg) => pkg.id === selectedPackage)?.bonus} de bônus
                  </div>
                )}
                <div className="text-xl font-bold text-yellow-500 mt-2">
                  {prysmsPackages.find((pkg) => pkg.id === selectedPackage)?.price}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="cardNumber" className="text-gray-300">
                  Número do Cartão
                </Label>
                <Input
                  id="cardNumber"
                  placeholder="0000 0000 0000 0000"
                  className="bg-gray-800/60 border-gray-700 focus:border-yellow-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="expiry" className="text-gray-300">
                    Validade
                  </Label>
                  <Input
                    id="expiry"
                    placeholder="MM/AA"
                    className="bg-gray-800/60 border-gray-700 focus:border-yellow-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv" className="text-gray-300">
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    className="bg-gray-800/60 border-gray-700 focus:border-yellow-500/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  Nome no Cartão
                </Label>
                <Input
                  id="name"
                  placeholder="NOME COMPLETO"
                  className="bg-gray-800/60 border-gray-700 focus:border-yellow-500/50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white"
                onClick={handleCompletePurchase}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Finalizar Compra
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Boost */}
      <Dialog open={boostDialogOpen} onOpenChange={setBoostDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-gray-900 border-yellow-900/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Impulsionar Clipe</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedClipToBoost && (
              <div className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg border border-gray-700 mb-4">
                <img
                  src={userClips.find((clip) => clip.id === selectedClipToBoost)?.thumbnail || "/placeholder.svg"}
                  alt="Thumbnail"
                  className="w-32 h-18 object-cover rounded"
                />
                <div>
                  <h4 className="font-medium text-white">
                    {userClips.find((clip) => clip.id === selectedClipToBoost)?.title}
                  </h4>
                  <div className="text-sm text-gray-400 mt-1">
                    {userClips.find((clip) => clip.id === selectedClipToBoost)?.game}
                  </div>
                </div>
              </div>
            )}

            <h3 className="text-lg font-semibold text-white">Escolha um nível de impulso</h3>

            <div className="space-y-3">
              {boostOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-yellow-500/50 cursor-pointer transition-all"
                  onClick={() => handleCompleteBoost(option.price)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-yellow-900/30 flex items-center justify-center mr-3">
                      <option.icon className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{option.name}</div>
                      <div className="text-xs text-gray-400">
                        {option.duration} • {option.position}
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-yellow-500">{option.price} PRYSMS</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800/60 rounded-lg border border-yellow-900/30">
              <div className="text-sm text-gray-300">Seu saldo atual</div>
              <div className="font-bold text-white">{prysmsBalance} PRYSMS</div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setBoostDialogOpen(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
