import { NextResponse } from "next/server"

export async function GET() {

// MOCK DATA NOT FROM DATABASE
  const orders = [
    {
      id: "ORD-1001",
      customerName: "John Doe",
      total: 59.99,
      status: "Completed",
      createdAt: "2025-10-06T14:35:00Z",
    },
    {
      id: "ORD-1002",
      customerName: "Jane Smith",
      total: 29.49,
      status: "Pending",
      createdAt: "2025-10-06T15:10:00Z",
    },
    {
      id: "ORD-1003",
      customerName: "Sam Wilson",
      total: 89.95,
      status: "Cancelled",
      createdAt: "2025-10-05T09:20:00Z",
    },
  ]

  return NextResponse.json(orders)
}
