"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ClipCard } from "@/components/clip-card"
import { Sidebar } from "@/components/sidebar"
import { Bookmark, Heart, MessageCircle, Share2, Send } from "lucide-react"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { ShareClipModal } from "@/components/share-clip-modal"

interface ClipPageProps {
  params: {
    id: string
  }
}

export default function ClipPage({ params }: ClipPageProps) {
  const { id } = params
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(1200)
  const [commentText, setCommentText] = useState("")
  const [isFollowing, setIsFollowing] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [comments, setComments] = useState([
    {
      id: "1",
      username: "GameMaster",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Que jogada incrível! Como você conseguiu aquele último headshot?",
      likes: 24,
      liked: false,
      date: "1 dia atrás",
    },
    {
      id: "2",
      username: "NinjaStreamer",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Sensacional! Você é muito habilidoso com esse personagem.",
      likes: 18,
      liked: false,
      date: "1 dia atrás",
    },
    {
      id: "3",
      username: "GamerGirl",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Quais configurações você usa? Seu jogo parece super fluido!",
      likes: 12,
      liked: false,
      date: "12 horas atrás",
    },
  ])

  // Dados simulados para o clipe
  const clip = {
    id,
    username: "ProGamer123",
    avatar: "/placeholder.svg?height=40&width=40",
    game: "Fortnite",
    title: "Vitória épica no último segundo!",
    description:
      "Consegui essa vitória incrível no último segundo do jogo. Foi uma partida muito disputada e consegui eliminar os últimos 3 jogadores com headshots perfeitos!",
    views: 15420,
    likes: likeCount,
    comments: comments.length,
    date: "2 dias atrás",
    thumbnail: "/placeholder.svg?height=720&width=1280",
  }

  // Dados simulados para clipes relacionados
  const relatedClips = [
    {
      id: "2",
      username: "GameMaster",
      avatar: "/placeholder.svg?height=40&width=40",
      game: "Fortnite",
      title: "Construção rápida e eliminação tripla",
      views: 8932,
      likes: 754,
      comments: 42,
      thumbnail: "/placeholder.svg?height=720&width=1280",
    },
    {
      id: "3",
      username: "NinjaStreamer",
      avatar: "/placeholder.svg?height=40&width=40",
      game: "Fortnite",
      title: "Sniper shot a 200 metros",
      views: 6543,
      likes: 432,
      comments: 28,
      thumbnail: "/placeholder.svg?height=720&width=1280",
    },
    {
      id: "4",
      username: "GamerGirl",
      avatar: "/placeholder.svg?height=40&width=40",
      game: "Fortnite",
      title: "Vitória solo vs squad",
      views: 9876,
      likes: 876,
      comments: 54,
      thumbnail: "/placeholder.svg?height=720&width=1280",
    },
  ]

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setLiked(!liked)
  }

  const handleCommentLike = (commentId: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
            liked: !comment.liked,
          }
        }
        return comment
      }),
    )
  }

  const handleAddComment = () => {
    if (!commentText.trim()) return

    const newComment = {
      id: `new-${Date.now()}`,
      username: "Você",
      avatar: "/placeholder.svg?height=40&width=40",
      content: commentText,
      likes: 0,
      liked: false,
      date: "agora mesmo",
    }

    setComments([newComment, ...comments])
    setCommentText("")
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Vídeo do Clipe */}
              <div className="bg-gray-900/60 rounded-xl border border-purple-900/30 overflow-hidden mb-6">
                <div className="aspect-video w-full bg-black flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-2xl font-bold text-purple-400 mb-4">Prévia do Clipe</div>
                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <Share2 className="h-12 w-12" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações do Clipe */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">{clip.title}</h1>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-400">
                    {clip.views.toLocaleString()} visualizações • {clip.date}
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      className={`text-gray-400 hover:text-pink-400 gap-2 ${liked ? "text-pink-500" : ""}`}
                      onClick={handleLike}
                    >
                      <Heart className="h-5 w-5" fill={liked ? "currentColor" : "none"} />
                      {likeCount.toLocaleString()}
                    </Button>
                    <Button variant="ghost" className="text-gray-400 hover:text-blue-400 gap-2">
                      <MessageCircle className="h-5 w-5" />
                      {comments.length.toLocaleString()}
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-gray-400 hover:text-purple-400"
                      onClick={() => setShareModalOpen(true)}
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      className={`text-gray-400 hover:text-yellow-400 ${saved ? "text-yellow-500" : ""}`}
                      onClick={() => setSaved(!saved)}
                    >
                      <Bookmark className="h-5 w-5" fill={saved ? "currentColor" : "none"} />
                    </Button>
                  </div>
                </div>
                <div className="h-px bg-gray-800 my-4" />
                <div className="flex items-start gap-4">
                  <Link href={`/profile/${clip.username}`}>
                    <Avatar className="h-10 w-10 border border-purple-500/30">
                      <AvatarImage src={clip.avatar || "/placeholder.svg"} alt={clip.username} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600">
                        {clip.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1">
                    <Link href={`/profile/${clip.username}`} className="font-medium text-white hover:text-purple-400">
                      {clip.username}
                    </Link>
                    <div className="text-sm text-gray-400 mt-1">
                      <Link
                        href={`/game/${clip.game.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-blue-400 hover:underline"
                      >
                        {clip.game}
                      </Link>
                    </div>
                    <p className="text-gray-300 mt-3">{clip.description}</p>
                  </div>
                  <Button
                    className={
                      isFollowing
                        ? "bg-gray-800 hover:bg-gray-700 text-white"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    }
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    {isFollowing ? "Seguindo" : "Seguir"}
                  </Button>
                </div>
              </div>

              {/* Comentários */}
              <div className="bg-gray-900/60 rounded-xl border border-purple-900/30 overflow-hidden">
                <div className="p-4 border-b border-purple-900/30">
                  <h3 className="font-semibold text-white">Comentários ({comments.length})</h3>
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-4 mb-6">
                    <Avatar className="h-10 w-10 border border-purple-500/30">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Seu avatar" />
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600">YA</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Adicione um comentário..."
                        className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-3 text-gray-300 focus:outline-none focus:border-purple-500/50 resize-none"
                        rows={3}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                          onClick={handleAddComment}
                          disabled={!commentText.trim()}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Comentar
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-4">
                        <Link href={`/profile/${comment.username}`}>
                          <Avatar className="h-10 w-10 border border-purple-500/30">
                            <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.username} />
                            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600">
                              {comment.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/profile/${comment.username}`}
                              className="font-medium text-white hover:text-purple-400"
                            >
                              {comment.username}
                            </Link>
                            <span className="text-xs text-gray-500">{comment.date}</span>
                          </div>
                          <p className="text-gray-300 mt-1">{comment.content}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`text-gray-400 hover:text-pink-400 gap-1 h-auto py-1 ${comment.liked ? "text-pink-500" : ""}`}
                              onClick={() => handleCommentLike(comment.id)}
                            >
                              <Heart className="h-4 w-4" fill={comment.liked ? "currentColor" : "none"} />
                              {comment.likes}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-blue-400 gap-1 h-auto py-1"
                            >
                              Responder
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar com Clipes Relacionados */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-300">Clipes Relacionados</h3>
              <div className="space-y-4">
                {relatedClips.map((clip) => (
                  <ClipCard key={clip.id} {...clip} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <ShareClipModal open={shareModalOpen} onOpenChange={setShareModalOpen} clipId={id} clipTitle={clip.title} />
    </div>
  )
}
