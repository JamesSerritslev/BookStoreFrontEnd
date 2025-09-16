import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to BookHub</h1>
          <p className="text-gray-400 text-lg">Your ultimate destination for books</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
