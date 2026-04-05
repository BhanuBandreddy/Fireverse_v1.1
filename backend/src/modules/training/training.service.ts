import { prisma } from "../../lib/prisma";


export async function getDashboardStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const [scheduled, courses, attendees, thisMonth] = await Promise.all([
    prisma.trainingSchedule.count({ where: { status: "SCHEDULED" } }),
    prisma.course.count(),
    prisma.trainingAttendee.count(),
    prisma.trainingSchedule.count({
      where: { scheduledDate: { gte: startOfMonth, lte: endOfMonth } },
    }),
  ]);
  return { scheduled, courses, attendees, thisMonth };
}

export async function getSchedules(skip: number, take: number, search: string) {
  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { venue: { contains: search, mode: "insensitive" as const } },
          { course: { name: { contains: search, mode: "insensitive" as const } } },
        ],
      }
    : {};
  const [data, total] = await Promise.all([
    prisma.trainingSchedule.findMany({
      where,
      skip,
      take,
      include: { course: true, attendees: true, trainer: true },
      orderBy: { scheduledDate: "desc" },
    }),
    prisma.trainingSchedule.count({ where }),
  ]);
  return { data, total };
}

export async function getSchedule(id: string) {
  return prisma.trainingSchedule.findUnique({
    where: { id },
    include: { course: true, attendees: { include: { employee: true } }, trainer: true },
  });
}

export async function createSchedule(data: Record<string, unknown>) {
  return prisma.trainingSchedule.create({
    data: data as Parameters<typeof prisma.trainingSchedule.create>[0]["data"],
  });
}

export async function updateSchedule(id: string, data: Record<string, unknown>) {
  return prisma.trainingSchedule.update({
    where: { id },
    data: data as Parameters<typeof prisma.trainingSchedule.update>[0]["data"],
  });
}

export async function getCourses(skip: number, take: number, search: string) {
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { code: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};
  const [data, total] = await Promise.all([
    prisma.course.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.course.count({ where }),
  ]);
  return { data, total };
}

export async function createCourse(data: Record<string, unknown>) {
  return prisma.course.create({
    data: data as Parameters<typeof prisma.course.create>[0]["data"],
  });
}
