import { CircleDashed } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

const EmptyAlert = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <Alert>
      <CircleDashed className="h-4 w-4 animate-ping" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="text-muted-foreground">
        {description}
      </AlertDescription>
    </Alert>
  );
};

export default EmptyAlert;
