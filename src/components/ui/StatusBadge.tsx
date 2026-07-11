import { Badge } from "@/components/ui/Badge";
import type { ProjectStatus } from "@/types";

const statusConfig: Record<
  ProjectStatus,
  { label: string; variant: "success" | "muted" | "accent" | "warning" }
> = {
  live: { label: "Live", variant: "success" },
  private: { label: "Private", variant: "muted" },
  prototype: { label: "Prototype", variant: "accent" },
  "in-development": { label: "In Development", variant: "warning" },
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
