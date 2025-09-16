import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import SignupForm from "@/components/SignupForm"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12">
        <SignupForm />
      </main>
      <Footer />
    </div>
  )
}
