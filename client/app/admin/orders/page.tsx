"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ChevronLeft, PackageCheck, Truck } from "lucide-react";
import { getAdminOrders, Order, updateOrderStatus } from "../../services/order.services";
import { useAuthStore } from "../../store/auth.store";

const ORDER_STATUSES = ["placed", "delivered"];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

const formatCurrency = (value?: number) =>
  `Rs ${Number(value ?? 0).toLocaleString("en-IN")}`;

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not set";

export default function AdminOrdersPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
    }
  }, [router, user]);

  useEffect(() => {
    if (user?.role !== "admin") {
      return;
    }

    const loadOrders = async () => {
      try {
        setLoading(true);
        setOrders(await getAdminOrders());
      } catch (error) {
        console.error("ADMIN_ORDERS_ERROR:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    void loadOrders();
  }, [user]);

  const updateOrder = async (order: Order, payload: Parameters<typeof updateOrderStatus>[1]) => {
    try {
      setSavingId(order._id);
      const updated = await updateOrderStatus(order._id, payload);
      setOrders((current) =>
        current.map((item) => (item._id === order._id ? updated : item))
      );
      toast.success("Order updated");
    } catch (error) {
      console.error("UPDATE_ORDER_ERROR:", error);
      toast.error("Could not update order");
    } finally {
      setSavingId("");
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50/70 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/admin"
            className="rounded-full p-2 text-gray-500 hover:bg-white hover:text-black hover:shadow-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-sm font-semibold text-gray-500">Fulfillment</p>
            <h1 className="text-3xl font-bold text-gray-950">Manage Orders</h1>
          </div>
        </div>

        {loading ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            No orders yet.
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <section key={order._id} className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatDate(order.createdAt)} by {order.address?.name || "Customer"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-lg font-bold text-gray-950">
                      {formatCurrency(order.total)}
                    </span>
                    {savingId === order._id && (
                      <span className="text-xs font-semibold text-gray-400">Saving...</span>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 p-5 lg:grid-cols-[1.2fr_1fr]">
                  <div>
                    <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
                      Items
                    </h2>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={`${order._id}-${index}`} className="flex justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm">
                          <div>
                            <p className="font-semibold text-gray-900">{item.title || "Product"}</p>
                            <p className="text-gray-500">Qty {item.quantity}</p>
                          </div>
                          <span className="font-bold text-gray-900">
                            {formatCurrency(item.lineTotal ?? (item.price ?? 0) * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
                          Order Status
                        </span>
                        <select
                          value={order.status === "delivered" ? "delivered" : "placed"}
                          onChange={(event) =>
                            updateOrder(order, {
                              status: event.target.value,
                              note: `Status changed to ${event.target.value}`,
                            })
                          }
                          className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold outline-none focus:border-black"
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block">
                        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
                          Payment
                        </span>
                        <select
                          value={order.paymentStatus || "pending"}
                          onChange={(event) =>
                            updateOrder(order, { paymentStatus: event.target.value })
                          }
                          className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold outline-none focus:border-black"
                        >
                          {PAYMENT_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
                        <Truck className="h-4 w-4" />
                        Tracking
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <input
                          placeholder="Courier"
                          defaultValue={order.tracking?.courier || ""}
                          onBlur={(event) =>
                            updateOrder(order, { courier: event.target.value })
                          }
                          className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-black"
                        />
                        <input
                          placeholder="Tracking number"
                          defaultValue={order.tracking?.trackingNumber || ""}
                          onBlur={(event) =>
                            updateOrder(order, { trackingNumber: event.target.value })
                          }
                          className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-black"
                        />
                        <input
                          type="date"
                          defaultValue={order.tracking?.estimatedDelivery?.slice(0, 10) || ""}
                          onBlur={(event) =>
                            updateOrder(order, { estimatedDelivery: event.target.value })
                          }
                          className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
                        <PackageCheck className="h-4 w-4" />
                        Timeline
                      </div>
                      <div className="space-y-2">
                        {(order.statusHistory?.length
                          ? order.statusHistory
                          : [{ status: order.status === "delivered" ? "delivered" : "placed", updatedAt: order.createdAt }]
                        ).map((event, index) => (
                          <div key={`${event.status}-${index}`} className="flex justify-between text-sm">
                            <span className="font-semibold capitalize text-gray-700">{event.status}</span>
                            <span className="text-gray-500">{formatDate(event.updatedAt)}</span>
                          </div>
                        ))}
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
