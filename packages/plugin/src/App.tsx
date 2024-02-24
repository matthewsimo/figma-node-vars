import { useCallback, useEffect, useRef } from "react";
import { UIPostMessage, postToFigma } from "./common/msg";
import { useAppState, useDispatch, useFigmaData } from "./hooks";
import BoundVariablesTable from "./components/bound-variables-table";
import Logger from "./components/logger";
import EmptyAlert from "./components/empty-alert";

function App() {
  const dispatch = useDispatch();
  const mainRef = useRef<HTMLDivElement>(null);

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
          loading: false,
        },
      });

      if (!initialized) {
        dispatch({
          type: "SET_INITIALIZED",
        });
      }

      postToFigma({
        type: "notifiy",
        payload: {
          message: "Latest Variables Received",
        },
      });
    },
    [dispatch, initialized]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  // // Request data once mounted
  useEffect(() => {
    postToFigma({ type: "refreshFigmaData" });
    console.log(mainRef);
  }, []);

  useEffect(() => {
    console.log(mainRef);
  }, [mainRef]);

  return (
    <main className="w-full h-screen p-4" ref={mainRef}>
      <h1 className="font-bold text-3xl pb-4">Node Vars</h1>
      <div className="card">
        {selection.length === 0 && (
          <div className="py-6">
            <EmptyAlert
              title={"No nodes selected"}
              description={"Select some nodes and we'll show you variable info"}
            />
          </div>
        )}

        {selection.length > 0 && (
          <ul className="space-y-8">
            {selection.map((node) => {
              return (
                <li key={`node-${node.id}`} className="space-y-2">
                  <header>
                    <h2 className="text-2xl">{node.name}</h2>
                    <p className="text-muted-foreground">
                      ID: {node.id} - Type: {node.type}
                    </p>
                  </header>
                  <div>
                    <BoundVariablesTable
                      boundVariables={node.boundVariables}
                      variables={node.variables}
                    />
                  </div>
                  {false && <Logger data={node} />}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}

export default App;
