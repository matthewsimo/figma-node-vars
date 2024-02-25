import { useFigmaData } from "@/hooks";

const Header = () => {
  const { selection } = useFigmaData();

  const selectionSummary = `${selection.length} selected node${
    selection.length > 1 ? "s" : ""
  }`;
  return (
    <header className="flex justify-between items-center">
      <h1 className="font-bold text-3xl pb-4">Node Vars</h1>
      {selection.length > 0 && <p>{selectionSummary}</p>}
    </header>
  );
};
export default Header;
