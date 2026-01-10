import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-red-600 text-white p-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-xl">Lensra Gifts</Link>
      <div className="flex gap-4">
        <Link href="/products" className="hover:underline">Products</Link>
        <Link href="/about" className="hover:underline">About</Link>
        <Link href="/contact" className="hover:underline">Contact</Link>
        <Link href="/cart" className="hover:underline">Cart</Link>
      </div>
    </nav>
  );
}
