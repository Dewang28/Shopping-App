"use client";

import { useEffect } from "react";
import { getMe } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { useCartStore } from "../store/cart.store";

export default function AuthCartBootstrap() {
  const setUser = useAuthStore((state) => state.setUser);
  const hydrateCart = useCartStore((state) => state.hydrateCart);
  const syncWithBackend = useCartStore((state) => state.syncWithBackend);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const user = await getMe();
        if (!mounted) {
          return;
        }

        setUser(user);
        await syncWithBackend();
      } catch (error) {
        if (!mounted) {
          return;
        }

        setUser(null);
        await hydrateCart();
      }
    };

    void bootstrap();

    return () => {
      mounted = false;
    };
  }, [hydrateCart, setUser, syncWithBackend]);

  return null;
}
