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
