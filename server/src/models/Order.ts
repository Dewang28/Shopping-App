import { Schema, model, Document } from "mongoose"

export interface IOrder extends Document {
  user: string
  items: {
    product: string
    quantity: number
    price: number
  }[]
  total: number
  status: string
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: String, required: true },
    items: [
      {
        product: String,
        quantity: Number,
        price: Number
      }
    ],
    total: Number,
    status: { type: String, default: "pending" }
  },
  { timestamps: true }
)

export default model<IOrder>("Order", orderSchema)
