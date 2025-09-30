import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import {ShopContent} from "@/components/ShopContent"

export default function ShopPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <main className="pt-20">
                <ShopContent />
            </main>
            <Footer />
        </div>
    )
}