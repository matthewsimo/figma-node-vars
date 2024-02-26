import EmptyAlert from "./empty-alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import ResolvedValue from "./resolved-value";
import { NodeVariable, nodeVarString } from "@/common/variables";
import { capitalize, forMS, handleCopy } from "@/common/utils";
import { Button } from "./ui/button";
import { Check, Copy, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { LogData } from "./logger";

const BoundVariableTableRow = ({
  boundVar,
  variable,
}: {
  boundVar: string;
  variable: NodeVariable;
}) => {
  const textareaEl = useRef<HTMLTextAreaElement>(null);

  const [copyState, setCopyState] = useState<
    "initial" | "pending" | "complete"
  >("initial");
  const handleClick = async () => {
    if (copyState === "initial") {
      setCopyState("pending");
      handleCopy(textareaEl, nodeVarString(boundVar, variable), variable.name);

      await forMS(250);
      setCopyState("complete");

      await forMS(500);
      setCopyState("initial");
    }
  };

  const iconClasses = `aspect-square w-4`;
  return (
    <>
      <TableRow>
        <TableCell width={"35%"}>{capitalize(boundVar)}</TableCell>
        <TableCell width={"50%"}>{variable.name}</TableCell>
        <TableCell width={"10%"} className="font-mono text-right">
          <ResolvedValue resolvedValue={variable.resolvedValue} />
        </TableCell>
        <TableCell width={"5%"} align="right">
          <Button
            disabled={copyState !== "initial"}
            size="xs"
            variant="ghost"
            onClick={handleClick}
          >
            {copyState === "pending" && (
              <Loader2
                className={`${iconClasses} animate-spin`}
                color="#EAAB31"
                aria-label="Copy started"
              />
            )}
            {copyState === "complete" && (
              <Check
                className={iconClasses}
                color="#25952A"
                aria-label="Copy completed"
              />
            )}
            {copyState === "initial" && (
              <Copy className={iconClasses} aria-label="Copy value" />
            )}
          </Button>
          <textarea
            ref={textareaEl}
            readOnly
            className="opacity-0 absolute w-[1px] h-[1px]"
            value={nodeVarString(boundVar, variable)}
          />
        </TableCell>
      </TableRow>
      {false && (
        <TableRow>
          <TableCell colSpan={3}>
            <LogData data={variable} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const BoundVariablesTable = ({ boundVariables, variables }) => {
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
      </Table>
    </>
  );
};

export default BoundVariablesTable;
