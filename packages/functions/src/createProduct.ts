import AWS from "aws-sdk";
import { randomUUID } from "crypto";

import { Product } from "./types";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { config } from "./config";

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  if (!event.body) {
    throw Error();
  }

  const data: Product = JSON.parse(event.body);

  const params = {
    TableName: config.productTable,
    Item: {
      id: randomUUID(),
      name: data.name,
      price: data.price,
      stockQuantity: data.stockQuantity,
      imgUrl: data.imgUrl,
    },
  };
  await dynamoDb.put(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(params.Item),
  };
};
