"use client";

import { useState } from "react";
import { register } from "../services/auth.service";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await register(form);
      console.log("REGISTER RESPONSE:", res);
      toast.success("Account created successfully!");
      router.push("/login");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("REGISTER ERROR:", err);
      toast.error(
        err?.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Input Styles
  const inputWrapperClass = "relative";
  const inputClass = 
    "w-full h-11 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all outline-none placeholder:text-gray-400 text-sm";
  const iconClass = "absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400";

  return (
    <main className="min-h-screen bg-gray-50/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-extrabold tracking-tighter text-gray-900 mb-2 block">
            SHOP.
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">
            Join us to get exclusive offers and track orders
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={submit} className="space-y-5">
          
          <div className="space-y-4">
            {/* Name Input */}
            <div className={inputWrapperClass}>
              <User className={iconClass} />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className={inputClass}
                required
              />
            </div>

            {/* Email Input */}
            <div className={inputWrapperClass}>
              <Mail className={iconClass} />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={inputClass}
                required
              />
            </div>

            {/* Password Input */}
            <div className={inputWrapperClass}>
              <Lock className={iconClass} />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create Password"
                className={inputClass}
                required
                minLength={6}
              />
            </div>
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
                CREATE ACCOUNT
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link 
            href="/login" 
            className="font-bold text-black hover:underline underline-offset-4"
          >
            Login Here
          </Link>
        </div>

      </div>
    </main>
  );
}