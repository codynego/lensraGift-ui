"use client"
import { useState } from 'react';
import { Package, Heart, Palette, ShoppingCart, TrendingUp, Clock, CheckCircle, Sparkles, ChevronRight, Plus, Zap, Star, Truck } from 'lucide-react';

export default function DashboardOverview() {
  const userName = "Shina";

  const stats = {
    activeDesigns: 3,
    ordersPlaced: 12,
    wishlistItems: 8,
    rewardPoints: 250
  };

  const recentDesigns = [
    { id: 1, name: 'Coffee Lover Mug', product: 'Mug', lastEdited: '2 hours ago', img: '☕', progress: 85 },
    { id: 2, name: 'Birthday T-Shirt', product: 'T-Shirt', lastEdited: '1 day ago', img: '👕', progress: 60 },
    { id: 3, name: 'Family Canvas', product: 'Canvas Print', lastEdited: '3 days ago', img: '🖼️', progress: 40 }
  ];

  const recentOrders = [
    { id: '#ORD-001234', status: 'delivered', date: 'Jan 10, 2025', total: 45.97, items: 3 },
    { id: '#ORD-001233', status: 'shipping', date: 'Jan 8, 2025', total: 34.99, items: 1 },
    { id: '#ORD-001232', status: 'printing', date: 'Jan 6, 2025', total: 136.95, items: 5 }
  ];

  const quickActions = [
    { name: 'Continue Design', icon: <Palette className="w-6 h-6" />, color: 'from-purple-600 to-pink-600', action: 'design' },
    { name: 'Start New Order', icon: <ShoppingCart className="w-6 h-6" />, color: 'from-blue-600 to-purple-600', action: 'shop' },
    { name: 'Browse Templates', icon: <Sparkles className="w-6 h-6" />, color: 'from-pink-600 to-red-600', action: 'templates' },
    { name: 'View Wishlist', icon: <Heart className="w-6 h-6" />, color: 'from-red-600 to-pink-600', action: 'wishlist' }
  ];

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; icon: JSX.Element }> = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-3 h-3" /> },
      printing: { label: 'Printing', color: 'bg-blue-100 text-blue-700', icon: <Zap className="w-3 h-3" /> },
      shipping: { label: 'Shipping', color: 'bg-purple-100 text-purple-700', icon: <Truck className="w-3 h-3" /> },
      delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3 h-3" /> }
    };
    return configs[status] || configs.pending;
  };

  const handleQuickAction = (action: string) => {
    const messages: Record<string, string> = {
      design: 'Opening design editor...',
      shop: 'Redirecting to shop...',
      templates: 'Opening template gallery...',
      wishlist: 'Opening your wishlist...'
    };
    alert(messages[action]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-5xl font-bold mb-2">Welcome back, {userName} 👋</h1>
              <p className="text-xl text-blue-100">Ready to create something amazing today?</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleQuickAction('design')}
                className="px-6 py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-gray-100 transition shadow-xl flex items-center gap-2"
              >
                <Palette className="w-5 h-5" />
                Continue Design
              </button>
              <button
                onClick={() => handleQuickAction('shop')}
                className="px-6 py-3 bg-white/20 backdrop-blur-sm border-2 border-white text-white rounded-full font-bold hover:bg-white/30 transition flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Start New Order
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition">
                <Palette className="w-7 h-7" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">{stats.activeDesigns}</div>
            <div className="text-gray-600 font-medium">Active Designs</div>
            <div className="mt-3 text-sm text-purple-600 font-semibold flex items-center gap-1">
              Continue editing <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition">
                <Package className="w-7 h-7" />
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">{stats.ordersPlaced}</div>
            <div className="text-gray-600 font-medium">Orders Placed</div>
            <div className="mt-3 text-sm text-blue-600 font-semibold flex items-center gap-1">
              View all orders <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition">
                <Heart className="w-7 h-7 fill-white" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">{stats.wishlistItems}</div>
            <div className="text-gray-600 font-medium">Wishlist Items</div>
            <div className="mt-3 text-sm text-red-600 font-semibold flex items-center gap-1">
              View wishlist <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition group cursor-pointer text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                <Star className="w-7 h-7 fill-white" />
              </div>
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-4xl font-bold mb-1">{stats.rewardPoints}</div>
            <div className="text-white/90 font-medium">Reward Points</div>
            <div className="mt-3 text-sm font-semibold flex items-center gap-1">
              Redeem now <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-purple-600" />
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(action.action)}
                className={`bg-gradient-to-br ${action.color} text-white rounded-xl p-6 hover:shadow-xl transition-all hover:scale-105 group`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    {action.icon}
                  </div>
                  <div className="font-bold text-lg">{action.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Recent Designs */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Palette className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">Recent Designs</h2>
              </div>
              <button className="text-purple-600 font-semibold hover:underline text-sm flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {recentDesigns.map((design) => (
                <div
                  key={design.id}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition">
                    {design.img}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 truncate">{design.name}</div>
                    <div className="text-sm text-gray-500">{design.product}</div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>{design.progress}% complete</span>
                        <span className="text-purple-600">{design.lastEdited}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all"
                          style={{ width: `${design.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition" />
                </div>
              ))}
              <button
                onClick={() => handleQuickAction('design')}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-semibold hover:border-purple-600 hover:text-purple-600 hover:bg-purple-50 transition flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Start New Design
              </button>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              </div>
              <button className="text-blue-600 font-semibold hover:underline text-sm flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {recentOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition cursor-pointer group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="font-bold text-gray-900">{order.id}</div>
                        <div className={`${statusConfig.color} px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                          {statusConfig.icon}
                          {statusConfig.label}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">{order.date} · {order.items} items</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">${order.total}</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                );
              })}
              <button
                onClick={() => handleQuickAction('shop')}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Place New Order
              </button>
            </div>
          </div>
        </div>

        {/* Promotional Banner */}
        <div className="mt-8 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6" />
                <span className="bg-white/20 backdrop-blur-sm text-sm font-bold px-3 py-1 rounded-full">
                  Limited Time Offer
                </span>
              </div>
              <h3 className="text-3xl font-bold mb-2">Get 20% Off Your Next Order!</h3>
              <p className="text-lg text-white/90">Use code: <code className="bg-white/20 px-3 py-1 rounded font-mono">WELCOME20</code> at checkout</p>
            </div>
            <button
              onClick={() => handleQuickAction('shop')}
              className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-xl"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}