import { X } from "lucide-react";
import { Button } from "./ui/button";
import { DrawerHeader, DrawerTitle, DrawerClose } from "./ui/drawer";

const SettingsPane = () => {
  // @TODO - build settings pane
  return (
    <>
      <DrawerHeader className="pb-4 flex justify-between items-center">
        <DrawerTitle>Settings</DrawerTitle>

        <DrawerClose asChild>
          <Button variant="ghost" size="sm" className="group">
            <X
              className="transition-transform relative group-hover:top-[1px]"
              aria-label="Close Settings"
            />
          </Button>
        </DrawerClose>
      </DrawerHeader>

      {/*
@TODO - On deck
- [x] ~Copy all~
- [] Refresh Variables
- [] Store Settings Message to call local storage
- [] Float Suffix Text input, 'px'
- [] Use Shorthand Props
- [] Use Logical Properties
- [] Switch output: CSS <-> JSON
*/}

      <div className="flex-col flex justify-stretch">
        <label className="text-lg">Ouput switch: CSS vs JSON</label>
        <label className="text-lg">Float Suffix?</label>
        <label className="text-lg">Use CSS Shorthand Props?</label>
        <label className="text-lg">Use Logical CSS Props?</label>
        <Button className="text-lg">Refresh Variables</Button>
      </div>
    </>
  );
};

export default SettingsPane;
