import AWS from "aws-sdk";

import { config } from "./config";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { LoanApplication } from "./types";

const sendResult = (application: LoanApplication) => {
  const totalAssetValue = application.assets.reduce(function (prev, cur) {
    return prev + cur.assetValue;
  }, 0);

  const totalProfileOrLoss = application.assets.reduce(function (prev, cur) {
    return prev + cur.profitOrLoss;
  }, 0);

  return {
    ...application,
    totalAssetValue,
    totalProfileOrLoss,
    hasLoan: application.Loan && application.Loan.length > 0 ? true : false,
  };
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.body) {
    throw Error();
  }

  const data: { id: string } = JSON.parse(event.body);

  const params = {
    TableName: config.loanTable,
    Key: { id: data.id },
  };
  const results = await dynamoDb.get(params).promise();

  return results.Item
    ? {
        statusCode: 200,
        body: JSON.stringify(sendResult(results.Item as LoanApplication)),
      }
    : {
        statusCode: 404,
        body: JSON.stringify({ error: true }),
      };
};
