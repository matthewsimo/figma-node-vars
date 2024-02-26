import { useEffect, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LogData = ({ data }: { data: any }) => (
  <pre>{JSON.stringify(data, undefined, 2)}</pre>
);

export const LogElement = ({ children }) => {
  const ref = useRef();
  useEffect(() => console.log(ref?.current), []);
  return <div ref={ref}>{children}</div>;
};
