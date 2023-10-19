import { SSTConfig } from "sst";

import { Stack } from "./infra/stack";

export default {
  config(_input) {
    return {
      name: "shopping",
      region: "ap-southeast-2",
    };
  },
  stacks(app) {
    app.stack(Stack);
  },
} satisfies SSTConfig;
