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

const sanitizeVarName = (varName: string): string =>
  varName.toLowerCase().replace(" ", "-");

const sanitizeValue = ({ value, resolvedType }: ResolvedValue): string =>
  resolvedType === "COLOR" ? colorToString(value as RGBA) : String(value);

export const nodeVarString = (
  boundVariableKey: string,
  nodeVariable: NodeVariable
): string => {
  const prop = sanitizeRule(boundVariableKey);
  const name = sanitizeVarName(nodeVariable.name);

  return `--${name}: ${sanitizeValue(nodeVariable.resolvedValue)};
${prop}: var(--${name}, ${sanitizeValue(nodeVariable.resolvedValue)}${
    nodeVariable.resolvedValue.resolvedType === "FLOAT" ? "px" : ""
  });`;
};
