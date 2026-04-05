import { prisma } from "../../lib/prisma";


export async function getDashboardStats() {
  const [employees, departments, designations, activeShifts] = await Promise.all([
    prisma.employee.count({ where: { isActive: true } }),
    prisma.department.count(),
    prisma.designation.count(),
    prisma.shift.count({ where: { isActive: true } }),
  ]);
  return { employees, departments, designations, activeShifts };
}

export async function getEmployees(skip: number, take: number, search: string) {
  const where = search
    ? {
        OR: [
          { firstName: { contains: search, mode: "insensitive" as const } },
          { lastName: { contains: search, mode: "insensitive" as const } },
          { employeeCode: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};
  const [data, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      skip,
      take,
      include: { department: true, designation: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.employee.count({ where }),
  ]);
  return { data, total };
}

export async function getEmployee(id: string) {
  return prisma.employee.findUnique({
    where: { id },
    include: { department: true, designation: true, shift: true },
  });
}

export async function createEmployee(data: Record<string, unknown>) {
  return prisma.employee.create({ data: data as Parameters<typeof prisma.employee.create>[0]["data"] });
}

export async function updateEmployee(id: string, data: Record<string, unknown>) {
  return prisma.employee.update({ where: { id }, data: data as Parameters<typeof prisma.employee.update>[0]["data"] });
}

export async function deleteEmployee(id: string) {
  return prisma.employee.update({ where: { id }, data: { isActive: false } });
}

export async function getDepartments(skip: number, take: number, search: string) {
  const where = search ? { name: { contains: search, mode: "insensitive" as const } } : {};
  const [data, total] = await Promise.all([
    prisma.department.findMany({ where, skip, take, orderBy: { createdAt: "desc" } }),
    prisma.department.count({ where }),
  ]);
  return { data, total };
}

export async function createDepartment(data: Record<string, unknown>) {
  return prisma.department.create({ data: data as Parameters<typeof prisma.department.create>[0]["data"] });
}

export async function updateDepartment(id: string, data: Record<string, unknown>) {
  return prisma.department.update({ where: { id }, data: data as Parameters<typeof prisma.department.update>[0]["data"] });
}

export async function deleteDepartment(id: string) {
  return prisma.department.delete({ where: { id } });
}

export async function getUsers(skip: number, take: number, search: string) {
  const where = search
    ? {
        OR: [
          { email: { contains: search, mode: "insensitive" as const } },
          { username: { contains: search, mode: "insensitive" as const } },
          { firstName: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};
  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      include: { roles: { include: { role: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);
  return { data, total };
}

export async function getRoles() {
  return prisma.role.findMany({ include: { permissions: { include: { permission: true } } } });
}
