"use client"
import { useEffect, useState } from "react"

type Order = {
    id: string
    amount: number
    customerName: string
    createdAt: string
    total: number
    status: string
    date: string
}

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("/api/orders")
                if (!response.ok) throw new Error("Failed to fetch orders")
                const data: Order[] = await response.json()
                setOrders(data)
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err)
                } else {
                    setError(new Error("Unknown error"))
                }
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    if (loading) return <div className="p-4 text-gray-500">Loading...</div>
    if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>

    return (
        <>
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Orders (MOCK DATA NOT FROM DATABASE)</h1>

            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">Order ID</th>
                            <th className="border border-gray-300 px-4 py-2">Customer</th>
                            <th className="border border-gray-300 px-4 py-2">Amount</th>
                            <th className="border border-gray-300 px-4 py-2">Date</th>
                            <th className="border border-gray-300 px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order: Order) => (
                            <tr key={order.id}>
                                <td className="border border-gray-300 px-4 py-2">{order.id}</td>
                                <td className="border border-gray-300 px-4 py-2">{order.customerName}</td>
                                <td className="border border-gray-300 px-4 py-2">${order.total}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td
                                    className={`border border-gray-300 px-4 py-2 font-semibold ${
                                        order.status === "Completed"
                                            ? "text-green-600"
                                            : order.status === "Pending"
                                            ? "text-yellow-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {order.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
        </>
    )
}
