import { Server } from "socket.io"
import type { NextApiRequest } from "next"
import type { NextApiResponse } from "next"
import { getSupabaseServer } from "@/lib/supabase/server"

// Tipos para o jogo
interface GameRoom {
  id: string
  name: string
  category: string
  players: Player[]
  currentDrawer: string | null
  currentWord: string | null
  timeLeft: number
  status: "waiting" | "playing" | "finished"
  maxPlayers: number
  isPrivate: boolean
  password?: string
  createdBy: string | null
  createdAt: Date
  expiresAt?: Date
}

interface Player {
  id: string
  username: string
  avatar: string
  points: number
  isDrawing: boolean
  joinedAt: Date
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

// Lista de palavras possíveis para o jogo
const possibleWords = [
  "COMPUTADOR",
  "SMARTPHONE",
  "INTERNET",
  "VIDEOGAME",
  "TECLADO",
  "MONITOR",
  "MOUSE",
  "HEADSET",
  "CONTROLE",
  "CONSOLE",
  "JOYSTICK",
  "PIXEL",
  "GRÁFICO",
  "SERVIDOR",
  "DOWNLOAD",
  "UPLOAD",
  "STREAMING",
  "BLUETOOTH",
  "WIFI",
  "BATERIA",
  "CARREGADOR",
  "MEMÓRIA",
  "PROCESSADOR",
  "PLACA DE VÍDEO",
  "JOGO",
  "PERSONAGEM",
  "AVATAR",
  "NÍVEL",
  "MISSÃO",
  "FASE",
]

// Função para escolher uma palavra aleatória
const getRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * possibleWords.length)
  return possibleWords[randomIndex]
}

// Armazenamento em memória para as salas (em produção, use Redis ou banco de dados)
const gameRooms: Map<string, GameRoom> = new Map()

// Inicializar o servidor Socket.IO
const initSocketServer = (req: NextApiRequest, res: NextApiResponse) => {
  if (!(res.socket as any).server.io) {
    console.log("Inicializando servidor Socket.IO...")
    const io = new Server((res.socket as any).server, {
      path: "/api/socket",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    })

    // Middleware para autenticação
    io.use(async (socket, next) => {
      const token = socket.handshake.auth.token
      if (!token) {
        return next(new Error("Autenticação necessária"))
      }

      try {
        const supabase = getSupabaseServer()
        const { data, error } = await supabase.auth.getUser(token)

        if (error || !data.user) {
          return next(new Error("Token inválido"))
        }

        // Armazenar informações do usuário no socket
        socket.data.user = data.user
        next()
      } catch (error) {
        next(new Error("Erro de autenticação"))
      }
    })

    // Eventos do Socket.IO
    io.on("connection", (socket) => {
      console.log(`Usuário conectado: ${socket.id}`)

      // Obter salas disponíveis
      socket.on("getRooms", () => {
        const rooms = Array.from(gameRooms.values()).map((room) => ({
          id: room.id,
          name: room.name,
          category: room.category,
          players: room.players.length,
          maxPlayers: room.maxPlayers,
          status: room.status,
          isPrivate: room.isPrivate,
        }))
        socket.emit("roomsList", rooms)
      })

      // Criar uma nova sala
      socket.on(
        "createRoom",
        async (roomData: { name: string; category: string; isPrivate: boolean; password?: string }) => {
          try {
            const user = socket.data.user
            const supabase = getSupabaseServer()

            // Verificar se o usuário tem PRYSMS suficientes para criar uma sala privada
            if (roomData.isPrivate) {
              const { data: userData, error } = await supabase
                .from("users")
                .select("prysms_balance")
                .eq("id", user.id)
                .single()

              if (error || !userData) {
                socket.emit("error", "Erro ao verificar saldo de PRYSMS")
                return
              }

              if (userData.prysms_balance < 100) {
                socket.emit("error", "PRYSMS insuficientes para criar uma sala privada")
                return
              }

              // Deduzir PRYSMS do usuário
              await supabase
                .from("users")
                .update({
                  prysms_balance: userData.prysms_balance - 100,
                })
                .eq("id", user.id)

              // Registrar transação
              await supabase.from("prysms_transactions").insert({
                user_id: user.id,
                amount: -100,
                transaction_type: "room_creation",
                description: "Criação de sala privada no PRYSMSDraw",
              })
            }

            // Criar sala no banco de dados
            const { data: roomDB, error } = await supabase
              .from("game_rooms")
              .insert({
                name: roomData.name,
                category: roomData.category,
                is_private: roomData.isPrivate,
                password: roomData.password,
                created_by: user.id,
                status: "waiting",
                expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
              })
              .select()
              .single()

            if (error || !roomDB) {
              socket.emit("error", "Erro ao criar sala")
              return
            }

            // Criar sala em memória
            const roomId = roomDB.id
            const newRoom: GameRoom = {
              id: roomId,
              name: roomData.name,
              category: roomData.category,
              players: [],
              currentDrawer: null,
              currentWord: null,
              timeLeft: 60,
              status: "waiting",
              maxPlayers: 16,
              isPrivate: roomData.isPrivate,
              password: roomData.password,
              createdBy: user.id,
              createdAt: new Date(),
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
            }

            gameRooms.set(roomId, newRoom)

            // Adicionar usuário à sala
            socket.join(roomId)
            socket.emit("roomCreated", { roomId })

            // Atualizar lista de salas para todos
            io.emit("roomsUpdated")
          } catch (error) {
            console.error("Erro ao criar sala:", error)
            socket.emit("error", "Erro ao criar sala")
          }
        },
      )

      // Entrar em uma sala
      socket.on("joinRoom", async ({ roomId, password }: { roomId: string; password?: string }) => {
        try {
          const room = gameRooms.get(roomId)
          const user = socket.data.user

          if (!room) {
            socket.emit("error", "Sala não encontrada")
            return
          }

          // Verificar senha para salas privadas
          if (room.isPrivate && room.password !== password) {
            socket.emit("error", "Senha incorreta")
            return
          }

          // Verificar se a sala está cheia
          if (room.players.length >= room.maxPlayers) {
            socket.emit("error", "Sala cheia")
            return
          }

          // Verificar se o usuário já está na sala
          if (room.players.some((p) => p.id === user.id)) {
            socket.emit("error", "Você já está nesta sala")
            return
          }

          // Obter dados do usuário
          const supabase = getSupabaseServer()
          const { data: userData, error } = await supabase
            .from("users")
            .select("username, avatar_url, display_name")
            .eq("id", user.id)
            .single()

          if (error || !userData) {
            socket.emit("error", "Erro ao obter dados do usuário")
            return
          }

          // Adicionar jogador à sala
          const newPlayer: Player = {
            id: user.id,
            username: userData.username,
            avatar: userData.avatar_url || "/placeholder.svg?height=40&width=40",
            points: 0,
            isDrawing: false,
            joinedAt: new Date(),
          }

          room.players.push(newPlayer)

          // Registrar jogador no banco de dados
          await supabase.from("game_room_players").insert({
            room_id: roomId,
            user_id: user.id,
            points: 0,
            is_drawing: false,
          })

          // Entrar na sala do Socket.IO
          socket.join(roomId)

          // Enviar dados da sala para o jogador
          socket.emit("roomJoined", {
            room: {
              ...room,
              password: undefined, // Não enviar senha
            },
          })

          // Notificar outros jogadores
          socket.to(roomId).emit("playerJoined", { player: newPlayer })

          // Iniciar jogo se for o primeiro jogador
          if (room.players.length === 1) {
            room.currentDrawer = user.id
            room.players[0].isDrawing = true
            room.currentWord = getRandomWord()
            room.status = "playing"
            room.timeLeft = 60

            // Atualizar status da sala no banco de dados
            await supabase
              .from("game_rooms")
              .update({
                status: "playing",
              })
              .eq("id", roomId)

            // Notificar jogadores
            io.to(roomId).emit("gameStarted", {
              currentDrawer: room.currentDrawer,
              timeLeft: room.timeLeft,
            })

            // Enviar palavra apenas para quem vai desenhar
            socket.emit("newWord", { word: room.currentWord })

            // Iniciar temporizador
            startGameTimer(roomId)
          }
        } catch (error) {
          console.error("Erro ao entrar na sala:", error)
          socket.emit("error", "Erro ao entrar na sala")
        }
      })

      // Desenhar
      socket.on("draw", ({ roomId, drawData }: { roomId: string; drawData: DrawData }) => {
        const room = gameRooms.get(roomId)
        const user = socket.data.user

        if (!room || room.currentDrawer !== user.id) {
          return
        }

        // Transmitir dados de desenho para outros jogadores
        socket.to(roomId).emit("drawing", drawData)
      })

      // Limpar canvas
      socket.on("clearCanvas", ({ roomId }: { roomId: string }) => {
        const room = gameRooms.get(roomId)
        const user = socket.data.user

        if (!room || room.currentDrawer !== user.id) {
          return
        }

        // Transmitir comando para limpar canvas
        socket.to(roomId).emit("canvasCleared")
      })

      // Enviar palpite
      socket.on("guess", async ({ roomId, guess }: { roomId: string; guess: string }) => {
        try {
          const room = gameRooms.get(roomId)
          const user = socket.data.user

          if (!room || !room.currentWord || room.currentDrawer === user.id) {
            return
          }

          // Verificar se o palpite está correto
          const isCorrect = guess.toLowerCase() === room.currentWord.toLowerCase()

          // Enviar mensagem para todos na sala
          io.to(roomId).emit("chatMessage", {
            userId: user.id,
            username: room.players.find((p) => p.id === user.id)?.username || "Desconhecido",
            message: isCorrect ? "Acertou a palavra!" : guess,
            isCorrect,
          })

          // Se acertou, atualizar pontuação
          if (isCorrect) {
            const supabase = getSupabaseServer()

            // Encontrar índices dos jogadores
            const guesserIndex = room.players.findIndex((p) => p.id === user.id)
            const drawerIndex = room.players.findIndex((p) => p.id === room.currentDrawer)

            if (guesserIndex !== -1 && drawerIndex !== -1) {
              // Adicionar pontos
              room.players[guesserIndex].points += 100 // Quem acertou
              room.players[drawerIndex].points += 50 // Quem desenhou

              // Atualizar pontuação no banco de dados
              await supabase
                .from("game_room_players")
                .update({
                  points: room.players[guesserIndex].points,
                })
                .eq("room_id", roomId)
                .eq("user_id", user.id)

              await supabase
                .from("game_room_players")
                .update({
                  points: room.players[drawerIndex].points,
                })
                .eq("room_id", roomId)
                .eq("user_id", room.currentDrawer)

              // Notificar jogadores sobre a pontuação
              io.to(roomId).emit("scoreUpdated", {
                players: room.players.map((p) => ({
                  id: p.id,
                  username: p.username,
                  points: p.points,
                })),
              })

              // Passar para o próximo jogador após 3 segundos
              setTimeout(() => {
                nextTurn(roomId)
              }, 3000)
            }
          }
        } catch (error) {
          console.error("Erro ao processar palpite:", error)
        }
      })

      // Sair da sala
      socket.on("leaveRoom", async ({ roomId }: { roomId: string }) => {
        try {
          const room = gameRooms.get(roomId)
          const user = socket.data.user

          if (!room) {
            return
          }

          // Remover jogador da sala
          const playerIndex = room.players.findIndex((p) => p.id === user.id)

          if (playerIndex !== -1) {
            const player = room.players[playerIndex]
            room.players.splice(playerIndex, 1)

            // Remover do banco de dados
            const supabase = getSupabaseServer()
            await supabase.from("game_room_players").delete().eq("room_id", roomId).eq("user_id", user.id)

            // Notificar outros jogadores
            socket.to(roomId).emit("playerLeft", { playerId: user.id })

            // Sair da sala do Socket.IO
            socket.leave(roomId)

            // Se era o desenhista atual, passar para o próximo
            if (room.currentDrawer === user.id) {
              nextTurn(roomId)
            }

            // Se a sala ficou vazia, remover
            if (room.players.length === 0) {
              gameRooms.delete(roomId)

              // Atualizar status da sala no banco de dados
              await supabase
                .from("game_rooms")
                .update({
                  status: "finished",
                })
                .eq("id", roomId)

              // Atualizar lista de salas para todos
              io.emit("roomsUpdated")
            }
          }
        } catch (error) {
          console.error("Erro ao sair da sala:", error)
        }
      })

      // Desconexão
      socket.on("disconnect", async () => {
        try {
          console.log(`Usuário desconectado: ${socket.id}`)
          const user = socket.data.user

          if (!user) {
            return
          }

          // Procurar salas onde o usuário está
          for (const [roomId, room] of gameRooms.entries()) {
            const playerIndex = room.players.findIndex((p) => p.id === user.id)

            if (playerIndex !== -1) {
              // Remover jogador da sala
              room.players.splice(playerIndex, 1)

              // Remover do banco de dados
              const supabase = getSupabaseServer()
              await supabase.from("game_room_players").delete().eq("room_id", roomId).eq("user_id", user.id)

              // Notificar outros jogadores
              io.to(roomId).emit("playerLeft", { playerId: user.id })

              // Se era o desenhista atual, passar para o próximo
              if (room.currentDrawer === user.id) {
                nextTurn(roomId)
              }

              // Se a sala ficou vazia, remover
              if (room.players.length === 0) {
                gameRooms.delete(roomId)

                // Atualizar status da sala no banco de dados
                await supabase
                  .from("game_rooms")
                  .update({
                    status: "finished",
                  })
                  .eq("id", roomId)

                // Atualizar lista de salas para todos
                io.emit("roomsUpdated")
              }
            }
          }
        } catch (error) {
          console.error("Erro ao processar desconexão:", error)
        }
      })
    })

    // Armazenar instância do Socket.IO no servidor
    ;(res.socket as any).server.io = io
  }

  res.end()
}

// Função para passar para o próximo jogador
const nextTurn = async (roomId: string) => {
  try {
    const room = gameRooms.get(roomId)

    if (!room || room.players.length === 0) {
      return
    }

    // Encontrar o índice do jogador atual
    const currentIndex = room.players.findIndex((p) => p.id === room.currentDrawer)

    // Atualizar quem está desenhando
    const nextIndex = (currentIndex + 1) % room.players.length

    // Atualizar estado da sala
    room.players.forEach((p, i) => {
      p.isDrawing = i === nextIndex
    })

    room.currentDrawer = room.players[nextIndex].id
    room.currentWord = getRandomWord()
    room.timeLeft = 60

    // Atualizar no banco de dados
    const supabase = getSupabaseServer()

    // Resetar todos os jogadores
    await supabase
      .from("game_room_players")
      .update({
        is_drawing: false,
      })
      .eq("room_id", roomId)

    // Definir o novo desenhista
    await supabase
      .from("game_room_players")
      .update({
        is_drawing: true,
      })
      .eq("room_id", roomId)
      .eq("user_id", room.currentDrawer)

    // Notificar todos os jogadores
    const io = (global as any).io

    io.to(roomId).emit("newTurn", {
      currentDrawer: room.currentDrawer,
      timeLeft: room.timeLeft,
    })

    // Enviar palavra apenas para quem vai desenhar
    io.to(roomId).to(room.currentDrawer).emit("newWord", {
      word: room.currentWord,
    })

    // Iniciar temporizador
    startGameTimer(roomId)
  } catch (error) {
    console.error("Erro ao passar para o próximo jogador:", error)
  }
}

// Função para iniciar o temporizador do jogo
const startGameTimer = (roomId: string) => {
  const room = gameRooms.get(roomId)

  if (!room) {
    return
  }

  // Limpar temporizador anterior se existir
  if (room.timerInterval) {
    clearInterval(room.timerInterval)
  }

  // Iniciar novo temporizador
  room.timerInterval = setInterval(() => {
    room.timeLeft--

    // Enviar atualização de tempo para todos na sala
    const io = (global as any).io
    io.to(roomId).emit("timeUpdate", { timeLeft: room.timeLeft })

    // Se o tempo acabou, passar para o próximo jogador
    if (room.timeLeft <= 0) {
      clearInterval(room.timerInterval)

      // Enviar mensagem informando que o tempo acabou
      io.to(roomId).emit("chatMessage", {
        userId: "system",
        username: "Sistema",
        message: `Tempo esgotado! A palavra era: ${room.currentWord}`,
      })

      // Passar para o próximo jogador após 3 segundos
      setTimeout(() => {
        nextTurn(roomId)
      }, 3000)
    }
  }, 1000)
}

export default initSocketServer
