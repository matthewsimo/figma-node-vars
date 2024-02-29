import { Check, RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";
import { postToFigma } from "@/common/msg";
import { useDispatch } from "@/hooks/appContext";
import { useState } from "react";
import { forMS } from "@/common/utils";

export const RefreshButton = () => {
  const [refreshState, setRefreshState] = useState<
    "initial" | "pending" | "complete"
  >("initial");
  const dispatch = useDispatch();

  const handleRefreshClick = async () => {
    setRefreshState("pending");
    dispatch({
      type: "SET_LOADING",
      payload: {
        isLoading: true,
      },
    });
    postToFigma({ type: "refreshFigmaData" });

    await forMS(250);
    postToFigma({
      type: "notifiy",
      payload: {
        message: "Latest Variables Received",
      },
    });
    setRefreshState("complete");

    await forMS(500);
    setRefreshState("initial");
  };

  const iconClasses = `aspect-square w-4 mr-1`;

  return (
    <Button
      className="group"
      variant="outline"
      onClick={handleRefreshClick}
      disabled={refreshState !== "initial"}
    >
      {refreshState === "complete" ? (
        <Check
          className={iconClasses}
          color="#25952A"
          aria-label="Copy completed"
        />
      ) : (
        <RefreshCcw
          className={`${iconClasses} ${
            refreshState === "pending"
              ? "animate-spin"
              : "group-hover:animate-spin-slow"
          }`}
        />
      )}
      Refresh Variables
    </Button>
  );
};
