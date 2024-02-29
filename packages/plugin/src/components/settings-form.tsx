import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/hooks/appContext";
import { Switch } from "./ui/switch";
import { Check, Loader2, SaveAll } from "lucide-react";
import { useState } from "react";
import { forMS } from "@/common/utils";
import { PluginSettings, postToFigma } from "@/common/msg";

const FormSchema = z.object({
  floatSuffix: z.string().min(1),
  shorthandProps: z.boolean(),
  logicalProps: z.boolean(),
});

const SettingsForm = ({ closeDrawer }: { closeDrawer: () => void }) => {
  const [saveState, setSateState] = useState<
    "initial" | "pending" | "complete"
  >("initial");
  const { shorthandProps, logicalProps, floatSuffix } = useSettings();
  const defaultValues = {
    shorthandProps,
    logicalProps,
    floatSuffix,
  };
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log("submitted:", { data, closeDrawer });
    setSateState("pending");
    postToFigma({
      type: "setStoredSetting",
      payload: data as Omit<PluginSettings, "lastUpdated">,
    });

    await forMS(250);
    setSateState("complete");
    postToFigma({
      type: "notifiy",
      payload: {
        message: "Settings Saved",
      },
    });
    await forMS(500);
    setSateState("initial");

    await forMS(150);
    closeDrawer();
  };

  const iconClasses = "aspect-square w-4 mr-1";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="shorthandProps"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-4">
                <div className="space-y-2">
                  <FormLabel className="text-base">
                    Shorthand Properties
                  </FormLabel>
                  <FormDescription>
                    Use shorthand properties when possible? i.e. 'paddingTop',
                    'paddingBottom' become just 'paddingVertical'
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="logicalProps"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-4">
                <div className="space-y-2">
                  <FormLabel className="text-base">
                    CSS Logical Properties
                  </FormLabel>
                  <FormDescription>
                    Use CSS logical properties when possible? i.e.
                    'padding-block-start' (on) vs. 'padding-top' (off)
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="floatSuffix"
            render={({ field }) => (
              <FormItem className="flex flex-col items-stretch justify-between rounded-lg border p-4 gap-1">
                <FormLabel className="text-base">Float Suffix</FormLabel>
                <FormControl>
                  <Input placeholder="px" {...field} />
                </FormControl>
                <FormDescription>
                  What suffix should be used for float type variables in CSS
                  output?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          disabled={!form.formState.isDirty}
          className="w-full"
          type="submit"
        >
          {saveState === "initial" && <SaveAll className={iconClasses} />}
          {saveState === "pending" && (
            <Loader2
              className={`${iconClasses} animate-spin`}
              aria-label="Save started"
            />
          )}
          {saveState === "complete" && (
            <Check
              className={iconClasses}
              color="#25952A"
              aria-label="Save completed"
            />
          )}
          Save Settings
        </Button>
      </form>
    </Form>
  );
};

export default SettingsForm;
