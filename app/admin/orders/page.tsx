"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type OrderItem = {
  bookId: number;
  bookName: string;
  bookPicture: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  amount: number;
  customerName: string;
  customerEmail?: string;
  createdAt: string;
  total: number;
  status: string;
  date: string;
  items?: OrderItem[];
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
        // If user is a BUYER, only fetch their orders
        // If ADMIN/SELLER, fetch all orders
        let url = "/api/orders";
        if (user && hasRole("BUYER") && !hasRole("ADMIN", "SELLER")) {
          url += `?customerEmail=${encodeURIComponent(user.email)}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, hasRole]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = searchQuery.toLowerCase();
      const bookNames =
        order.items?.map((item) => item.bookName.toLowerCase()).join(" ") || "";
      return (
        order.id.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.status.toLowerCase().includes(q) ||
        order.total.toString().includes(q) ||
        bookNames.includes(q) ||
        new Date(order.createdAt).toLocaleDateString().toLowerCase().includes(q)
      );
    });
  }, [orders, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mb-4"></div>
            <p className="text-gray-400">Loading orders...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-2">Error Loading Orders</h2>
            <p className="text-gray-400">{error.message}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isBuyer = Boolean(
    user && hasRole("BUYER") && !hasRole("ADMIN", "SELLER")
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
                {isBuyer ? "My Orders" : "Orders Management"}
              </h1>
              <p className="text-gray-400">
                {isBuyer
                  ? "Track and manage your order history"
                  : "View and manage all customer orders"}
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by book name, order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 py-3 w-96 rounded-xl bg-neutral-900 border border-neutral-700 
                         focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent 
                         text-white placeholder-gray-500 transition-all"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <EmptyState searchQuery={searchQuery} isBuyer={isBuyer} />
        ) : (
          <OrdersList orders={filteredOrders} isBuyer={isBuyer} />
        )}
      </main>

      <Footer />
    </div>
  );
}

// Empty State Component
function EmptyState({
  searchQuery,
  isBuyer,
}: {
  searchQuery: string;
  isBuyer: boolean;
}) {
  if (searchQuery) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-6">🔍</div>
        <h3 className="text-2xl font-bold mb-2">No Results Found</h3>
        <p className="text-gray-400 mb-8">
          No orders match &quot;{searchQuery}&quot;. Try a different search
          term.
        </p>
      </div>
    );
  }

  if (isBuyer) {
    return (
      <div className="text-center py-20">
        <div className="inline-block p-8 bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-full mb-6">
          <div className="text-6xl">📦</div>
        </div>
        <h3 className="text-3xl font-bold mb-3">No Orders Yet</h3>
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          You haven&apos;t placed any orders yet. Start exploring our collection
          and find your next favorite book!
        </p>
        <a
          href="/book-browser"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 
                     hover:from-teal-600 hover:to-teal-700 text-white rounded-xl font-semibold 
                     transition-all transform hover:scale-105 shadow-lg shadow-teal-500/25"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          Browse Books
        </a>
      </div>
    );
  }

  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-6">📭</div>
      <h3 className="text-2xl font-bold mb-2">No Orders Found</h3>
      <p className="text-gray-400">
        There are currently no orders in the system.
      </p>
    </div>
  );
}

// Orders List Component
function OrdersList({
  orders,
  isBuyer,
}: {
  orders: Order[];
  isBuyer: boolean;
}) {
  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-xl border border-neutral-700 
                     hover:border-teal-500/50 transition-all duration-300 overflow-hidden group"
        >
          <div className="p-6">
            {/* Header Row - Order Info */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-700">
              <div className="flex items-center gap-4">
                <div className="bg-teal-500/10 p-3 rounded-lg">
                  <svg
                    className="w-6 h-6 text-teal-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Order ID</p>
                  <p className="text-lg font-bold text-white">{order.id}</p>
                </div>

                <div className="ml-6">
                  <p className="text-xs text-gray-400 mb-1">Date</p>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>

                {/* Customer Info (only for admin/seller) */}
                {!isBuyer && (
                  <div className="ml-6">
                    <p className="text-xs text-gray-400 mb-1">Customer</p>
                    <p className="text-sm font-semibold text-white">
                      {order.customerName}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">Total</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${order.total.toFixed(2)}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>
            </div>

            {/* Books Section */}
            {order.items && order.items.length > 0 ? (
              <div>
                <p className="text-sm text-gray-400 mb-3 font-medium">
                  Books in this order:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-neutral-800/50 rounded-lg p-3 border border-neutral-700 
                                 hover:border-teal-500/30 transition-all"
                    >
                      {/* Book Image */}
                      {item.bookPicture ? (
                        <img
                          src={item.bookPicture}
                          alt={item.bookName}
                          className="w-16 h-24 object-cover rounded-md border border-neutral-600"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-16 h-24 bg-neutral-700 rounded-md flex items-center justify-center border border-neutral-600">
                          <svg
                            className="w-8 h-8 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Book Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-sm mb-1 line-clamp-2">
                          {item.bookName}
                        </h4>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">
                            Qty: {item.quantity}
                          </span>
                          <span className="font-semibold text-teal-400">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No book details available for this order
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = () => {
    switch (status) {
      case "Completed":
        return {
          bg: "bg-green-500/10",
          border: "border-green-500/30",
          text: "text-green-400",
          icon: (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ),
        };
      case "Pending":
        return {
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/30",
          text: "text-yellow-400",
          icon: (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
      case "Processing":
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/30",
          text: "text-blue-400",
          icon: (
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          ),
        };
      case "Cancelled":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          text: "text-red-400",
          icon: (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ),
        };
      default:
        return {
          bg: "bg-gray-500/10",
          border: "border-gray-500/30",
          text: "text-gray-400",
          icon: (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${config.bg} ${config.border} ${config.text} font-semibold text-sm`}
    >
      {config.icon}
      <span>{status}</span>
    </div>
  );
}
