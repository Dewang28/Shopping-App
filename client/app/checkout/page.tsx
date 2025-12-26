"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "../components/layout/Container";
import { useCartStore } from "../store/cart.store";
import { useAuthStore } from "../store/auth.store";
import { createOrder } from "../services/order.services";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCartStore();
  const user = useAuthStore((s) => s.user);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const total = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const placeOrder = async () => {
    if (items.length === 0) {
      toast.error("Your bag is empty");
      return;
    }

    const payload = {
      items: items.map((i) => ({
        productId: i._id,
        quantity: i.quantity,
      })),
      address,
    };

    await createOrder(payload);
    clear();
    toast.success("Order placed successfully");
    router.push("/");
  };

  return (
    <main className="py-10">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h1 className="text-xl font-semibold">Delivery Address</h1>

            {Object.entries(address).map(([k, v]) => (
              <input
                key={k}
                value={v}
                onChange={(e) =>
                  setAddress({ ...address, [k]: e.target.value })
                }
                placeholder={k.toUpperCase()}
                className="w-full h-11 border border-border rounded px-3"
              />
            ))}
          </div>

          <div className="border border-border rounded p-6 space-y-4">
            <h2 className="font-semibold">Order Summary</h2>

            {items.map((i) => (
              <div key={i._id} className="flex justify-between text-sm">
                <span>
                  {i.title} × {i.quantity}
                </span>
                <span>₹{i.price * i.quantity}</span>
              </div>
            ))}

            <div className="flex justify-between font-semibold pt-4 border-t border-border">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              onClick={placeOrder}
              className="w-full h-12 bg-primary text-white font-semibold rounded"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </Container>
    </main>
  );
}
