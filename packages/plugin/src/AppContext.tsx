/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer } from "react";
import { UIPostMessagePayload } from "./common/msg";

type AppContextData = {
  // Sent from code.ts
  figmaData: UIPostMessagePayload;
  // App Settings
  settings: Record<string, never>;
  // Global App State
  state: {
    loading: boolean;
    initialized: boolean;
  };
};

const initData: AppContextData = {
  figmaData: {
    selection: [],
    fileKey: "",
    currentUser: "",
  },
  settings: {},
  state: {
    loading: true,
    initialized: false,
  },
};

export const AppContext = createContext<{
  data: AppContextData;
  dispatch: React.Dispatch<ReducerAction>;
}>({
  data: initData,
  dispatch: () => null,
});

export function AppProvider({ children }: React.PropsWithChildren) {
  const [data, dispatch] = useReducer(appReducer, initData);

  return (
    <AppContext.Provider value={{ data, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

type ReducerAction =
  | {
      type: "UPDATE_FIGMA_DATA";
      payload: AppContextData["figmaData"];
    }
  | {
      type: "SET_LOADING";
      payload: {
        loading: boolean;
      };
    }
  | {
      type: "SET_INITIALIZED";
    };

function appReducer(data: AppContextData, action: ReducerAction) {
  switch (action.type) {
    case "UPDATE_FIGMA_DATA":
      return {
        ...data,
        ...{
          figmaData: {
            ...action.payload,
          },
          settings: {},
        },
      };
    case "SET_LOADING":
      return {
        ...data,
        ...{
          state: {
            ...data.state,
            loading: action.payload.loading,
          },
        },
      };
    case "SET_INITIALIZED":
      return {
        ...data,
        ...{
          state: {
            ...data.state,
            initialized: true,
          },
        },
      };
    default:
      console.log(`Unknown AppReducer Action:`);
      console.log({ action });
      return data;
  }
}
