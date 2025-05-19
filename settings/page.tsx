"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Camera, Globe, Moon, Save, Sun } from "lucide-react"

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark")
  const [language, setLanguage] = useState("pt-BR")

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
        Configurações
      </h1>

      <Tabs defaultValue="profile" className="w-full">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 shrink-0">
            <TabsList className="bg-gray-900/60 border border-purple-900/30 flex flex-col h-auto p-1 w-full">
              <TabsTrigger value="profile" className="justify-start w-full data-[state=active]:bg-purple-900/30">
                Perfil
              </TabsTrigger>
              <TabsTrigger value="account" className="justify-start w-full data-[state=active]:bg-purple-900/30">
                Conta
              </TabsTrigger>
              <TabsTrigger value="notifications" className="justify-start w-full data-[state=active]:bg-purple-900/30">
                Notificações
              </TabsTrigger>
              <TabsTrigger value="privacy" className="justify-start w-full data-[state=active]:bg-purple-900/30">
                Privacidade
              </TabsTrigger>
              <TabsTrigger value="appearance" className="justify-start w-full data-[state=active]:bg-purple-900/30">
                Aparência
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1">
            <TabsContent value="profile" className="mt-0">
              <div className="bg-gray-900/60 rounded-xl border border-purple-900/30 p-6">
                <h2 className="text-xl font-semibold mb-6 text-white">Editar Perfil</h2>

                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <Avatar className="h-32 w-32 border-2 border-purple-500/30">
                        <AvatarImage src="/placeholder.svg?height=150&width=150" alt="Seu avatar" />
                        <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-3xl">
                          YA
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full bg-purple-600 hover:bg-purple-700 h-8 w-8"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      className="border-purple-500/50 text-purple-400 hover:bg-purple-950/30 mt-2"
                    >
                      Alterar Avatar
                    </Button>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-gray-300">
                          Nome de Usuário
                        </Label>
                        <Input
                          id="username"
                          defaultValue="ProGamer123"
                          className="bg-gray-800/60 border-gray-700 focus:border-purple-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="displayName" className="text-gray-300">
                          Nome de Exibição
                        </Label>
                        <Input
                          id="displayName"
                          defaultValue="Pro Gamer"
                          className="bg-gray-800/60 border-gray-700 focus:border-purple-500/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-gray-300">
                        Biografia
                      </Label>
                      <Textarea
                        id="bio"
                        defaultValue="Gamer apaixonado e criador de conteúdo. Compartilhando os melhores momentos dos meus jogos favoritos!"
                        className="bg-gray-800/60 border-gray-700 focus:border-purple-500/50 min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="progamer@example.com"
                        className="bg-gray-800/60 border-gray-700 focus:border-purple-500/50"
                      />
                    </div>

                    <div className="pt-4">
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Alterações
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="account" className="mt-0">
              <div className="bg-gray-900/60 rounded-xl border border-purple-900/30 p-6">
                <h2 className="text-xl font-semibold mb-6 text-white">Configurações da Conta</h2>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-300">Alterar Senha</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-gray-300">
                          Senha Atual
                        </Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          className="bg-gray-800/60 border-gray-700 focus:border-purple-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-gray-300">
                          Nova Senha
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          className="bg-gray-800/60 border-gray-700 focus:border-purple-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-gray-300">
                          Confirmar Nova Senha
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          className="bg-gray-800/60 border-gray-700 focus:border-purple-500/50"
                        />
                      </div>
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white mt-2">
                        Atualizar Senha
                      </Button>
                    </div>
                  </div>

                  <div className="h-px bg-gray-800 my-6" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-300">Conectar Contas</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-800/60 rounded-lg">
                        <div className="font-medium text-white">Twitch</div>
                        <Button
                          variant="outline"
                          className="border-purple-500/50 text-purple-400 hover:bg-purple-950/30"
                        >
                          Conectar
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/60 rounded-lg">
                        <div className="font-medium text-white">YouTube</div>
                        <Button
                          variant="outline"
                          className="border-purple-500/50 text-purple-400 hover:bg-purple-950/30"
                        >
                          Conectar
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/60 rounded-lg">
                        <div className="font-medium text-white">Discord</div>
                        <Button
                          variant="outline"
                          className="border-purple-500/50 text-purple-400 hover:bg-purple-950/30"
                        >
                          Conectar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <div className="bg-gray-900/60 rounded-xl border border-purple-900/30 p-6">
                <h2 className="text-xl font-semibold mb-6 text-white">Configurações de Notificações</h2>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-300">Notificações no Site</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">Novos seguidores</div>
                          <div className="text-sm text-gray-400">Receba notificações quando alguém te seguir</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">Curtidas em clipes</div>
                          <div className="text-sm text-gray-400">
                            Receba notificações quando alguém curtir seus clipes
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">Comentários</div>
                          <div className="text-sm text-gray-400">
                            Receba notificações quando alguém comentar em seus clipes
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">Menções</div>
                          <div className="text-sm text-gray-400">Receba notificações quando alguém te mencionar</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gray-800 my-6" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-300">Notificações por Email</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">Resumo semanal</div>
                          <div className="text-sm text-gray-400">Receba um resumo semanal das atividades</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">Atualizações da plataforma</div>
                          <div className="text-sm text-gray-400">
                            Receba notificações sobre atualizações e novidades
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">Marketing</div>
                          <div className="text-sm text-gray-400">Receba ofertas e promoções especiais</div>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="mt-0">
              <div className="bg-gray-900/60 rounded-xl border border-purple-900/30 p-6">
                <h2 className="text-xl font-semibold mb-6 text-white">Configurações de Privacidade</h2>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-300">Visibilidade do Perfil</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">Perfil público</div>
                          <div className="text-sm text-gray-400">Seu perfil pode ser visto por qualquer pessoa</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">Mostrar estatísticas</div>
                          <div className="text-sm text-gray-400">
                            Suas estatísticas são visíveis para outros usuários
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">Mostrar jogos jogados</div>
                          <div className="text-sm text-gray-400">Seus jogos são visíveis para outros usuários</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gray-800 my-6" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-300">Interações</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">Quem pode te seguir</div>
                          <div className="text-sm text-gray-400">Controle quem pode te seguir na plataforma</div>
                        </div>
                        <select className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-purple-500/50">
                          <option>Todos</option>
                          <option>Apenas usuários aprovados</option>
                          <option>Ninguém</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">Quem pode comentar</div>
                          <div className="text-sm text-gray-400">Controle quem pode comentar em seus clipes</div>
                        </div>
                        <select className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-purple-500/50">
                          <option>Todos</option>
                          <option>Apenas seguidores</option>
                          <option>Ninguém</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="mt-0">
              <div className="bg-gray-900/60 rounded-xl border border-purple-900/30 p-6">
                <h2 className="text-xl font-semibold mb-6 text-white">Aparência</h2>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-300">Tema</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div
                        className={`bg-gray-800 ${theme === "cyber" ? "border-2 border-purple-500" : "border border-gray-700"} rounded-lg p-4 flex flex-col items-center cursor-pointer`}
                        onClick={() => setTheme("cyber")}
                      >
                        <div className="w-full h-24 bg-black rounded-md mb-4 overflow-hidden">
                          <div className="w-full h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500"></div>
                        </div>
                        <div className="font-medium text-white">Cyber Neon</div>
                      </div>
                      <div
                        className={`bg-gray-800 ${theme === "dark" ? "border-2 border-purple-500" : "border border-gray-700"} rounded-lg p-4 flex flex-col items-center cursor-pointer`}
                        onClick={() => setTheme("dark")}
                      >
                        <div className="w-full h-24 bg-gray-900 rounded-md mb-4"></div>
                        <div className="font-medium text-white">Dark Mode</div>
                      </div>
                      <div
                        className={`bg-gray-800 ${theme === "light" ? "border-2 border-purple-500" : "border border-gray-700"} rounded-lg p-4 flex flex-col items-center cursor-pointer`}
                        onClick={() => setTheme("light")}
                      >
                        <div className="w-full h-24 bg-gray-100 rounded-md mb-4"></div>
                        <div className="font-medium text-white">Light Mode</div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gray-800 my-6" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-300">Modo Claro/Escuro</h3>
                    <div className="flex items-center gap-4">
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        className={theme === "dark" ? "bg-gray-800 text-white" : "border-gray-700 text-gray-400"}
                        onClick={() => setTheme("dark")}
                      >
                        <Moon className="mr-2 h-4 w-4" />
                        Escuro
                      </Button>
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        className={theme === "light" ? "bg-gray-200 text-gray-900" : "border-gray-700 text-gray-400"}
                        onClick={() => setTheme("light")}
                      >
                        <Sun className="mr-2 h-4 w-4" />
                        Claro
                      </Button>
                    </div>
                  </div>

                  <div className="h-px bg-gray-800 my-6" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-300">Idioma</h3>
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-gray-400" />
                      <select
                        className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-purple-500/50"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                      >
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="ja">日本語</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-300">Layout do Feed</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">Modo de visualização</div>
                          <div className="text-sm text-gray-400">Escolha como os clipes são exibidos no feed</div>
                        </div>
                        <select className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-purple-500/50">
                          <option>Grade</option>
                          <option>Lista</option>
                          <option>Compacto</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">Reprodução automática</div>
                          <div className="text-sm text-gray-400">Reproduzir clipes automaticamente ao rolar</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Preferências
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
