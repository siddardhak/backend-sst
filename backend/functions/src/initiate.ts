import AWS from "aws-sdk";

import { LoanApplication } from "./types";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { config } from "./config";

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  if (!event.body || !(event.pathParameters && event.pathParameters.id)) {
    throw Error();
  }

  const data: LoanApplication = JSON.parse(event.body);

  const assets = generateAssets();

  const params = {
    TableName: config.loanTable,
    Item: {
      id: event.pathParameters.id,
      companyName: data.companyName,
      accountingProvider: data.accountingProvider,
      assets,
    },
  };
  await dynamoDb.put(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(params.Item as LoanApplication),
  };
};

function generateRandomInteger(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function generateAssets() {
  let assets = [];

  for (let i = 1; i <= 12; i++) {
    const values = {
      year: 2023,
      month: i,
      profitOrLoss: generateRandomInteger(-30000, 30000),
      assetValue: generateRandomInteger(0, 10000),
    };
    assets.push(values);
  }

  return assets;
}
