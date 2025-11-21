"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

type Order = {
  id: string;
  amount: number;
  customerName: string;
  customerEmail?: string;
  createdAt: string;
  total: number;
  status: string;
  date: string;
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;
  if (error)
    return <div className="p-6 text-red-400">Error: {error.message}</div>;

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.status.toLowerCase().includes(q) ||
      order.total.toString().includes(q) ||
      new Date(order.createdAt).toLocaleDateString().toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 text-white">
      <Navbar />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 w-72 rounded-xl bg-neutral-900 border border-neutral-700 
                       focus:outline-none focus:ring-2 focus:ring-blue-600 text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-sm text-gray-300 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-gray-400 py-6">
          {searchQuery
            ? `No orders match "${searchQuery}"`
            : "No orders found."}
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-800">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900">
              <tr>
                <th className="px-4 py-3 text-left text-gray-300">Order ID</th>
                <th className="px-4 py-3 text-left text-gray-300">Customer</th>
                <th className="px-4 py-3 text-left text-gray-300">Amount</th>
                <th className="px-4 py-3 text-left text-gray-300">Date</th>
                <th className="px-4 py-3 text-left text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-800/50">
                  <td className="px-4 py-3">{order.id}</td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3">${order.total}</td>
                  <td className="px-4 py-3">
                    {new Date(order.createdAt).toLocaleDateString()}
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
  );
}

function StatusBadge({ status }: { status: string }) {
  const base =
    "px-3 py-1 text-xs font-semibold rounded-full inline-block";

  if (status === "Completed")
    return <span className={`${base} bg-green-900 text-green-300`}>Completed</span>;

  if (status === "Pending")
    return <span className={`${base} bg-yellow-900 text-yellow-300`}>Pending</span>;

  if (status === "Cancelled")
    return <span className={`${base} bg-red-900 text-red-300`}>Cancelled</span>;

  return <span className={`${base} bg-neutral-700 text-neutral-300`}>{status}</span>;
}
