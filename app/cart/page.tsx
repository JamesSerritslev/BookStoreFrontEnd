"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  formatPrice,
} from "@/lib/api/cart";
import { CartResponse, CartItem, CartItemWithDetails } from "@/lib/types/cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  X,
  Info,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { toast } = useToast();

  const [cart, setCart] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch cart on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const cartData = await getCart();
      setCart(cartData);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to load cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQty: number) => {
    if (newQty < 1) return;

    try {
      setUpdatingItemId(itemId);
      const updatedCart = await updateCartItem(itemId, newQty);
      setCart(updatedCart);
      toast({
        title: "Cart updated",
        description: "Item quantity has been updated",
      });
    } catch (error) {
      console.error("Failed to update item:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update item",
        variant: "destructive",
      });
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      setRemovingItemId(itemId);
      await removeFromCart(itemId);
      // Refresh cart after removal
      await fetchCart();
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to remove item",
        variant: "destructive",
      });
    } finally {
      setRemovingItemId(null);
    }
  };

  const handleClearCart = async () => {
    if (!confirm("Are you sure you want to clear your cart?")) return;

    try {
      setIsClearing(true);
      await clearCart();
      await fetchCart();
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
    } catch (error) {
      console.error("Failed to clear cart:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to clear cart",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleCheckout = async () => {
    if (!cart || !user || cart.items.length === 0) {
      toast({
        title: "Error",
        description: "Cannot checkout with an empty cart",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCheckingOut(true);

      // Calculate order details from cart
      const orderTotal = cart.subtotal / 100; // Convert from cents to dollars
      const itemCount = cart.items.reduce((sum, item) => sum + item.qty, 0);
      const customerName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Customer";
      const customerEmail = user.email || "";
      const shippingAddress = `${customerName}, ${customerEmail}`.trim() || "Default Address";
      const userId = user.id?.toString() || user.email || "unknown";

      // Create order immediately via API (MSW will intercept)
      // This ensures the order appears in the orders list
      const orderResponse = await fetch("http://localhost:8080/api/v1/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          cartId: cart.cartId || "default-cart",
          itemCount: itemCount,
          total: orderTotal,
          shippingAddress: shippingAddress,
          billingAddress: shippingAddress,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const order = await orderResponse.json();

      // Clear the cart after successful order
      await clearCart();
      await fetchCart();

      // Show success message
      toast({
        title: "Order Placed! 🎉",
        description: `Your order has been placed successfully. Total: ${formatPrice(orderTotal * 100)}`,
      });

      // Redirect to orders page after a short delay
      setTimeout(() => {
        router.push("/admin/orders");
      }, 1500);
    } catch (error) {
      console.error("Failed to checkout:", error);
      toast({
        title: "Checkout Failed",
        description: error instanceof Error ? error.message : "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-teal-400" />
            <p className="text-gray-400">Loading your cart...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-gray-400">
            {isEmpty
              ? "Your cart is empty"
              : `${cart.items.length} item(s) in your cart`}
          </p>
        </div>

        {isEmpty ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 mx-auto mb-6 text-gray-600" />
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-8">Add some books to get started!</p>
            <Button
              onClick={() => router.push("/shop")}
              className="bg-teal-500 hover:bg-teal-600 text-black"
            >
              Browse Books
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <Card key={item.itemId} className="bg-gray-900 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Book image */}
                      <div className="w-24 h-32 bg-gray-800 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.bookPicture ? (
                          <img
                            src={item.bookPicture}
                            alt={item.bookName || "Book"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ShoppingCart className="w-8 h-8 text-gray-600" />
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">
                              {item.bookName || `Item ID: ${item.inventoryId.substring(0, 8)}...`}
                            </h3>
                            {item.bookDescription && (
                              <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                                {item.bookDescription}
                              </p>
                            )}
                            <p className="text-sm text-gray-400">
                              {formatPrice(item.unitPrice)} each
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.itemId)}
                            disabled={removingItemId === item.itemId}
                            className="text-red-400 hover:text-red-300 hover:bg-red-950"
                          >
                            {removingItemId === item.itemId ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </Button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 bg-gray-800 rounded-lg p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleUpdateQuantity(item.itemId, item.qty - 1)
                              }
                              disabled={
                                item.qty <= 1 || updatingItemId === item.itemId
                              }
                              className="h-8 w-8"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>

                            <span className="w-12 text-center font-semibold">
                              {updatingItemId === item.itemId ? (
                                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                              ) : (
                                item.qty
                              )}
                            </span>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleUpdateQuantity(item.itemId, item.qty + 1)
                              }
                              disabled={updatingItemId === item.itemId}
                              className="h-8 w-8"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-gray-400">Subtotal</p>
                            <p className="text-xl font-bold text-teal-400">
                              {formatPrice(item.lineSubtotal)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Clear Cart Button */}
              <Button
                variant="outline"
                onClick={handleClearCart}
                disabled={isClearing}
                className="w-full border-red-600 text-red-400 hover:bg-red-950 hover:text-red-300"
              >
                {isClearing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Clear Cart
                  </>
                )}
              </Button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-900 border-gray-700 sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-400">
                      <span>Items ({cart.items.length})</span>
                      <span>{formatPrice(cart.subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-gray-400">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>

                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span className="text-teal-400">
                          {formatPrice(cart.subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={isCheckingOut || !cart || cart.items.length === 0}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-black font-semibold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing Order...
                      </>
                    ) : (
                      "Proceed to Checkout"
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => router.push("/shop")}
                    className="w-full mt-3 border-gray-600 hover:bg-gray-800"
                  >
                    Continue Shopping
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Prices are in USD
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
