import { NextResponse } from "next/server"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const { role } = body
  const { id } = params

  console.log(`Updating user ${id} to role ${role}`)

  // You’d normally update the database here
  return NextResponse.json({ message: `User ${id} updated to role ${role}` })
}
