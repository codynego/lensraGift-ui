"use client";

import { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Edit2, Trash2, Plus, 
  Check, X, Save, Home, Briefcase, Heart, Star, 
  Loader2, Zap, ShieldCheck, Settings, ChevronRight, Globe
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";

export default function ProfileDashboard() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState([]);

  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: ''
  });

  const [addressForm, setAddressForm] = useState({
    address_type: 'shipping',
    full_name: '',
    phone_number: '',
    street_address: '',
    apartment_suite: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Nigeria',
    is_default: false
  });

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  useEffect(() => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || ''
      });
    }
    fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${BaseUrl}api/users/addresses/`, { headers });
      const data = await res.json();
      setAddresses(data);
    } catch (err) {
      console.error("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch(`${BaseUrl}api/users/profile/`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(profileForm)
      });
      if (res.ok) setIsEditingProfile(false);
    } catch (err) {
      alert("Error updating profile");
    }
  };

  const handleAddAddress = async () => {
    try {
      const res = await fetch(`${BaseUrl}api/users/addresses/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(addressForm)
      });
      if (res.ok) {
        fetchAddresses();
        setShowAddressModal(false);
        resetAddressForm();
      }
    } catch (err) {
      alert("Error adding address");
    }
  };

  const handleSetDefault = async (id: number) => {
    await fetch(`${BaseUrl}api/users/addresses/${id}/set-default/`, { method: 'POST', headers });
    fetchAddresses();
  };

  const handleDeleteAddress = async (id: number) => {
    if (confirm('Decommission this hub location?')) {
      await fetch(`${BaseUrl}api/users/addresses/${id}/`, { method: 'DELETE', headers });
      fetchAddresses();
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      address_type: 'shipping', full_name: '', phone_number: '',
      street_address: '', apartment_suite: '', city: '',
      state: '', postal_code: '', country: 'Nigeria', is_default: false
    });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
      <div className="w-10 h-10 border-2 border-zinc-200 border-t-red-600 rounded-full animate-spin mb-4" />
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Syncing Identity</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      {/* 1. IDENTITY HEADER */}
      <section className="bg-zinc-900 rounded-[32px] p-8 md:p-12 relative overflow-hidden text-white shadow-2xl shadow-zinc-200">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-red-600/10 blur-[100px] rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-[24px] flex items-center justify-center text-3xl font-bold tracking-tighter text-zinc-900 border-4 border-zinc-800 shadow-xl">
              {profileForm.first_name[0]}{profileForm.last_name[0]}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-red-600 p-2 rounded-xl text-white shadow-lg border-2 border-zinc-900">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-center md:text-left">
            <span className="text-red-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-2 block">Verified Operator</span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase leading-tight">
              {profileForm.first_name} <span className="text-zinc-500">{profileForm.last_name}</span><span className="text-red-600">.</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase text-[9px] tracking-widest mt-2 bg-zinc-800/50 inline-block px-3 py-1 rounded-lg border border-zinc-700">
              {profileForm.email}
            </p>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 2. PROFILE BLUEPRINT FORM */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[32px] border border-zinc-200 overflow-hidden shadow-sm">
            <div className="px-8 py-6 flex items-center justify-between border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center">
                  <User className="text-red-600 w-4 h-4" />
                </div>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Profile Parameters</h2>
              </div>
              <button
                onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-[9px] tracking-widest uppercase transition-all ${
                  isEditingProfile ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                }`}
              >
                {isEditingProfile ? <><Save className="w-3.5 h-3.5" /> Save Changes</> : <><Edit2 className="w-3.5 h-3.5" /> Edit Identity</>}
              </button>
            </div>
            
            <div className="p-8 grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Legal First Name</label>
                <input 
                  disabled={!isEditingProfile}
                  value={profileForm.first_name}
                  onChange={(e) => setProfileForm({...profileForm, first_name: e.target.value})}
                  className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-200 focus:border-red-600/30 rounded-xl transition font-bold text-sm outline-none disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Legal Last Name</label>
                <input 
                  disabled={!isEditingProfile}
                  value={profileForm.last_name}
                  onChange={(e) => setProfileForm({...profileForm, last_name: e.target.value})}
                  className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-200 focus:border-red-600/30 rounded-xl transition font-bold text-sm outline-none disabled:opacity-50"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Verified Contact Link</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                  <input 
                    disabled={!isEditingProfile}
                    value={profileForm.phone_number}
                    onChange={(e) => setProfileForm({...profileForm, phone_number: e.target.value})}
                    className="w-full pl-12 pr-5 py-3.5 bg-zinc-50 border border-zinc-200 focus:border-red-600/30 rounded-xl transition font-bold text-sm outline-none disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. LOGISTICS HUB (ADDRESSES) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tight">Logistics <span className="text-red-600">Hubs</span></h2>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Active Deployment Points</p>
              </div>
              <button 
                onClick={() => setShowAddressModal(true)}
                className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold text-[9px] tracking-widest hover:bg-red-600 transition-all uppercase"
              >
                <Plus className="w-3.5 h-3.5" /> New Protocol
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {addresses.map((addr: any) => (
                <div key={addr.id} className={`group p-6 rounded-[24px] border transition-all relative ${addr.is_default ? 'border-red-600 bg-white shadow-lg shadow-red-900/5' : 'border-zinc-200 bg-zinc-50/50 hover:bg-white'}`}>
                  {addr.is_default && (
                    <div className="absolute -top-2.5 left-6 bg-red-600 text-white text-[8px] font-bold px-3 py-1 rounded-md uppercase tracking-widest shadow-lg">
                      Primary Node
                    </div>
                  )}
                  
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${addr.is_default ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-300 border border-zinc-100'}`}>
                      <Home className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold uppercase tracking-tight text-zinc-900 truncate mb-1">{addr.full_name}</p>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider space-y-0.5 leading-relaxed">
                        <p className="truncate">{addr.street_address}</p>
                        <p>{addr.city}, {addr.state}</p>
                      </div>
                      
                      <div className="flex gap-4 mt-4">
                        {!addr.is_default && (
                          <button onClick={() => handleSetDefault(addr.id)} className="text-[8px] font-bold uppercase tracking-widest text-red-600 hover:underline">Authorize Primary</button>
                        )}
                        <button onClick={() => handleDeleteAddress(addr.id)} className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-colors">Decommission</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. SIDEBAR SETTINGS / QUICK STATS */}
        <div className="space-y-6">
          <div className="bg-zinc-900 text-white rounded-[32px] p-8 shadow-xl">
            <Settings className="w-6 h-6 text-red-600 mb-6" />
            <h3 className="text-lg font-bold uppercase tracking-tight mb-4">Account <span className="text-zinc-500">Security</span></h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-xl border border-zinc-700">
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">2FA Status</span>
                <span className="text-[9px] font-bold uppercase text-emerald-500">Active</span>
              </div>
              <button className="w-full py-3 bg-white text-zinc-900 rounded-xl font-bold text-[9px] tracking-widest uppercase hover:bg-red-600 hover:text-white transition-all">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. PROTOCOL MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="bg-zinc-900 p-6 flex justify-between items-center text-white">
              <h3 className="text-lg font-bold uppercase tracking-tight">Hub <span className="text-red-600">Calibration</span></h3>
              <button onClick={() => setShowAddressModal(false)} className="hover:rotate-90 transition-transform"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="RECEIPIENT OPERATOR" className="col-span-2 p-4 bg-zinc-50 rounded-xl font-bold text-[10px] tracking-widest outline-none border border-zinc-200 focus:border-red-600/30 uppercase" onChange={e => setAddressForm({...addressForm, full_name: e.target.value})} />
                <input placeholder="STREET ADDRESS" className="col-span-2 p-4 bg-zinc-50 rounded-xl font-bold text-[10px] tracking-widest outline-none border border-zinc-200 focus:border-red-600/30 uppercase" onChange={e => setAddressForm({...addressForm, street_address: e.target.value})} />
                <input placeholder="CITY" className="p-4 bg-zinc-50 rounded-xl font-bold text-[10px] tracking-widest outline-none border border-zinc-200 focus:border-red-600/30 uppercase" onChange={e => setAddressForm({...addressForm, city: e.target.value})} />
                <input placeholder="STATE" className="p-4 bg-zinc-50 rounded-xl font-bold text-[10px] tracking-widest outline-none border border-zinc-200 focus:border-red-600/30 uppercase" onChange={e => setAddressForm({...addressForm, state: e.target.value})} />
                <input placeholder="CONTACT PHONE" className="col-span-2 p-4 bg-zinc-50 rounded-xl font-bold text-[10px] tracking-widest outline-none border border-zinc-200 focus:border-red-600/30 uppercase" onChange={e => setAddressForm({...addressForm, phone_number: e.target.value})} />
              </div>

              <button 
                onClick={handleAddAddress}
                className="w-full mt-4 py-4 bg-red-600 text-white rounded-xl font-bold text-[10px] tracking-[0.2em] uppercase shadow-lg shadow-red-900/20 hover:bg-zinc-900 transition-all"
              >
                Authorize Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}