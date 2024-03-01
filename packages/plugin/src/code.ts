import { PostMessage } from "./common/msg";
import { getVarData, init, setStoredSettings } from "./common/app";
import { verbose } from "./common/logging";

figma.showUI(__html__, { themeColors: true });
figma.ui.resize(500, 800);

(async () => {
  await init();
})();

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async (msg: PostMessage) => {
  verbose && console.log(`"${msg.type}" Message Received!`);

  switch (msg.type) {
    case "refreshFigmaData":
      await getVarData();
      break;
    case "setStoredSettings":
      await setStoredSettings(msg.payload);
      break;
    case "close":
      verbose && console.log("closing!");
      figma.closePlugin();
      break;
    case "notifiy":
      figma.notify(msg.payload.message, msg.payload.options || {});
      break;
    default:
      console.log("Unknown PostMessage Received");
      console.log({ msg });
  }
};
