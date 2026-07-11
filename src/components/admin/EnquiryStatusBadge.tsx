import type { EnquiryStatus } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";

const statusVariant: Record<
  EnquiryStatus,
  "default" | "accent" | "success" | "warning" | "muted"
> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "muted",
  CONTACTED: "accent",
  CLOSED: "default",
  SPAM: "muted",
};

export function EnquiryStatusBadge({ status }: { status: EnquiryStatus }) {
  return <Badge variant={statusVariant[status]}>{status}</Badge>;
}
