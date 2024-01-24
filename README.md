# SST App

This is a typscript based application with backend in serverless.

Technologies used

1. SST (Serverless Stack)
2. AWS Services (Dynamodb, Api GW, Cloudfront, S3, Lambda... etc)

## Infra

all the infrastructure code can be found in the infra/stack.ts file, where tables are being created along with lambda functions attching to the Api.

## Code for backend

code for backend can be found under packages/functions

## setting up the project

1. clone the repo
2. Have you aws-vault configured with your profile you can find more details here at [aws-vault](https://github.com/99designs/aws-vault)
3. once you have configured vault you can run this command on the root

```
aws-vault exec [your aws-vault profile] -- yarn deploy --stage <stage you to use>
```

4. This will deploy backend to the AWS and outputs api url and frontend url on your console.
5. Backend url is basically a apigw url, this can be further configured to custom domain.

## Running Tests

1. Run dynamodb doker container on your local using below command
   ```
   docker run --rm -d -p 8000:8000 amazon/dynamodb-local

   ``` 
2. test/tables.ts file is connect to this docker container and createTables method will create table dyncmoadb table and test cases will keep wirting and reading the data from this table in the docker container
3. to run the test use below command

   ```
   yarn test
   ```
