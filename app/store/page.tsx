"use client"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"


export default function StorePage() {
    const router = useRouter()
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        const role = localStorage.getItem("role")
        if (role === "buyer") {
            setAuthorized(true)
        }
        else {
            router.replace("/login")
        }
    }, [router])

    if (!authorized) {
        return null
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <Navbar />
            <main className="flex-1 flex items-center justify-center py-12">
            <h1>Welcome to the store!</h1>
            </main>
            <Footer />
        </div>
    )
}