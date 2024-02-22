export type NormalizedVariable = Pick<
  Variable,
  | "id"
  | "name"
  | "key"
  | "description"
  | "valuesByMode"
  | "remote"
  | "scopes"
  | "resolveForConsumer"
>;

export type ResolvedValue = {
  value: VariableValue;
  resolvedType: VariableResolvedDataType;
};

export type NormalizedSelection = Pick<
  SceneNode,
  "id" | "name" | "boundVariables" | "type"
> & {
  variables: Record<string, NormalizedVariable & ResolvedValue>;
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
        });
      } else {
        variables[boundVariables[k].id] = getVarById(boundVariables[k].id);
        variables[boundVariables[k].id]["resolvedValue"] =
          variables[boundVariables[k].id].resolveForConsumer(node);
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

export const getVarById = (varId: string): NormalizedVariable => {
  const v = figma.variables.getVariableById(varId) as Variable;
  const {
    id = "unknown",
    key = "unknown",
    name = "unknown",
    description = "unknown",
    valuesByMode = {},
    scopes = [],
    resolveForConsumer,
    remote,
  } = v;
  const variable = {
    id,
    key,
    name,
    description,
    valuesByMode,
    scopes,
    resolveForConsumer,
    remote,
  };
  false && console.log({ variable });
  return variable;
};
