"use client"
import { useState } from 'react';
import { Building2, Users, Package, TrendingUp, CheckCircle, Gift, Truck, Headphones, Mail, Phone, MapPin, Star } from 'lucide-react';

export default function LensraBusinessPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    productType: '',
    quantity: '',
    budget: '',
    deadline: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Quote request submitted! Our team will contact you within 24 hours.');
    setFormData({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      productType: '',
      quantity: '',
      budget: '',
      deadline: '',
      message: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const benefits = [
    { icon: <Package className="w-8 h-8" />, title: 'Volume Discounts', desc: 'Save up to 40% on bulk orders of 100+ units' },
    { icon: <Users className="w-8 h-8" />, title: 'Dedicated Account Manager', desc: 'Personal support throughout your order process' },
    { icon: <TrendingUp className="w-8 h-8" />, title: 'Custom Branding', desc: 'Full customization with your company logo and colors' },
    { icon: <Truck className="w-8 h-8" />, title: 'Fast Turnaround', desc: 'Rush orders available with 5-7 day production' },
    { icon: <CheckCircle className="w-8 h-8" />, title: 'Quality Guarantee', desc: '100% satisfaction or full refund policy' },
    { icon: <Headphones className="w-8 h-8" />, title: 'Priority Support', desc: '24/7 dedicated business customer service' }
  ];

  const pricingTiers = [
    { range: '50-99 units', discount: '15%', color: 'from-blue-500 to-blue-600' },
    { range: '100-249 units', discount: '25%', color: 'from-purple-500 to-purple-600' },
    { range: '250-499 units', discount: '35%', color: 'from-pink-500 to-pink-600' },
    { range: '500+ units', discount: '40%', color: 'from-red-500 to-red-600' }
  ];

  const useCases = [
    { title: 'Employee Appreciation', icon: '🎁', desc: 'Branded gifts for team milestones and achievements' },
    { title: 'Corporate Events', icon: '🎪', desc: 'Conference swag, trade show giveaways, and event merchandise' },
    { title: 'Client Gifting', icon: '🤝', desc: 'Impress clients with personalized corporate gifts' },
    { title: 'New Hire Kits', icon: '👋', desc: 'Welcome packages for onboarding new employees' },
    { title: 'Marketing Campaigns', icon: '📢', desc: 'Promotional items to boost brand awareness' },
    { title: 'Holiday Gifts', icon: '🎄', desc: 'Seasonal gifts for employees and clients' }
  ];

  const testimonials = [
    { company: 'TechCorp Inc.', person: 'Sarah Johnson, HR Director', text: 'Ordered 500 branded mugs for our annual conference. Quality exceeded expectations and delivery was on time!', rating: 5 },
    { company: 'Marketing Pro Agency', person: 'Mike Chen, CEO', text: 'The dedicated account manager made the entire process seamless. Will definitely order again.', rating: 5 },
    { company: 'StartUp Labs', person: 'Emily Rodriguez, Operations Manager', text: 'Great bulk pricing and the customization options were perfect for our brand identity.', rating: 5 }
  ];

  const popularProducts = [
    { name: 'Branded Mugs', minOrder: 50, price: 'from $8.99', img: '☕' },
    { name: 'Corporate T-Shirts', minOrder: 100, price: 'from $12.99', img: '👕' },
    { name: 'Tote Bags', minOrder: 50, price: 'from $14.99', img: '👜' },
    { name: 'Water Bottles', minOrder: 100, price: 'from $18.99', img: '🍶' },
    { name: 'Notebooks', minOrder: 50, price: 'from $6.99', img: '📓' },
    { name: 'Hoodies', minOrder: 50, price: 'from $29.99', img: '🧥' }
  ];

  const scrollToForm = () => {
    const formElement = document.getElementById('quote-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue-100">
                <Building2 className="w-6 h-6" />
                <span className="font-semibold">Lensra for Business</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Elevate Your Brand with Custom Corporate Gifts
              </h1>
              <p className="text-xl text-blue-50">
                Premium bulk customization for businesses of all sizes. From employee swag to client appreciation gifts.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={scrollToForm}
                  className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-xl"
                >
                  Request a Quote
                </button>
                <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition">
                  View Catalog
                </button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold">10,000+</div>
                  <div className="text-blue-100">Happy Businesses</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">500K+</div>
                  <div className="text-blue-100">Products Delivered</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-300" />
                <span className="text-lg">No minimum order for samples</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-300" />
                <span className="text-lg">Free design mockups</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-300" />
                <span className="text-lg">Volume discounts up to 40%</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-300" />
                <span className="text-lg">Dedicated account manager</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Lensra for Business?</h2>
            <p className="text-xl text-gray-600">Everything you need for successful corporate gifting</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition group">
                <div className="text-purple-600 mb-4 group-hover:scale-110 transition">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Volume Discount Pricing</h2>
            <p className="text-xl text-gray-600">The more you order, the more you save</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {pricingTiers.map((tier, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${tier.color} text-white rounded-xl p-6 text-center hover:scale-105 transition shadow-xl`}>
                <div className="text-5xl font-bold mb-2">{tier.discount}</div>
                <div className="text-xl font-semibold mb-2">OFF</div>
                <div className="text-sm opacity-90">{tier.range}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Looking for 1,000+ units? <button className="text-purple-600 font-semibold hover:underline">Contact us for enterprise pricing</button>
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Perfect for Every Occasion</h2>
            <p className="text-xl text-gray-600">Versatile solutions for all your corporate needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((useCase, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 hover:shadow-xl transition cursor-pointer group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition">{useCase.icon}</div>
                <h3 className="text-xl font-bold mb-2">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Popular Business Products</h2>
            <p className="text-xl text-gray-600">Best sellers for corporate gifting</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularProducts.map((product, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-4 text-center hover:shadow-lg transition group cursor-pointer">
                <div className="text-6xl mb-4 group-hover:scale-110 transition">{product.img}</div>
                <h3 className="font-bold mb-2">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">Min. {product.minOrder} units</p>
                <p className="text-purple-600 font-semibold">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Trusted by Leading Companies</h2>
            <p className="text-xl text-gray-600">See what our business clients have to say</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="border-t pt-4">
                  <p className="font-bold">{testimonial.person}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Request Form */}
      <section id="quote-form" className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center text-white mb-12">
            <h2 className="text-4xl font-bold mb-4">Request a Custom Quote</h2>
            <p className="text-xl text-purple-100">Fill out the form below and our team will get back to you within 24 hours</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Your Company Inc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Name *</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Product Type *</label>
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select a product</option>
                    <option value="mugs">Mugs</option>
                    <option value="tshirts">T-Shirts</option>
                    <option value="hoodies">Hoodies</option>
                    <option value="tote-bags">Tote Bags</option>
                    <option value="water-bottles">Water Bottles</option>
                    <option value="notebooks">Notebooks</option>
                    <option value="multiple">Multiple Products</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity *</label>
                  <select
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select quantity</option>
                    <option value="50-99">50-99 units</option>
                    <option value="100-249">100-249 units</option>
                    <option value="250-499">250-499 units</option>
                    <option value="500-999">500-999 units</option>
                    <option value="1000+">1,000+ units</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Budget Range</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select budget</option>
                    <option value="under-1000">Under $1,000</option>
                    <option value="1000-5000">$1,000 - $5,000</option>
                    <option value="5000-10000">$5,000 - $10,000</option>
                    <option value="10000-25000">$10,000 - $25,000</option>
                    <option value="25000+">$25,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Target Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Details</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Tell us about your project, design requirements, or any special requests..."
                ></textarea>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg hover:shadow-xl transition"
              >
                Submit Quote Request
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Mail className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-gray-400">business@lensra.com</p>
            </div>
            <div>
              <Phone className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p className="text-gray-400">1-800-LENSRA-BIZ</p>
            </div>
            <div>
              <MapPin className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-bold mb-2">Visit Us</h3>
              <p className="text-gray-400">123 Business St, Suite 100</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}