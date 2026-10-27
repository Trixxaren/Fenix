import { AppState, Message, Profile } from "../data/models";
import { createSeed } from "../data/seed";
export type Action =
  | { type: "login" }
  | { type: "logout" }
  | { type: "profile"; profile: Profile }
  | { type: "onboard"; profile: Profile }
  | { type: "relation"; id: string; value?: "friend" | "outgoing" }
  | { type: "message"; id: string; message: Message }
  | { type: "block"; id: string }
  | { type: "read"; id: string; time: string }
  | { type: "reset" };
export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "login":
      return { ...state, loggedIn: true, onboarded: true };
    case "logout":
      return { ...state, loggedIn: false };
    case "profile":
      return { ...state, profile: action.profile };
    case "onboard":
      return {
        ...state,
        profile: action.profile,
        onboarded: true,
        loggedIn: true,
      };
    case "relation": {
      if (state.blocked.includes(action.id)) return state;
      const relations = { ...state.relations };
      if (action.value) relations[action.id] = action.value;
      else delete relations[action.id];
      return { ...state, relations };
    }
    case "message":
      return state.blocked.includes(action.id)
        ? state
        : {
            ...state,
            conversations: {
              ...state.conversations,
              [action.id]: [
                ...(state.conversations[action.id] ?? []),
                action.message,
              ],
            },
          };
    case "block": {
      const relations = { ...state.relations };
      delete relations[action.id];
      return {
        ...state,
        blocked: [...new Set([...state.blocked, action.id])],
        relations,
      };
    }
    case "read":
      return {
        ...state,
        readAt: { ...state.readAt, [action.id]: action.time },
      };
    case "reset":
      return createSeed();
  }
}
