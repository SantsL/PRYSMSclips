import { Button } from "@/components/ui/button"
import { Instagram, Twitter, Twitch, Youtube, Mail, Globe } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
        Sobre Nós
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-gray-900/60 rounded-xl border border-purple-900/30 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">PRYSMSCLIPS</h2>

            <div className="space-y-4 text-gray-300">
              <p className="text-lg">
                PRYSMSCLIPS nasceu da ideia de criar um espaço onde jogadores pudessem ser reconhecidos por suas jogadas
                épicas, clipes insanos e criatividade — sem depender de algoritmos de grandes redes sociais ou
                streamings.
              </p>

              <p className="text-xl font-semibold text-purple-400">Aqui, a comunidade é quem decide o que brilha.</p>

              <p>
                Somos uma equipe apaixonada por jogos, design e tecnologia, que acredita no poder dos momentos
                compartilhados e na liberdade de criar conteúdo gamer sem barreiras.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">Nosso objetivo é simples:</h3>
              <p>
                Construir a melhor plataforma de clipes de gameplay, com ranking real, destaques justos, e um toque de
                diversão com o nosso mini-game exclusivo, o PRYSMS Draw — onde habilidade e zoeira se misturam em
                partidas ao vivo.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">Valorizamos:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>A comunidade gamer</li>
                <li>A criatividade de quem joga e compartilha</li>
                <li>E a experiência de usuário, com interface leve, fluida e feita para prender sua atenção.</li>
              </ul>

              <p className="text-lg font-semibold mt-8">
                PRYSMSCLIPS é onde jogadores se tornam lendas. Seja com uma play clutch, um frag insano ou um desenho
                maluco que ninguém entendeu (mas todo mundo riu).
              </p>
            </div>
          </div>

          <div className="bg-gray-900/60 rounded-xl border border-purple-900/30 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Nossa Equipe</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/60 p-4 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-2xl font-bold">
                    JG
                  </div>
                  <div>
                    <h3 className="font-bold text-white">João Gamer</h3>
                    <p className="text-sm text-gray-400">Fundador & CEO</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  Gamer desde os 5 anos, João criou o PRYSMSCLIPS após perceber que faltava um espaço dedicado
                  exclusivamente para os melhores momentos dos jogos.
                </p>
              </div>

              <div className="bg-gray-800/60 p-4 rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-2xl font-bold">
                    MS
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Maria Stream</h3>
                    <p className="text-sm text-gray-400">Diretora de Comunidade</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  Streamer profissional e ex-jogadora de e-sports, Maria entende como ninguém o que faz um clipe se
                  destacar e viralizar.
                </p>
              </div>

              <div className="bg-gray-800/60 p-4 rounded-lg border border-pink-500/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center text-2xl font-bold">
                    PD
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Pedro Dev</h3>
                    <p className="text-sm text-gray-400">CTO & Desenvolvedor</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  Apaixonado por tecnologia e games, Pedro é responsável por toda a infraestrutura técnica que mantém o
                  PRYSMSCLIPS funcionando de forma rápida e eficiente.
                </p>
              </div>

              <div className="bg-gray-800/60 p-4 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-teal-600 flex items-center justify-center text-2xl font-bold">
                    AD
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Ana Design</h3>
                    <p className="text-sm text-gray-400">Diretora Criativa</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  Designer com experiência em UI/UX para games, Ana criou a identidade visual única do PRYSMSCLIPS,
                  combinando elementos cyber-neon com usabilidade.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900/60 rounded-xl border border-purple-900/30 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Redes Sociais</h2>

            <div className="space-y-3">
              <a
                href="https://instagram.com/PRYSMSclips"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-800/60 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center">
                  <Instagram className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium text-white">Instagram</div>
                  <div className="text-xs text-gray-400">@PRYSMSclips</div>
                </div>
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-800/60 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                  <Twitter className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium text-white">Twitter</div>
                  <div className="text-xs text-gray-400">@PRYSMSclips</div>
                </div>
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-800/60 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                  <Twitch className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium text-white">Twitch</div>
                  <div className="text-xs text-gray-400">PRYSMSclips</div>
                </div>
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-800/60 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-orange-600 flex items-center justify-center">
                  <Youtube className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium text-white">YouTube</div>
                  <div className="text-xs text-gray-400">PRYSMS Clips</div>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-gray-900/60 rounded-xl border border-purple-900/30 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Contato</h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-800/60 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-teal-600 flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium text-white">Email</div>
                  <div className="text-xs text-gray-400">contato@prysmsclips.com</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-800/60 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium text-white">Website</div>
                  <div className="text-xs text-gray-400">www.prysmsclips.com</div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                Enviar Mensagem
              </Button>
            </div>
          </div>

          <div className="bg-gray-900/60 rounded-xl border border-purple-900/30 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Junte-se a Nós</h2>
            <p className="text-gray-300 mb-4">
              Quer fazer parte da revolução dos clipes de gameplay? Crie sua conta agora e comece a compartilhar seus
              melhores momentos!
            </p>
            <Button
              className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 hover:from-purple-700 hover:via-blue-700 hover:to-pink-700 text-white"
              asChild
            >
              <Link href="/feed">Criar Conta Grátis</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
