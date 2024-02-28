import { X } from "lucide-react";
import { Button } from "./ui/button";
import { DrawerHeader, DrawerTitle, DrawerClose } from "./ui/drawer";
import { RefreshButton } from "./refresh-button";
import { LogElement } from "./logger";
import { useSettings } from "@/hooks";
import { forMS } from "@/common/utils";

const SettingsPane = ({ closeDrawer }) => {
  const { lastUpdated } = useSettings();

  const handleClick = async () => {
    await forMS(250);
    closeDrawer();
  };

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
- [x] Refresh Variables
- [] Store Settings Message to call local storage
- [] Float Suffix Text input, 'px'
- [] Use Shorthand Props
- [] Use Logical Properties


Defer
- [] Switch output: CSS <-> JSON
*/}

      <LogElement>
        <div className="flex-col flex justify-stretch space-y-4 pb-8">
          <h3 className="mb-4 text-lg font-medium">Settings</h3>

          <label className="text-lg">input: Float Suffix?</label>
          <label className="text-lg">switch: Use CSS Shorthand Props?</label>
          <label className="text-lg">switch: Use Logical CSS Props?</label>

          <div className="flex flex-col justify-stretch space-y-2">
            <Button onClick={handleClick}>Save Settings</Button>
          </div>
        </div>

        <div className="flex flex-col justify-stretch space-y-2">
          <RefreshButton />
          <p className="text-sm text-muted-foreground italic">
            Last updated: {lastUpdated}
          </p>
        </div>
      </LogElement>
    </>
  );
};

export default SettingsPane;
