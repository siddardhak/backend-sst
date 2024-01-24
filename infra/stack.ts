import { BillingMode } from "aws-cdk-lib/aws-dynamodb";
import { Api, StackContext, Table } from "sst/constructs";

export function Stack({ stack }: StackContext) {
  const loanTable = new Table(stack, "LoanApplication", {
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

  const api = new Api(stack, "LoanApi", {
    defaults: {
      function: {
        description: "Loan Api Lambda",
        environment: {
          LOAN_TABLE: loanTable.tableName,
        },
        runtime: "nodejs18.x",
      },
    },
    routes: {
      "GET    /loan/{id}": "backend/functions/src/get.handler",
      "POST   /apply/{id}": "backend/functions/src/initiate.handler",
      "PUT    /submit/{id}": "backend/functions/src/update.handler",
    },
  });

  api.attachPermissions([loanTable]);

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
