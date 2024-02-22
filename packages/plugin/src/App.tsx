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

  // Request data once mounted
  useEffect(() => {
    postToFigma({ type: "refreshFigmaData" });
    console.log(mainRef);
  }, []);

  return (
    <main className="w-full h-screen p-4" ref={mainRef}>
      <h1 className="font-bold text-2xl pb-4">Figma Node Vars</h1>
      <div className="card">
        {selection.length === 0 && <p>No nodes selected</p>}

        {selection.length > 0 && (
          <ul>
            {selection.map((node) => {
              return (
                <li>
                  <header>
                    <h3>{node.name}</h3>
                    <p>
                      ID: {node.id} - Type: {node.type}
                    </p>
                  </header>
                  {true && (
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
