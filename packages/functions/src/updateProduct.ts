import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { config } from "./config";
import { updateExpression } from "./dynamodbUpdateExpression";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.body || !event.pathParameters) {
    console.log("no body or id to update");

    throw Error();
  }

  const data = JSON.parse(event.body);

  const exp = updateExpression({ ...data });

  const params = {
    TableName: config.productTable,
    Key: {
      id: event.pathParameters.id,
    },
    UpdateExpression: exp.expression,
    ExpressionAttributeNames: exp.names,
    ExpressionAttributeValues: exp.values,
    ReturnValues: "ALL_NEW",
  };

  const results = await dynamoDb.update(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(results.Attributes),
  };
};
