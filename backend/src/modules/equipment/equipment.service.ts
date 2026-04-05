import { prisma } from "../../lib/prisma";

export async function getDashboardStats() {
  const [items, warehouses, openMRs, assets] = await Promise.all([
    prisma.storeItem.count(),
    prisma.warehouse.count(),
    prisma.materialRequisition.count({ where: { status: "OPEN" } }),
    prisma.asset.count(),
  ]);
  return { items, warehouses, openMRs, assets };
}

export async function getItems(skip: number, take: number, search: string) {
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { code: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};
  const [data, total] = await Promise.all([
    prisma.storeItem.findMany({ where, skip, take, include: { category: true }, orderBy: { name: "asc" } }),
    prisma.storeItem.count({ where }),
  ]);
  return { data, total };
}

export async function createItem(data: Record<string, unknown>) {
  return prisma.storeItem.create({
    data: data as Parameters<typeof prisma.storeItem.create>[0]["data"],
  });
}

export async function updateItem(id: string, data: Record<string, unknown>) {
  return prisma.storeItem.update({
    where: { id },
    data: data as Parameters<typeof prisma.storeItem.update>[0]["data"],
  });
}

export async function getWarehouses(skip: number, take: number, search: string) {
  const where = search
    ? { name: { contains: search, mode: "insensitive" as const } }
    : {};
  const [data, total] = await Promise.all([
    prisma.warehouse.findMany({ where, skip, take, orderBy: { name: "asc" } }),
    prisma.warehouse.count({ where }),
  ]);
  return { data, total };
}

export async function createWarehouse(data: Record<string, unknown>) {
  return prisma.warehouse.create({
    data: data as Parameters<typeof prisma.warehouse.create>[0]["data"],
  });
}

export async function getRequisitions(skip: number, take: number, search: string) {
  const where = search
    ? {
        OR: [
          { mrNo: { contains: search, mode: "insensitive" as const } },
          { requestedBy: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};
  const [data, total] = await Promise.all([
    prisma.materialRequisition.findMany({ where, skip, take, include: { lines: true }, orderBy: { createdAt: "desc" } }),
    prisma.materialRequisition.count({ where }),
  ]);
  return { data, total };
}

export async function createRequisition(data: Record<string, unknown>) {
  return prisma.materialRequisition.create({
    data: data as Parameters<typeof prisma.materialRequisition.create>[0]["data"],
  });
}

export async function getAssets(skip: number, take: number, search: string) {
  const where = search
    ? { assetName: { contains: search, mode: "insensitive" as const } }
    : {};
  const [data, total] = await Promise.all([
    prisma.asset.findMany({ where, skip, take, orderBy: { createdAt: "desc" } }),
    prisma.asset.count({ where }),
  ]);
  return { data, total };
}

export async function createAsset(data: Record<string, unknown>) {
  return prisma.asset.create({
    data: data as Parameters<typeof prisma.asset.create>[0]["data"],
  });
}
