import { shouldCollapseKeys, collapseKeysToKey } from "@/common/selection";
import { useSettings } from "./appContext";

const radiusKeys = [
  "topLeftRadius",
  "topRightRadius",
  "bottomLeftRadius",
  "bottomRightRadius",
];

const paddingBlockKeys = ["paddingTop", "paddingBottom"];
const paddingInlineKeys = ["paddingLeft", "paddingRight"];
const paddingKeys = [...paddingBlockKeys, ...paddingInlineKeys];

export const useCollapseNodeFields = (
  boundVariables: SceneNode["boundVariables"]
) => {
  const { shorthandProps } = useSettings();
  let boundVariablesCopy = { ...boundVariables };
  if (!shorthandProps) {
    return boundVariablesCopy;
  }

  boundVariablesCopy = shouldCollapseKeys(boundVariablesCopy, radiusKeys)
    ? collapseKeysToKey(boundVariablesCopy, radiusKeys, "radius")
    : boundVariablesCopy;

  boundVariablesCopy = shouldCollapseKeys(boundVariablesCopy, paddingKeys)
    ? collapseKeysToKey(boundVariablesCopy, paddingKeys, "padding")
    : boundVariablesCopy;

  boundVariablesCopy = shouldCollapseKeys(boundVariablesCopy, paddingBlockKeys)
    ? collapseKeysToKey(boundVariablesCopy, paddingBlockKeys, "paddingVertical")
    : boundVariablesCopy;

  boundVariablesCopy = shouldCollapseKeys(boundVariablesCopy, paddingInlineKeys)
    ? collapseKeysToKey(
        boundVariablesCopy,
        paddingInlineKeys,
        "paddingHorizontal"
      )
    : boundVariablesCopy;

  return boundVariablesCopy;
};
