// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Logger = ({ data }: { data: any }) => (
  <pre>{JSON.stringify(data, undefined, 2)}</pre>
);

export default Logger;
