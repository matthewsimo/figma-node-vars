import { normalizeCollections } from "./common/collections";
import { postToUI, PostMessage } from "./common/msg";
import { normalizeSelection } from "./common/selection";
import { normalizeVariables } from "./common/variables";
// Figma Documentation Links:
// https://www.figma.com/plugin-docs/how-plugins-run
// https://www.figma.com/plugin-docs/api/api-reference/

figma.showUI(__html__, { themeColors: true });
figma.ui.resize(500, 800);

const settings = {
  lastUpdated: new Date().toISOString(),
  floatSuffix: "px",
  shorthandProps: true,
  logicalProps: true,
};

const fileKey = figma.fileKey || "Unknown";
const currentUser = (figma.currentUser && figma.currentUser.name) || "Unknown";
let collections = {};
let variables = {};

const getVarData = async () => {
  collections = await normalizeCollections();
  variables = await normalizeVariables();
  settings.lastUpdated = new Date().toISOString();

  getFigmaData();
};

const selectionchangeHandler = () => {
  console.log("selection change", figma.currentPage.selection);

  getFigmaData();
};

figma.on("selectionchange", selectionchangeHandler);

figma.on("close", () => {
  console.log("closing plugin");
  figma.off("selectionchange", selectionchangeHandler);
});

const getFigmaData = () => {
  console.log("GET FIGMA DATA", settings);
  const selection = normalizeSelection(figma.currentPage.selection);

  const payload = {
    fileKey,
    currentUser,
    selection,
    collections,
    variables,
    settings,
  };
  console.log("Plugin:");
  console.log(payload);
  postToUI(payload);
};

const setStoredSetting = async (data) => {
  // @TODO - make this work, call figma.clientStorage API
  // https://www.figma.com/plugin-docs/api/figma-clientStorage/
  console.log("store", { data });
};

getVarData();

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async (msg: PostMessage) => {
  console.log(`"${msg.type}" Message Received!`);

  switch (msg.type) {
    case "refreshFigmaData":
      await getVarData();
      break;
    case "setStoredSetting":
      await setStoredSetting(msg.payload);
      break;
    case "log": // Demonstrate UI passing data to code.ts
      console.log("payload:");
      console.log(msg.payload);
      break;
    case "close":
      console.log("closing!");
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
