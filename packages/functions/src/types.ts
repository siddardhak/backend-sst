export type Product = {
  id: string;
  price: number;
  name: string;
  stockQuantity: number;
  imgUrl: string;
};

type ShippingInformation = {
  address: string;
  trackingNumber: string;
  trackingCompany: string;
};

export type Order = {
  id: string;
  productId: string[];
  quantity: number;
  status: "processing" | "cancelled" | "delivered";
  shippingInformation: ShippingInformation;
};
