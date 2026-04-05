import { prisma } from "../../lib/prisma";


export async function getDashboardStats() {
  const [planned, inProgress, completed, criticalObs] = await Promise.all([
    prisma.audit.count({ where: { status: "PLANNED" } }),
    prisma.audit.count({ where: { status: "IN_PROGRESS" } }),
    prisma.audit.count({ where: { status: "COMPLETED" } }),
    prisma.auditObservation.count({ where: { severity: "CRITICAL", status: "OPEN" } }),
  ]);
  return { planned, inProgress, completed, criticalObs };
}

export async function getAudits(skip: number, take: number, search: string) {
  const where = search
    ? {
        OR: [
          { auditNo: { contains: search, mode: "insensitive" as const } },
          { title: { contains: search, mode: "insensitive" as const } },
          { auditedEntity: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};
  const [data, total] = await Promise.all([
    prisma.audit.findMany({
      where,
      skip,
      take,
      include: { inspectionType: true, leadAuditor: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.audit.count({ where }),
  ]);
  return { data, total };
}

export async function getAudit(id: string) {
  return prisma.audit.findUnique({
    where: { id },
    include: {
      inspectionType: true,
      leadAuditor: true,
      observations: true,
      attachments: true,
    },
  });
}

export async function createAudit(data: Record<string, unknown>) {
  return prisma.audit.create({
    data: data as Parameters<typeof prisma.audit.create>[0]["data"],
  });
}

export async function updateAudit(id: string, data: Record<string, unknown>) {
  return prisma.audit.update({
    where: { id },
    data: data as Parameters<typeof prisma.audit.update>[0]["data"],
  });
}

export async function getObservations(skip: number, take: number, search: string) {
  const where = search
    ? {
        OR: [
          { observationNo: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
          { audit: { auditNo: { contains: search, mode: "insensitive" as const } } },
        ],
      }
    : {};
  const [data, total] = await Promise.all([
    prisma.auditObservation.findMany({
      where,
      skip,
      take,
      include: { audit: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.auditObservation.count({ where }),
  ]);
  return { data, total };
}

export async function createObservation(data: Record<string, unknown>) {
  return prisma.auditObservation.create({
    data: data as Parameters<typeof prisma.auditObservation.create>[0]["data"],
  });
}

export async function closeObservation(id: string) {
  return prisma.auditObservation.update({
    where: { id },
    data: { status: "CLOSED", closedAt: new Date() },
  });
}

export async function getInspectionTypes() {
  return prisma.auditInspectionType.findMany({ orderBy: { name: "asc" } });
}
