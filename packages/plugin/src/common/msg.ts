export type PostMessage =
  | {
      type: "refreshFigmaData";
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

export type UIPostMessagePayload = {
  fileKey: string;
  currentUser: string;
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
