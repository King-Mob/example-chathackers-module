import { type State } from "../types";

const pseudoState = {};

export const getPseudoState = async (roomId: string) => {
  return pseudoState[roomId];
};

export const setPseudoState = async (
  roomId: string,
  content: State
) => {
  pseudoState[roomId] = content;
};
