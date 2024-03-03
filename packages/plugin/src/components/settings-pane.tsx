import { X } from "lucide-react";
import { Button } from "./ui/button";
import { DrawerHeader, DrawerTitle, DrawerClose } from "./ui/drawer";
import { RefreshButton } from "./refresh-button";
import { useSettings } from "@/hooks/appContext";
import SettingsForm from "./settings-form";

const SettingsPane = ({ closeDrawer }: { closeDrawer: () => void }) => {
  const { lastUpdated } = useSettings();

  return (
    <>
      <DrawerHeader className="pb-4 flex justify-between items-center">
        <DrawerTitle>Settings</DrawerTitle>

        <DrawerClose asChild>
          <Button
            variant="ghost"
            size="sm"
            className="group"
            onClick={closeDrawer}
          >
            <X
              className="transition-transform relative group-hover:top-[1px]"
              aria-label="Close Settings"
            />
          </Button>
        </DrawerClose>
      </DrawerHeader>

      <SettingsForm closeDrawer={() => closeDrawer()} />

      <div className="flex flex-col justify-stretch space-y-2">
        <RefreshButton />
        <p className="text-sm text-muted-foreground italic">
          Last updated: {lastUpdated}
        </p>
      </div>
    </>
  );
};

export default SettingsPane;
