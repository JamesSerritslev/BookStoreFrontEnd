"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to BookHub</h1>
          <p className="text-gray-400 text-lg mb-8">
            Your ultimate destination for books
          </p>
          {!isAuthenticated && (
            <div className="space-x-4">
              <Link href="/login">
                <Button className="bg-teal-500 hover:bg-teal-600 text-black font-medium">
                  Get Started
                </Button>
              </Link>
              <Link href="/shop">
                <Button
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-800"
                >
                  Browse Books
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
