import { BillingMode } from "aws-cdk-lib/aws-dynamodb";
import { Api, StackContext, StaticSite, Table } from "sst/constructs";

export function Stack({ stack }: StackContext) {
  const productTable = new Table(stack, "Products", {
    fields: {
      id: "string",
    },
    primaryIndex: { partitionKey: "id" },
    cdk: {
      table: {
        billingMode: BillingMode.PAY_PER_REQUEST,
      },
    },
  });

  const orderTable = new Table(stack, "Orders", {
    fields: {
      id: "string",
      productId: "string",
    },
    primaryIndex: { partitionKey: "id" },
    cdk: {
      table: {
        billingMode: BillingMode.PAY_PER_REQUEST,
      },
    },
  });

  const api = new Api(stack, "ShoppingApi", {
    defaults: {
      function: {
        description: "Shopping Api Lambda",
        environment: {
          PRODUCT_TABLE: productTable.tableName,
          ORDER_TABLE: orderTable.tableName,
        },
        runtime: "nodejs18.x",
      },
    },
    routes: {
      "GET    /products": "packages/functions/src/listProducts.handler",
      "POST   /product": "packages/functions/src/createProduct.handler",
      "PUT    /product/{id}": "packages/functions/src/updateProduct.handler",
      "GET    /orders": "packages/functions/src/listOrders.handler",
      "POST   /order": "packages/functions/src/createOrder.handler",
      "PUT    /order/{id}": "packages/functions/src/updateOrder.handler",
    },
  });

  api.attachPermissions([productTable, orderTable]);

  const site = new StaticSite(stack, "ShoppingFrontend", {
    path: "packages/frontend",
    buildCommand: "npm run build",
    buildOutput: "build",
    environment: {
      REACT_APP_API_URL: api.url,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    FrontendUrl: site.url,
  });
}
