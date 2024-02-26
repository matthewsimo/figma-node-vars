import { LogElement } from "./logger";
import { useFigmaData } from "@/hooks";

const Header = () => {
  const { selection } = useFigmaData();

  const selectionSummary = `${selection.length} node${
    selection.length > 1 ? "s" : ""
  } selected`;

  return (
    <LogElement>
      <header className="flex gap-4 items-baseline pb-4">
        <h1 className="font-bold text-3xl">Node Vars</h1>
        {selection.length > 0 && <p>{selectionSummary}</p>}
      </header>
    </LogElement>
  );
};
export default Header;
