import type React from "react"
import { Sidebar } from "@/components/sidebar"

export default function PrysmsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
