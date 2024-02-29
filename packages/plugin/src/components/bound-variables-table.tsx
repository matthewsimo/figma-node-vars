import EmptyAlert from "./empty-alert";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import ResolvedValue from "./resolved-value";
import { NodeVariable } from "@/common/variables";
import { capitalize } from "@/common/utils";
import { LogData } from "./logger";
import CopyVariableButton from "./copy-variable-button";
import { NormalizedSelection } from "@/common/selection";
import { useNodeVarString, useNodeVarsString } from "@/hooks/variables";
import { useCollapseNodeFields } from "@/hooks/selection";

const BoundVariableTableRow = ({
  boundVar,
  variable,
}: {
  boundVar: string;
  variable: NodeVariable;
}) => {
  const nodeVarString = useNodeVarString(boundVar, variable);
  return (
    <>
      <TableRow>
        <TableCell width={"35%"}>{capitalize(boundVar)}</TableCell>
        <TableCell width={"50%"}>{variable.name}</TableCell>
        <TableCell width={"10%"} className="font-mono text-right">
          <ResolvedValue resolvedValue={variable.resolvedValue} />
        </TableCell>
        <TableCell width={"5%"} align="right">
          <CopyVariableButton
            title={`Copy ${variable.name}`}
            value={nodeVarString}
            name={variable.name}
          />
        </TableCell>
      </TableRow>
      {false && (
        <TableRow>
          <TableCell colSpan={4}>
            <LogData data={variable} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const BoundVariablesTableFooter = ({ node }) => {
  const { variables } = node;
  const boundVariables = useCollapseNodeFields(node.boundVariables);
  const nodeVarsString = useNodeVarsString(boundVariables, variables);
  return Object.keys(boundVariables).length > 1 ? (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={4} align="right">
          <CopyVariableButton
            title={`Copy ${Object.keys(boundVariables).length} variables on '${
              node.name
            }'`}
            value={nodeVarsString}
            name={`'${node.name}' variables`}
          />
        </TableCell>
      </TableRow>
    </TableFooter>
  ) : null;
};

const BoundVariablesTable = ({ node }: { node: NormalizedSelection }) => {
  const { variables } = node;
  const boundVariables = useCollapseNodeFields(node.boundVariables);
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
            <TableHead>Attribute</TableHead>
            <TableHead>Variable Name</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(boundVariables).map((boundVar) =>
            typeof boundVariables[boundVar].length === "number" ? (
              boundVariables[boundVar].map((bVar) => (
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
                variable={variables[boundVariables[boundVar].id]}
              />
            )
          )}
        </TableBody>
        <BoundVariablesTableFooter node={node} />
      </Table>
    </>
  );
};

export default BoundVariablesTable;
