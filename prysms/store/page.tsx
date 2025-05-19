"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context-dev"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Coins,
  CreditCard,
  Gift,
  Sparkles,
  Star,
  Crown,
  ShoppingCart,
  Check,
  Info,
  AlertCircle,
  Users,
  MessageSquare,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"

interface PrysmsPackage {
  id: number
  amount: number
  price: number
  bonus: number
  popular: boolean
}

interface StoreItem {
  id: string
  name: string
  description: string
  type: string
  price: number
  image_url: string
  is_animated: boolean
  rarity: string
  duration_hours?: number
}

export default function PrysmsStorePage() {
  const { user, refreshUser } = useAuth()
  const router = useRouter()
  const [prysmsBalance, setPrysmsBalance] = useState(0)
  const [selectedPackage, setSelectedPackage] = useState<PrysmsPackage | null>(null)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)
  const [purchaseError, setPurchaseError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [storeItems, setStoreItems] = useState<StoreItem[]>([])
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null)
  const [itemPurchaseDialogOpen, setItemPurchaseDialogOpen] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  })

  const prysmsPackages: PrysmsPackage[] = [
    { id: 1, amount: 500, price: 9.9, bonus: 0, popular: false },
    { id: 2, amount: 1000, price: 18.9, bonus: 50, popular: true },
    { id: 3, amount: 2500, price: 44.9, bonus: 150, popular: false },
    { id: 4, amount: 5000, price: 84.9, bonus: 500, popular: false },
    { id: 5, amount: 10000, price: 159.9, bonus: 1500, popular: false },
  ]

  // Carregar saldo de PRYSMS e itens da loja
  useEffect(() => {
    if (!user) {
      router.push("/auth?redirect=/prysms/store")
      return
    }

    const fetchUserData = async () => {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.from("users").select("prysms_balance").eq("id", user.id).single()

        if (error) {
          console.error("Erro ao buscar saldo:", error)
          return
        }

        setPrysmsBalance(data.prysms_balance || 0)
      } catch (error) {
        console.error("Erro ao buscar saldo:", error)
      }
    }

    const fetchStoreItems = async () => {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.from("store_items").select("*").order("price", { ascending: true })

        if (error) {
          console.error("Erro ao buscar itens da loja:", error)
          return
        }

        setStoreItems(data || [])
      } catch (error) {
        console.error("Erro ao buscar itens da loja:", error)
      }
    }

    fetchUserData()
    fetchStoreItems()
  }, [user, router])

  const handleBuyPrysms = (pkg: PrysmsPackage) => {
    setSelectedPackage(pkg)
    setPaymentDialogOpen(true)
  }

  const handleProcessPayment = () => {
    if (!selectedPackage) return

    setIsProcessing(true)
    setPurchaseError(null)

    // Simulação de processamento de pagamento
    setTimeout(async () => {
      try {
        // Validação básica do cartão
        if (
          !cardDetails.cardNumber.trim() ||
          !cardDetails.expiry.trim() ||
          !cardDetails.cvv.trim() ||
          !cardDetails.name.trim()
        ) {
          setPurchaseError("Por favor, preencha todos os campos do cartão.")
          setIsProcessing(false)
          return
        }

        if (cardDetails.cardNumber.replace(/\s/g, "").length !== 16) {
          setPurchaseError("Número de cartão inválido.")
          setIsProcessing(false)
          return
        }

        // Atualizar saldo de PRYSMS no banco de dados
        const supabase = getSupabaseClient()
        const newBalance = prysmsBalance + selectedPackage.amount + selectedPackage.bonus

        const { error: updateError } = await supabase
          .from("users")
          .update({ prysms_balance: newBalance })
          .eq("id", user.id)

        if (updateError) {
          setPurchaseError("Erro ao atualizar saldo. Tente novamente.")
          setIsProcessing(false)
          return
        }

        // Registrar transação
        const { error: transactionError } = await supabase.from("prysms_transactions").insert({
          user_id: user.id,
          amount: selectedPackage.amount + selectedPackage.bonus,
          transaction_type: "purchase",
          description: `Compra de ${selectedPackage.amount} PRYSMS + ${selectedPackage.bonus} de bônus`,
        })

        if (transactionError) {
          console.error("Erro ao registrar transação:", transactionError)
        }

        // Atualizar saldo local
        setPrysmsBalance(newBalance)
        setPaymentDialogOpen(false)
        setPurchaseSuccess(true)
        setConfirmationDialogOpen(true)
        setIsProcessing(false)

        // Atualizar dados do usuário no contexto
        refreshUser()

        // Limpar dados do cartão
        setCardDetails({
          cardNumber: "",
          expiry: "",
          cvv: "",
          name: "",
        })
      } catch (error) {
        console.error("Erro ao processar pagamento:", error)
        setPurchaseError("Erro ao processar pagamento. Tente novamente.")
        setIsProcessing(false)
      }
    }, 2000)
  }

  const handlePurchaseItem = (item: StoreItem) => {
    setSelectedItem(item)
    setItemPurchaseDialogOpen(true)
  }

  const handleConfirmItemPurchase = async () => {
    if (!selectedItem || !user) return

    setIsProcessing(true)
    setPurchaseError(null)

    try {
      // Verificar saldo
      if (prysmsBalance < selectedItem.price) {
        setPurchaseError("PRYSMS insuficientes para esta compra.")
        setIsProcessing(false)
        return
      }

      const supabase = getSupabaseClient()

      // Calcular data de expiração para itens temporários
      let expiresAt = null
      if (selectedItem.duration_hours) {
        expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + selectedItem.duration_hours)
      }

      // Adicionar item ao inventário do usuário
      const { error: itemError } = await supabase.from("user_items").insert({
        user_id: user.id,
        item_id: selectedItem.id,
        expires_at: expiresAt,
      })

      if (itemError) {
        if (itemError.code === "23505") {
          // Código de erro de violação de chave única
          setPurchaseError("Você já possui este item.")
        } else {
          setPurchaseError("Erro ao adicionar item ao inventário.")
        }
        setIsProcessing(false)
        return
      }

      // Deduzir PRYSMS do usuário
      const newBalance = prysmsBalance - selectedItem.price
      const { error: updateError } = await supabase
        .from("users")
        .update({ prysms_balance: newBalance })
        .eq("id", user.id)

      if (updateError) {
        setPurchaseError("Erro ao atualizar saldo. Tente novamente.")
        setIsProcessing(false)
        return
      }

      // Registrar transação
      const { error: transactionError } = await supabase.from("prysms_transactions").insert({
        user_id: user.id,
        amount: -selectedItem.price,
        transaction_type: "item_purchase",
        description: `Compra de ${selectedItem.name}`,
      })

      if (transactionError) {
        console.error("Erro ao registrar transação:", transactionError)
      }

      // Atualizar saldo local
      setPrysmsBalance(newBalance)
      setItemPurchaseDialogOpen(false)
      setPurchaseSuccess(true)
      setConfirmationDialogOpen(true)
      setIsProcessing(false)

      // Atualizar dados do usuário no contexto
      refreshUser()
    } catch (error) {
      console.error("Erro ao processar compra:", error)
      setPurchaseError("Erro ao processar compra. Tente novamente.")
      setIsProcessing(false)
    }
  }

  // Função para formatar número do cartão
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Função para formatar data de validade
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  // Renderizar ícone de raridade
  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "common":
        return <Star className="h-4 w-4 text-gray-400" />
      case "rare":
        return <Star className="h-4 w-4 text-blue-400" />
      case "epic":
        return <Sparkles className="h-4 w-4 text-purple-400" />
      case "legendary":
        return <Crown className="h-4 w-4 text-yellow-400" />
      default:
        return <Star className="h-4 w-4 text-gray-400" />
    }
  }

  // Renderizar cor de raridade
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-600"
      case "rare":
        return "border-blue-600"
      case "epic":
        return "border-purple-600"
      case "legendary":
        return "border-yellow-600"
      default:
        return "border-gray-600"
    }
  }

  // Renderizar texto de raridade
  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "Comum"
      case "rare":
        return "Raro"
      case "epic":
        return "Épico"
      case "legendary":
        return "Lendário"
      default:
        return "Comum"
    }
  }

  if (!user) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">
          Loja de PRYSMS
        </h1>
        <div className="bg-gray-900/60 rounded-xl border border-yellow-900/30 p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-4">Faça login para acessar a loja</h2>
          <p className="text-gray-300 mb-6">Você precisa estar logado para comprar PRYSMS e itens exclusivos.</p>
          <Button
            onClick={() => router.push("/auth?redirect=/prysms/store")}
            className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white"
          >
            Fazer Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">
        Loja de PRYSMS
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Tabs defaultValue="prysms" className="w-full">
            <TabsList className="bg-gray-900/60 border border-yellow-900/30 mb-6">
              <TabsTrigger value="prysms" className="data-[state=active]:bg-yellow-900/30">
                Comprar PRYSMS
              </TabsTrigger>
              <TabsTrigger value="stickers" className="data-[state=active]:bg-yellow-900/30">
                Stickers
              </TabsTrigger>
              <TabsTrigger value="avatars" className="data-[state=active]:bg-yellow-900/30">
                Avatares
              </TabsTrigger>
              <TabsTrigger value="boosts" className="data-[state=active]:bg-yellow-900/30">
                Boosts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prysms">
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
                      <div className="text-center text-xl font-bold text-white mb-4">R$ {pkg.price.toFixed(2)}</div>
                      <Button
                        className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white"
                        onClick={() => handleBuyPrysms(pkg)}
                      >
                        Comprar
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-gray-800/60 rounded-lg border border-yellow-900/30">
                  <h3 className="text-lg font-semibold text-white mb-2">O que você pode fazer com PRYSMS?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <div className="bg-yellow-900/30 p-2 rounded-full mr-3">
                          <Sparkles className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">Destaque UltraClip (24h)</h4>
                          <p className="text-sm text-gray-400">500 PRYSMS</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-yellow-900/30 p-2 rounded-full mr-3">
                          <Gift className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">Sticker animado premium</h4>
                          <p className="text-sm text-gray-400">100 PRYSMS</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-yellow-900/30 p-2 rounded-full mr-3">
                          <Crown className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">Skin de perfil/Avatar</h4>
                          <p className="text-sm text-gray-400">750–1.200 PRYSMS</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <div className="bg-yellow-900/30 p-2 rounded-full mr-3">
                          <Users className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">Sala privada no DrawBattle (7 dias)</h4>
                          <p className="text-sm text-gray-400">600 PRYSMS</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-yellow-900/30 p-2 rounded-full mr-3">
                          <MessageSquare className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">Comentário com emoji especial</h4>
                          <p className="text-sm text-gray-400">50 PRYSMS</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stickers">
              <div className="bg-gray-900/60 rounded-xl border border-yellow-900/30 p-6">
                <h2 className="text-xl font-semibold mb-6 text-white">Stickers</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {storeItems
                    .filter((item) => item.type === "sticker")
                    .map((item) => (
                      <Card
                        key={item.id}
                        className={`bg-gray-800/60 border-2 ${getRarityColor(item.rarity)} hover:bg-gray-800 transition-colors`}
                      >
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-white text-lg">{item.name}</CardTitle>
                            <div className="flex items-center gap-1 bg-gray-900/60 px-2 py-1 rounded-full">
                              {getRarityIcon(item.rarity)}
                              <span className="text-xs">{getRarityText(item.rarity)}</span>
                            </div>
                          </div>
                          <CardDescription className="text-gray-400 text-sm">{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <div className="aspect-square bg-gray-900/60 rounded-lg flex items-center justify-center overflow-hidden">
                            <img
                              src={item.image_url || "/placeholder.svg?height=100&width=100"}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-2 flex justify-between items-center">
                          <div className="flex items-center">
                            <Coins className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-bold text-yellow-500">{item.price}</span>
                          </div>
                          <Button
                            onClick={() => handlePurchaseItem(item)}
                            className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Comprar
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="avatars">
              <div className="bg-gray-900/60 rounded-xl border border-yellow-900/30 p-6">
                <h2 className="text-xl font-semibold mb-6 text-white">Avatares</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {storeItems
                    .filter((item) => item.type === "avatar")
                    .map((item) => (
                      <Card
                        key={item.id}
                        className={`bg-gray-800/60 border-2 ${getRarityColor(item.rarity)} hover:bg-gray-800 transition-colors`}
                      >
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-white text-lg">{item.name}</CardTitle>
                            <div className="flex items-center gap-1 bg-gray-900/60 px-2 py-1 rounded-full">
                              {getRarityIcon(item.rarity)}
                              <span className="text-xs">{getRarityText(item.rarity)}</span>
                            </div>
                          </div>
                          <CardDescription className="text-gray-400 text-sm">{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <div className="aspect-square bg-gray-900/60 rounded-full flex items-center justify-center overflow-hidden">
                            <img
                              src={item.image_url || "/placeholder.svg?height=128&width=128"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-2 flex justify-between items-center">
                          <div className="flex items-center">
                            <Coins className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-bold text-yellow-500">{item.price}</span>
                          </div>
                          <Button
                            onClick={() => handlePurchaseItem(item)}
                            className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Comprar
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="boosts">
              <div className="bg-gray-900/60 rounded-xl border border-yellow-900/30 p-6">
                <h2 className="text-xl font-semibold mb-6 text-white">Boosts</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {storeItems
                    .filter((item) => item.type === "boost")
                    .map((item) => (
                      <Card
                        key={item.id}
                        className={`bg-gray-800/60 border-2 ${getRarityColor(item.rarity)} hover:bg-gray-800 transition-colors`}
                      >
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-white text-lg">{item.name}</CardTitle>
                            <div className="flex items-center gap-1 bg-gray-900/60 px-2 py-1 rounded-full">
                              {getRarityIcon(item.rarity)}
                              <span className="text-xs">{getRarityText(item.rarity)}</span>
                            </div>
                          </div>
                          <CardDescription className="text-gray-400 text-sm">{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-900/60 rounded-lg flex items-center justify-center overflow-hidden">
                              <img
                                src={item.image_url || "/placeholder.svg?height=64&width=64"}
                                alt={item.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <div className="text-sm text-gray-400">Duração:</div>
                              <div className="font-medium text-white">
                                {item.duration_hours
                                  ? item.duration_hours >= 24
                                    ? `${Math.floor(item.duration_hours / 24)} dias`
                                    : `${item.duration_hours} horas`
                                  : "Permanente"}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-2 flex justify-between items-center">
                          <div className="flex items-center">
                            <Coins className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-bold text-yellow-500">{item.price}</span>
                          </div>
                          <Button
                            onClick={() => handlePurchaseItem(item)}
                            className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Comprar
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
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
              onClick={() => handleBuyPrysms(prysmsPackages.find((pkg) => pkg.popular) || prysmsPackages[0])}
            >
              Comprar Mais
            </Button>
          </div>

          <div className="bg-gray-900/60 rounded-xl border border-yellow-900/30 p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Gastos Típicos</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-800/80 rounded">
                <div className="text-sm text-gray-300">Destaque UltraClip (24h)</div>
                <div className="text-sm font-medium text-yellow-500">500 PRYSMS</div>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-800/80 rounded">
                <div className="text-sm text-gray-300">Sticker animado premium</div>
                <div className="text-sm font-medium text-yellow-500">100 PRYSMS</div>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-800/80 rounded">
                <div className="text-sm text-gray-300">Skin de perfil/Avatar</div>
                <div className="text-sm font-medium text-yellow-500">750–1.200 PRYSMS</div>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-800/80 rounded">
                <div className="text-sm text-gray-300">Sala privada no DrawBattle (7 dias)</div>
                <div className="text-sm font-medium text-yellow-500">600 PRYSMS</div>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-800/80 rounded">
                <div className="text-sm text-gray-300">Comentário com emoji especial</div>
                <div className="text-sm font-medium text-yellow-500">50 PRYSMS</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/60 rounded-xl border border-yellow-900/30 p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Informações</h2>
            <Alert className="bg-gray-800/60 border-yellow-900/30">
              <Info className="h-4 w-4 text-yellow-500" />
              <AlertTitle className="text-white">Sobre os PRYSMS</AlertTitle>
              <AlertDescription className="text-gray-300">
                PRYSMS são a moeda virtual da plataforma. Você pode usá-los para destacar seus clipes, comprar itens
                exclusivos e muito mais.
              </AlertDescription>
            </Alert>
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
                <div className="text-2xl font-bold text-white">{selectedPackage.amount.toLocaleString()} PRYSMS</div>
                {selectedPackage.bonus > 0 && (
                  <div className="text-green-400 text-sm">+{selectedPackage.bonus} de bônus</div>
                )}
                <div className="text-xl font-bold text-yellow-500 mt-2">R$ {selectedPackage.price.toFixed(2)}</div>
              </div>
            )}

            {purchaseError && (
              <Alert className="bg-red-900/30 border-red-500/50">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertTitle className="text-white">Erro</AlertTitle>
                <AlertDescription className="text-red-300">{purchaseError}</AlertDescription>
              </Alert>
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
                  value={cardDetails.cardNumber}
                  onChange={(e) =>
                    setCardDetails({
                      ...cardDetails,
                      cardNumber: formatCardNumber(e.target.value),
                    })
                  }
                  maxLength={19}
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
                    value={cardDetails.expiry}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        expiry: formatExpiry(e.target.value),
                      })
                    }
                    maxLength={5}
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
                    value={cardDetails.cvv}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        cvv: e.target.value.replace(/\D/g, "").substring(0, 3),
                      })
                    }
                    maxLength={3}
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
                  value={cardDetails.name}
                  onChange={(e) =>
                    setCardDetails({
                      ...cardDetails,
                      name: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setPaymentDialogOpen(false)
                  setPurchaseError(null)
                }}
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button
                className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white"
                onClick={handleProcessPayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Finalizar Compra
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Compra */}
      <Dialog open={confirmationDialogOpen} onOpenChange={setConfirmationDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border-yellow-900/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Compra Realizada</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <DialogDescription className="text-gray-300 text-lg">
              {selectedPackage
                ? `Você adquiriu ${selectedPackage.amount.toLocaleString()} PRYSMS${selectedPackage.bonus > 0 ? ` + ${selectedPackage.bonus} de bônus` : ""}!`
                : selectedItem
                  ? `Você adquiriu ${selectedItem.name}!`
                  : "Compra realizada com sucesso!"}
            </DialogDescription>
            <div className="text-gray-400">
              Seu novo saldo é de{" "}
              <span className="font-bold text-yellow-500">{prysmsBalance.toLocaleString()} PRYSMS</span>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              onClick={() => {
                setConfirmationDialogOpen(false)
                setSelectedPackage(null)
                setSelectedItem(null)
              }}
            >
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Compra de Item */}
      <Dialog open={itemPurchaseDialogOpen} onOpenChange={setItemPurchaseDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border-yellow-900/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Confirmar Compra</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedItem && (
              <div className="p-4 bg-gray-800/60 rounded-lg border border-yellow-900/30">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-900/60 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={selectedItem.image_url || "/placeholder.svg?height=64&width=64"}
                      alt={selectedItem.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{selectedItem.name}</h3>
                    <p className="text-sm text-gray-400">{selectedItem.description}</p>
                    {selectedItem.duration_hours && (
                      <p className="text-xs text-gray-500 mt-1">
                        Duração:{" "}
                        {selectedItem.duration_hours >= 24
                          ? `${Math.floor(selectedItem.duration_hours / 24)} dias`
                          : `${selectedItem.duration_hours} horas`}
                      </p>
                    )}
                  </div>
                </div>
                <Separator className="my-4 bg-gray-700" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Preço:</span>
                  <div className="flex items-center">
                    <Coins className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-bold text-yellow-500">{selectedItem.price}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-300">Seu saldo:</span>
                  <div className="flex items-center">
                    <Coins className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-bold text-white">{prysmsBalance}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-300">Saldo após a compra:</span>
                  <div className="flex items-center">
                    <Coins className="h-4 w-4 text-yellow-500 mr-1" />
                    <span
                      className={`font-bold ${prysmsBalance >= selectedItem.price ? "text-white" : "text-red-500"}`}
                    >
                      {Math.max(0, prysmsBalance - selectedItem.price)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {purchaseError && (
              <Alert className="bg-red-900/30 border-red-500/50">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertTitle className="text-white">Erro</AlertTitle>
                <AlertDescription className="text-red-300">{purchaseError}</AlertDescription>
              </Alert>
            )}

            {prysmsBalance < (selectedItem?.price || 0) && (
              <Alert className="bg-yellow-900/30 border-yellow-500/50">
                <AlertCircle className="h-4 w-4 text-yellow-400" />
                <AlertTitle className="text-white">PRYSMS insuficientes</AlertTitle>
                <AlertDescription className="text-yellow-300">
                  Você não tem PRYSMS suficientes para esta compra. Adicione mais PRYSMS ao seu saldo.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setItemPurchaseDialogOpen(false)
                  setPurchaseError(null)
                }}
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button
                className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white"
                onClick={handleConfirmItemPurchase}
                disabled={isProcessing || prysmsBalance < (selectedItem?.price || 0)}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Processando...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Confirmar Compra
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
