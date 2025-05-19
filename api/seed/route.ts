import { getSupabaseAdmin } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = getSupabaseAdmin()

  try {
    // Inserir categorias
    const categories = [
      { name: "Destaques", slug: "highlights", description: "Os melhores momentos e jogadas" },
      { name: "Momentos Engraçados", slug: "funny", description: "Fails, bugs e momentos hilários" },
      { name: "Criativos", slug: "creative", description: "Construções, designs e criações incríveis" },
    ]

    await supabase.from("categories").upsert(
      categories.map((category) => ({
        ...category,
        created_at: new Date().toISOString(),
      })),
      { onConflict: "slug" },
    )

    // Inserir plataformas
    const platforms = [
      { name: "PC", slug: "pc" },
      { name: "Mobile", slug: "mobile" },
      { name: "PlayStation", slug: "playstation" },
      { name: "Xbox", slug: "xbox" },
      { name: "Nintendo Switch", slug: "nintendo-switch" },
    ]

    await supabase.from("platforms").upsert(
      platforms.map((platform) => ({
        ...platform,
        created_at: new Date().toISOString(),
      })),
      { onConflict: "slug" },
    )

    // Inserir jogos
    const games = [
      { name: "Fortnite", slug: "fortnite", description: "Battle Royale da Epic Games" },
      { name: "Call of Duty", slug: "call-of-duty", description: "FPS da Activision" },
      { name: "Valorant", slug: "valorant", description: "FPS tático da Riot Games" },
      { name: "League of Legends", slug: "league-of-legends", description: "MOBA da Riot Games" },
      { name: "CS:GO", slug: "cs-go", description: "FPS tático da Valve" },
      { name: "Apex Legends", slug: "apex-legends", description: "Battle Royale da Respawn Entertainment" },
      { name: "Minecraft", slug: "minecraft", description: "Jogo sandbox da Mojang" },
      { name: "Rocket League", slug: "rocket-league", description: "Futebol com carros da Psyonix" },
      { name: "GTA V", slug: "gta-v", description: "Jogo de mundo aberto da Rockstar Games" },
      { name: "PUBG", slug: "pubg", description: "Battle Royale da PUBG Corporation" },
    ]

    await supabase.from("games").upsert(
      games.map((game) => ({
        ...game,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
      { onConflict: "slug" },
    )

    return NextResponse.json({ success: true, message: "Banco de dados inicializado com sucesso!" })
  } catch (error) {
    console.error("Erro ao inicializar banco de dados:", error)
    return NextResponse.json({ success: false, error: "Erro ao inicializar banco de dados" }, { status: 500 })
  }
}
