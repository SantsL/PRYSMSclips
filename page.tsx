import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Gamepad2, Share2, Trophy, Users } from "lucide-react"
import { SaibaMaisModal } from "@/components/saiba-mais-modal"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 z-0" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.png')] bg-repeat opacity-20 z-0" />

        <div className="container relative z-10 px-4 py-24 mx-auto text-center sm:px-6 lg:py-32">
          <div className="glow-text text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500">
            PRYSMSCLIPS
          </div>
          <h2 className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-300 mb-8">
            Compartilhe seus melhores momentos de gameplay. Conquiste o ranking semanal e divirta-se com nosso minigame
            PRYSMS Draw.
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg"
              asChild
            >
              <Link href="/feed">
                Começar Agora
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <SaibaMaisModal />
          </div>

          <div className="relative mx-auto mt-12 max-w-5xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur-xl opacity-30"></div>
            <div className="relative bg-gray-900/80 border border-purple-500/30 rounded-xl overflow-hidden shadow-2xl">
              <div className="aspect-video w-full bg-black/60 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-2xl font-bold text-purple-400 mb-4">Prévia da Plataforma</div>
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <Share2 className="h-12 w-12" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-b from-black to-purple-950/20">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-400">
            Recursos Exclusivos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-900/60 p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 group">
              <div className="w-16 h-16 mb-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Share2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-purple-300">Feed Infinito</h3>
              <p className="text-gray-400">
                Navegue por um feed infinito de clipes, com os melhores momentos dos seus jogos favoritos.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-900/60 p-6 rounded-xl border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 group">
              <div className="w-16 h-16 mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Trophy className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-blue-300">Ranking Semanal</h3>
              <p className="text-gray-400">
                Compita com outros jogadores e alcance o topo do ranking semanal com seus melhores clipes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-900/60 p-6 rounded-xl border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300 group">
              <div className="w-16 h-16 mb-6 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Gamepad2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-pink-300">PRYSMS Draw</h3>
              <p className="text-gray-400">
                Divirta-se com nosso minigame PRYSMS Draw enquanto espera por novos clipes ou interaja com outros
                jogadores.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="py-20 bg-gradient-to-b from-purple-950/20 to-black">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">
            Junte-se à Comunidade
          </h2>
          <p className="max-w-2xl mx-auto text-gray-300 mb-12">
            Conecte-se com milhares de gamers, compartilhe seus melhores momentos e faça parte de uma comunidade
            vibrante de jogadores.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mb-16">
            <div className="flex items-center gap-2 text-purple-300">
              <Users className="h-5 w-5" />
              <span className="font-bold">10K+ Usuários Ativos</span>
            </div>
            <div className="flex items-center gap-2 text-blue-300">
              <Share2 className="h-5 w-5" />
              <span className="font-bold">50K+ Clipes Compartilhados</span>
            </div>
            <div className="flex items-center gap-2 text-pink-300">
              <Gamepad2 className="h-5 w-5" />
              <span className="font-bold">100+ Jogos Suportados</span>
            </div>
          </div>

          <Button
            className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 hover:from-purple-700 hover:via-blue-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full text-lg"
            asChild
          >
            <Link href="/feed">Criar Conta Grátis</Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500">
                PRYSMSCLIPS
              </div>
              <p className="text-gray-500 mt-2">© 2025 PRYSMSCLIPS. Todos os direitos reservados.</p>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                Termos
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                Privacidade
              </Link>
              <Link href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                Contato
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
