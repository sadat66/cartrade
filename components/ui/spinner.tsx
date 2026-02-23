import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

function Spinner({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"svg"> & {
  size?: "sm" | "default" | "lg";
}) {
  const sizeClass = {
    sm: "size-4",
    default: "size-6",
    lg: "size-8",
  };
  return (
    <Loader2
      aria-hidden
      className={cn("animate-spin text-current", sizeClass[size], className)}
      {...props}
    />
  );
}

export { Spinner };
