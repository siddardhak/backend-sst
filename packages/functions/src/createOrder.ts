import AWS from "aws-sdk";
import { randomUUID } from "crypto";

import { Order } from "./types";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { config } from "./config";

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  if (!event.body) {
    throw Error();
  }

  const data: Order = JSON.parse(event.body);

  const params = {
    TableName: config.orderTable,
    Item: {
      id: randomUUID(),
      quantity: data.quantity,
      productId: data.productId,
      status: data.status,
      shippingInformation: {
        address: data.shippingInformation.address,
        trackingNumber: data.shippingInformation.trackingNumber,
        trackingCompany: data.shippingInformation.trackingCompany,
      },
    },
  };
  await dynamoDb.put(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(params.Item),
  };
};
