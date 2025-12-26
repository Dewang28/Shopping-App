"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "../../../components/layout/Container";
import api from "../../../services/api";
import toast from "react-hot-toast";

export default function CreateProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    brand: "",
    price: "",
    mrp: "",
    discount: "",
    description: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);

  const onImageChange = (files: FileList | null) => {
    if (!files) return;

    const arr = Array.from(files);
    setImages(arr);
    setPreview(arr.map((f) => URL.createObjectURL(f)));
  };

  const submit = async () => {
    if (!images.length) {
      toast.error("Please add at least one image");
      return;
    }

    const data = new FormData();

    Object.entries(form).forEach(([k, v]) => {
      if (v) data.append(k, v);
    });

    images.forEach((img) => data.append("images", img));

    await api.post("/api/products", data);


    toast.success("Product created");
    router.push("/shop");
  };

  return (
    <main className="py-10">
      <Container>
        <div className="max-w-xl space-y-4">
          <h1 className="text-xl font-semibold">Create Product</h1>

          {Object.entries(form).map(([k, v]) => (
            <input
              key={k}
              value={v}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              placeholder={k.toUpperCase()}
              className="w-full h-11 border border-border rounded px-3"
            />
          ))}

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => onImageChange(e.target.files)}
          />

          {preview.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {preview.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt="preview"
                  className="h-32 w-full object-cover rounded"
                />
              ))}
            </div>
          )}

          <button
            onClick={submit}
            className="h-12 px-8 bg-primary text-white font-semibold rounded"
          >
            CREATE PRODUCT
          </button>
        </div>
      </Container>
    </main>
  );
}
