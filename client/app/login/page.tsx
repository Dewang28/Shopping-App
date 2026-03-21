"use client";

import { useState } from "react";
import { login } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { useCartStore } from "../store/cart.store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const syncWithBackend = useCartStore((s) => s.syncWithBackend);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const user = await login(form);
      setUser(user);
      await syncWithBackend();
      toast.success("Welcome back!");
      router.push("/");
      router.refresh(); // This ensures Server Components see the new cookie
    } catch (error) {
      console.error(error);
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const inputWrapperClass = "relative";
  const inputClass = 
    "w-full h-11 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all outline-none placeholder:text-gray-400 text-sm";
  const iconClass = "absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400";

  return (
    <main className="min-h-screen bg-gray-50/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-sm border border-gray-100">
        
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-extrabold tracking-tighter text-gray-900 mb-2 block">
            SHOP.
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">
            Please sign in to your account
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          
          <div className="space-y-4">
            <div className={inputWrapperClass}>
              <Mail className={iconClass} />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={inputClass}
                required
              />
            </div>

            <div className={inputWrapperClass}>
              <Lock className={iconClass} />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
             <button type="button" className="text-xs font-medium text-gray-500 hover:text-black transition-colors">
               Forgot Password?
             </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                SIGN IN
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link 
            href="/register" 
            className="font-bold text-black hover:underline underline-offset-4"
          >
            Create Account
          </Link>
        </div>

      </div>
    </main>
  );
}
