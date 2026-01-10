import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">Get 15% Off Your First Order</h2>
          <p className="text-lg mb-6">Join our newsletter for exclusive deals and design inspiration</p>
          <div className="flex gap-3 max-w-md mx-auto flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-8 py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-gray-100 transition shadow-lg">
              Subscribe
            </button>
          </div>
          <p className="text-sm mt-4 opacity-90">No spam, unsubscribe anytime</p>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">Lensra Gifts</h3>
            <p className="text-gray-400 mb-4 max-w-sm">
              Create personalized products that express your unique style. From custom mugs to apparel, we bring your ideas to life with quality printing and fast delivery.
            </p>
            <div className="space-y-2">
              <a href="tel:+2348012345678" className="flex items-center gap-2 hover:text-white transition">
                <Phone className="w-4 h-4" />
                <span>+234 801 234 5678</span>
              </a>
              <a href="mailto:support@lensra.com" className="flex items-center gap-2 hover:text-white transition">
                <Mail className="w-4 h-4" />
                <span>support@lensra.com</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Benin City, Edo State, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/products" className="hover:text-white transition">All Products</a></li>
              <li><a href="/products?category=apparel" className="hover:text-white transition">Apparel</a></li>
              <li><a href="/products?category=drinkware" className="hover:text-white transition">Drinkware</a></li>
              <li><a href="/products?category=home" className="hover:text-white transition">Home & Living</a></li>
              <li><a href="/products?category=accessories" className="hover:text-white transition">Accessories</a></li>
              <li><a href="/sale" className="text-red-400 hover:text-red-300 transition font-medium">Sale Items</a></li>
              <li><a href="/custom-gifts" className="hover:text-white transition">Custom Gifts</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-white mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/help" className="hover:text-white transition">Help Center</a></li>
              <li><a href="/shipping" className="hover:text-white transition">Shipping Info</a></li>
              <li><a href="/returns" className="hover:text-white transition">Returns & Exchanges</a></li>
              <li><a href="/track-order" className="hover:text-white transition">Track Your Order</a></li>
              <li><a href="/sizing" className="hover:text-white transition">Size Guide</a></li>
              <li><a href="/faq" className="hover:text-white transition">FAQ</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:text-white transition">About Us</a></li>
              <li><a href="/careers" className="hover:text-white transition">Careers</a></li>
              <li><a href="/blog" className="hover:text-white transition">Blog</a></li>
              <li><a href="/press" className="hover:text-white transition">Press</a></li>
              <li><a href="/affiliate" className="hover:text-white transition">Affiliate Program</a></li>
              <li><a href="/business" className="hover:text-white transition">Business Solutions</a></li>
              <li><a href="/sustainability" className="hover:text-white transition">Sustainability</a></li>
            </ul>
          </div>
        </div>

        {/* Social Media & Payment Methods */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-white">Follow Us:</span>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-full hover:bg-sky-500 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-full hover:bg-pink-600 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-full hover:bg-red-600 transition">
                <Youtube className="w-5 h-5" />
              </a>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-white">We Accept:</span>
              <div className="flex gap-2">
                {['💳', '💰', '🏦', '📱'].map((icon, idx) => (
                  <div key={idx} className="bg-white rounded px-3 py-1 text-lg">
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-gray-500">
              © {new Date().getFullYear()} Lensra Gifts. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition">Terms of Service</a>
              <a href="/cookies" className="hover:text-white transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl">🚚</div>
              <h5 className="font-semibold text-white text-sm">Free Shipping</h5>
              <p className="text-xs text-gray-400">Orders over ₦10,000</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">🔒</div>
              <h5 className="font-semibold text-white text-sm">Secure Payment</h5>
              <p className="text-xs text-gray-400">100% protected</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">↩️</div>
              <h5 className="font-semibold text-white text-sm">Easy Returns</h5>
              <p className="text-xs text-gray-400">30-day guarantee</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">⭐</div>
              <h5 className="font-semibold text-white text-sm">Quality Guaranteed</h5>
              <p className="text-xs text-gray-400">Premium products</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}