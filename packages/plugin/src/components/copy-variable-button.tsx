import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { forMS, handleCopy } from "@/common/utils";
import { Check, Copy, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const CopyVariableButton = ({ value, name, title }) => {
  const textareaEl = useRef<HTMLTextAreaElement>(null);

  const [copyState, setCopyState] = useState<
    "initial" | "pending" | "complete"
  >("initial");
  const handleClick = async () => {
    if (copyState === "initial") {
      setCopyState("pending");
      handleCopy(textareaEl, value, name);

      await forMS(250);
      setCopyState("complete");

      await forMS(500);
      setCopyState("initial");
    }
  };

  const iconClasses = `aspect-square w-4`;
  return (
    <>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
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
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8} align="center">
            <div className="bg-background/90 p-2 rounded-md">
              <p>{title}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <textarea
        ref={textareaEl}
        readOnly
        className="opacity-0 absolute w-[1px] h-[1px]"
        value={value}
      />
    </>
  );
};
export default CopyVariableButton;
