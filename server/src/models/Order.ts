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
  paymentStatus: string
  status: string
  tracking?: {
    courier?: string
    trackingNumber?: string
    estimatedDelivery?: Date
  }
  statusHistory: {
    status: string
    note?: string
    updatedAt: Date
  }[]
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
    paymentStatus: { type: String, default: "pending" },
    status: { type: String, enum: ["placed", "delivered"], default: "placed" },
    tracking: {
      courier: { type: String },
      trackingNumber: { type: String },
      estimatedDelivery: { type: Date },
    },
    statusHistory: [
      {
        status: { type: String, enum: ["placed", "delivered"], required: true },
        note: { type: String },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
)

orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ status: 1, createdAt: -1 })

export default model<IOrder>("Order", orderSchema)
