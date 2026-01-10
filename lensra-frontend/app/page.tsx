import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 gap-6">
      <h1 className="text-4xl font-bold text-center">
        Welcome to Lensra Gifts
      </h1>
      <p className="text-center max-w-xl">
        Customize your favorite products and create unique personalized gifts.
      </p>
      <Link
        href="/products"
        className="px-6 py-3 bg-red-600 text-white rounded shadow hover:bg-red-700"
      >
        Shop Now
      </Link>
    </main>
  );
}
