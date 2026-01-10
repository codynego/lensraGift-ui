"use client"
import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, Lock, ArrowLeft, Heart } from 'lucide-react';

const initialCart = [
  { 
    id: "mug_white", 
    name: "White Ceramic Mug", 
    qty: 1, 
    price: 2500,
    image: "☕",
    customization: "Custom design with photo",
    color: "White",
    size: "11oz"
  },
  { 
    id: "shirt_white", 
    name: "Premium Cotton T-Shirt", 
    qty: 2, 
    price: 4000,
    image: "👕",
    customization: "Text: 'Best Dad Ever'",
    color: "White",
    size: "Large"
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCart);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setCartItems(prev => 
      prev.map(item => item.id === id ? { ...item, qty: newQty } : item)
    );
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = promoApplied ? subtotal * 0.2 : 0;
  const shipping = subtotal > 10000 ? 0 : 1500;
  const total = subtotal - discount + shipping;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'GIFT20') {
      setPromoApplied(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 text-sm font-medium">
        🎁 Free Shipping on Orders Over ₦10,000 | Use Code: GIFT20 for 20% Off
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-600">
          <a href="/" className="hover:text-red-600">Home</a> / <span className="text-gray-900 font-medium">Shopping Cart</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back to Shopping */}
        <a href="/products" className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </a>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center gap-3 mb-6">
                <ShoppingBag className="w-6 h-6 text-red-600" />
                <h1 className="text-2xl font-bold">Shopping Cart ({cartItems.length} items)</h1>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 mb-6">Start adding some amazing custom products!</p>
                  <a href="/products" className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition">
                    Browse Products
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                        {item.image}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <p className="text-sm text-gray-600">{item.customization}</p>
                            <div className="flex gap-4 text-xs text-gray-500 mt-1">
                              <span>Color: {item.color}</span>
                              <span>Size: {item.size}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-600 transition h-fit"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">Qty:</span>
                            <div className="flex items-center border rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.qty - 1)}
                                className="p-2 hover:bg-gray-100 transition"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{item.qty}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.qty + 1)}
                                className="p-2 hover:bg-gray-100 transition"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-900">
                              ₦{(item.price * item.qty).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              ₦{item.price.toLocaleString()} each
                            </div>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-4 mt-3">
                          <button className="text-sm text-red-600 hover:underline font-medium">
                            Edit Design
                          </button>
                          <button className="text-sm text-gray-600 hover:text-red-600 transition flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            Save for Later
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Products */}
            {cartItems.length > 0 && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="font-bold text-lg mb-4">You Might Also Like</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Canvas Print', price: 5500, image: '🖼️' },
                    { name: 'Tote Bag', price: 3500, image: '👜' },
                    { name: 'Phone Case', price: 2800, image: '📱' },
                    { name: 'Notebook', price: 2200, image: '📓' }
                  ].map((product, idx) => (
                    <div key={idx} className="border rounded-lg p-3 hover:shadow-md transition cursor-pointer group">
                      <div className="bg-gray-100 rounded-lg h-24 flex items-center justify-center text-3xl mb-2 group-hover:bg-gray-200 transition">
                        {product.image}
                      </div>
                      <h4 className="text-sm font-medium mb-1 line-clamp-1">{product.name}</h4>
                      <p className="text-sm font-bold text-red-600">₦{product.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-red-600"
                  />
                  <button
                    onClick={applyPromo}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    ✓ Promo code applied!
                  </p>
                )}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (20%)</span>
                    <span>-₦{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₦${shipping.toLocaleString()}`}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-green-600">🎉 You qualify for free shipping!</p>
                )}
              </div>

              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Total</span>
                <span className="text-red-600">₦{total.toLocaleString()}</span>
              </div>

              <button className="w-full py-4 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition shadow-lg hover:shadow-xl mb-3 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                Proceed to Checkout
              </button>

              <button className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-red-600 hover:text-red-600 transition">
                Continue Shopping
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ShoppingBag className="w-4 h-4 text-blue-600" />
                  <span>Free returns within 30 days</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Heart className="w-4 h-4 text-red-600" />
                  <span>100% satisfaction guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}