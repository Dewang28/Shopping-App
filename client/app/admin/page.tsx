"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "../components/layout/Container";
import { useAuthStore } from "../store/auth.store";

export default function AdminPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  return (
    <main className="py-10">
      <Container>
        <h1 className="text-xl font-semibold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/admin/products/create"
            className="border border-border rounded p-6 hover:border-primary"
          >
            Create Product
          </a>

          <a
            href="/admin/products"
            className="border border-border rounded p-6 hover:border-primary"
          >
            Manage Products
          </a>

          <a
            href="/admin/orders"
            className="border border-border rounded p-6 hover:border-primary"
          >
            Manage Orders
          </a>
        </div>
      </Container>
    </main>
  );
}
