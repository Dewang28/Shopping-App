"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Package, ChevronLeft, Truck, ShieldCheck } from "lucide-react";
import { useAuthStore } from "../store/auth.store";
import { getMyOrders, Order } from "../services/order.services";

const formatCurrency = (value?: number) =>
  `₹${Number(value ?? 0).toLocaleString("en-IN")}`;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getOrderSubtotal = (order: Order) =>
  order.subtotal ??
  order.items.reduce(
    (sum, item) => sum + (item.lineTotal ?? (item.price ?? 0) * item.quantity),
    0
  );

const getOrderShipping = (order: Order) => {
  if (typeof order.shipping === "number") {
    return order.shipping;
  }

  const subtotal = getOrderSubtotal(order);
  return subtotal > 1000 ? 0 : 99;
};

const getOrderTotal = (order: Order) =>
  order.total ?? getOrderSubtotal(order) + getOrderShipping(order);

export default function OrdersPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        router.push("/login");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [router, user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error("LOAD_ORDERS_ERROR:", err);
        setError("Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    void loadOrders();
  }, [user]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50/50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full border-4 border-gray-200 border-t-black animate-spin" />
          <p className="mt-4 text-sm text-gray-500">Loading your orders...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50/50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="p-2 rounded-full hover:bg-white hover:shadow-sm transition-all text-gray-500 hover:text-black"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              My Orders
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track all orders placed from your account.
            </p>
          </div>
        </div>

        {error ? (
          <div className="bg-white border border-red-100 text-red-600 rounded-2xl p-6">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-gray-900">No orders yet</h2>
            <p className="mt-2 text-sm text-gray-500">
              Once you place an order, it will show up here.
            </p>
            <Link
              href="/shop"
              className="inline-flex mt-6 h-11 px-6 bg-black text-white font-semibold rounded-full items-center justify-center hover:bg-gray-900 transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <section
                key={order._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-5 border-b border-gray-100 bg-gray-50/70">
                  <div>
                    <p className="text-xs font-bold tracking-[0.18em] text-gray-500 uppercase">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wide">
                      {order.status === "delivered" || order.status === "returned" ? order.status : "placed"}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(getOrderTotal(order))}
                    </span>
                  </div>
                </div>

                <div className="grid lg:grid-cols-[1.5fr_0.9fr] gap-6 p-6">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-gray-500 mb-4">
                      Items
                    </h2>
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={`${order._id}-${item.product}-${index}`} className="flex gap-4">
                          <Link
                            href={`/shop/product/${item.product}`}
                            className="relative h-20 w-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shrink-0 transition hover:border-gray-300"
                          >
                            <Image
                              src={item.image || "/placeholder.png"}
                              alt={item.title || "Ordered product"}
                              fill
                              className="object-contain p-2 mix-blend-multiply"
                            />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/shop/product/${item.product}`}
                              className="font-semibold text-gray-900 line-clamp-2 transition hover:text-black hover:underline"
                            >
                              {item.title || "Product"}
                            </Link>
                            <p className="text-sm text-gray-500 mt-1">
                              Qty: {item.quantity} x {formatCurrency(item.price)}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-gray-900 whitespace-nowrap">
                            {formatCurrency(item.lineTotal ?? (item.price ?? 0) * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-gray-500 mb-3">
                        Delivery
                      </h2>
                      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
                        {order.address ? (
                          <>
                            <p className="font-semibold text-gray-900">{order.address.name}</p>
                            <p className="mt-1">{order.address.phone}</p>
                            <p className="mt-2">{order.address.line1}</p>
                            <p>
                              {order.address.city}, {order.address.state} {order.address.pincode}
                            </p>
                          </>
                        ) : (
                          <p className="text-gray-500">Address not available for this older order.</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-gray-500 mb-3">
                        Summary
                      </h2>
                      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3 text-sm">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span>{formatCurrency(getOrderSubtotal(order))}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Shipping</span>
                          <span>{getOrderShipping(order) === 0 ? "Free" : formatCurrency(getOrderShipping(order))}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Payment</span>
                          <span className="uppercase">{order.paymentMethod || "cod"}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900">
                          <span>Total</span>
                          <span>{formatCurrency(getOrderTotal(order))}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        <span>Delivery updates will appear here as the order moves.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Payment mode recorded securely with your order.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
