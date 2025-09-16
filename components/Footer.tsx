import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">© 2025 BookHub Corporation</div>

          <div className="flex flex-wrap items-center space-x-6 text-sm">
            <Link href="/" className="text-gray-400 hover:text-teal-400 transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-400 hover:text-teal-400 transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-teal-400 transition-colors">
              Contact Us
            </Link>
            <Link href="/faq" className="text-gray-400 hover:text-teal-400 transition-colors">
              FAQ
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-teal-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-teal-400 transition-colors">
              Terms Of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
