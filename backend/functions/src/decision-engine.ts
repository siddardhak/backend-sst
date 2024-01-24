import AWS from "aws-sdk";

import { config } from "./config";
import { dockerComposeConfig } from "./dynamodbConfig";
import { LoanApplication } from "./types";

const DynamodbConfig = process.env.STAGE === "test" ? dockerComposeConfig : {};

const dynamoDb = new AWS.DynamoDB.DocumentClient(DynamodbConfig);

export const decisionEngine = async (id: string, amount: number) => {
  const params = {
    TableName: config.loanTable,
    Key: { id },
  };
  const results = await dynamoDb.get(params).promise();

  if (!results.Item) {
    throw Error("No Loan application found");
  }

  const averageAssetValut =
    (results.Item as LoanApplication).assets.reduce(function (prev, cur) {
      return prev + cur.assetValue;
    }, 0) / 12;

  const totalProfitOrLoss = (results.Item as LoanApplication).assets.reduce(
    function (prev, cur) {
      return prev + cur.assetValue;
    },
    0
  );

  if (averageAssetValut > amount) {
    return {
      approvedPercentage: "100%",
      amount,
      status: "Approved",
    };
  } else if (totalProfitOrLoss > 0) {
    return {
      approvedPercentage: "60%",
      amount,
      status: "Approved",
    };
  }
  return {
    approvedPercentage: "20%",
    amount,
    status: "Approved",
  };
};
