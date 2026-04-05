import { prisma } from "../../lib/prisma";


export async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [open, inProgress, closedToday, critical] = await Promise.all([
    prisma.incident.count({ where: { status: "OPEN" } }),
    prisma.incident.count({ where: { status: "IN_PROGRESS" } }),
    prisma.incident.count({
      where: { status: "CLOSED", closedAt: { gte: today, lt: tomorrow } },
    }),
    prisma.incident.count({ where: { severity: "CRITICAL" } }),
  ]);
  return { open, inProgress, closedToday, critical };
}

export async function getIncidents(skip: number, take: number, search: string) {
  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { incidentNo: { contains: search, mode: "insensitive" as const } },
          { location: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};
  const [data, total] = await Promise.all([
    prisma.incident.findMany({
      where,
      skip,
      take,
      include: { type: true, category: true, reportedBy: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.incident.count({ where }),
  ]);
  return { data, total };
}

export async function getIncident(id: string) {
  return prisma.incident.findUnique({
    where: { id },
    include: {
      type: true,
      category: true,
      reportedBy: true,
      actions: true,
      attachments: true,
    },
  });
}

export async function createIncident(data: Record<string, unknown>) {
  return prisma.incident.create({
    data: data as Parameters<typeof prisma.incident.create>[0]["data"],
  });
}

export async function updateIncident(id: string, data: Record<string, unknown>) {
  return prisma.incident.update({
    where: { id },
    data: data as Parameters<typeof prisma.incident.update>[0]["data"],
  });
}

export async function closeIncident(id: string) {
  return prisma.incident.update({
    where: { id },
    data: { status: "CLOSED", closedAt: new Date() },
  });
}

export async function getIncidentTypes() {
  return prisma.incidentType.findMany({ orderBy: { name: "asc" } });
}

export async function getIncidentCategories() {
  return prisma.incidentCategory.findMany({ orderBy: { name: "asc" } });
}
