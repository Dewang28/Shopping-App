"use client";

import { useState } from "react";
import { register } from "../services/auth.service";
import { useRouter } from "next/navigation";
import Container from "../components/layout/Container";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    try {
      const res = await register(form);
      console.log("REGISTER RESPONSE:", res);
      toast.success("Account created");
      router.push("/login");
    } catch (err: any) {
      console.error("REGISTER ERROR:", err);
      toast.error(
        err?.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <main className="py-16">
      <Container>
        <div className="max-w-md mx-auto space-y-4">
          <h1 className="text-xl font-semibold">Register</h1>

          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            placeholder="NAME"
            className="w-full h-11 border border-border rounded px-3"
          />

          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            placeholder="EMAIL"
            className="w-full h-11 border border-border rounded px-3"
          />

          <input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            placeholder="PASSWORD"
            className="w-full h-11 border border-border rounded px-3"
          />

          <button
            onClick={submit}
            className="w-full h-12 bg-primary text-white font-semibold rounded"
          >
            CREATE ACCOUNT
          </button>
        </div>
      </Container>
    </main>
  );
}
