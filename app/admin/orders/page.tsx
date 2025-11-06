"use client";
import { useEffect, useState } from "react";

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
        const response = await fetch("/api/orders");
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data: Order[] = await response.json();
        setOrders(data);
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

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;

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
    <>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Orders (MOCK DATA NOT FROM DATABASE)
          </h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search orders by ID, customer, status, amount, or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-96"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchQuery
                ? `No orders found matching "${searchQuery}"`
                : "No orders found."}
            </p>
            {searchQuery && orders.length > 0 && (
              <p className="text-sm text-gray-400 mt-2">
                Showing 0 of {orders.length} orders
              </p>
            )}
          </div>
        ) : (
          <>
            {searchQuery && (
              <p className="text-sm text-gray-600 mb-4">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
            )}
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
                {filteredOrders.map((order: Order) => (
                  <tr key={order.id}>
                    <td className="border border-gray-300 px-4 py-2">
                      {order.id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {order.customerName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      ${order.total}
                    </td>
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
          </>
        )}
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const base =
    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold";
  if (status === "Completed")
    return (
      <span className={`${base} bg-green-900 text-green-300`}>{status}</span>
    );
  if (status === "Pending")
    return (
      <span className={`${base} bg-yellow-900 text-yellow-300`}>{status}</span>
    );
  if (status === "Cancelled")
    return <span className={`${base} bg-red-900 text-red-300`}>{status}</span>;
  return <span className={`${base} bg-gray-800 text-gray-300`}>{status}</span>;
}
// ...existing code...
