import { Settings } from "lucide-react";
import SettingsPane from "./settings-pane";
import { Button } from "./ui/button";
import { Drawer, DrawerTrigger, DrawerContent } from "./ui/drawer";

const SettingsDrawer = () => {
  // postToFigma({
  //   type: "notifiy",
  //   payload: {
  //     message: "Latest Variables Received",
  //   },
  // });

  return (
    <div className="grow flex justify-end">
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <Button variant="ghost" size="sm" className="">
            <Settings
              className="transition-transform hover:-rotate-45"
              aria-label="Open Settings"
            />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <SettingsPane />
        </DrawerContent>
      </Drawer>
    </div>
  );
};
export default SettingsDrawer;
