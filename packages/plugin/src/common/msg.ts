import { NormalizedCollectionMap } from "./collections";
import { NormalizedSelection } from "./selection";
import { NormalizedVariableMap } from "./variables";

export type PostMessage =
  | {
      type: "refreshFigmaData";
    }
  | {
      type: "setStoredSetting";
      payload: Omit<PluginSettings, "lastUpdated">;
    }
  | {
      type: "log";
      payload: {
        count: number;
        foo: boolean;
      };
    }
  | {
      type: "create";
    }
  | {
      type: "close";
    }
  | {
      type: "notifiy";
      payload: {
        message: string;
        options?: NotificationOptions;
      };
    }
  | {
      type: "toggleLibraries";
    };

export type PluginSettings = {
  lastUpdated: string;
  floatSuffix: string;
  shorthandProps: boolean;
  logicalProps: boolean;
};

export type UIPostMessagePayload = {
  fileKey: string;
  currentUser: string;
  selection: NormalizedSelection[];
  collections: NormalizedCollectionMap;
  variables: NormalizedVariableMap;
  settings: PluginSettings;
};

export type UIPostMessage = {
  data: {
    pluginId: string;
    pluginMessage: UIPostMessagePayload;
  };
};

export const postToUI = (msg: UIPostMessagePayload) => {
  figma.ui.postMessage(msg);
};

export const postToFigma = (msg: PostMessage) => {
  parent.postMessage({ pluginMessage: msg }, "*");
};
