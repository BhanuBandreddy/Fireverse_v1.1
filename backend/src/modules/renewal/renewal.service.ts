import { prisma } from "../../lib/prisma";


export async function getDashboardStats() {
  const [firms, applications, pending, approved] = await Promise.all([
    prisma.firm.count(),
    prisma.renewalApplication.count(),
    prisma.renewalApplication.count({ where: { status: "PENDING" } }),
    prisma.renewalApplication.count({ where: { status: "APPROVED" } }),
  ]);
  return { firms, applications, pending, approved };
}

export async function getFirms(skip: number, take: number, search: string) {
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { registrationNo: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};
  const [data, total] = await Promise.all([
    prisma.firm.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.firm.count({ where }),
  ]);
  return { data, total };
}

export async function createFirm(data: Record<string, unknown>) {
  return prisma.firm.create({
    data: data as Parameters<typeof prisma.firm.create>[0]["data"],
  });
}

export async function getApplications(skip: number, take: number, search: string) {
  const where = search
    ? {
        OR: [
          { applicationNo: { contains: search, mode: "insensitive" as const } },
          { firm: { name: { contains: search, mode: "insensitive" as const } } },
        ],
      }
    : {};
  const [data, total] = await Promise.all([
    prisma.renewalApplication.findMany({
      where,
      skip,
      take,
      include: { firm: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.renewalApplication.count({ where }),
  ]);
  return { data, total };
}

export async function getApplication(id: string) {
  return prisma.renewalApplication.findUnique({
    where: { id },
    include: { firm: true, documents: true, payments: true },
  });
}

export async function createApplication(data: Record<string, unknown>) {
  return prisma.renewalApplication.create({
    data: data as Parameters<typeof prisma.renewalApplication.create>[0]["data"],
  });
}

export async function updateApplication(id: string, data: Record<string, unknown>) {
  return prisma.renewalApplication.update({
    where: { id },
    data: data as Parameters<typeof prisma.renewalApplication.update>[0]["data"],
  });
}
