"use client";

import { useState } from "react";
import { login } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { useRouter } from "next/navigation";
import Container from "../components/layout/Container";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    const user = await login(form);
    setUser(user);
    toast.success("Logged in");
    router.push("/");
  };

  return (
    <main className="py-16">
      <Container>
        <div className="max-w-md mx-auto space-y-4">
          <h1 className="text-xl font-semibold">Login</h1>

          {Object.entries(form).map(([k, v]) => (
            <input
              key={k}
              value={v}
              onChange={(e) =>
                setForm({ ...form, [k]: e.target.value })
              }
              placeholder={k.toUpperCase()}
              className="w-full h-11 border border-border rounded px-3"
            />
          ))}

          <button
            onClick={submit}
            className="w-full h-12 bg-primary text-white font-semibold rounded"
          >
            LOGIN
          </button>
        </div>
      </Container>
    </main>
  );
}
