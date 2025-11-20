"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiFetch } from "@/lib/config";

type Order = {
  id: string;
  amount: number;
  customerName: string;
  createdAt: string;
  total: number;
  status: string;
  date: string;
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Use apiFetch which respects mock mode and API base URL
        const data: any = await apiFetch("/api/v1/order");

        // The mock API returns { userId, role, orders: [...] }
        const rawOrders: any[] = Array.isArray(data)
          ? data
          : data?.orders ?? [];

        // Map whatever the mock returns into the shape used by this page
        const mapped: Order[] = (rawOrders || []).map((o: any) => ({
          id: o.orderId || o.id || String(Math.random()),
          amount: o.total ?? o.amount ?? 0,
          customerName:
            o.customerName || o.customerName?.name || o.userId || "Unknown",
          createdAt: o.placedAt || o.createdAt || new Date().toISOString(),
          total: o.total ?? o.amount ?? 0,
          status: o.status ?? "Processing",
          date: o.placedAt || o.createdAt || "",
        }));

        setOrders(mapped);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("Unknown error"));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="p-6 text-gray-400">Loading orders...</div>
        <Footer />
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="p-6 text-red-400">Error: {error.message}</div>
        <Footer />
      </div>
    );

  // Filter orders based on search query
  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query) ||
      order.total.toString().includes(query) ||
      new Date(order.createdAt)
        .toLocaleDateString()
        .toLowerCase()
        .includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Orders</h1>
            <p className="text-sm text-gray-400 mt-1">(Using mock API)</p>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search orders by ID, customer, status, amount, or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-700 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 w-80"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 text-gray-300 hover:text-white border border-gray-700 rounded-md bg-gray-900"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-sm overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">
                {searchQuery
                  ? `No orders found matching "${searchQuery}"`
                  : "No orders found."}
              </p>
              {searchQuery && orders.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Showing 0 of {orders.length} orders
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              {searchQuery && (
                <p className="text-sm text-gray-400 mb-4 px-6 pt-6">
                  Showing {filteredOrders.length} of {orders.length} orders
                </p>
              )}
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-900">
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-300">Order ID</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-300">Customer</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-300">Amount</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-300">Date</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order: Order) => (
                    <tr key={order.id} className="border-t border-gray-800 last:border-b-0 hover:bg-gray-800">
                      <td className="px-6 py-4 text-sm text-gray-100">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-200">{order.customerName}</td>
                      <td className="px-6 py-4 text-sm text-gray-100">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-200">{new Date(order.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          order.status === "Delivered" || order.status === "Completed"
                            ? "bg-green-900 text-green-300"
                            : order.status === "Pending" || order.status === "Processing" || order.status === "Shipped"
                            ? "bg-yellow-900 text-yellow-300"
                            : "bg-red-900 text-red-300"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ...existing code...
