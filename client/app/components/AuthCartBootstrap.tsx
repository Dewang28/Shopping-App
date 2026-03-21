"use client";

import { useEffect } from "react";
import { getMe } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { useCartStore } from "../store/cart.store";

export default function AuthCartBootstrap() {
  const setUser = useAuthStore((state) => state.setUser);
  const syncWithBackend = useCartStore((state) => state.syncWithBackend);
  const resetForGuest = useCartStore((state) => state.resetForGuest);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const user = await getMe();
        if (!mounted) {
          return;
        }

        setUser(user);
        await syncWithBackend(user._id);
      } catch (error) {
        if (!mounted) {
          return;
        }

        setUser(null);
        resetForGuest();
      }
    };

    void bootstrap();

    return () => {
      mounted = false;
    };
  }, [resetForGuest, setUser, syncWithBackend]);

  return null;
}
