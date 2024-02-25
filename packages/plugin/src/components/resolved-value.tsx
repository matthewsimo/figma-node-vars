import { colorToString } from "@/common/utils";
import { NodeVariable } from "@/common/variables";
import Logger from "./logger";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from "@radix-ui/react-tooltip";

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
            <TooltipContent sideOffset={4} align="end">
              <div className="bg-background/90 p-2 rounded-md">
                <TooltipArrow height={8} width={12} className="opacity-90" />
                <p>{colorToString(value as RGBA)}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <p className="text-2xl">{String(value)}</p>
      )}

      {false && <Logger data={value} />}
    </>
  );
};

export default ResolvedValue;
