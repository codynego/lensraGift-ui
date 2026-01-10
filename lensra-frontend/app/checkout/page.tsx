export default function CheckoutPage() {
  return (
    <main className="p-6 max-w-md mx-auto flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <input type="text" placeholder="Full Name" className="border p-2 rounded"/>
      <input type="text" placeholder="Phone Number" className="border p-2 rounded"/>
      <input type="text" placeholder="Delivery Address" className="border p-2 rounded"/>
      <button className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 mt-4">
        Place Order
      </button>
    </main>
  );
}
