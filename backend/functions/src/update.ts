import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { config } from "./config";
import { decisionEngine } from "./decision-engine";
import { updateExpression } from "./dynamodb-update-expression";

type UpdateInput = {
  loanAmount: number;
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.body || !(event.pathParameters && event.pathParameters.id)) {
    console.log("no body or id to update");

    throw Error();
  }

  const data: UpdateInput = JSON.parse(event.body);

  const approvedPercentage = await decisionEngine(
    event.pathParameters.id,
    data.loanAmount
  );

  const exp = updateExpression({
    ...data,
    loan: [{ status: "Approved", approvedPercentage, amount: data.loanAmount }],
  });

  const params = {
    TableName: config.loanTable,
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
