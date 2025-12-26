"use client";

import Container from "../components/layout/Container";
import { useCartStore } from "../store/cart.store";

export default function CartPage() {
  const { items, removeItem } = useCartStore();

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <main className="py-10">
      <Container>
        <h1 className="text-xl font-semibold mb-6">My Bag</h1>

        {items.length === 0 && (
          <div className="py-20 text-center text-textSecondary">
            Your bag is empty
          </div>
        )}

        <div className="space-y-4">
          {items.map((i) => (
            <div
              key={i._id}
              className="flex justify-between items-center border border-border rounded p-4"
            >
              <div>
                <p className="font-medium">{i.title}</p>
                <p className="text-sm text-textSecondary">Qty: {i.quantity}</p>
              </div>

              <div className="flex items-center gap-6">
                <span className="font-semibold">₹{i.price * i.quantity}</span>
                <button
                  onClick={() => removeItem(i._id)}
                  className="text-sm text-primary"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="mt-8 flex justify-between items-center">
            <span className="text-lg font-semibold">Total: ₹{total}</span>
            <a
              href="/checkout"
              className="h-12 px-8 bg-primary text-white font-semibold rounded flex items-center justify-center"
            >
              PLACE ORDER
            </a>
          </div>
        )}
      </Container>
    </main>
  );
}
