import { Settings } from "lucide-react";
import SettingsPane from "./settings-pane";
import { Button } from "./ui/button";
import { Drawer, DrawerTrigger, DrawerContent } from "./ui/drawer";
import { useState } from "react";

const SettingsDrawer = () => {
  const [isOpen, setOpen] = useState<boolean>();

  const closeDrawer = () => setOpen(false);

  return (
    <div className="grow flex justify-end">
      <Drawer direction="right" open={isOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className=""
            onClick={() => setOpen(true)}
          >
            <Settings
              className="transition-transform hover:-rotate-45"
              aria-label="Open Settings"
            />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <SettingsPane closeDrawer={closeDrawer} />
        </DrawerContent>
      </Drawer>
    </div>
  );
};
export default SettingsDrawer;
