"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user, hasRole } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let url = "/api/orders";
        
        // If user is a buyer (but not admin/seller), filter orders by their email
        if (hasRole("BUYER") && !hasRole("ADMIN", "SELLER")) {
          const userEmail = user?.email || "";
          if (userEmail) {
            url = `/api/orders?customerEmail=${encodeURIComponent(userEmail)}`;
          }
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data: Order[] = await response.json();
        setOrders(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch if user data is available (or if admin/seller who can see all)
    if (hasRole("ADMIN", "SELLER") || user) {
      fetchOrders();
    }
  }, [user, hasRole]);

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
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-2xl font-bold">
                {hasRole("BUYER") && !hasRole("ADMIN", "SELLER") ? "My Orders" : "Orders"}{" "}
                <span className="text-gray-400 text-sm">(Mock Data)</span>
              </CardTitle>

              <div className="flex items-center gap-3">
                <Input
                  type="text"
                  placeholder="Search orders by ID, customer, status, amount, or date..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white w-80"
                />
                {searchQuery && (
                  <Button
                    onClick={() => setSearchQuery("")}
                    variant="outline"
                    className="text-gray-300 border-gray-600 hover:bg-gray-800"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {loading && (
                <p className="text-gray-400 text-center py-6">Loading...</p>
              )}
              {error && (
                <p className="text-red-500 text-center py-6">
                  Error: {error.message}
                </p>
              )}

              {!loading && !error && filteredOrders.length === 0 && (
                <p className="text-gray-400 text-center py-6">
                  {searchQuery
                    ? `No orders found matching "${searchQuery}"`
                    : "No orders found."}
                </p>
              )}

              {!loading && !error && filteredOrders.length > 0 && (
                <div className="overflow-x-auto mt-4">
                  <table className="w-full border border-gray-700 text-left text-sm">
                    <thead className="bg-gray-800 text-gray-300 uppercase text-xs">
                      <tr>
                        <th className="px-4 py-3 border-b border-gray-700">
                          Order ID
                        </th>
                        <th className="px-4 py-3 border-b border-gray-700">
                          Customer
                        </th>
                        <th className="px-4 py-3 border-b border-gray-700">
                          Amount
                        </th>
                        <th className="px-4 py-3 border-b border-gray-700">
                          Date
                        </th>
                        <th className="px-4 py-3 border-b border-gray-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-gray-800 transition-colors"
                        >
                          <td className="px-4 py-3 border-b border-gray-700 font-mono text-sm">
                            {order.id}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-700">
                            {order.customerName}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-700">
                            ${order.total}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-700">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-700">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                order.status === "Completed"
                                  ? "bg-green-500/20 text-green-400"
                                  : order.status === "Pending"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
