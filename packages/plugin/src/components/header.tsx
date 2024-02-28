import { useFigmaData } from "@/hooks";
import SettingsDrawer from "./settings-drawer";

const Header = () => {
  const { selection } = useFigmaData();

  const selectionSummary = `${selection.length} node${
    selection.length > 1 ? "s" : ""
  } selected`;

  return (
    <header className="flex gap-4 items-baseline pb-4">
      <h1 className="font-bold text-3xl">Node Vars</h1>
      {selection.length > 0 && <p>{selectionSummary}</p>}
      <SettingsDrawer />
    </header>
  );
};
export default Header;
