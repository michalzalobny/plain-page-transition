import { createEventDispatcher } from "./utils/eventDispatcher";

export const globalState = {
  eventDispatcher: createEventDispatcher(),
  savedScrollPositions: new Map(),
};
