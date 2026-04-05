import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getDashboardStats() {
  const [scheduled, inProgress, completed, openDeviations] = await Promise.all([
    prisma.scheduledInspection.count({ where: { status: "SCHEDULED" } }),
    prisma.scheduledInspection.count({ where: { status: "IN_PROGRESS" } }),
    prisma.scheduledInspection.count({ where: { status: "COMPLETED" } }),
    prisma.deviation.count({ where: { status: "OPEN" } }),
  ]);
  return { scheduled, inProgress, completed, openDeviations };
}

export async function getScheduledInspections(skip: number, take: number, search: string) {
  const where = search
    ? {
        OR: [
          { inspectionNo: { contains: search, mode: "insensitive" as const } },
          { location: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};
  const [data, total] = await Promise.all([
    prisma.scheduledInspection.findMany({
      where,
      skip,
      take,
      include: { assignedTo: true },
      orderBy: { scheduledDate: "desc" },
    }),
    prisma.scheduledInspection.count({ where }),
  ]);
  return { data, total };
}

export async function getScheduledInspection(id: string) {
  return prisma.scheduledInspection.findUnique({
    where: { id },
    include: {
      assignedTo: true,
      checklists: true,
      deviations: true,
    },
  });
}

export async function createScheduledInspection(data: Record<string, unknown>) {
  return prisma.scheduledInspection.create({
    data: data as Parameters<typeof prisma.scheduledInspection.create>[0]["data"],
  });
}

export async function updateScheduledInspection(id: string, data: Record<string, unknown>) {
  return prisma.scheduledInspection.update({
    where: { id },
    data: data as Parameters<typeof prisma.scheduledInspection.update>[0]["data"],
  });
}

export async function getChecklists(skip: number, take: number, search: string) {
  const where = search
    ? { name: { contains: search, mode: "insensitive" as const } }
    : {};
  const [data, total] = await Promise.all([
    prisma.inspectionChecklist.findMany({
      where,
      skip,
      take,
      include: { items: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.inspectionChecklist.count({ where }),
  ]);
  return { data, total };
}

export async function createChecklist(data: Record<string, unknown>) {
  return prisma.inspectionChecklist.create({
    data: data as Parameters<typeof prisma.inspectionChecklist.create>[0]["data"],
  });
}

export async function getDeviations(skip: number, take: number, search: string) {
  const where = search
    ? {
        OR: [
          { deviationNo: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};
  const [data, total] = await Promise.all([
    prisma.deviation.findMany({
      where,
      skip,
      take,
      include: { inspection: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.deviation.count({ where }),
  ]);
  return { data, total };
}

export async function updateDeviation(id: string, data: Record<string, unknown>) {
  return prisma.deviation.update({
    where: { id },
    data: data as Parameters<typeof prisma.deviation.update>[0]["data"],
  });
}
