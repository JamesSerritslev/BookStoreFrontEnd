import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import LoginForm from "@/components/LoginForm"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12">
        <LoginForm />
      </main>
      <Footer />
    </div>
  )
}
