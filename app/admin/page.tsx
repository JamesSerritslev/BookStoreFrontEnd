"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function AdminPage() {
    const router = useRouter()
    const [authorized, setAuthorized] = useState(false)


    useEffect(() => {
        const role = localStorage.getItem("role")

        if (role === "admin") {
        setAuthorized(true) // allow rendering
        } else {
        router.replace("/login") // redirect non-admins
        }
    }, [router])

    if (!authorized) {
        return null
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <Navbar />
            <main className="flex-1 flex items-center justify-center py-12">
                <h1 className="text-4xl font-bold">Admin Page</h1>
            </main>
            <h1>Admin Page</h1>
            <p>Here you can manage the books and users</p>
            <Footer />
        </div>
    )
}