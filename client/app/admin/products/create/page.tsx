import { redirect } from "next/navigation";

export default function CreateProductRedirect() {
  redirect("/admin/add-products");
}
