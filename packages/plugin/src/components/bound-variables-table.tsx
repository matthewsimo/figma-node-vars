import { NormalizedVariable } from "@/common/utils";
import EmptyAlert from "./empty-alert";
import Logger from "./logger";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import ResolvedValue from "./resolved-value";

const radiusKeys = [
  "topLeftRadius",
  "topRightRadius",
  "bottomLeftRadius",
  "bottomRightRadius",
];
const shouldCollapseRadius = (boundVariables) => {
  if (radiusKeys.every((k) => k in boundVariables)) {
    return radiusKeys.every(
      (k) => boundVariables[k].id === boundVariables[radiusKeys[0]].id
    );
  } else {
    return false;
  }
};

const collapsRadius = (boundVariables) => {
  const radiusValue = boundVariables[radiusKeys[0]];
  radiusKeys.forEach((k) => {
    delete boundVariables[k];
  });

  boundVariables.radius = radiusValue;
  return boundVariables;
};

const capitalize = (str: string) => {
  console.log({ str });

  return str
    .split("")
    .map((char, i) => (i === 0 ? char.toUpperCase() : char))
    .join("");
};

const BoundVariableTableRow = ({
  boundVar,
  variable,
}: {
  boundVar: string;
  variable: NormalizedVariable;
}) => {
  return (
    <>
      <TableRow>
        <TableCell>{capitalize(boundVar)}</TableCell>
        <TableCell>{variable.name}</TableCell>
        <TableCell className="font-mono">
          <ResolvedValue resolvedValue={variable.resolvedValue} />
        </TableCell>
      </TableRow>
      {false && (
        <TableRow>
          <TableCell colSpan={3}>
            <Logger data={variable} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const BoundVariablesTable = ({ boundVariables, variables }) => {
  const deduped = shouldCollapseRadius({ ...boundVariables })
    ? collapsRadius({ ...boundVariables })
    : boundVariables;

  return Object.keys(boundVariables).length === 0 ? (
    <EmptyAlert
      title={"No bound variables"}
      description={"This node isn't using any variables currently"}
    />
  ) : (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Attribute</TableHead>
            <TableHead>Variable Name</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(deduped).map((boundVar) =>
            typeof deduped[boundVar].length === "number" ? (
              deduped[boundVar].map((bVar) => (
                <BoundVariableTableRow
                  key={`var-${bVar.id}`}
                  boundVar={boundVar}
                  variable={variables[bVar.id]}
                />
              ))
            ) : (
              <BoundVariableTableRow
                key={`boundVar-${boundVar}`}
                boundVar={boundVar}
                variable={variables[deduped[boundVar].id]}
              />
            )
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default BoundVariablesTable;
