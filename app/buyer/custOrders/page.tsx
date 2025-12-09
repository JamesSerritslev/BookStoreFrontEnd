"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

type Order = {
  id: string;
  customerName?: string;
  customerEmail?: string;
  total?: number;
  status?: string;
  date?: string;
};

export default function CustOrdersPage() {
  const router = useRouter();
  const { isLoading, isBuyer, isSeller, isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      setError(null);

      const params =
        isBuyer() && user?.email
          ? `?customerEmail=${encodeURIComponent(user.email)}`
          : "";

      const res = await fetch(`/api/orders${params}`);
      if (!res.ok) throw new Error("Failed to load orders");
      const data = (await res.json()) as Order[];
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;

    // Check if user has access (Buyer or Seller)
    const isAuthorized = isAuthenticated && (isBuyer() || isSeller());

    if (!isAuthorized) {
      router.replace("/login");
      return;
    }
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated, isBuyer, isSeller, user?.email, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated || (!isBuyer() && !isSeller())) {
    return null;
  }

  const title = isBuyer() ? "My Orders" : "Orders (Seller View)";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl text-gray-400 font-bold mb-6">{title}</h1>

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loadingOrders ? (
            <div className="text-gray-400">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-gray-400">No orders found.</div>
          ) : (
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
              <table className="w-full">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-200">
                        {order.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-200">
                        {order.customerName || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-200">
                        {order.customerEmail || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-200">
                        {order.total !== undefined ? `$${order.total.toFixed(2)}` : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-200">
                        {order.status || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-200">
                        {order.date || "-"}
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
