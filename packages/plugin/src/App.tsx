import { useCallback, useEffect } from "react";
import { UIPostMessage } from "./common/msg";
import { useAppState, useDispatch, useFigmaData } from "./hooks/appContext";
import EmptyAlert from "./components/empty-alert";
import SelectedNode from "./components/selected-node";
import { ScrollArea } from "./components/ui/scroll-area";
import { LogElement } from "./components/logger";
import Header from "./components/header";

function App() {
  const dispatch = useDispatch();

  const { initialized } = useAppState();
  const { selection } = useFigmaData();

  const handleMessage = useCallback(
    (msg: UIPostMessage) => {
      true && console.log({ handleMessage: true, msg });

      dispatch({
        type: "UPDATE_FIGMA_DATA",
        payload: {
          ...msg.data.pluginMessage,
        },
      });

      dispatch({
        type: "SET_LOADING",
        payload: {
          isLoading: false,
        },
      });

      if (!initialized) {
        dispatch({
          type: "SET_INITIALIZED",
        });
      }
    },
    [dispatch, initialized]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  return (
    <LogElement>
      <main>
        <ScrollArea className="w-full h-screen px-4">
          <div className="py-4">
            <Header />

            <div>
              {selection.length === 0 && (
                <div className="py-6">
                  <EmptyAlert
                    title={"No nodes selected"}
                    description={
                      "Select some nodes and we'll show you variable info"
                    }
                  />
                </div>
              )}

              {selection.length > 0 && (
                <ul className="space-y-8">
                  {selection.map((node) => {
                    return <SelectedNode key={`node-${node.id}`} node={node} />;
                  })}
                </ul>
              )}
            </div>
          </div>
        </ScrollArea>
      </main>
    </LogElement>
  );
}

export default App;
