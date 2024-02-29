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

const sanitizeRule = (
  boundVariableKey: string,
  logicalProps: boolean = true
): string => {
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
      return logicalProps ? "padding-block-start" : "padding-top";
    case "paddingBottom":
      return logicalProps ? "padding-block-end" : "padding-bottom";
    case "paddingLeft":
      return logicalProps ? "padding-inline-start" : "padding-left";
    case "paddingRight":
      return logicalProps ? "padding-inline-end" : "padding-right";
    case "paddingVertical": // No non-logical equivalent!
      return "padding-block";
    case "paddingHorizontal": // No non-logical equivalent!
      return "padding-inline";
    case "fills":
      return "background-color";
    case "strokes":
      return "border-color";
    default:
      return boundVariableKey.toLowerCase().replace(" ", "-");
  }
};

export type SanitizedNodeVariable = {
  name: string;
  value: string;
  isFloat: boolean;
};
export const sanitizeNodeVariable = (
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

export const varToCustomPropString = (nodeVariable: NodeVariable): string => {
  const { name, value } = sanitizeNodeVariable(nodeVariable);
  return `--${name}: ${value};`;
};

export const varToCSSRule = (
  boundVariableKey,
  nodeVariable,
  { floatSuffix = "px", logicalProps = true }
): string => {
  const prop = sanitizeRule(boundVariableKey, logicalProps);
  const { name, value, isFloat } = sanitizeNodeVariable(nodeVariable);
  return `${prop}: ${isFloat ? "calc(" : ""}var(--${name}, ${value})${
    isFloat ? ` * 1${floatSuffix})` : ""
  };`;
};
