import { colorToString } from "./utils";

export type NormalizedVariable = Pick<
  Variable,
  | "id"
  | "name"
  | "key"
  | "description"
  | "valuesByMode"
  | "remote"
  | "scopes"
  | "variableCollectionId"
>;

export type ResolvedValue = {
  value: VariableValue;
  resolvedType: VariableResolvedDataType;
};

type PreNodeVariable = NormalizedVariable &
  Pick<Variable, "resolveForConsumer">;

export type NodeVariable = NormalizedVariable & {
  resolvedValue: ResolvedValue;
};

export type NodeVariableMap = Record<string, NodeVariable>;
export type NormalizedVariableMap = Record<string, NormalizedVariable>;

export const getVarById = (varId: string): PreNodeVariable => {
  const v = figma.variables.getVariableById(varId) as Variable;
  const {
    id,
    key,
    name,
    description,
    valuesByMode,
    scopes,
    remote,
    variableCollectionId,
    resolveForConsumer,
  } = v;
  const variable = {
    id,
    key,
    name,
    description,
    valuesByMode,
    scopes,
    remote,
    variableCollectionId,
    resolveForConsumer,
  };
  false && console.log({ variable });
  return variable;
};

export const normalizeVariables = async (): Promise<NormalizedVariableMap> => {
  const variables: NormalizedVariableMap = {};
  const rawVariables = await figma.variables.getLocalVariablesAsync();
  rawVariables.map((variable) => {
    const {
      id,
      name,
      key,
      description,
      valuesByMode,
      remote,
      scopes,
      variableCollectionId,
    } = variable;
    variables[id] = {
      id,
      name,
      key,
      description,
      valuesByMode,
      remote,
      scopes,
      variableCollectionId,
    };
  });
  return variables;
};

const sanitizeRule = (boundVariableKey: string): string => {
  switch (boundVariableKey) {
    case "radius":
      return "border-radius";
    case "topLeftRadius":
      return "border-top-left-radius";
    case "topRightRadius":
      return "border-top-right-radius";
    case "bottomLeftRadius":
      return "border-bottom-left-radius";
    case "bottomRightRadius":
      return "border-bottom-right-radius";
    case "paddingTop":
      return "padding-block-start";
    case "paddingBottom":
      return "padding-block-end";
    case "paddingVertical":
      return "padding-block";
    case "paddingLeft":
      return "padding-inline-start";
    case "paddingRight":
      return "padding-inline-end";
    case "paddingHorizontal":
      return "padding-inline";
    case "fills":
      return "background-color";
    case "strokes":
      return "border-color";
    default:
      return boundVariableKey.toLowerCase().replace(" ", "-");
  }
};

type SanitizedNodeVariable = { name: string; value: string; isFloat: boolean };
const sanitizeNodeVariable = (
  nodeVariable: NodeVariable
): SanitizedNodeVariable => {
  const { name, resolvedValue } = nodeVariable;
  const { resolvedType, value } = resolvedValue;

  return {
    name: name.toLowerCase().replace(" ", "-"),
    value:
      resolvedType === "COLOR" ? colorToString(value as RGBA) : String(value),
    isFloat: resolvedType === "FLOAT",
  };
};

const varToCustomPropString = (nodeVariable: NodeVariable): string => {
  const { name, value } = sanitizeNodeVariable(nodeVariable);
  return `--${name}: ${value};`;
};

const varToCSSRule = (boundVariableKey, nodeVariable): string => {
  const prop = sanitizeRule(boundVariableKey);
  const { name, value, isFloat } = sanitizeNodeVariable(nodeVariable);
  return `${prop}: ${isFloat ? "calc(" : ""}var(--${name}, ${value})${
    isFloat ? " * 1px)" : ""
  };`;
};

export const nodeVarString = (
  boundVariableKey: string,
  nodeVariable: NodeVariable
): string => {
  return [varToCustomPropString(nodeVariable)]
    .concat(varToCSSRule(boundVariableKey, nodeVariable))
    .join("\n");
};

export const nodeVarsString = (
  boundVariables: SceneNode["boundVariables"],
  nodeVariables: NodeVariableMap
): string => {
  const customProps = Object.keys(nodeVariables).map((key) =>
    varToCustomPropString(nodeVariables[key])
  );
  const rules = [];
  Object.keys(boundVariables).forEach((boundVariableKey, i) => {
    if (typeof boundVariables[boundVariableKey].length === "number") {
      rules.push(
        varToCSSRule(
          boundVariableKey,
          nodeVariables[boundVariables[boundVariableKey][i].id]
        )
      );
    } else {
      rules.push(
        varToCSSRule(
          boundVariableKey,
          nodeVariables[boundVariables[boundVariableKey].id]
        )
      );
    }
  });

  return customProps.concat("\n").concat(rules).join("\n");
};
