# Shopping App

This is a typscript based shopping application which has frontend in react and backend in Node serverless

Technologies used

1. SST (Serverless Stack)
2. AWS Services (Dynamodb, Api GW, Cloudfront, S3, Lambda... etc)
3. Tailwind CSS
4. Redux Toolkit and Redux Saga

## Infra

all the infrastructure code can be found in the infra/stack.ts file, where tables are being created along with lambda functions attching to the Api and frontend infra for deployment

## Code for backend

code for backend can be found under packages/functions

## Code for frontend

code for frontend can be found under packages/frontend

## setting up the project

1. clone the repo
2. Have you aws-vault configured with your profile you can find more details here at [aws-vault](https://github.com/99designs/aws-vault)
3. once you have configured vault you can run this command on the root

```
aws-vault exec [your aws-vault profile] -- yarn deploy --stage <stage you to use>
```

4. This will deploy backend and frontend to the AWS and outputs api url and frontend url on your console.
5. Frontend url is basically a cloudfront url, this can be further configured to custom domain.
