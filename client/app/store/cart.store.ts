import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../types/product";
import { useAuthStore } from "./auth.store";
import {
  clearCart as clearRemoteCart,
  getCart,
  syncCart,
} from "../services/cart.services";

export interface CartItem extends Product {
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  initialized: boolean;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  hydrateCart: () => Promise<void>;
  syncWithBackend: () => Promise<void>;
  setInitialized: (value: boolean) => void;
}

const toPayload = (items: CartItem[]) =>
  items.map((item) => ({ productId: item._id, quantity: item.quantity }));

const fromServer = (
  cart: Awaited<ReturnType<typeof getCart>>
): CartItem[] =>
  (cart?.items || [])
    .filter((item) => item.product)
    .map((item) => ({
      ...item.product,
      quantity: item.quantity,
    }));

const syncIfLoggedIn = async (items: CartItem[]) => {
  if (!useAuthStore.getState().user) {
    return;
  }

  try {
    const cart = await syncCart(toPayload(items));
    useCartStore.setState({ items: fromServer(cart) });
  } catch (error) {
    console.error("CART_SYNC_ERROR:", error);
  }
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      initialized: false,
      setInitialized: (value) => set({ initialized: value }),
      addItem: (product) => {
        let nextItems: CartItem[] = [];

        set((state) => {
          const existing = state.items.find((i) => i._id === product._id);
          nextItems = existing
            ? state.items.map((i) =>
                i._id === product._id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              )
            : [...state.items, { ...product, quantity: 1 }];

          return { items: nextItems };
        });

        void syncIfLoggedIn(nextItems);
      },
      removeItem: (id) => {
        const nextItems = get().items.filter((i) => i._id !== id);
        set({ items: nextItems });
        void syncIfLoggedIn(nextItems);
      },
      setQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }

        const nextItems = get().items.map((item) =>
          item._id === id ? { ...item, quantity } : item
        );
        set({ items: nextItems });
        void syncIfLoggedIn(nextItems);
      },
      clear: () => {
        set({ items: [] });
        if (useAuthStore.getState().user) {
          void clearRemoteCart().catch((error) => {
            console.error("CART_CLEAR_ERROR:", error);
          });
        }
      },
      hydrateCart: async () => {
        if (!useAuthStore.getState().user) {
          set({ initialized: true });
          return;
        }

        try {
          const cart = await getCart();
          set({ items: fromServer(cart), initialized: true });
        } catch (error) {
          console.error("CART_HYDRATE_ERROR:", error);
          set({ initialized: true });
        }
      },
      syncWithBackend: async () => {
        const localItems = get().items;

        try {
          const cart = await getCart();
          const serverItems = fromServer(cart);
          const merged = [...serverItems];

          for (const localItem of localItems) {
            const existing = merged.find((item) => item._id === localItem._id);
            if (existing) {
              existing.quantity += localItem.quantity;
            } else {
              merged.push(localItem);
            }
          }

          const syncedCart = await syncCart(toPayload(merged));
          set({ items: fromServer(syncedCart), initialized: true });
        } catch (error) {
          console.error("CART_MERGE_ERROR:", error);
          set({ initialized: true });
        }
      },
    }),
    {
      name: "cart-store",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
