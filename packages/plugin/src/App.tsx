import { useCallback, useEffect, useRef } from "react";
import { UIPostMessage, postToFigma } from "./common/msg";
import { useAppState, useDispatch, useFigmaData } from "./hooks";
import EmptyAlert from "./components/empty-alert";
import Header from "./components/header";
import SelectedNode from "./components/selected-node";

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
      <Header />

      <div>
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
              return <SelectedNode key={`node-${node.id}`} node={node} />;
            })}
          </ul>
        )}
      </div>
    </main>
  );
}

export default App;
