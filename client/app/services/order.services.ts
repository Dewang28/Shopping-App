import api from "./api";
import { Product } from "../types/product";

export type OrderItem = {
  product: string;
  title?: string;
  image?: string;
  quantity: number;
  price?: number;
  lineTotal?: number;
};

export type Order = {
  _id: string;
  items: OrderItem[];
  address?: {
    name: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  subtotal?: number;
  shipping?: number;
  total?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  status?: string;
  tracking?: {
    courier?: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
  };
  statusHistory?: {
    status: string;
    note?: string;
    updatedAt: string;
  }[];
  createdAt: string;
};

export const createOrder = async (payload: {
  items: { productId: string; quantity: number }[];
  address: {
    name: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
}) => {
  const res = await api.post("/api/orders", payload);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await api.get("/api/orders/me");
  return res.data as Order[];
};

export const getAdminOrders = async () => {
  try {
    const res = await api.get("/api/orders/admin");
    return res.data as Order[];
  } catch (error: unknown) {
    if (getResponseStatus(error) !== 404) {
      throw error;
    }

    const res = await api.get("/api/admin/orders");
    return res.data as Order[];
  }
};

export const updateOrderStatus = async (
  id: string,
  payload: {
    status?: string;
    paymentStatus?: string;
    note?: string;
    courier?: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
  }
) => {
  const res = await api.patch(`/api/orders/${id}/status`, payload);
  return res.data as Order;
};

export type AdminAnalytics = {
  totalOrders: number;
  revenue: number;
  pendingOrders: number;
  deliveredOrders: number;
  productCount: number;
  inactiveProducts: number;
  totalStock: number;
  outOfStockProducts: number;
  lowStockProducts: {
    _id: string;
    title: string;
    brand: string;
    stock?: number;
    lowStockThreshold?: number;
  }[];
  topProducts: {
    _id: string;
    title: string;
    quantitySold: number;
    revenue: number;
  }[];
  monthlySales: {
    label: string;
    revenue: number;
    orders: number;
  }[];
  orderStatusBreakdown: {
    status: string;
    count: number;
  }[];
};

const emptyAnalytics: AdminAnalytics = {
  totalOrders: 0,
  revenue: 0,
  pendingOrders: 0,
  deliveredOrders: 0,
  productCount: 0,
  inactiveProducts: 0,
  totalStock: 0,
  outOfStockProducts: 0,
  lowStockProducts: [],
  topProducts: [],
  monthlySales: [],
  orderStatusBreakdown: [],
};

const buildAdminAnalyticsFromResources = (
  orders: Order[],
  products: Product[]
): AdminAnalytics => {
  const productSales = new Map<
    string,
    { _id: string; title: string; quantitySold: number; revenue: number }
  >();
  const monthlySales = new Map<string, { label: string; revenue: number; orders: number; time: number }>();
  const orderStatusBreakdown = new Map<string, number>();

  const analytics = orders.reduce<AdminAnalytics>(
    (result, order) => {
      const total = Number(order.total ?? 0);
      const status =
        order.status === "delivered" || order.status === "returned"
          ? order.status
          : "placed";
      const createdAt = order.createdAt ? new Date(order.createdAt) : null;

      result.totalOrders += 1;
      result.revenue += total;
      result.pendingOrders += status === "placed" ? 1 : 0;
      result.deliveredOrders += status === "delivered" ? 1 : 0;
      orderStatusBreakdown.set(status, (orderStatusBreakdown.get(status) ?? 0) + 1);

      if (createdAt && !Number.isNaN(createdAt.getTime())) {
        const month = createdAt.getMonth() + 1;
        const year = createdAt.getFullYear();
        const label = `${month}/${year}`;
        const existing = monthlySales.get(label) ?? {
          label,
          revenue: 0,
          orders: 0,
          time: new Date(year, month - 1).getTime(),
        };

        existing.revenue += total;
        existing.orders += 1;
        monthlySales.set(label, existing);
      }

      order.items.forEach((item) => {
        const id = item.product || item.title || "unknown";
        const existing = productSales.get(id) ?? {
          _id: id,
          title: item.title || "Unknown product",
          quantitySold: 0,
          revenue: 0,
        };

        existing.quantitySold += Number(item.quantity ?? 0);
        existing.revenue += Number(item.lineTotal ?? (item.price ?? 0) * (item.quantity ?? 0));
        productSales.set(id, existing);
      });

      return result;
    },
    { ...emptyAnalytics }
  );

  analytics.productCount = products.filter((product) => product.isActive !== false).length;
  analytics.inactiveProducts = products.filter((product) => product.isActive === false).length;
  analytics.totalStock = products.reduce((sum, product) => sum + Number(product.stock ?? 0), 0);
  analytics.outOfStockProducts = products.filter((product) => Number(product.stock ?? 0) <= 0).length;
  analytics.lowStockProducts = products
    .filter(
      (product) =>
        product.isActive !== false &&
        Number(product.stock ?? 0) < Number(product.lowStockThreshold ?? 5)
    )
    .sort((a, b) => Number(a.stock ?? 0) - Number(b.stock ?? 0))
    .slice(0, 6)
    .map((product) => ({
      _id: product._id,
      title: product.title,
      brand: product.brand,
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold,
    }));
  analytics.topProducts = Array.from(productSales.values())
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, 5);
  analytics.monthlySales = Array.from(monthlySales.values())
    .sort((a, b) => a.time - b.time)
    .slice(-6)
    .map(({ label, revenue, orders }) => ({ label, revenue, orders }));
  analytics.orderStatusBreakdown = Array.from(orderStatusBreakdown.entries())
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);

  return analytics;
};

const getResponseStatus = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "status" in error.response &&
    typeof error.response.status === "number"
  ) {
    return error.response.status;
  }

  return undefined;
};

const getSettledArray = <T,>(result: PromiseSettledResult<{ data: unknown }>) => {
  if (result.status === "fulfilled" && Array.isArray(result.value.data)) {
    return result.value.data as T[];
  }

  return [];
};

export const getAdminAnalytics = async () => {
  try {
    const res = await api.get("/api/orders/admin/analytics");
    return res.data as AdminAnalytics;
  } catch (error: unknown) {
    if (getResponseStatus(error) !== 404) {
      throw error;
    }

    try {
      const res = await api.get("/api/admin/orders/analytics");
      return res.data as AdminAnalytics;
    } catch (aliasError: unknown) {
      if (getResponseStatus(aliasError) !== 404) {
        throw aliasError;
      }
    }

    const [ordersRes, productsRes] = await Promise.allSettled([
      api.get("/api/orders/admin").catch((error: unknown) => {
        if (getResponseStatus(error) !== 404) {
          throw error;
        }

        return api.get("/api/admin/orders");
      }),
      api.get("/api/products"),
    ]);

    return buildAdminAnalyticsFromResources(
      getSettledArray<Order>(ordersRes),
      getSettledArray<Product>(productsRes)
    );
  }
};
