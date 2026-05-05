"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  Boxes,
  CircleDollarSign,
  ClipboardList,
  Package,
  PackageCheck,
  Plus,
  ShoppingBag,
} from "lucide-react";
import Container from "../components/layout/Container";
import { AdminAnalytics, getAdminAnalytics } from "../services/order.services";
import { useAuthStore } from "../store/auth.store";

const formatCurrency = (value?: number) =>
  `Rs ${Number(value ?? 0).toLocaleString("en-IN")}`;

const formatNumber = (value?: number) =>
  Number(value ?? 0).toLocaleString("en-IN");

export default function AdminPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setAnalytics(await getAdminAnalytics());
    } catch (error) {
      console.error("ADMIN_ANALYTICS_ERROR:", error);
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
    }
  }, [router, user]);

  useEffect(() => {
    if (user?.role !== "admin") {
      return;
    }

    void loadAnalytics(true);

    const interval = window.setInterval(() => {
      void loadAnalytics();
    }, 30000);

    return () => window.clearInterval(interval);
  }, [loadAnalytics, user]);

  const maxMonthlyRevenue = useMemo(
    () => Math.max(...(analytics?.monthlySales ?? []).map((item) => item.revenue), 1),
    [analytics]
  );

  if (!user || user.role !== "admin") {
    return null;
  }

  const statCards = [
    {
      label: "Total Sales",
      value: formatCurrency(analytics?.revenue),
      caption: "Revenue from all orders",
      icon: CircleDollarSign,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Total Orders",
      value: formatNumber(analytics?.totalOrders),
      caption: `${formatNumber(analytics?.pendingOrders)} placed`,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Inventory Units",
      value: formatNumber(analytics?.totalStock),
      caption: `${formatNumber(analytics?.outOfStockProducts)} products out of stock`,
      icon: Boxes,
      color: "bg-violet-50 text-violet-700",
    },
    {
      label: "Delivered",
      value: formatNumber(analytics?.deliveredOrders),
      caption: "Completed orders",
      icon: PackageCheck,
      color: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <Container>
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
              Sales & Inventory Analytics
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Monitor revenue, order movement, product performance, and stock risk from one dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/add-products"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-bold text-white hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Add Products
            </Link>
            <Link
              href="/admin/products"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-bold text-slate-800 hover:border-slate-400"
            >
              <Package className="h-4 w-4" />
              Inventory
            </Link>
            <Link
              href="/admin/orders"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-bold text-slate-800 hover:border-slate-400"
            >
              <ClipboardList className="h-4 w-4" />
              Orders
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            Loading dashboard analytics...
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-lg ${card.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                    <p className="mt-1 text-3xl font-black text-slate-950">{card.value}</p>
                    <p className="mt-2 text-xs font-medium text-slate-400">{card.caption}</p>
                  </div>
                );
              })}
            </section>

            <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.9fr]">
              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-950">Monthly Sales</h2>
                    <p className="text-sm text-slate-500">Revenue and order count by month</p>
                  </div>
                  <BarChart3 className="h-5 w-5 text-slate-400" />
                </div>

                <div className="flex h-72 items-end gap-4 border-b border-l border-slate-200 px-2 pb-4">
                  {(analytics?.monthlySales?.length ? analytics.monthlySales : []).map((item) => (
                    <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
                      <div className="flex h-52 w-full items-end">
                        <div
                          className="w-full rounded-t-lg bg-slate-900 transition-all"
                          style={{
                            height: `${Math.max((item.revenue / maxMonthlyRevenue) * 100, 8)}%`,
                          }}
                          title={`${formatCurrency(item.revenue)} from ${item.orders} orders`}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-700">{item.label}</p>
                        <p className="text-[11px] text-slate-400">{item.orders} orders</p>
                      </div>
                    </div>
                  ))}

                  {!analytics?.monthlySales?.length && (
                    <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
                      Sales bars will appear after orders are placed.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-black text-slate-950">Order Status</h2>
                  <p className="text-sm text-slate-500">Current fulfillment distribution</p>
                </div>

                <div className="space-y-4">
                  {(analytics?.orderStatusBreakdown ?? []).map((item) => {
                    const percent =
                      analytics?.totalOrders && analytics.totalOrders > 0
                        ? (item.count / analytics.totalOrders) * 100
                        : 0;

                    return (
                      <div key={item.status}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="font-bold capitalize text-slate-700">{item.status}</span>
                          <span className="text-slate-500">{item.count}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-slate-900" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    );
                  })}

                  {!analytics?.orderStatusBreakdown?.length && (
                    <p className="text-sm text-slate-500">Order status data will appear after orders.</p>
                  )}
                </div>
              </div>
            </section>

            <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-950">Inventory Watchlist</h2>
                    <p className="text-sm text-slate-500">
                      {formatNumber(analytics?.productCount)} active products, {formatNumber(analytics?.inactiveProducts)} inactive
                    </p>
                  </div>
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>

                <div className="space-y-3">
                  {analytics?.lowStockProducts?.length ? (
                    analytics.lowStockProducts.map((product) => (
                      <div key={product._id} className="flex items-center justify-between rounded-lg bg-amber-50 px-4 py-3">
                        <div>
                          <p className="font-bold text-slate-950">{product.title}</p>
                          <p className="text-xs text-slate-500">{product.brand}</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-amber-700">
                          {formatNumber(product.stock)} left
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No low-stock products right now.</p>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-black text-slate-950">Top Selling Products</h2>
                  <p className="text-sm text-slate-500">Best performers by quantity sold</p>
                </div>

                <div className="space-y-3">
                  {analytics?.topProducts?.length ? (
                    analytics.topProducts.map((product, index) => (
                      <div key={product._id} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg bg-slate-50 px-4 py-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-black text-slate-700">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-950">{product.title}</p>
                          <p className="text-xs text-slate-500">{product.quantitySold} units sold</p>
                        </div>
                        <span className="text-sm font-black text-slate-950">
                          {formatCurrency(product.revenue)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">Top sellers will appear after orders.</p>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </Container>
    </main>
  );
}
