const mockCart = [
  { id: "mug_white", name: "Mug", qty: 1, price: 2500 },
  { id: "shirt_white", name: "T-Shirt", qty: 2, price: 4000 },
];

export default function CartPage() {
  const total = mockCart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="flex flex-col gap-4">
        {mockCart.map((item) => (
          <div key={item.id} className="flex justify-between border p-4 rounded">
            <span>{item.name} x {item.qty}</span>
            <span>₦{item.price * item.qty}</span>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-bold mt-6">Total: ₦{total}</h2>
      <a href="/checkout" className="mt-4 inline-block px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700">
        Checkout
      </a>
    </main>
  );
}
