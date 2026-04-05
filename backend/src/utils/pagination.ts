export function getPagination(query: Record<string, string | undefined>) {
  const page = Math.max(1, parseInt(query["page"] ?? "1"));
  const limit = Math.min(100, Math.max(1, parseInt(query["limit"] ?? "10")));
  const skip = (page - 1) * limit;
  const search = query["search"] ?? "";
  const sortBy = query["sortBy"] ?? "createdAt";
  const sortOrder: "asc" | "desc" = query["sortOrder"] === "asc" ? "asc" : "desc";
  return { page, limit, skip, search, sortBy, sortOrder };
}
