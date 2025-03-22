import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "up" | "down" | "degraded";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "capitalize",
        status === "up" && "bg-green-100 text-green-800",
        status === "down" && "bg-red-100 text-red-800",
        status === "degraded" && "bg-yellow-100 text-yellow-800"
      )}
    >
      {status}
    </Badge>
  );
}
