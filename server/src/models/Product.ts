import { Schema, model } from "mongoose"

const productSchema = new Schema(
  {
    title: String,
    price: Number,
    description: String,
    image: String
  },
  { timestamps: true }
)

export default model("Product", productSchema)
