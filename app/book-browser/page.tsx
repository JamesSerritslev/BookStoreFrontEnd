import Image from "next/image";
import Navbar from "@/components/Navbar";

const books = [
  {
    title: "The Great Gatsby",
    image: "/placeholder.jpg",
  },
  {
    title: "To Kill a Mockingbird",
    image: "/placeholder.jpg",
  },
  {
    title: "1984",
    image: "/placeholder.jpg",
  },
  {
    title: "Pride and Prejudice",
    image: "/placeholder.jpg",
  },
  {
    title: "Moby Dick",
    image: "/placeholder.jpg",
  },
];

function BookBrowserPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-teal-400">Browse Books</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {books.map((book, idx) => (
            <div key={idx} className="bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center">
              <Image
                src={book.image}
                alt={book.title}
                width={160}
                height={220}
                className="rounded mb-4 object-cover"
              />
              <div className="text-white text-lg font-semibold text-center">{book.title}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default BookBrowserPage;
