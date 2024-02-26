import { NormalizedSelection, collapseNodeFields } from "@/common/selection";
import BoundVariablesTable from "./bound-variables-table";
import { pluralize } from "@/common/utils";

const SelectedNode = ({ node }: { node: NormalizedSelection }) => {
  const boundVariables = collapseNodeFields(node.boundVariables);

  const boundCount = Object.keys(boundVariables).length;
  const boundSummary = `${pluralize("Attribute", boundCount)}: ${boundCount}`;
  const varCount = Object.keys(node.variables).length;
  const variableSummary = `${pluralize("Variable", varCount)}: ${varCount}`;

  return (
    <li className="space-y-2">
      <header>
        <h2 className="text-2xl">{node.name}</h2>
        <div className="flex justify-between text-muted-foreground">
          <p>
            ID: {node.id} - Type: {node.type}
            {boundCount > 0 && ` - ${boundSummary}`}
            {varCount > 0 && ` - ${variableSummary}`}
          </p>
        </div>
      </header>
      <div>
        <BoundVariablesTable
          boundVariables={boundVariables}
          variables={node.variables}
        />
      </div>
    </li>
  );
};

export default SelectedNode;
