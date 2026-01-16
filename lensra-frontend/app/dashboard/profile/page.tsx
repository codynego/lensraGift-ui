"use client";

import { useState, useEffect } from 'react';
import { 
  User, Phone, Home, Plus, Edit2, Trash2, 
  Check, X, Save, ShieldCheck, Settings, Loader2 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/";


interface Address {
  id: number;
  full_name: string;
  phone_number: string;
  street_address: string;
  city: string;
  state: string;
  country: string;
  is_default: boolean;
}

export default function ProfileDashboard() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
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
    city: '',
    state: '',
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
      setAddresses(Array.isArray(data) ? data : []);
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
    if (confirm('Are you sure you want to delete this address?')) {
      await fetch(`${BaseUrl}api/users/addresses/${id}/`, { method: 'DELETE', headers });
      fetchAddresses();
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      address_type: 'shipping', full_name: '', phone_number: '',
      street_address: '', city: '', state: '', country: 'Nigeria', is_default: false
    });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
      <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Loading Profile</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      {/* 1. HEADER */}
      <section className="bg-zinc-950 rounded-[48px] p-8 md:p-12 relative overflow-hidden text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-[32px] flex items-center justify-center text-3xl font-black italic tracking-tighter text-zinc-900 border-4 border-zinc-800">
              {(profileForm.first_name[0] || 'U')}{(profileForm.last_name[0] || '')}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-red-600 p-2 rounded-xl text-white border-2 border-zinc-950">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-center md:text-left">
            <span className="text-red-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Official Account</span>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
              {profileForm.first_name} <span className="text-zinc-600">{profileForm.last_name}</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase text-[9px] tracking-widest mt-4 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800 inline-block">
              {profileForm.email}
            </p>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 2. PROFILE SETTINGS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[40px] border border-zinc-100 overflow-hidden shadow-sm">
            <div className="px-8 py-6 flex items-center justify-between border-b border-zinc-50">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Personal Details</h2>
              <button
                onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[9px] tracking-widest uppercase transition-all ${
                  isEditingProfile ? 'bg-red-600 text-white' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                }`}
              >
                {isEditingProfile ? <><Save className="w-3.5 h-3.5" /> Save Changes</> : <><Edit2 className="w-3.5 h-3.5" /> Edit Profile</>}
              </button>
            </div>
            
            <div className="p-8 grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">First Name</label>
                <input 
                  disabled={!isEditingProfile}
                  value={profileForm.first_name}
                  onChange={(e) => setProfileForm({...profileForm, first_name: e.target.value})}
                  className="w-full px-6 py-4 bg-zinc-50 border-2 border-transparent focus:border-red-600/20 focus:bg-white rounded-2xl transition font-bold text-sm outline-none disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">Last Name</label>
                <input 
                  disabled={!isEditingProfile}
                  value={profileForm.last_name}
                  onChange={(e) => setProfileForm({...profileForm, last_name: e.target.value})}
                  className="w-full px-6 py-4 bg-zinc-50 border-2 border-transparent focus:border-red-600/20 focus:bg-white rounded-2xl transition font-bold text-sm outline-none disabled:opacity-50"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input 
                    disabled={!isEditingProfile}
                    value={profileForm.phone_number}
                    onChange={(e) => setProfileForm({...profileForm, phone_number: e.target.value})}
                    className="w-full pl-14 pr-6 py-4 bg-zinc-50 border-2 border-transparent focus:border-red-600/20 focus:bg-white rounded-2xl transition font-bold text-sm outline-none disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. ADDRESS BOOK */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">My <span className="text-red-600">Addresses</span></h2>
              <button 
                onClick={() => setShowAddressModal(true)}
                className="flex items-center gap-2 bg-zinc-950 text-white px-6 py-3 rounded-2xl font-black text-[9px] tracking-widest hover:bg-red-600 transition-all uppercase"
              >
                <Plus className="w-4 h-4" /> Add New
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {addresses.map((addr: any) => (
                <div key={addr.id} className={`p-6 rounded-[32px] border-2 transition-all relative ${addr.is_default ? 'border-red-600 bg-white shadow-xl shadow-red-900/5' : 'border-zinc-100 bg-zinc-50/50 hover:bg-white'}`}>
                  {addr.is_default && (
                    <div className="absolute -top-3 left-8 bg-red-600 text-white text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                      Default Shipping
                    </div>
                  )}
                  
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${addr.is_default ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-300 border border-zinc-100'}`}>
                      <Home className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black uppercase tracking-tight text-zinc-900 truncate mb-1">{addr.full_name}</p>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest space-y-0.5 leading-relaxed">
                        <p className="truncate">{addr.street_address}</p>
                        <p>{addr.city}, {addr.state}</p>
                      </div>
                      
                      <div className="flex gap-6 mt-6">
                        {!addr.is_default && (
                          <button onClick={() => handleSetDefault(addr.id)} className="text-[9px] font-black uppercase tracking-widest text-red-600 hover:scale-105 transition-transform">Set as Default</button>
                        )}
                        <button onClick={() => handleDeleteAddress(addr.id)} className="text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-colors">Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. SIDEBAR SETTINGS */}
        <div className="space-y-6">
          <div className="bg-zinc-950 text-white rounded-[40px] p-10 shadow-2xl">
            <Settings className="w-8 h-8 text-red-600 mb-8" />
            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-6">Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Protection</span>
                <span className="text-[9px] font-black uppercase text-emerald-500 flex items-center gap-1"><Check className="w-3 h-3" /> Secure</span>
              </div>
              <button className="w-full py-4 bg-white text-zinc-900 rounded-2xl font-black text-[9px] tracking-[0.2em] uppercase hover:bg-red-600 hover:text-white transition-all">
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. ADDRESS MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-zinc-950/90 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[48px] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="bg-zinc-950 p-8 flex justify-between items-center text-white">
              <h3 className="text-xl font-black italic uppercase tracking-tighter">New <span className="text-red-600">Address</span></h3>
              <button onClick={() => setShowAddressModal(false)} className="hover:rotate-90 transition-transform"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="p-10 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="RECEIVER NAME" className="col-span-2 p-5 bg-zinc-50 rounded-2xl font-bold text-[10px] tracking-widest outline-none border-2 border-transparent focus:border-red-600/20 uppercase" onChange={e => setAddressForm({...addressForm, full_name: e.target.value})} />
                <input placeholder="STREET ADDRESS" className="col-span-2 p-5 bg-zinc-50 rounded-2xl font-bold text-[10px] tracking-widest outline-none border-2 border-transparent focus:border-red-600/20 uppercase" onChange={e => setAddressForm({...addressForm, street_address: e.target.value})} />
                <input placeholder="CITY" className="p-5 bg-zinc-50 rounded-2xl font-bold text-[10px] tracking-widest outline-none border-2 border-transparent focus:border-red-600/20 uppercase" onChange={e => setAddressForm({...addressForm, city: e.target.value})} />
                <input placeholder="STATE" className="p-5 bg-zinc-50 rounded-2xl font-bold text-[10px] tracking-widest outline-none border-2 border-transparent focus:border-red-600/20 uppercase" onChange={e => setAddressForm({...addressForm, state: e.target.value})} />
                <input placeholder="PHONE NUMBER" className="col-span-2 p-5 bg-zinc-50 rounded-2xl font-bold text-[10px] tracking-widest outline-none border-2 border-transparent focus:border-red-600/20 uppercase" onChange={e => setAddressForm({...addressForm, phone_number: e.target.value})} />
              </div>

              <button 
                onClick={handleAddAddress}
                className="w-full mt-6 py-5 bg-red-600 text-white rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase shadow-xl shadow-red-900/20 hover:bg-zinc-950 transition-all"
              >
                Save Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}