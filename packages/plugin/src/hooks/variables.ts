import {
  NodeVariable,
  NodeVariableMap,
  varToCSSRule,
  varToCustomPropString,
} from "@/common/variables";
import { useSettings } from "./appContext";

export const useNodeVarString = (
  boundVariableKey: string,
  nodeVariable: NodeVariable
): string => {
  const settings = useSettings();
  return [varToCustomPropString(nodeVariable)]
    .concat(varToCSSRule(boundVariableKey, nodeVariable, settings))
    .join("\n");
};

export const useNodeVarsString = (
  boundVariables: SceneNode["boundVariables"],
  nodeVariables: NodeVariableMap
): string => {
  const settings = useSettings();
  const customProps = Object.keys(nodeVariables).map((key) =>
    varToCustomPropString(nodeVariables[key])
  );
  const rules = [];
  Object.keys(boundVariables).forEach((boundVariableKey) => {
    if (typeof boundVariables[boundVariableKey].length === "number") {
      boundVariables[boundVariableKey].forEach((bVar) => {
        rules.push(
          varToCSSRule(boundVariableKey, nodeVariables[bVar.id], settings)
        );
      });
    } else {
      rules.push(
        varToCSSRule(
          boundVariableKey,
          nodeVariables[boundVariables[boundVariableKey].id],
          settings
        )
      );
    }
  });

  return customProps.concat("\n").concat(rules).join("\n");
};
