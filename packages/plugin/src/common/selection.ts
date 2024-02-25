import { NodeVariableMap, getVarById } from "./variables";

export type NormalizedSelection = Pick<
  SceneNode,
  "id" | "name" | "boundVariables" | "type"
> & {
  variables: NodeVariableMap;
};

export const normalizeSelection = (
  selection: readonly SceneNode[]
): NormalizedSelection[] => {
  const normalizedSelection = [];
  selection.forEach((node): void => {
    const { id, name, boundVariables = {}, type } = node;
    console.log({ id, name, variables: boundVariables });
    const variables = {};

    Object.keys(boundVariables).forEach((k) => {
      if (typeof boundVariables[k].length === "number") {
        boundVariables[k].map((v: VariableAlias) => {
          variables[v.id] = getVarById(v.id);
          variables[v.id]["resolvedValue"] =
            variables[v.id].resolveForConsumer(node);
          delete variables[v.id].resolveForConsumer;
        });
      } else {
        variables[boundVariables[k].id] = getVarById(boundVariables[k].id);
        variables[boundVariables[k].id]["resolvedValue"] =
          variables[boundVariables[k].id].resolveForConsumer(node);
        delete variables[boundVariables[k].id].resolveForConsumer;
      }
    });

    normalizedSelection.push({
      id,
      name,
      boundVariables,
      type,
      variables,
    });

    if ("children" in node) {
      const normalizedChildren = normalizeSelection(node.children);
      normalizedSelection.push(...normalizedChildren);
    }
  });

  return normalizedSelection;
};

const shouldCollapseKeys = (boundVariables, keys: string[]) => {
  if (keys.every((k) => k in boundVariables)) {
    return keys.every(
      (k) => boundVariables[k].id === boundVariables[keys[0]].id
    );
  } else {
    return false;
  }
};

const collapseKeysToKey = (boundVariables, keys: string[], key: string) => {
  const value = boundVariables[keys[0]];
  keys.forEach((k) => {
    delete boundVariables[k];
  });

  boundVariables[key] = value;
  return boundVariables;
};

const radiusKeys = [
  "topLeftRadius",
  "topRightRadius",
  "bottomLeftRadius",
  "bottomRightRadius",
];

const paddingBlockKeys = ["paddingTop", "paddingBottom"];
const paddingInlineKeys = ["paddingLeft", "paddingRight"];
const paddingKeys = [...paddingBlockKeys, ...paddingInlineKeys];

export const collapseNodeFields = (
  boundVariables: SceneNode["boundVariables"]
) => {
  let boundVariablesCopy = { ...boundVariables };

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
