import { Tag } from "@carbon/react";

type TagType = "green" | "red" | "blue" | "gray" | "warm-gray" | "teal" | "purple" | "cyan" | "magenta";

const statusMap: Record<string, TagType> = {
  ACTIVE: "green",
  APPROVED: "green",
  COMPLETED: "green",
  CLOSED: "green",
  PENDING: "blue",
  SCHEDULED: "blue",
  IN_PROGRESS: "teal",
  PLANNED: "teal",
  ONGOING: "teal",
  UNDER_REVIEW: "cyan",
  INACTIVE: "gray",
  CANCELLED: "gray",
  SUSPENDED: "warm-gray",
  REJECTED: "red",
  OPEN: "red",
  REQUESTED: "magenta",
  CRITICAL: "red",
  HIGH: "magenta",
  MEDIUM: "blue",
  LOW: "gray",
  OFFLINE: "warm-gray",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Tag type={statusMap[status] ?? "gray"}>
      {status.replace(/_/g, " ")}
    </Tag>
  );
}
