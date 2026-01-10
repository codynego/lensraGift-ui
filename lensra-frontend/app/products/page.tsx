import Link from "next/link";

const products = [
  { id: "mug_white", name: "Mug", image: "/mockups/mug-white.png", price: 2500 },
  { id: "shirt_white", name: "T-Shirt", image: "/mockups/shirt-white.png", price: 4000 },
  { id: "frame_wood", name: "Frame", image: "/mockups/frame.png", price: 3000 },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded shadow p-4 flex flex-col items-center gap-4"
          >
            <img src={product.image} alt={product.name} className="w-40 h-40 object-contain"/>
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-red-600 font-bold">₦{product.price}</p>
            <Link
              href="/editor"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Customize
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
