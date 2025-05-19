import type React from "react"
import { Sidebar } from "@/components/sidebar"

export default function FollowingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
