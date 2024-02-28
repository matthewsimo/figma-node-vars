/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer } from "react";
import { UIPostMessagePayload } from "./common/msg";

type AppContextData = {
  // Sent from code.ts
  figmaData: UIPostMessagePayload;
  // Global App State
  state: {
    isLoading: boolean;
    initialized: boolean;
  };
};

const initData: AppContextData = {
  figmaData: {
    selection: [],
    fileKey: "",
    currentUser: "",
    collections: {},
    variables: {},
    settings: {
      lastUpdated: "",
      floatSuffix: "",
      shorthandProps: true,
      logicalProps: true,
    },
  },
  state: {
    isLoading: true,
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
        isLoading: boolean;
      };
    }
  | {
      type: "SET_INITIALIZED";
    };

function appReducer(data: AppContextData, action: ReducerAction) {
  false && console.log("appReducer:", { data, action });
  switch (action.type) {
    case "UPDATE_FIGMA_DATA":
      return {
        ...data,
        ...{
          figmaData: {
            ...action.payload,
          },
        },
      };
    case "SET_LOADING":
      return {
        ...data,
        ...{
          state: {
            ...data.state,
            isLoading: action.payload.isLoading,
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
