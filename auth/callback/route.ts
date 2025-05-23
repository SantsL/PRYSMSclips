import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Troca o código de autenticação por uma sessão
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL para redirecionar após a confirmação
  return NextResponse.redirect(new URL("/auth?confirmed=true", request.url))
}
