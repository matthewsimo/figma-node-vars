import { colorToString } from "@/common/utils";
import { NodeVariable } from "@/common/variables";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const ResolvedValue = ({
  resolvedValue,
}: {
  resolvedValue: NodeVariable["resolvedValue"];
}) => {
  const { value, resolvedType } = resolvedValue;

  return (
    <>
      {resolvedType === "COLOR" ? (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                style={{ backgroundColor: colorToString(value as RGBA) }}
                className="w-6 align-bottom aspect-square rounded-sm inline-block border"
                title={colorToString(value as RGBA)}
              />
            </TooltipTrigger>
            <TooltipContent sideOffset={8} align="end" alignOffset={-8}>
              <div className="bg-background/90 p-2 rounded-md">
                <p>{colorToString(value as RGBA)}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <p className="text-xl">{String(value)}</p>
      )}
    </>
  );
};

export default ResolvedValue;
