export type PreNormalizedVariable = Pick<
  Variable,
  | "id"
  | "name"
  | "key"
  | "description"
  | "valuesByMode"
  | "remote"
  | "scopes"
  | "variableCollectionId"
  | "resolveForConsumer"
>;

export type ResolvedValue = {
  value: VariableValue;
  resolvedType: VariableResolvedDataType;
};

export type NormalizedVariable = Omit<
  PreNormalizedVariable,
  "resolveForConsumer"
> &
  ResolvedValue;

export type NormalizedSelection = Pick<
  SceneNode,
  "id" | "name" | "boundVariables" | "type"
> & {
  variables: Record<string, NormalizedVariable>;
};

export const normalizeSelection = (
  selection: readonly SceneNode[]
): NormalizedSelection[] => {
  return selection.map((node): NormalizedSelection => {
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

    return {
      id,
      name,
      boundVariables,
      type,
      variables,
    };
  });
};

export const getVarById = (varId: string): PreNormalizedVariable => {
  const v = figma.variables.getVariableById(varId) as Variable;
  const {
    id = "unknown",
    key = "unknown",
    name = "unknown",
    description = "unknown",
    valuesByMode = {},
    scopes = [],
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
