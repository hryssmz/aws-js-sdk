// cognito/actions/index.ts
import adminActions from "./admin";
import clientActions from "./client";
import type { Action } from "../../utils";

const actions: Record<string, Action> = {
  ...adminActions,
  ...clientActions,
};

export default actions;
