import { prisma } from "../../lib/prisma";


export async function getDashboardStats() {
  const [requested, planned, scheduled, completed] = await Promise.all([
    prisma.drill.count({ where: { status: "REQUESTED" } }),
    prisma.drill.count({ where: { status: "PLANNED" } }),
    prisma.drill.count({ where: { status: "SCHEDULED" } }),
    prisma.drill.count({ where: { status: "COMPLETED" } }),
  ]);
  return { requested, planned, scheduled, completed };
}

export async function getDrills(skip: number, take: number, search: string) {
  const where = search
    ? {
        OR: [
          { drillNo: { contains: search, mode: "insensitive" as const } },
          { title: { contains: search, mode: "insensitive" as const } },
          { location: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};
  const [data, total] = await Promise.all([
    prisma.drill.findMany({
      where,
      skip,
      take,
      include: { drillType: true, coordinator: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.drill.count({ where }),
  ]);
  return { data, total };
}

export async function getDrill(id: string) {
  return prisma.drill.findUnique({
    where: { id },
    include: {
      drillType: true,
      coordinator: true,
      participants: true,
      observations: true,
    },
  });
}

export async function createDrill(data: Record<string, unknown>) {
  return prisma.drill.create({
    data: data as Parameters<typeof prisma.drill.create>[0]["data"],
  });
}

export async function updateDrill(id: string, data: Record<string, unknown>) {
  return prisma.drill.update({
    where: { id },
    data: data as Parameters<typeof prisma.drill.update>[0]["data"],
  });
}

export async function getDrillTypes() {
  return prisma.drillType.findMany({ orderBy: { name: "asc" } });
}
