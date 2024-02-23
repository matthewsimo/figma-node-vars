import { useCallback, useEffect, useRef } from "react";
import { UIPostMessage, postToFigma } from "./common/msg";
import { useAppState, useDispatch, useFigmaData } from "./hooks";

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
      <h1 className="font-bold text-2xl pb-4">Node Vars</h1>
      <div className="card">
        {selection.length === 0 && <p>No nodes selected</p>}

        {selection.length > 0 && (
          <ul>
            {selection.map((node) => {
              return (
                <li key={`node-${node.id}`}>
                  <header>
                    <h3>{node.name}</h3>
                    <p>
                      ID: {node.id} - Type: {node.type}
                    </p>
                  </header>
                  <div>
                    {Object.keys(node.boundVariables).length === 0 ? (
                      <p>No bound variables</p>
                    ) : (
                      <ul>
                        {Object.keys(node.boundVariables).map((boundVar) => {
                          return (
                            <li key={`bound-var-key-${boundVar}`}>
                              <h4>{boundVar}</h4>
                              {typeof node.boundVariables[boundVar].length ===
                              "number" ? (
                                <>
                                  {node.boundVariables[boundVar].map(
                                    ({ id }) => (
                                      <>
                                        <pre>
                                          {JSON.stringify(
                                            node.variables[id],
                                            undefined,
                                            2
                                          )}
                                        </pre>
                                      </>
                                    )
                                  )}
                                </>
                              ) : (
                                <>
                                  <pre>
                                    {JSON.stringify(
                                      node.variables[
                                        node.boundVariables[boundVar].id
                                      ],
                                      undefined,
                                      2
                                    )}
                                  </pre>
                                </>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                  {false && (
                    <div className="">
                      <pre>{JSON.stringify(node, undefined, 2)}</pre>
                    </div>
                  )}
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
