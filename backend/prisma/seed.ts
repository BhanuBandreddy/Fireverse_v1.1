import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

const ALL_MODULES = [
  "fire_admin", "noc", "fire_inspection", "renewal",
  "equipment", "vehicle_gps", "incident", "training", "mock_drill", "audit",
];
const ALL_ACTIONS = ["create", "read", "update", "delete", "approve", "export"];
const ALL_RESOURCES = [
  "dashboard", "employee", "department", "designation", "shift", "roster",
  "attendance", "document", "noc_application", "noc_certificate", "noc_fee",
  "inspection", "checklist", "deviation", "renewal", "firm", "equipment",
  "vehicle", "gps", "incident", "training", "drill", "audit", "report",
  "user", "role", "organization", "settings",
];

async function main() {
  console.log("🌱 Seeding Firedrive database...");

  // Create all permissions
  for (const module of ALL_MODULES) {
    for (const action of ALL_ACTIONS) {
      for (const resource of ALL_RESOURCES) {
        await prisma.permission.upsert({
          where: { module_action_resource: { module, action, resource } },
          update: {},
          create: { module, action, resource },
        });
      }
    }
  }
  console.log("✅ Permissions seeded");

  // Create SUPER_ADMIN role
  const superAdminRole = await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {},
    create: {
      name: "SUPER_ADMIN",
      displayName: "Super Administrator",
      description: "Full system access — all modules, all permissions",
    },
  });

  // Assign all permissions to SUPER_ADMIN
  const allPermissions = await prisma.permission.findMany();
  for (const perm of allPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: superAdminRole.id, permissionId: perm.id },
    });
  }
  console.log("✅ SUPER_ADMIN role seeded with all permissions");

  // Create other roles
  const otherRoles = [
    { name: "ADMIN", displayName: "Administrator", description: "Full access within assigned organization" },
    { name: "FIRE_OFFICER", displayName: "Fire Officer", description: "Access to inspection, incident, vehicle, training" },
    { name: "CAPTAIN", displayName: "Captain", description: "Inspect, report incidents, manage drills" },
    { name: "FIREMAN", displayName: "Fireman", description: "Record attendance, view training schedule" },
    { name: "SURVEYOR", displayName: "Surveyor", description: "NOC and renewal inspections" },
    { name: "APPLICANT", displayName: "Applicant", description: "Submit NOC / renewal applications" },
  ];
  for (const r of otherRoles) {
    await prisma.role.upsert({ where: { name: r.name }, update: {}, create: r });
  }
  console.log("✅ All roles seeded");

  // Create default organization
  const org = await prisma.organization.upsert({
    where: { shortCode: "NMMC-HQ" },
    update: {},
    create: {
      name: "MFES – Maharashtra Fire & Emergency Services (NMMC)",
      shortCode: "NMMC-HQ",
      type: "HQ",
      city: "Navi Mumbai",
      state: "Maharashtra",
      isActive: true,
    },
  });
  console.log("✅ Default organization seeded");

  // Create Super Admin user — upsert by username to handle email renames
  const passwordHash = await bcrypt.hash("Fire@Admin#2026", 12);
  const existingAdmin = await prisma.user.findFirst({ where: { username: "superadmin" } });
  const superAdmin = await prisma.user.upsert({
    where: { email: existingAdmin?.email ?? "superadmin@firedrive.gov.in" },
    update: { email: "superadmin@firedrive.gov.in" },
    create: {
      email: "superadmin@firedrive.gov.in",
      username: "superadmin",
      passwordHash,
      firstName: "Super",
      lastName: "Admin",
      phone: "+919800000000",
      status: "ACTIVE",
      organizationId: org.id,
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: superAdmin.id, roleId: superAdminRole.id } },
    update: {},
    create: { userId: superAdmin.id, roleId: superAdminRole.id },
  });
  console.log("✅ Super Admin user seeded");

  // Seed sample data
  // Departments
  const depts = ["Operations", "Administration", "Training", "Technical", "Logistics"];
  for (const name of depts) {
    await prisma.department.upsert({
      where: { id: name.toLowerCase() },
      update: {},
      create: { id: name.toLowerCase(), name, organizationId: org.id },
    }).catch(() =>
      prisma.department.create({ data: { name, organizationId: org.id } })
    );
  }

  // Designations
  const designations = [
    { name: "Fire Station Officer", level: 5 },
    { name: "Sub Officer", level: 4 },
    { name: "Leading Fireman", level: 3 },
    { name: "Fireman", level: 2 },
    { name: "Driver Operator", level: 2 },
  ];
  for (const d of designations) {
    await prisma.designation.create({ data: d }).catch(() => null);
  }

  // Shifts
  const shifts = [
    { name: "Morning Shift", startTime: "06:00", endTime: "14:00" },
    { name: "Afternoon Shift", startTime: "14:00", endTime: "22:00" },
    { name: "Night Shift", startTime: "22:00", endTime: "06:00" },
  ];
  for (const s of shifts) {
    await prisma.shift.create({ data: s }).catch(() => null);
  }

  // Incident types
  const incidentTypes = ["Building Fire", "Vehicle Fire", "Industrial Fire", "Forest Fire", "Chemical Hazard", "Rescue Operation"];
  for (const name of incidentTypes) {
    await prisma.incidentType.create({ data: { name } }).catch(() => null);
  }

  // Drill types
  const drillTypes = ["LIVE", "TABLETOP", "EVACUATION", "MOCK_FIRE"];
  for (const name of drillTypes) {
    await prisma.drillType.create({ data: { name } }).catch(() => null);
  }

  // Audit inspection types
  const auditTypes = ["FIRE_AUDIT", "BUILDING_AUDIT", "SAFETY_AUDIT", "EQUIPMENT_AUDIT"];
  for (const name of auditTypes) {
    await prisma.auditInspectionType.create({ data: { name } }).catch(() => null);
  }

  // Building usage types
  const usageTypes = ["Residential", "Commercial", "Industrial", "Hospital", "Hotel", "Educational"];
  for (const name of usageTypes) {
    await prisma.buildingUsageType.create({ data: { name } }).catch(() => null);
  }

  console.log("\n🎉 Seed complete!");
  console.log("─────────────────────────────────────────");
  console.log("   Super Admin Login:");
  console.log("   Email:    superadmin@firedrive.gov.in");
  console.log("   Password: Fire@Admin#2026");
  console.log("─────────────────────────────────────────");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
