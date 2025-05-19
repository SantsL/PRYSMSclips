"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context-dev"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Send, Trash2, Users, MessageSquare, AlertCircle, Lock, Plus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { initializeSocket } from "@/lib/socket"
import { useRouter } from "next/navigation"

interface Player {
  id: string
  username: string
  avatar: string
  points: number
  isDrawing: boolean
}

interface Room {
  id: string
  name: string
  category: string
  players: number
  maxPlayers: number
  status: string
  isPrivate: boolean
}

interface ChatMessage {
  userId: string
  username: string
  message: string
  isCorrect?: boolean
}

interface DrawData {
  x: number
  y: number
  prevX: number
  prevY: number
  color: string
  brushSize: number
  isDrawing: boolean
}

export default function MinigamePage() {
  const { user } = useAuth()
  const router = useRouter()
  
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentColor, setCurrentColor] = useState("#FFFFFF")
  const [brushSize, setBrushSize] = useState(5)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [timeLeft, setTimeLeft] = useState(60)
  const [currentWord, setCurrentWord] = useState("")
  const [isMyTurn, setIsMyTurn] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })
  const [activeRoom, setActiveRoom] = useState<string | null>(null)
  const [showWordAlert, setShowWordAlert] = useState(false)
  const [touchEnabled, setTouchEnabled] = useState(false)
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [createRoomDialogOpen, setCreateRoomDialogOpen] = useState(false)
  const [joinRoomDialogOpen, setJoinRoomDialogOpen] = useState(false)
  const [selectedRoomToJoin, setSelectedRoomToJoin] = useState<Room | null>(null)
  const [roomPassword, setRoomPassword] = useState("")
  const [newRoomData, setNewRoomData] = useState({
    name: "",
    category: "Tecnologia",
    isPrivate: false,
    password: "",
  })
  const [error, setError] = useState<string | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<any>(null)

  // Available colors for drawing
  const colors = [
    "#FFFFFF", // white
    "#FF3366", // pink
    "#6633FF", // purple
    "#33CCFF", // blue
    "#33FF99", // green
    "#FFCC33", // yellow
    "#FF6633", // orange
    "#FF0000", // red
    "#000000", // black
  ]

  // Categorias disponíveis
  const categories = [
    "Tecnologia",
    "Jogos",
    "Filmes",
    "Esportes",
    "Animais",
    "Comida",
    "Música",
  ]

  // Inicializar Socket.IO
  useEffect(() => {
    if (!user) {
      return
    }

    // Inicializar socket
    const socket = initializeSocket()
    socketRef.current = socket

    // Conectar ao servidor
    socket.auth = { token: user.id }
    socket.connect()

    // Configurar eventos
    socket.on("connect", () => {
      console.log("Conectado ao servidor Socket.IO")
      socket.emit("getRooms")
    })

    socket.on("roomsList", (rooms: Room[]) => {
      setAvailableRooms(rooms)
    })

    socket.on("roomsUpdated", () => {
      socket.emit("getRooms")
    })

    socket.on("error", (message: string) => {
      setError(message)
      setTimeout(() => setError(null), 5000)
    })

    socket.on("roomCreated", ({ roomId }: { roomId: string }) => {
      setCreateRoomDialogOpen(false)
      joinRoom(roomId)
    })

    socket.on("roomJoined", ({ room }: { room: any }) => {
      setActiveRoom(room.id)
      setPlayers(room.players)
      setGameStarted(room.status === "playing")
      setMessages([
        { userId: "system", username: "Sistema", message: `Bem-vindo à sala ${room.name}!` },
        { userId: "system", username: "Sistema", message: `Categoria: ${room.category}` },
      ])
    })

    socket.on("playerJoined", ({ player }: { player: Player }) => {
      setPlayers((prev) => [...prev, player])
      setMessages((prev) => [
        ...prev,
        { userId: "system", username: "Sistema", message: `${player.username} entrou na sala` },
      ])
    })

    socket.on("playerLeft", ({ playerId }: { playerId: string }) => {
      setPlayers((prev) => prev.filter((p) => p.id !== playerId))
      const playerName = players.find((p) => p.id === playerId)?.username || "Jogador"
      setMessages((prev) => [
        ...prev,
        { userId: "system", username: "Sistema", message: `${playerName} saiu da sala` },
      ])
    })

    socket.on("gameStarted", ({ currentDrawer, timeLeft }: { currentDrawer: string; timeLeft: number }) => {
      setGameStarted(true)
      setTimeLeft(timeLeft)
      setIsMyTurn(currentDrawer === user.id)
      setPlayers((prev) =>
        prev.map((p) => ({
          ...p,
          isDrawing: p.id === currentDrawer,
        }))
      )
    })

    socket.on("newTurn", ({ currentDrawer, timeLeft }: { currentDrawer: string; timeLeft: number }) => {
      setTimeLeft(timeLeft)
      setIsMyTurn(currentDrawer === user.id)
      clearCanvas()
      setPlayers((prev) =>
        prev.map((p) => ({
          ...p,
          isDrawing: p.id === currentDrawer,
        }))
      )
      setMessages((prev) => [
        ...prev,
        { userId: "system", username: "Sistema", message: "Nova rodada começou!" },
      ])
    })

    socket.on("newWord", ({ word }: { word: string }) => {
      setCurrentWord(word)
      setShowWordAlert(true)
      setTimeout(() => setShowWordAlert(false), 3000)
    })

    socket.on("timeUpdate", ({ timeLeft }: { timeLeft: number }) => {
      setTimeLeft(timeLeft)
    })

    socket.on("chatMessage", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message])
    })

    socket.on("drawing", (drawData: DrawData) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.beginPath()
      ctx.moveTo(drawData.prevX, drawData.prevY)
      ctx.lineTo(drawData.x, drawData.y)
      ctx.strokeStyle = drawData.color
      ctx.lineWidth = drawData.brushSize
      ctx.lineCap = "round"
      ctx.stroke()
    })

    socket.on("canvasCleared", () => {
      clearCanvas()
    })

    socket.on("scoreUpdated", ({ players: updatedPlayers }: { players: Player[] }) => {
      setPlayers((prev) =>
        prev.map((p) => {
          const updated = updatedPlayers.find((up) => up.id === p.id)
          return updated ? { ...p, points: updated.points } : p
        })
      )
    })

    socket.on("disconnect", () => {
      console.log("Desconectado do servidor Socket.IO")
    })

    // Limpar ao desmontar
    return () => {
      socket.off("connect")
      socket.off("roomsList")
      socket.off("roomsUpdated")
      socket.off("error")
      socket.off("roomCreated")
      socket.off("roomJoined")
      socket.off("playerJoined")
      socket.off("playerLeft")
      socket.off("gameStarted")
      socket.off("newTurn")
      socket.off("newWord")
      socket.off("timeUpdate")
      socket.off("chatMessage")
      socket.off("drawing")
      socket.off("canvasCleared")
      socket.off("scoreUpdated")
      socket.off("disconnect")
      socket.disconnect()
    }
  }, [user])

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas background
    ctx.fillStyle = "#1a1a1a"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Detectar se o dispositivo suporta touch
    setTouchEnabled("ontouchstart" in window || navigator.maxTouchPoints > 0)
  }, [])

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMyTurn) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setLastPosition({ x, y })
    setIsDrawing(true)

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isMyTurn) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(lastPosition.x, lastPosition.y)
    ctx.lineTo(x, y)
    ctx.strokeStyle = currentColor
    ctx.lineWidth = brushSize
    ctx.lineCap = "round"
    ctx.stroke()

    // Enviar dados de desenho para o servidor
    if (socketRef.current && activeRoom) {
      socketRef.current.emit("draw", {
        roomId: activeRoom,
        drawData: {
          x,
          y,
          prevX: lastPosition.x,
          prevY: lastPosition.y,
          color: currentColor,
          brushSize,
          isDrawing: true,
        },
      })
    }

    setLastPosition({ x, y })
  }

  // Touch drawing functions
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isMyTurn) return
    e.preventDefault()

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    setLastPosition({ x, y })
    setIsDrawing(true)

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isMyTurn) return
    e.preventDefault()

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(lastPosition.x, lastPosition.y)
    ctx.lineTo(x, y)
    ctx.strokeStyle = currentColor
    ctx.lineWidth = brushSize
    ctx.lineCap = "round"
    ctx.stroke()

    // Enviar dados de desenho para o servidor
    if (socketRef.current && activeRoom) {
      socketRef.current.emit("draw", {
        roomId: activeRoom,
        drawData: {
          x,
          y,
          prevX: lastPosition.x,
          prevY: lastPosition.y,
          color: currentColor,
          brushSize,
          isDrawing: true,
        },
      })
    }

    setLastPosition({ x, y })
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#1a1a1a"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Enviar comando para limpar canvas
    if (socketRef.current && activeRoom && isMyTurn) {
      socketRef.current.emit("clearCanvas", { roomId: activeRoom })
    }
  }

  // Chat functions
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !socketRef.current || !activeRoom) return

    // Enviar palpite para o servidor
    socketRef.current.emit("guess", {
      roomId: activeRoom,
      guess: inputMessage,
    })

    // Limpar input
    setInputMessage("")
  }

  // Função para criar sala
  const handleCreateRoom = () => {
    if (!socketRef.current || !user) return

    if (!newRoomData.name.trim()) {
      setError("Nome da sala é obrigatório")
      return
    }

    if (newRoomData.isPrivate && !newRoomData.password.trim()) {
      setError("Senha é obrigatória para salas privadas")
      return
    }

    socketRef.current.emit("createRoom", newRoomData)
  }

  // Função para entrar em uma sala
  const joinRoom = (roomId: string, password?: string) => {
    if (!socketRef.current || !user) return

    socketRef.current.emit("joinRoom", { roomId, password })
    setJoinRoomDialogOpen(false)
  }

  // Função para sair da sala
  const leaveRoom = () => {
    if (!socketRef.current || !activeRoom) return

    socketRef.current.emit("leaveRoom", { roomId: activeRoom })
    setActiveRoom(null)
    setGameStarted(false)
    setPlayers([])
    setMessages([])
  }

  // Verificar se o usuário está autenticado
  if (!user) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          PRYSMS Draw
        </h1>
        <div className="bg-gray-900/60 rounded-xl border border-purple-900/30 p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-4">Faça login para jogar</h2>
          <p className="text-gray-300 mb-6">
            Você precisa estar logado para jogar PRYSMS Draw e interagir com outros jogadores.
          </p>
          <Button
            onClick={() => router.push("/auth?redirect=/minigame")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            Fazer Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
        PRYSMS Draw
      </h1>

      {error && (
        <Alert className="mb-4 bg-red-900/30 border-red-500/50">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertTitle className="text-white">Erro</AlertTitle>
          <AlertDescription className="text-red-300">{error}</AlertDescription>
        </Alert>
      )}

      {showWordAlert && isMyTurn && (
        <Alert className="mb-4 bg-purple-900/30 border-purple-500/50">
          <AlertCircle className="h-4 w-4 text-purple-400" />
          <AlertTitle className="text-white">Sua palavra para desenhar</AlertTitle>
          <AlertDescription className="text-purple-300 font-bold">{currentWord}</AlertDescription>
        </Alert>
      )}

      {!activeRoom ? (
        <div className="bg-gray-900/60 rounded-xl border border-purple-900/30 p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Bem-vindo ao PRYSMS Draw!</h2>
            <p className="text-gray-300 mb-6">
              Desenhe e adivinhe! Um jogador desenha enquanto os outros tentam adivinhar o que está sendo desenhado.
              Ganhe pontos adivinhando corretamente ou quando os outros jogadores acertarem seu desenho.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800/60 p-4 rounded-lg border border-purple-500/20">
                <h3 className="font-semibold text-white mb-2">Sala Rápida</h3>
                <p className="text-sm text-gray-400 mb-4">Entre em uma partida com jogadores aleatórios</p>
                <Button
                  onClick={() => {
                    if (availableRooms.length > 0) {
                      const publicRooms = availableRooms.filter((r) => !r.isPrivate && r.status === "waiting")
                      if (publicRooms.length > 0) {
                        joinRoom(publicRooms[0].id)
                      } else {
                        setCreateRoomDialogOpen(true)
                      }
                    } else {
                      setCreateRoomDialogOpen(true)
                    }
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full"
                >
                  Começar a Jogar
                </Button>
              </div>
              <div className="bg-gray-800/60 p-4 rounded-lg border border-purple-500/20">
                <h3 className="font-semibold text-white mb-2">Criar Sala Privada</h3>
                <p className="text-sm text-gray-400 mb-4">Crie uma sala para jogar com amigos</p>
                <Button
                  onClick={() => {
                    setNewRoomData({
                      ...newRoomData,
                      isPrivate: true,
                    })
                    setCreateRoomDialogOpen(true)
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full"
                >
                  Criar Sala
                </Button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-4">Ou entre em uma sala existente</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableRooms.length > 0 ? (
                availableRooms.map((room) => (
                  <div
                    key={room.id}
                    className="bg-gray-800/60 p-4 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-white">{room.name}</h4>
                      <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">{room.category}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-xs text-gray-400">
                        <Users className="h-3 w-3 inline mr-1" />
                        {room.players}/{room.maxPlayers}
                      </div>
                      <div className="text-xs text-gray-400">
                        {room.status === "waiting" ? "Aguardando" : "Em andamento"}
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        if (room.isPrivate) {
                          setSelectedRoomToJoin(room)
                          setJoinRoomDialogOpen(true)
                        } else {
                          joinRoom(room.id)
                        }
                      }}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full"
                    >
                      {room.isPrivate ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" /> Entrar
                        </>
                      ) : (
                        "Entrar"
                      )}
                    </Button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center p-8">
                  <p className="text-gray-400 mb-4">Nenhuma sala disponível no momento</p>
                  <Button
                    onClick={() => setCreateRoomDialogOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Criar Nova Sala
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Area - Drawing Canvas and Tools */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-gray-900/60 rounded-xl border border-purple-900/30 overflow-hidden">
              {/* Game Header */}
              <div className="p-3 border-b border-purple-900/30 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-gray-300">
                    {isMyTurn ? "Você está desenhando:" : "Adivinhe a palavra:"}
                  </div>
                  {isMyTurn ? (
                    <div className="font-bold text-white bg-purple-900/50 px-3 py-1 rounded-md">{currentWord}</div>
                  ) : (
                    <div className="font-bold text-white">
                      {currentWord
                        ? "_".repeat(currentWord.length).split("").join(" ")
                        : "Aguardando palavra..."}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full">
                    <Clock className="h-4 w-4 text-yellow-400" />
                    <span className="font-medium text-white">{timeLeft}s</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={leaveRoom}>
                    Sair
                  </Button>
                </div>
              </div>

              {/* Canvas */}
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  className="w-full bg-gray-900 cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={stopDrawing}
                />

                {/* Drawing Tools - Only visible when it's your turn */}
                {isMyTurn && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/90 border border-purple-900/50 rounded-lg p-2 flex flex-wrap items-center gap-2">
                    <div className="flex flex-wrap gap-1 mr-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full ${currentColor === color ? "ring-2 ring-white" : ""}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setCurrentColor(color)}
                        />
                      ))}
                    </div>
                    <div className="h-6 w-px bg-gray-700 mx-1 hidden md:block" />
                    <div className="flex items-center gap-1">
                      <button
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          brushSize === 2 ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"
                        }`}
                        onClick={() => setBrushSize(2)}
                      >
                        <div className="w-1 h-1 rounded-full bg-white" />
                      </button>
                      <button
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          brushSize === 5 ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"
                        }`}
                        onClick={() => setBrushSize(5)}
                      >
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </button>
                      <button
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          brushSize === 10 ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"
                        }`}
                        onClick={() => setBrushSize(10)}
                      >
                        <div className="w-3 h-3 rounded-full bg-white" />
                      </button>
                      <button
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          brushSize === 15 ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"
                        }`}
                        onClick={() => setBrushSize(15)}
                      >
                        <div className="w-4 h-4 rounded-full bg-white" />
                      </button>
                    </div>
                    <div className="h-6 w-px bg-gray-700 mx-1 hidden md:block" />
                    <button
                      className="w-8 h-8 rounded-full bg-red-900/50 hover:bg-red-900/80 flex items-center justify-center"
                      onClick={clearCanvas}
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="bg-gray-900/60 rounded-xl border border-purple-900/30 overflow-hidden">
              <div className="p-3 border-b border-purple-900/30 flex justify-between items-center">
                <div className="font-medium text-white flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-purple-400" />
                  Chat
                </div>
              </div>
              <div ref={chatContainerRef} className="h-48 overflow-y-auto p-3 space-y-2">
                {messages.map((msg, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="font-medium text-purple-400">{msg.username}:</div>
                    <div className={`${msg.isCorrect ? "text-green-400 font-bold" : "text-gray-300"}`}>
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-purple-900/30 flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={isMyTurn ? "Você está desenhando..." : "Digite seu palpite..."}
                  className="bg-gray-800/60 border-gray-700 focus:border-purple-500/50"
                  disabled={isMyTurn}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isMyTurn || !inputMessage.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar - Players and Game Info */}
          <div className="space-y-4">
            <div className="bg-gray-900/60 rounded-xl border border-purple-900/30 h-full">
              <div className="p-3 border-b border-purple-900/30">
                <h3 className="font-semibold text-white">Jogadores ({players.length})</h3>
              </div>
              <div className="p-3 space-y-2">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      player.isDrawing ? "bg-purple-900/30 border border-purple-500/30" : "bg-gray-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-purple-500/30">
                        <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.username} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600">
                          {player.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-white flex items-center">
                          {player.username}
                          {player.id === user.id && <span className="text-xs text-purple-400 ml-1">(Você)</span>}
                          {player.isDrawing && (
                            <span className="ml-2 text-xs bg-purple-600/80 text-white px-1.5 py-0.5 rounded">
                              Desenhando
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-yellow-400">{player.points}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900/60 rounded-xl border border-purple-900/30 p-4">
              <h3 className="font-semibold text-white mb-3">Informações da Sala</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-white">{gameStarted ? "Em andamento" : "Aguardando"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Jogadores:</span>
                  <span className="text-white">
                    {players.length}/{16}
                  </span>
                </div>
                <div className="h-px bg-gray-800 my-2"></div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Próximo a desenhar:</span>
                  <span className="text-white">
                    {players.length > 0
                      ? players.find((p) => p.isDrawing)
                        ? players[(players.findIndex((p) => p.isDrawing) + 1) % players.length].username
                        : players[0].username
                      : "Desconhecido"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criação de Sala */}
      <Dialog open={createRoomDialogOpen} onOpenChange={setCreateRoomDialogOpen}>
        <DialogContent className="bg-gray-900 border-purple-900/30">
          <DialogHeader>
            <DialogTitle className="text-white">Criar Nova Sala</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomName" className="text-gray-300">
                Nome da Sala
              </Label>
              <Input
                id="roomName"
                value={newRoomData.name}
                onChange={(e) => setNewRoomData({ ...newRoomData, name: e.target.value })}
                className="bg-gray-800/60 border-gray-700 focus:border-purple-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-300">
                Categoria
              </Label>
              <select
                id="category"
                value={newRoomData.category}
                onChange={(e) => setNewRoomData({ ...newRoomData, category: e.target.value })}
                className="w-full bg-gray-800/60 border border-gray-700 focus:border-purple-500/50 rounded-md p-2 text-white"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPrivate"
                checked={newRoomData.isPrivate}
                onChange={(e) => setNewRoomData({ ...newRoomData, isPrivate: e.target.checked })}
                className="rounded bg-gray-800 border-gray-700 text-purple-500 focus:ring-purple-500"
              />
              <Label htmlFor="isPrivate" className="text-gray-300">
                Sala Privada (100 PRYSMS)
              </Label>
            </div>
            {newRoomData.isPrivate && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={newRoomData.password}
                  onChange={(e) => setNewRoomData({ ...newRoomData, password: e.target.value })}
                  className="bg-gray-800/60 border-gray-700 focus:border-purple-500/50"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateRoomDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateRoom}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              Criar Sala
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Entrada em Sala Privada */}
      <Dialog open={joinRoomDialogOpen} onOpenChange={setJoinRoomDialogOpen}>
        <DialogContent className="bg-gray-900 border-purple-900/30">
          <DialogHeader>
            <DialogTitle className="text-white">Entrar em Sala Privada</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">
              A sala <span className="font-bold text-white">{selectedRoomToJoin?.name}</span> é privada. Digite a senha
              para entrar.
            </p>
            <div className="\
