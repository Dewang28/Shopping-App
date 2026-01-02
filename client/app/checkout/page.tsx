"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "../store/cart.store";
import { useAuthStore } from "../store/auth.store";
import { createOrder } from "../services/order.services";
import toast from "react-hot-toast";
import { 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  Loader2, 
  Truck, 
  ChevronLeft,
  ShieldCheck 
} from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCartStore();
  const user = useAuthStore((s) => s.user);
  
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 99;
  const total = subtotal + shipping;

  useEffect(() => {
    const timer = setTimeout(() => {
        if (!user) {
          router.push("/login");
        }
    }, 100);
    return () => clearTimeout(timer);
  }, [user, router]);

  if (!user) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = async () => {
    if (items.length === 0) {
      toast.error("Your bag is empty");
      return;
    }

    // Basic Validation
    const isValid = Object.values(address).every((val) => val.trim() !== "");
    if (!isValid) {
      toast.error("Please fill in all address fields");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        items: items.map((i) => ({
          productId: i._id,
          quantity: i.quantity,
        })),
        address,
      };

      await createOrder(payload);
      clear();
      toast.success("Order placed successfully!");
      router.push("/"); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 
    "w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all outline-none placeholder:text-gray-400 text-sm";
  
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <main className="min-h-screen bg-gray-50/50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart" className="p-2 rounded-full hover:bg-white hover:shadow-sm transition-all text-gray-500 hover:text-black">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Shipping Form */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Contact & Address Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <MapPin className="h-5 w-5 text-gray-900" />
                <h2 className="text-lg font-bold text-gray-900">Shipping Details</h2>
              </div>

              <div className="space-y-5">
                {/* Row 1: Name & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        name="name"
                        value={address.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        name="phone"
                        value={address.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className={`${inputClass} pl-10`}
                        type="tel"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Address Line 1 */}
                <div>
                  <label className={labelClass}>Address</label>
                  <input
                    name="line1"
                    value={address.line1}
                    onChange={handleInputChange}
                    placeholder="Street, House No, Apartment"
                    className={inputClass}
                  />
                </div>

                {/* Row 3: City, State, Pincode */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  <div>
                    <label className={labelClass}>City</label>
                    <input
                      name="city"
                      value={address.city}
                      onChange={handleInputChange}
                      placeholder="Mumbai"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <input
                      name="state"
                      value={address.state}
                      onChange={handleInputChange}
                      placeholder="Maharashtra"
                      className={inputClass}
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className={labelClass}>Pincode</label>
                    <input
                      name="pincode"
                      value={address.pincode}
                      onChange={handleInputChange}
                      placeholder="400001"
                      className={inputClass}
                      maxLength={6}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <CreditCard className="h-5 w-5 text-gray-900" />
                <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
              </div>
              
              <div className="border border-black bg-gray-50 rounded-xl p-4 flex items-center gap-4 cursor-pointer relative overflow-hidden">
                 <div className="h-5 w-5 rounded-full border-[5px] border-black bg-white"></div>
                 <div>
                    <p className="font-bold text-gray-900">Cash on Delivery (COD)</p>
                    <p className="text-sm text-gray-500">Pay securely when your order arrives.</p>
                 </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Items List */}
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 mb-6 scrollbar-thin scrollbar-thumb-gray-200">
                {items.map((i) => (
                  <div key={i._id} className="flex gap-3">
                    <div className="relative h-16 w-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                       <Image
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          src={(i as any).image || (i as any).images?.[0] || "/placeholder.png"}
                          alt={i.title}
                          fill
                          className="object-contain p-1 mix-blend-multiply"
                       />
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium text-gray-900 line-clamp-1">{i.title}</p>
                      <p className="text-gray-500 mt-1">Qty: {i.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                       ₹{(i.price * i.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-6 border-t border-gray-100 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                   <span>Shipping</span>
                   {shipping === 0 ? (
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        <Truck className="h-3 w-3" /> Free
                      </span>
                   ) : (
                      <span>₹{shipping}</span>
                   )}
                </div>
                <div className="flex justify-between text-gray-900 font-bold text-lg pt-2">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={placeOrder}
                disabled={loading}
                className="w-full mt-6 h-12 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "CONFIRM ORDER"
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="h-4 w-4" />
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}