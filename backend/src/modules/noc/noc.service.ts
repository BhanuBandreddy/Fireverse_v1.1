import { prisma } from "../../lib/prisma";

export async function getDashboardStats() {
  const [total, pending, approved, underReview] = await Promise.all([
    prisma.nOCApplication.count(),
    prisma.nOCApplication.count({ where: { status: "PENDING" } }),
    prisma.nOCApplication.count({ where: { status: "APPROVED" } }),
    prisma.nOCApplication.count({ where: { status: "UNDER_REVIEW" } }),
  ]);
  return { total, pending, approved, underReview };
}

export async function getApplications(skip: number, take: number, search: string) {
  const where = search
    ? {
        OR: [
          { applicantName: { contains: search, mode: "insensitive" as const } },
          { applicationNo: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};
  const [data, total] = await Promise.all([
    prisma.nOCApplication.findMany({ where, skip, take, orderBy: { createdAt: "desc" } }),
    prisma.nOCApplication.count({ where }),
  ]);
  return { data, total };
}

export async function getApplication(id: string) {
  return prisma.nOCApplication.findUnique({
    where: { id },
    include: { documents: true, payments: true, inspections: true },
  });
}

export async function createApplication(data: Record<string, unknown>) {
  return prisma.nOCApplication.create({
    data: data as Parameters<typeof prisma.nOCApplication.create>[0]["data"],
  });
}

export async function updateApplication(id: string, data: Record<string, unknown>) {
  return prisma.nOCApplication.update({
    where: { id },
    data: data as Parameters<typeof prisma.nOCApplication.update>[0]["data"],
  });
}

export async function deleteApplication(id: string) {
  return prisma.nOCApplication.delete({ where: { id } });
}

export async function getCertificates(skip: number, take: number) {
  const [data, total] = await Promise.all([
    prisma.nOCCertificate.findMany({ skip, take, orderBy: { issuedAt: "desc" } }),
    prisma.nOCCertificate.count(),
  ]);
  return { data, total };
}

export async function getFees(skip: number, take: number) {
  const [data, total] = await Promise.all([
    prisma.nOCFee.findMany({ skip, take, orderBy: { effectiveFrom: "desc" } }),
    prisma.nOCFee.count(),
  ]);
  return { data, total };
}
