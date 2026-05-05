"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";
import toast from "react-hot-toast";
import Image from "next/image";
import { isAxiosError, AxiosError } from "axios";
import { Upload, X, ChevronLeft, Loader2 } from "lucide-react";

interface BackendErrorResponse {
  message: string;
}

const CATEGORY_OPTIONS = [
  "men",
  "women",
  "kids",
  "home",
  "beauty",
  "genz",
  "studio",
];
const GENDER_OPTIONS = ["Men", "Women", "Unisex"];

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    brand: "",
    sku: "",
    price: "",
    mrp: "",
    discount: "",
    stock: "0",
    lowStockThreshold: "5",
    description: "",
    category: [] as string[],
    gender: "",
    isActive: true,
  });

  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      preview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [preview]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleActiveChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, isActive: e.target.checked }));
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((prev) => {
      if (prev.category.includes(value)) {
        return { ...prev, category: prev.category.filter((c) => c !== value) };
      } else {
        return { ...prev, category: [...prev.category, value] };
      }
    });
  };

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    preview.forEach((url) => URL.revokeObjectURL(url));

    const arr = Array.from(files);
    setImages(arr);
    setPreview(arr.map((f) => URL.createObjectURL(f)));
  };


  const removeImage = (index: number) => {
    
    setImages([]);
    setPreview([]);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.brand || !form.price) {
      toast.error("Please fill in required fields (Title, Brand, Price)");
      return;
    }

    if (form.category.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    if (images.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();

      data.append("title", form.title);
      data.append("brand", form.brand);
      if (form.sku) data.append("sku", form.sku);
      data.append("price", form.price);
      if (form.mrp) data.append("mrp", form.mrp);
      if (form.discount) data.append("discount", form.discount);
      data.append("stock", form.stock);
      data.append("lowStockThreshold", form.lowStockThreshold);
      data.append("isActive", String(form.isActive));
      if (form.description) data.append("description", form.description);
      if (form.gender) data.append("gender", form.gender);

      data.append("category", JSON.stringify(form.category));

      images.forEach((img) => data.append("images", img));

      await api.post("/api/products", data);

      toast.success("Product created successfully!");
      router.push("/admin/products");
      router.refresh();
    } catch (error: unknown) {
      console.error("Create Product Error:", error);

      let errorMessage = "Failed to create product";

      if (isAxiosError(error)) {
        const axiosError = error as AxiosError<BackendErrorResponse>;
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";
  const inputClass =
    "w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all outline-none placeholder:text-gray-400 text-sm";

  return (
    <main className="min-h-screen bg-gray-50/50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Navigation */}
        <div className="mb-8 flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="p-2 rounded-full hover:bg-white hover:shadow-sm transition-all text-gray-500 hover:text-black"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add Products</h1>
            <p className="text-sm text-gray-500">Create a new item for your inventory.</p>
          </div>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Product Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* General Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">General Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Product Title <span className="text-red-500">*</span></label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Oversized Cotton T-Shirt"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Brand <span className="text-red-500">*</span></label>
                    <input
                      name="brand"
                      value={form.brand}
                      onChange={handleChange}
                      placeholder="e.g. Nike"
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>SKU</label>
                    <input
                      name="sku"
                      value={form.sku}
                      onChange={handleChange}
                      placeholder="e.g. TSHIRT-BLK-M"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Gender</label>
                  <div className="relative">
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      <option value="">Select Gender</option>
                      {GENDER_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the product features, material, and care instructions..."
                    className={`${inputClass} min-h-[140px] py-3 resize-none`}
                  />
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">Pricing & Inventory</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Selling Price <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                    <input
                      type="text"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className={`${inputClass} pl-8`}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>MRP (List Price)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                    <input
                      type="text"
                      name="mrp"
                      value={form.mrp}
                      onChange={handleChange}
                      placeholder="0.00"
                      className={`${inputClass} pl-8`}
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Discount (%)</label>
                  <input
                    type="number"
                    name="discount"
                    value={form.discount}
                    onChange={handleChange}
                    placeholder="0"
                    className={inputClass}
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className={labelClass}>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="0"
                    className={inputClass}
                    min="0"
                  />
                </div>

                <div>
                  <label className={labelClass}>Low Stock Alert</label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    value={form.lowStockThreshold}
                    onChange={handleChange}
                    placeholder="5"
                    className={inputClass}
                    min="0"
                  />
                </div>

                <label className="flex h-11 items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={handleActiveChange}
                    className="h-4 w-4 accent-black"
                  />
                  Active product
                </label>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            
            {/* Media Upload Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images <span className="text-red-500">*</span></h2>
              
              <div className="space-y-4">
                {/* Upload Zone */}
                <div className="relative group">
                  <input
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={onImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center group-hover:bg-gray-50 group-hover:border-gray-300 transition-all">
                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="h-5 w-5 text-gray-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Click to upload image</p>
                    <p className="text-xs text-gray-400 mt-1">or drag and drop (Max 5)</p>
                  </div>
                </div>

                {/* Previews */}
                {preview.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mt-4 animate-in fade-in duration-300">
                    {preview.map((src, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                        <Image
                          src={src}
                          alt={`Preview ${index}`}
                          fill
                          className="object-cover"
                        />

                        {/* Overlay to remove */}

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <button 
                             type="button" 
                             onClick={() => removeImage(index)}
                             className="text-white bg-red-500 p-1 rounded-full"
                           >
                             <X className="h-4 w-4" />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Categories Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Category <span className="text-red-500">*</span></h2>
              
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((cat) => {
                  const isSelected = form.category.includes(cat);
                  return (
                    <label
                      key={cat}
                      className={`
                        cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize select-none
                        ${isSelected 
                          ? "bg-black text-white shadow-md ring-2 ring-offset-1 ring-black" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"}
                      `}
                    >
                      <input
                        type="checkbox"
                        value={cat}
                        checked={isSelected}
                        onChange={handleCategoryChange}
                        className="hidden" 
                      />
                      {cat}
                    </label>
                  );
                })}
              </div>
              {form.category.length === 0 && (
                <p className="text-xs text-amber-600 mt-3 font-medium flex items-center gap-1">
                  ! Select at least one
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-black text-white font-bold rounded-xl hover:bg-gray-900 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Creating..." : "PUBLISH PRODUCT"}
              </button>
              
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="w-full h-12 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>

          </div>
        </form>
      </div>
    </main>
  );
}
