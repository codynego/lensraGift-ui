"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Updated to match your Django Serializer with stats
type User = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  design_count?: number;      // Added for Dashboard stats
  wishlist_count?: number;    // Added for Dashboard stats
  active_orders_count?: number; // Added for Dashboard stats
  reward_points?: number;     // Added for Dashboard stats
  date_joined?: string;
};

type RegisterData = {
  email: string;
  password:  string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone_number: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;       // 1. ADDED TOKEN HERE
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
};

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // 2. TRACK TOKEN IN STATE
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const storedToken = localStorage.getItem("accessToken");
    if (!storedToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${BaseUrl}api/users/profile`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setUser(res.data);
      setToken(storedToken); // 3. SET TOKEN STATE
    } catch {
      localStorage.removeItem("accessToken");
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await axios.post(`${BaseUrl}api/users/login/`, { email, password });
    const { user: userData, access } = res.data;
    localStorage.setItem("accessToken", access);
    setToken(access);
    setUser(userData);
  };

  const register = async (data: RegisterData) => {
    const res = await axios.post(`${BaseUrl}api/users/register/`, data);
    if (res.data.access) {
      localStorage.setItem("accessToken", res.data.access);
      setToken(res.data.access);
      setUser(res.data.user);
    } 
  };

  const logout = async () => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      try {
        await axios.post(`${BaseUrl}api/users/logout`, {}, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
      } catch (e) { console.error("Logout failed", e); }
    }
    localStorage.removeItem("accessToken");
    setToken(null);
    setUser(null);
  };

  return (
    // 4. PROVIDE TOKEN IN VALUE
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};