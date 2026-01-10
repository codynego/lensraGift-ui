"use client"

import { Target, Heart, Award, Users, Zap, Shield, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Customer First",
      description: "Your satisfaction drives everything we do. We're committed to making your creative vision a reality."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Quality Guaranteed",
      description: "Premium materials and professional printing ensure your products look amazing and last long."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast & Easy",
      description: "Design in minutes, not hours. Our intuitive editor makes customization simple for everyone."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Reliable",
      description: "Your data is safe with us. We use industry-standard security for all transactions."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Happy Customers" },
    { number: "50,000+", label: "Products Created" },
    { number: "4.8/5", label: "Average Rating" },
    { number: "99%", label: "Satisfaction Rate" }
  ];

  const features = [
    "Easy-to-use design editor",
    "High-quality printing technology",
    "Fast and reliable shipping",
    "Wide range of customizable products",
    "Competitive pricing",
    "Excellent customer support"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Lensra Gifts</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Nigeria's premier personalized print-on-demand platform, making it easy to create unique gifts with your own designs
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Lensra Gifts was born from a simple idea: everyone should be able to create personalized gifts that truly matter, without the hassle of complicated design tools or expensive minimum orders.
                </p>
                <p>
                  As Nigeria's first locally built print-on-demand platform, we're proud to bring world-class customization technology to our community. Whether it's a birthday mug, a wedding shirt, or a corporate gift, we make it simple to turn your ideas into reality.
                </p>
                <p>
                  Our mission is to help you give gifts that feel personal, creative, and unforgettable—because the best gifts come from the heart.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-100 to-purple-100 rounded-2xl h-80 flex items-center justify-center text-8xl">
              🎁
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do, from product development to customer service
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white border rounded-xl p-6 hover:shadow-xl transition text-center">
                <div className="text-red-600 flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Why Choose Lensra?</h2>
            <p className="text-gray-600">
              We're not just another print shop—we're your creative partner
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white rounded-lg p-4 hover:shadow-md transition">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-red-600 to-pink-600 text-white rounded-2xl p-8">
              <Target className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="leading-relaxed">
                To empower individuals and businesses across Nigeria to create meaningful, personalized products that celebrate their unique stories, relationships, and moments—all through an accessible, easy-to-use platform.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl p-8">
              <Users className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="leading-relaxed">
                To become the leading personalized gifting platform in Nigeria and beyond, making custom products accessible to everyone while supporting local creativity and entrepreneurship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A passionate group of designers, developers, and customer service experts dedicated to bringing your ideas to life
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { name: "John Doe", role: "Founder & CEO", emoji: "👨‍💼" },
              { name: "Jane Smith", role: "Head of Design", emoji: "👩‍🎨" },
              { name: "Mike Johnson", role: "Tech Lead", emoji: "👨‍💻" },
              { name: "Sarah Williams", role: "Customer Success", emoji: "👩‍💼" }
            ].map((member, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 text-center hover:shadow-xl transition">
                <div className="text-6xl mb-4">{member.emoji}</div>
                <h4 className="font-bold text-lg mb-1 text-gray-900">{member.name}</h4>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Create Something Special?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers who trust Lensra for their personalized gifts</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/products" className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold hover:bg-gray-100 transition shadow-xl">
              Start Designing
            </a>
            <a href="/contact" className="px-8 py-4 border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-purple-600 transition">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}