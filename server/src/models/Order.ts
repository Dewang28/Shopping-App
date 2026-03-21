import { Schema, model, Document } from "mongoose"

export interface IOrder extends Document {
  user: string
  items: {
    product: string
    title: string
    image?: string
    quantity: number
    price: number
    lineTotal: number
  }[]
  address: {
    name: string
    phone: string
    line1: string
    city: string
    state: string
    pincode: string
  }
  subtotal: number
  shipping: number
  total: number
  paymentMethod: string
  status: string
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: String, required: true },
    items: [
      {
        product: { type: String, required: true },
        title: { type: String, required: true },
        image: { type: String },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        lineTotal: { type: Number, required: true },
      }
    ],
    address: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      line1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: "cod" },
    status: { type: String, default: "pending" }
  },
  { timestamps: true }
)

export default model<IOrder>("Order", orderSchema)
