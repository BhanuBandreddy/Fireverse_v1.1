import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getDashboardStats() {
  const now = new Date();
  const [total, active, inspectionsDue, openDiscrepancies] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { status: "ACTIVE" } }),
    prisma.vehicle.count({ where: { nextInspectionDate: { lte: now } } }),
    prisma.vehicleDiscrepancy.count({ where: { status: "OPEN" } }),
  ]);
  return { total, active, inspectionsDue, openDiscrepancies };
}

export async function getVehicles(skip: number, take: number, search: string) {
  const where = search
    ? {
        OR: [
          { registrationNo: { contains: search, mode: "insensitive" as const } },
          { make: { contains: search, mode: "insensitive" as const } },
          { model: { contains: search, mode: "insensitive" as const } },
          { vehicleType: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};
  const [data, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.vehicle.count({ where }),
  ]);
  return { data, total };
}

export async function getVehicle(id: string) {
  return prisma.vehicle.findUnique({
    where: { id },
    include: {
      inspections: true,
      discrepancies: true,
    },
  });
}

export async function createVehicle(data: Record<string, unknown>) {
  return prisma.vehicle.create({
    data: data as Parameters<typeof prisma.vehicle.create>[0]["data"],
  });
}

export async function updateVehicle(id: string, data: Record<string, unknown>) {
  return prisma.vehicle.update({
    where: { id },
    data: data as Parameters<typeof prisma.vehicle.update>[0]["data"],
  });
}

export async function getInspections(skip: number, take: number, search: string) {
  const where = search
    ? {
        OR: [
          { inspectionNo: { contains: search, mode: "insensitive" as const } },
          { vehicle: { registrationNo: { contains: search, mode: "insensitive" as const } } },
        ],
      }
    : {};
  const [data, total] = await Promise.all([
    prisma.vehicleInspection.findMany({
      where,
      skip,
      take,
      include: { vehicle: true },
      orderBy: { inspectionDate: "desc" },
    }),
    prisma.vehicleInspection.count({ where }),
  ]);
  return { data, total };
}

export async function createInspection(data: Record<string, unknown>) {
  return prisma.vehicleInspection.create({
    data: data as Parameters<typeof prisma.vehicleInspection.create>[0]["data"],
  });
}

export async function getDiscrepancies(skip: number, take: number, search: string) {
  const where = search
    ? {
        OR: [
          { description: { contains: search, mode: "insensitive" as const } },
          { vehicle: { registrationNo: { contains: search, mode: "insensitive" as const } } },
        ],
      }
    : {};
  const [data, total] = await Promise.all([
    prisma.vehicleDiscrepancy.findMany({
      where,
      skip,
      take,
      include: { vehicle: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.vehicleDiscrepancy.count({ where }),
  ]);
  return { data, total };
}

export async function getGPSLogs(vehicleId: string) {
  return prisma.vehicleGPSLog.findMany({
    where: { vehicleId },
    orderBy: { timestamp: "desc" },
    take: 100,
  });
}
