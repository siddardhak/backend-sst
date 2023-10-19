import AWS from "aws-sdk";

import { config } from "./config";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

import { APIGatewayProxyHandlerV2 } from "aws-lambda";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const params = {
    TableName: config.orderTable,
  };
  const results = await dynamoDb.scan(params).promise();

  return results.Items
    ? {
        statusCode: 200,
        body: JSON.stringify(results.Items),
      }
    : {
        statusCode: 404,
        body: JSON.stringify({ error: true }),
      };
};
