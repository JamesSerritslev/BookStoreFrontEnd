// ...existing code...
"use client"
import Navbar from "../../../components/Navbar"
import { useEffect, useMemo, useState } from "react"

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

    const [query, setQuery] = useState<string>("")
    const [statusFilter, setStatusFilter] = useState<string>("All")
    const [refreshKey, setRefreshKey] = useState<number>(0)

    const fetchOrders = async () => {
        setLoading(true)
        setError(null)
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

    useEffect(() => {
        fetchOrders()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshKey])

    const formatCurrency = (n: number) =>
        n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 })

    const formatDateTime = (iso?: string) =>
        iso ? new Date(iso).toLocaleString() : "-"

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        return orders.filter((o) => {
            if (statusFilter !== "All" && o.status !== statusFilter) return false
            if (!q) return true
            return (
                o.id.toLowerCase().includes(q) ||
                o.customerName.toLowerCase().includes(q) ||
                o.status.toLowerCase().includes(q)
            )
        })
    }, [orders, query, statusFilter])

    return (
        <>
            <div className="min-h-screen bg-black text-white">
                <Navbar />

                <main className="max-w-6xl mx-auto px-4 pt-24 pb-16">
                    <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-xl">
                        <div className="px-6 py-5 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-semibold text-white">Orders</h1>
                                <p className="text-sm text-gray-400">Manage recent orders and track statuses</p>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search order ID, customer or status..."
                                    className="w-full sm:w-64 px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-200"
                                >
                                    <option>All</option>
                                    <option>Pending</option>
                                    <option>Completed</option>
                                    <option>Cancelled</option>
                                </select>
                                <button
                                    onClick={() => setRefreshKey((k) => k + 1)}
                                    className="px-3 py-2 rounded-md bg-teal-500 text-black hover:bg-teal-600"
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {loading ? (
                                <div className="space-y-3">
                                    <div className="h-6 bg-gray-800 rounded w-1/3 animate-pulse"></div>
                                    <div className="h-40 bg-gray-800 rounded animate-pulse"></div>
                                </div>
                            ) : error ? (
                                <div className="text-center py-8">
                                    <p className="text-red-400 mb-3">Error: {error.message}</p>
                                    <button
                                        onClick={() => fetchOrders()}
                                        className="px-4 py-2 bg-red-700 text-white rounded-md"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">No orders found.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-700">
                                        <thead>
                                            <tr className="text-left text-sm text-gray-400">
                                                <th className="px-4 py-3">Order ID</th>
                                                <th className="px-4 py-3">Customer</th>
                                                <th className="px-4 py-3">Amount</th>
                                                <th className="px-4 py-3">Date</th>
                                                <th className="px-4 py-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {filtered.map((order) => (
                                                <tr key={order.id} className="hover:bg-gray-800">
                                                    <td className="px-4 py-3 align-top">
                                                        <div className="font-medium text-sm text-gray-200">{order.id}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm text-gray-200">{order.customerName}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm font-medium text-teal-400">{formatCurrency(order.total)}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm text-gray-400">{formatDateTime(order.createdAt)}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <StatusBadge status={order.status} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

function StatusBadge({ status }: { status: string }) {
    const base = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
    if (status === "Completed")
        return <span className={`${base} bg-green-900 text-green-300`}>{status}</span>
    if (status === "Pending")
        return <span className={`${base} bg-yellow-900 text-yellow-300`}>{status}</span>
    if (status === "Cancelled")
        return <span className={`${base} bg-red-900 text-red-300`}>{status}</span>
    return <span className={`${base} bg-gray-800 text-gray-300`}>{status}</span>
}
// ...existing code...