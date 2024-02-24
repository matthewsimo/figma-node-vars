export type NormalizedCollection = Pick<
  VariableCollection,
  "id" | "name" | "remote" | "modes" | "variableIds"
>;

export type NormalizedCollectionMap = Record<string, NormalizedCollection>;

export const normalizeCollections =
  async (): Promise<NormalizedCollectionMap> => {
    const collections: NormalizedCollectionMap = {};
    const rawCollections =
      await figma.variables.getLocalVariableCollectionsAsync();
    rawCollections.map((collection) => {
      const { id, name, remote, modes, variableIds } = collection;
      collections[id] = { id, name, remote, modes, variableIds };
    });
    return collections;
  };
