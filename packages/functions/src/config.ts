type Config = {
  productTable: string;
  orderTable: string;
};

export const config: Config = {
  productTable: String(process.env.PRODUCT_TABLE),
  orderTable: String(process.env.ORDER_TABLE),
};
