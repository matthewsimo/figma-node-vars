import { normalizeCollections } from "./collections";
import { verbose } from "./logging";
import { postToUI } from "./msg";
import { normalizeSelection } from "./selection";
import { normalizeVariables } from "./variables";

export type PluginSettings = {
  lastUpdated: string;
  floatSuffix: string;
  shorthandProps: boolean;
  logicalProps: boolean;
};

let settings: PluginSettings = {
  lastUpdated: new Date().toISOString(),
  floatSuffix: "px",
  shorthandProps: true,
  logicalProps: true,
};

export type StoredSettings = Omit<PluginSettings, "lastUpdated">;

export const init = async () => {
  settings = await getStoredSettings();
  getVarData();
  return;
};

export const getStoredSettings = async (): Promise<PluginSettings> => {
  const storedSettings = await figma.clientStorage.getAsync("settings");
  console.log("get stored settings:", { storedSettings });
  return Object.assign({}, settings, storedSettings);
};

export const setStoredSettings = async (
  data: Omit<PluginSettings, "lastUpdated">
) => {
  verbose && console.log("store", { settings, data });
  figma.clientStorage
    .setAsync("settings", data)
    .then(() => {
      settings = Object.assign({}, settings, data);
      figma.notify("Settings saved");
    })
    .catch((e) => {
      true && console.log("Save settings error:", { e });
      figma.notify("Error saving settings", { error: true });
    })
    .finally(() => {
      getVarData();
    });
};

let collections = {};
let variables = {};

export const getFigmaData = () => {
  const selection = normalizeSelection(figma.currentPage.selection);

  const payload = {
    selection,
    collections,
    variables,
    settings,
  };
  verbose && console.log("getFigmaData:", payload);
  postToUI(payload);
};

export const getVarData = async () => {
  collections = await normalizeCollections();
  variables = await normalizeVariables();
  settings.lastUpdated = new Date().toISOString();

  getFigmaData();
};

const selectionchangeHandler = () => {
  getFigmaData();
};

figma.on("selectionchange", selectionchangeHandler);

figma.on("close", () => {
  figma.off("selectionchange", selectionchangeHandler);
});
