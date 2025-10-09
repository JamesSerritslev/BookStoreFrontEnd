import { NextResponse } from "next/server"

let users = [
  { id: "1", name: "Alice", email: "alice@example.com", role: "ADMIN" },
  { id: "2", name: "Bob", email: "bob@example.com", role: "BUYER" },
  { id: "3", name: "Charlie", email: "charlie@example.com", role: "SELLER" },
]

export async function GET() {
  return NextResponse.json(users)
}
