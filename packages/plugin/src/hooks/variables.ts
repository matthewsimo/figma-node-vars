import {
  NodeVariable,
  NodeVariableMap,
  varToCSSRule,
  varToCustomPropString,
} from "@/common/variables";
import { useFigmaData, useSettings } from "./appContext";

export const useNodeVarString = (
  boundVariableKey: string,
  nodeVariable: NodeVariable
): string => {
  const settings = useSettings();
  const { collections } = useFigmaData();
  return [varToCustomPropString(nodeVariable, collections)]
    .concat(varToCSSRule(boundVariableKey, nodeVariable, settings, collections))
    .join("\n");
};

export const useNodeVarsString = (
  boundVariables: SceneNode["boundVariables"],
  nodeVariables: NodeVariableMap
): string => {
  const settings = useSettings();
  const { collections } = useFigmaData();
  const customProps = Object.keys(nodeVariables).map((key) =>
    varToCustomPropString(nodeVariables[key], collections)
  );
  const rules = [];
  Object.keys(boundVariables).forEach((boundVariableKey) => {
    if (typeof boundVariables[boundVariableKey].length === "number") {
      boundVariables[boundVariableKey].forEach((bVar) => {
        rules.push(
          varToCSSRule(
            boundVariableKey,
            nodeVariables[bVar.id],
            settings,
            collections
          )
        );
      });
    } else {
      rules.push(
        varToCSSRule(
          boundVariableKey,
          nodeVariables[boundVariables[boundVariableKey].id],
          settings,
          collections
        )
      );
    }
  });

  return customProps.concat("\n").concat(rules).join("\n");
};
