import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma";

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

// ─── Helper: date offset ───────────────────────────────────────────────────────
function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}
function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  // Early-exit: if more than 5 incidents already seeded, skip demo data
  const incidentCount = await prisma.incident.count();
  if (incidentCount > 5) {
    console.log("Demo data already present — skipping (fast path)");

    // Still ensure superadmin exists
    const alreadySeeded = await prisma.user.findFirst({ where: { username: "superadmin" } });
    if (alreadySeeded) return;
  }

  console.log("Seeding Firedrive database...");

  // ── PERMISSIONS ─────────────────────────────────────────────────────────────
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
  console.log("Permissions seeded");

  // ── ROLES ────────────────────────────────────────────────────────────────────
  const superAdminRole = await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {},
    create: {
      name: "SUPER_ADMIN",
      displayName: "Super Administrator",
      description: "Full system access — all modules, all permissions",
    },
  });

  const allPermissions = await prisma.permission.findMany();
  for (const perm of allPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: superAdminRole.id, permissionId: perm.id },
    });
  }
  console.log("SUPER_ADMIN role seeded with all permissions");

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
  console.log("All roles seeded");

  // ── ORGANIZATION ─────────────────────────────────────────────────────────────
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
  console.log("Default organization seeded");

  // ── SUPERADMIN USER ──────────────────────────────────────────────────────────
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
  console.log("Super Admin user seeded");

  // If demo data already present, stop here
  if (incidentCount > 5) return;

  // ─────────────────────────────────────────────────────────────────────────────
  //  DEMO DATA
  // ─────────────────────────────────────────────────────────────────────────────

  // ── DEPARTMENTS ──────────────────────────────────────────────────────────────
  const deptNames = ["Operations", "Administration", "Training", "Technical", "Logistics"];
  const deptIds: string[] = [];
  for (const name of deptNames) {
    const dept = await prisma.department.upsert({
      where: { id: name.toLowerCase() },
      update: {},
      create: { id: name.toLowerCase(), name, organizationId: org.id },
    }).catch(async () => {
      return prisma.department.create({ data: { name, organizationId: org.id } });
    });
    deptIds.push(dept.id);
  }

  // ── DESIGNATIONS ─────────────────────────────────────────────────────────────
  const designationData = [
    { name: "Fire Station Officer", level: 5 },
    { name: "Sub Officer", level: 4 },
    { name: "Leading Fireman", level: 3 },
    { name: "Fireman", level: 2 },
    { name: "Driver Operator", level: 2 },
  ];
  const desigIds: string[] = [];
  for (const d of designationData) {
    const desig = await prisma.designation.create({ data: d }).catch(async () => {
      return prisma.designation.findFirst({ where: { name: d.name } });
    });
    if (desig) desigIds.push(desig.id);
  }

  // ── SHIFTS ────────────────────────────────────────────────────────────────────
  const shiftData = [
    { name: "Morning Shift", startTime: "06:00", endTime: "14:00" },
    { name: "Afternoon Shift", startTime: "14:00", endTime: "22:00" },
    { name: "Night Shift", startTime: "22:00", endTime: "06:00" },
  ];
  for (const s of shiftData) {
    await prisma.shift.create({ data: s }).catch(() => null);
  }

  // ── INCIDENT TYPES ────────────────────────────────────────────────────────────
  const incidentTypeNames = [
    "Building Fire", "Vehicle Fire", "Industrial Fire",
    "Forest Fire", "Chemical Hazard", "Rescue Operation",
    "Gas Leak", "Electrical Fire",
  ];
  const incidentTypeIds: string[] = [];
  for (const name of incidentTypeNames) {
    const t = await prisma.incidentType.create({ data: { name } }).catch(async () => {
      return prisma.incidentType.findFirst({ where: { name } });
    });
    if (t) incidentTypeIds.push(t.id);
  }

  // ── DRILL TYPES ───────────────────────────────────────────────────────────────
  const drillTypeNames = ["LIVE", "TABLETOP", "EVACUATION", "MOCK_FIRE"];
  const drillTypeIds: string[] = [];
  for (const name of drillTypeNames) {
    const dt = await prisma.drillType.create({ data: { name } }).catch(async () => {
      return prisma.drillType.findFirst({ where: { name } });
    });
    if (dt) drillTypeIds.push(dt.id);
  }

  // ── AUDIT INSPECTION TYPES ────────────────────────────────────────────────────
  const auditTypeNames = ["FIRE_AUDIT", "BUILDING_AUDIT", "SAFETY_AUDIT", "EQUIPMENT_AUDIT"];
  const auditTypeIds: string[] = [];
  for (const name of auditTypeNames) {
    const at = await prisma.auditInspectionType.create({ data: { name } }).catch(async () => {
      return prisma.auditInspectionType.findFirst({ where: { name } });
    });
    if (at) auditTypeIds.push(at.id);
  }

  // ── BUILDING USAGE TYPES ──────────────────────────────────────────────────────
  const usageTypeNames = ["Residential", "Commercial", "Industrial", "Hospital", "Hotel", "Educational"];
  for (const name of usageTypeNames) {
    await prisma.buildingUsageType.create({ data: { name } }).catch(() => null);
  }

  // ── DEVIATION TYPES ───────────────────────────────────────────────────────────
  const deviationTypeNames = [
    "Missing Fire Extinguisher", "Blocked Exit", "Faulty Alarm",
    "Missing Signage", "Non-compliant Wiring",
  ];
  const deviationTypeIds: string[] = [];
  for (const name of deviationTypeNames) {
    const devType = await prisma.deviationType.create({ data: { name } }).catch(async () => {
      return prisma.deviationType.findFirst({ where: { name } });
    });
    if (devType) deviationTypeIds.push(devType.id);
  }

  console.log("Reference data seeded");

  // ── 50 EMPLOYEES ──────────────────────────────────────────────────────────────
  const maharashtraFirstNamesMale = [
    "Rajesh", "Suresh", "Mahesh", "Dinesh", "Ganesh",
    "Ramesh", "Vikas", "Sanjay", "Ajay", "Vijay",
    "Nilesh", "Yogesh", "Santosh", "Rakesh", "Pradeep",
    "Amol", "Sachin", "Nitin", "Vinod", "Arun",
    "Deepak", "Rahul", "Rohit", "Amit", "Anand",
  ];
  const maharashtraFirstNamesFemale = [
    "Priya", "Sunita", "Rekha", "Meena", "Kavita",
    "Anita", "Suchita", "Varsha", "Pooja", "Nisha",
    "Sneha", "Sapna", "Archana", "Manisha", "Dipika",
    "Smita", "Pallavi", "Rashmi", "Geeta", "Usha",
    "Lata", "Sarita", "Asha", "Nandini", "Madhuri",
  ];
  const maharashtraLastNames = [
    "Patil", "Jadhav", "Deshmukh", "Shinde", "Kadam",
    "Bhosale", "More", "Pawar", "Gaikwad", "Kale",
    "Salvi", "Nair", "Kulkarni", "Joshi", "Deshpande",
    "Thakur", "Mane", "Waghmare", "Sawant", "Rane",
  ];

  const employeeIds: string[] = [];
  for (let i = 0; i < 50; i++) {
    const isFemale = i % 4 === 0; // ~25% female
    const firstNames = isFemale ? maharashtraFirstNamesFemale : maharashtraFirstNamesMale;
    const firstName = firstNames[i % firstNames.length];
    const lastName = maharashtraLastNames[i % maharashtraLastNames.length];
    const deptId = deptIds[i % deptIds.length];
    const desigId = desigIds[i % desigIds.length];
    const empCode = `EMP${String(1001 + i).padStart(4, "0")}`;

    const emp = await prisma.employee.create({
      data: {
        employeeCode: empCode,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@firedrive.gov.in`,
        phone: `+9198${String(10000000 + i).padStart(8, "0")}`,
        gender: isFemale ? "FEMALE" : "MALE",
        joiningDate: daysAgo(365 - i * 6),
        departmentId: deptId,
        designationId: desigId,
        organizationId: org.id,
        isActive: i < 47, // 3 inactive
      },
    }).catch(() => null);
    if (emp) employeeIds.push(emp.id);
  }
  console.log(`Employees seeded: ${employeeIds.length}`);

  // ── 30 NOC APPLICATIONS ───────────────────────────────────────────────────────
  const nocProjects = [
    { name: "Seawoods Grand Central Mall", city: "Navi Mumbai", ward: "W-01", addr: "Plot 1, Sector 40, Seawoods, Navi Mumbai" },
    { name: "Hiranandani Hospital", city: "Navi Mumbai", ward: "W-02", addr: "Dr E Borges Road, Powai, Navi Mumbai" },
    { name: "Thane IT Park Tower A", city: "Thane", ward: "TH-05", addr: "Wagle Industrial Estate, Thane West 400604" },
    { name: "Pune Metro Station – Shivajinagar", city: "Pune", ward: "P-08", addr: "Shivajinagar Station Road, Pune 411005" },
    { name: "Nagpur MIHAN SEZ Building", city: "Nagpur", ward: "NG-03", addr: "MIHAN SEZ, Nagpur 441108" },
    { name: "Nashik Industrial Cold Storage", city: "Nashik", ward: "NK-07", addr: "Ambad MIDC, Nashik 422010" },
    { name: "Kalyan Hotel Grand Residency", city: "Kalyan", ward: "KL-02", addr: "Kalyan West, Thane District 421301" },
    { name: "Aurangabad Chemical Factory", city: "Aurangabad", ward: "AB-04", addr: "Chikalthana MIDC, Aurangabad 431006" },
    { name: "Solapur Textile Mill Complex", city: "Solapur", ward: "SL-06", addr: "Akkalkot Road, Solapur 413001" },
    { name: "Kolhapur Multi-Storey Residential", city: "Kolhapur", ward: "KH-03", addr: "Kasaba Bawda, Kolhapur 416012" },
    { name: "Belapur Corporate Tower", city: "Navi Mumbai", ward: "W-03", addr: "CBD Belapur Sector 11, Navi Mumbai 400614" },
    { name: "Vashi Shopping Complex", city: "Navi Mumbai", ward: "W-04", addr: "Plot 12, Sector 17, Vashi, Navi Mumbai 400703" },
    { name: "Airoli Pharmaceutical Unit", city: "Navi Mumbai", ward: "W-05", addr: "TTC MIDC Airoli, Navi Mumbai 400708" },
    { name: "Panvel Bus Depot", city: "Panvel", ward: "PV-01", addr: "Panvel MSRTC Depot, Panvel 410206" },
    { name: "Mulund Warehouse Complex", city: "Mumbai", ward: "MU-09", addr: "LBS Road, Mulund West, Mumbai 400080" },
    { name: "Dombivli Spinning Mill", city: "Dombivli", ward: "DB-04", addr: "MIDC Dombivli East, Thane 421203" },
    { name: "Badlapur Educational Campus", city: "Badlapur", ward: "BD-02", addr: "Badlapur East, Thane District 421503" },
    { name: "Mira Road Residential Tower", city: "Mira Road", ward: "MR-05", addr: "Mira Bhayandar Road, Mira Road 401107" },
    { name: "Bhiwandi Logistics Park", city: "Bhiwandi", ward: "BH-07", addr: "Padgha Road, Bhiwandi, Thane 421302" },
    { name: "Vasai Hill Fort Heritage Hotel", city: "Vasai", ward: "VS-03", addr: "Vasai Fort Road, Vasai West 401201" },
    { name: "Ulhasnagar Market Complex", city: "Ulhasnagar", ward: "UL-04", addr: "Central Avenue, Ulhasnagar 421003" },
    { name: "Pimpri Hospital Block B", city: "Pimpri", ward: "PC-06", addr: "Pimpri Road, Pune 411018" },
    { name: "Hadapsar IT Hub Phase 2", city: "Pune", ward: "P-12", addr: "Magarpatta Road, Hadapsar, Pune 411028" },
    { name: "Karad Sugar Factory", city: "Karad", ward: "KD-01", addr: "Panchganga Nagar, Karad, Satara 415110" },
    { name: "Satara Fort Heritage Complex", city: "Satara", ward: "ST-02", addr: "Ajinkya Tara Road, Satara 415001" },
    { name: "Amravati Cotton Warehouse", city: "Amravati", ward: "AM-05", addr: "Badnera MIDC, Amravati 444701" },
    { name: "Latur Earthquake Memorial Hall", city: "Latur", ward: "LT-03", addr: "Killari Road, Latur 413512" },
    { name: "Nanded Gurudwara Complex", city: "Nanded", ward: "ND-01", addr: "Hazur Sahib Road, Nanded 431601" },
    { name: "Jalgaon Banana Processing Plant", city: "Jalgaon", ward: "JL-04", addr: "Wakadi MIDC, Jalgaon 425001" },
    { name: "Dhule Textile Hub", city: "Dhule", ward: "DH-02", addr: "Industrial Area, Dhule 424001" },
  ];

  const nocStatuses = [
    "PENDING","PENDING","PENDING","PENDING","PENDING","PENDING","PENDING","PENDING","PENDING","PENDING","PENDING","PENDING",
    "APPROVED","APPROVED","APPROVED","APPROVED","APPROVED","APPROVED","APPROVED","APPROVED",
    "REJECTED","REJECTED","REJECTED","REJECTED","REJECTED",
    "UNDER_REVIEW","UNDER_REVIEW","UNDER_REVIEW","UNDER_REVIEW","UNDER_REVIEW",
  ];
  const nocTypes = ["PROVISIONAL","FINAL","AMENDMENT","TEMPORARY","PROVISIONAL","FINAL","AMENDMENT","PROVISIONAL","FINAL","AMENDMENT"];

  const nocApplicantFirstNames = [
    "Avinash","Balasaheb","Chandrakant","Dattatray","Eknath",
    "Fulchand","Gajanan","Haribhau","Ishwar","Jagannath",
    "Kailas","Laxman","Madhav","Narayan","Omkar",
    "Pandurang","Ramchandra","Shivaji","Tulshiram","Umakant",
    "Vasant","Waman","Yadav","Zulfikaar","Arvind",
    "Bhimrao","Chiranjeev","Digambar","Eknath","Firoze",
  ];

  for (let i = 0; i < 30; i++) {
    const project = nocProjects[i];
    const appNo = `NOC-2024-${String(1001 + i).padStart(4, "0")}`;
    const applicantFirst = nocApplicantFirstNames[i];
    const applicantLast = maharashtraLastNames[i % maharashtraLastNames.length];
    await prisma.nOCApplication.create({
      data: {
        applicationNo: appNo,
        nocType: nocTypes[i % nocTypes.length] as "PROVISIONAL" | "FINAL" | "AMENDMENT" | "TEMPORARY",
        applicantName: `${applicantFirst} ${applicantLast}`,
        applicantEmail: `${applicantFirst.toLowerCase()}${i}@example.com`,
        applicantPhone: `+9197${String(10000000 + i).padStart(8, "0")}`,
        projectName: project.name,
        buildingAddress: project.addr,
        city: project.city,
        ward: project.ward,
        status: nocStatuses[i] as "PENDING" | "APPROVED" | "REJECTED" | "UNDER_REVIEW",
        remarks: i % 5 === 0 ? "Documents under verification" : null,
      },
    }).catch(() => null);
  }
  console.log("NOC Applications seeded");

  // ── 25 INCIDENTS ──────────────────────────────────────────────────────────────
  const incidents = [
    {
      no: "INC-2024-001", title: "Building Fire – Vashi Commercial Complex",
      priority: "CRITICAL", severity: "VERY_HIGH", status: "OPEN",
      address: "Sector 17, Vashi, Navi Mumbai", daysAgoVal: 2,
      description: "Major fire broke out on 4th floor of a 7-storey commercial complex. Multiple occupants reported trapped.",
    },
    {
      no: "INC-2024-002", title: "Gas Cylinder Explosion – Kalamboli",
      priority: "HIGH", severity: "HIGH", status: "IN_PROGRESS",
      address: "Plot 45, Kalamboli, Navi Mumbai", daysAgoVal: 5,
      description: "LPG cylinder explosion in a residential kitchen causing structural damage to two adjacent apartments.",
    },
    {
      no: "INC-2024-003", title: "Vehicle Fire – Mumbai-Pune Expressway",
      priority: "MEDIUM", severity: "MEDIUM", status: "CLOSED",
      address: "Mumbai-Pune Expressway, Khopoli Exit km 72", daysAgoVal: 10,
      description: "Private bus caught fire near Khopoli due to engine overheating. All 38 passengers evacuated safely.",
    },
    {
      no: "INC-2024-004", title: "Industrial Fire – Thane MIDC",
      priority: "CRITICAL", severity: "VERY_HIGH", status: "OPEN",
      address: "TTC Industrial Area, Thane 400604", daysAgoVal: 1,
      description: "Chemical warehouse fire at a plastics manufacturing unit. Hazardous fumes detected. Evacuation underway.",
    },
    {
      no: "INC-2024-005", title: "Electrical Fire – Belapur IT Tower",
      priority: "HIGH", severity: "HIGH", status: "IN_PROGRESS",
      address: "CBD Belapur, Navi Mumbai 400614", daysAgoVal: 3,
      description: "Short circuit in server room on 12th floor triggered fire suppression. Partial evacuation of building.",
    },
    {
      no: "INC-2024-006", title: "Forest Fire – Matheran Hills",
      priority: "HIGH", severity: "VERY_HIGH", status: "OPEN",
      address: "Matheran Eco-sensitive Zone, Raigad", daysAgoVal: 4,
      description: "Forest fire spreading rapidly due to dry summer conditions. Multiple fire teams deployed.",
    },
    {
      no: "INC-2024-007", title: "Chemical Hazard – Nashik MIDC",
      priority: "CRITICAL", severity: "VERY_HIGH", status: "OPEN",
      address: "Ambad MIDC Phase 2, Nashik 422010", daysAgoVal: 6,
      description: "Chlorine gas leak from a pharma unit. Emergency response team with HAZMAT gear deployed.",
    },
    {
      no: "INC-2024-008", title: "Rescue Operation – Panvel Flood",
      priority: "HIGH", severity: "HIGH", status: "IN_PROGRESS",
      address: "Old Panvel Market Area, Raigad 410206", daysAgoVal: 7,
      description: "Flood rescue operation following heavy monsoon. 22 residents rescued from waterlogged structures.",
    },
    {
      no: "INC-2024-009", title: "Building Fire – Dadar Chawl",
      priority: "MEDIUM", severity: "MEDIUM", status: "CLOSED",
      address: "Dadar West, Mumbai 400028", daysAgoVal: 15,
      description: "Small fire in ground-floor shop of old chawl building. Controlled in 45 minutes. No casualties.",
    },
    {
      no: "INC-2024-010", title: "Fuel Tanker Fire – Pune NH-48",
      priority: "HIGH", severity: "VERY_HIGH", status: "IN_PROGRESS",
      address: "NH-48, Talegaon Dabhade, Pune", daysAgoVal: 8,
      description: "Petroleum tanker overturned and caught fire. Highway closed. Foam tender deployed.",
    },
    {
      no: "INC-2024-011", title: "Hotel Kitchen Fire – Aurangabad",
      priority: "MEDIUM", severity: "MEDIUM", status: "CLOSED",
      address: "CIDCO Colony, Aurangabad 431001", daysAgoVal: 20,
      description: "Kitchen fire at a 3-star hotel. Fire contained to kitchen area. No guest injuries reported.",
    },
    {
      no: "INC-2024-012", title: "Electrical Short Circuit – Nagpur Mall",
      priority: "MEDIUM", severity: "HIGH", status: "CLOSED",
      address: "Central Avenue Mall, Nagpur 440012", daysAgoVal: 25,
      description: "Short circuit in electrical panel on basement level. Fire extinguished by staff before unit arrived.",
    },
    {
      no: "INC-2024-013", title: "Residential Fire – Kolhapur",
      priority: "LOW", severity: "MEDIUM", status: "CLOSED",
      address: "Tarabai Park, Kolhapur 416003", daysAgoVal: 30,
      description: "Minor kitchen fire in residential apartment. Controlled within 20 minutes. Family evacuated safely.",
    },
    {
      no: "INC-2024-014", title: "Garbage Dump Fire – Deonar",
      priority: "HIGH", severity: "HIGH", status: "CLOSED",
      address: "Deonar Dumping Ground, Mumbai 400043", daysAgoVal: 35,
      description: "Spontaneous combustion at solid waste facility. Massive smoke plume. 4 units deployed for 6 hours.",
    },
    {
      no: "INC-2024-015", title: "Cylinder Leak – Solapur Market",
      priority: "MEDIUM", severity: "MEDIUM", status: "CLOSED",
      address: "Rajiv Gandhi Market, Solapur 413001", daysAgoVal: 40,
      description: "LPG cylinder leak detected in crowded market. Evacuated, leak sealed, area ventilated.",
    },
    {
      no: "INC-2024-016", title: "Workshop Fire – Bhiwandi",
      priority: "HIGH", severity: "HIGH", status: "CLOSED",
      address: "MIDC Bhiwandi, Thane 421302", daysAgoVal: 45,
      description: "Welding sparks triggered fire in textile godown. Losses estimated at Rs 30 lakhs.",
    },
    {
      no: "INC-2024-017", title: "Fire at School – Latur",
      priority: "CRITICAL", severity: "VERY_HIGH", status: "CLOSED",
      address: "Udgir Road, Latur 413512", daysAgoVal: 55,
      description: "Fire in library building of government school. Students evacuated. All records destroyed.",
    },
    {
      no: "INC-2024-018", title: "Crane Collapse Fire – Pune",
      priority: "HIGH", severity: "HIGH", status: "CLOSED",
      address: "Hinjewadi IT Park Phase 3, Pune 411057", daysAgoVal: 60,
      description: "Construction crane fire following electrical fault. Adjacent scaffolding caught fire. Contained after 2 hours.",
    },
    {
      no: "INC-2024-019", title: "Boat Fire – Mumbai Harbour",
      priority: "MEDIUM", severity: "HIGH", status: "CLOSED",
      address: "Sassoon Docks, Colaba, Mumbai 400005", daysAgoVal: 70,
      description: "Fishing trawler engine room fire. 3 fishermen rescued. Boat partially submerged.",
    },
    {
      no: "INC-2024-020", title: "Temple Fire – Satara",
      priority: "MEDIUM", severity: "MEDIUM", status: "CLOSED",
      address: "Ajinkya Tara Temple, Satara 415001", daysAgoVal: 80,
      description: "Accidental fire from oil lamp during festival season. Minor damage to wooden structures.",
    },
    {
      no: "INC-2024-021", title: "Transformer Fire – Amravati",
      priority: "HIGH", severity: "HIGH", status: "CLOSED",
      address: "MSEDCL Substation, Amravati 444601", daysAgoVal: 90,
      description: "Transformer explosion caused fire. Nearby residential area power supply disrupted for 8 hours.",
    },
    {
      no: "INC-2024-022", title: "Hospital Fire Drill Emergency – Nanded",
      priority: "LOW", severity: "LOW", status: "CLOSED",
      address: "Dr Shankarrao Chavan Govt Hospital, Nanded 431601", daysAgoVal: 100,
      description: "False alarm from faulty detector led to full evacuation. No actual fire. 200 patients relocated temporarily.",
    },
    {
      no: "INC-2024-023", title: "Cotton Bale Fire – Jalgaon",
      priority: "HIGH", severity: "HIGH", status: "OPEN",
      address: "Cotton Market Warehouse, Jalgaon 425001", daysAgoVal: 3,
      description: "Spontaneous combustion of cotton bales in storage. 4 units deployed. Fire spreading rapidly.",
    },
    {
      no: "INC-2024-024", title: "Bus Depot Fire – Dhule",
      priority: "MEDIUM", severity: "MEDIUM", status: "CLOSED",
      address: "MSRTC Bus Depot, Dhule 424001", daysAgoVal: 110,
      description: "Fire in maintenance bay of bus depot. 3 buses damaged. No injuries.",
    },
    {
      no: "INC-2024-025", title: "Industrial Explosion – Ratnagiri",
      priority: "CRITICAL", severity: "VERY_HIGH", status: "OPEN",
      address: "MIDC Lote Parshuram, Ratnagiri 415722", daysAgoVal: 1,
      description: "Boiler explosion at chemical manufacturing plant. Multiple casualties feared. All available units mobilised.",
    },
  ];

  for (const inc of incidents) {
    const typeId = incidentTypeIds.length > 0 ? incidentTypeIds[0] : undefined;
    await prisma.incident.create({
      data: {
        incidentNo: inc.no,
        title: inc.title,
        typeId,
        address: inc.address,
        status: inc.status as "OPEN" | "IN_PROGRESS" | "CLOSED",
        priority: inc.priority as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
        severity: inc.severity as "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH",
        reportedAt: daysAgo(inc.daysAgoVal),
        reportedBy: "Control Room NMMC",
        description: inc.description,
      },
    }).catch(() => null);
  }
  console.log("Incidents seeded");

  // ── 15 VEHICLES ───────────────────────────────────────────────────────────────
  const vehicleData = [
    { reg: "MH-04-FA-1001", make: "TATA", model: "Fire Tender 5000L", bodyType: "Fire Tender", active: true },
    { reg: "MH-04-FA-1002", make: "TATA", model: "Fire Tender 3000L", bodyType: "Fire Tender", active: true },
    { reg: "MH-04-FA-1003", make: "Ashok Leyland", model: "Water Tanker 10000L", bodyType: "Water Tanker", active: true },
    { reg: "MH-04-FA-1004", make: "Ashok Leyland", model: "Water Tanker 8000L", bodyType: "Water Tanker", active: true },
    { reg: "MH-04-FA-1005", make: "TATA", model: "Foam Tender", bodyType: "Foam Tender", active: true },
    { reg: "MH-04-FA-1006", make: "Force Motors", model: "Rescue Van", bodyType: "Rescue Van", active: true },
    { reg: "MH-04-FA-1007", make: "Force Motors", model: "Ambulance", bodyType: "Ambulance", active: true },
    { reg: "MH-04-FA-1008", make: "TATA", model: "Command Vehicle", bodyType: "Command Vehicle", active: true },
    { reg: "MH-04-FA-1009", make: "Mahindra", model: "Quick Response Vehicle", bodyType: "QRV", active: true },
    { reg: "MH-04-FA-1010", make: "TATA", model: "Aerial Platform 30m", bodyType: "Aerial Platform", active: true },
    { reg: "MH-04-FA-1011", make: "MAN", model: "HAZMAT Vehicle", bodyType: "HAZMAT", active: true },
    { reg: "MH-04-FA-1012", make: "Ashok Leyland", model: "Fire Tender 6000L", bodyType: "Fire Tender", active: true },
    { reg: "MH-04-FA-1013", make: "TATA", model: "Water Tanker 5000L", bodyType: "Water Tanker", active: false },
    { reg: "MH-04-FA-1014", make: "Force Motors", model: "Rescue Van", bodyType: "Rescue Van", active: false },
    { reg: "MH-04-FA-1015", make: "Mahindra", model: "Staff Vehicle", bodyType: "Staff Vehicle", active: false },
  ];

  for (const v of vehicleData) {
    await prisma.vehicle.create({
      data: {
        registrationNo: v.reg,
        make: v.make,
        model: v.model,
        bodyType: v.bodyType,
        isActive: v.active,
      },
    }).catch(() => null);
  }
  console.log("Vehicles seeded");

  // ── WAREHOUSE + STORE ITEMS + INVENTORY ────────────────────────────────────────
  const warehouse = await prisma.warehouse.create({
    data: {
      name: "Central Fire Equipment Warehouse – NMMC",
      address: "Fire Brigade HQ, Sector 15A, CBD Belapur, Navi Mumbai 400614",
      isActive: true,
    },
  }).catch(async () => {
    return prisma.warehouse.findFirst({ where: { name: { contains: "Central Fire" } } });
  });

  const storeItemsData = [
    { name: "Fire Extinguisher CO2 5kg", code: "FE-CO2-5K", uom: "Nos", reorderLevel: 20 },
    { name: "Fire Extinguisher ABC 9kg", code: "FE-ABC-9K", uom: "Nos", reorderLevel: 15 },
    { name: "Fire Hose 63mm x 15m", code: "FH-63-15", uom: "Nos", reorderLevel: 30 },
    { name: "Breathing Apparatus Set", code: "BA-SET-01", uom: "Sets", reorderLevel: 10 },
    { name: "BA Cylinder 6L 300bar", code: "BA-CYL-6L", uom: "Nos", reorderLevel: 20 },
    { name: "Firefighting Helmet", code: "FFH-01", uom: "Nos", reorderLevel: 25 },
    { name: "Firefighting Gloves", code: "FFG-01", uom: "Pairs", reorderLevel: 40 },
    { name: "Firefighting Boots", code: "FFB-01", uom: "Pairs", reorderLevel: 30 },
    { name: "Proximity Suit", code: "PS-01", uom: "Sets", reorderLevel: 5 },
    { name: "Foam Compound AFFF 25L", code: "FC-AFFF-25", uom: "Cans", reorderLevel: 12 },
    { name: "Rope Rescue Kit 50m", code: "RRK-50", uom: "Sets", reorderLevel: 6 },
    { name: "First Aid Kit Type A", code: "FAK-A", uom: "Kits", reorderLevel: 15 },
    { name: "Thermal Imaging Camera", code: "TIC-01", uom: "Nos", reorderLevel: 3 },
    { name: "Hydraulic Rescue Tool Set", code: "HRT-01", uom: "Sets", reorderLevel: 4 },
    { name: "Fire Resistant Blanket", code: "FRB-01", uom: "Nos", reorderLevel: 20 },
  ];

  // Quantities: some below reorderLevel for alerts
  const inventoryQty = [12, 18, 45, 15, 8, 30, 55, 28, 2, 6, 8, 22, 4, 5, 14];

  if (warehouse) {
    for (let i = 0; i < storeItemsData.length; i++) {
      const item = storeItemsData[i];
      const storeItem = await prisma.storeItem.create({
        data: {
          name: item.name,
          code: item.code,
          uom: item.uom,
          reorderLevel: item.reorderLevel,
          isActive: true,
        },
      }).catch(async () => {
        return prisma.storeItem.findFirst({ where: { code: item.code } });
      });

      if (storeItem) {
        await prisma.inventoryItem.create({
          data: {
            itemId: storeItem.id,
            warehouseId: warehouse.id,
            quantity: inventoryQty[i],
          },
        }).catch(() => null);
      }
    }
  }
  console.log("Warehouse and inventory seeded");

  // ── COURSES ────────────────────────────────────────────────────────────────────
  const courseData = [
    { name: "Basic Fire Safety", code: "BFS-01" },
    { name: "Hazmat Response", code: "HAZMAT-01" },
    { name: "Rope Rescue Techniques", code: "RRT-01" },
    { name: "First Aid & CPR", code: "FA-CPR-01" },
    { name: "Incident Command System", code: "ICS-01" },
    { name: "Advanced Fire Fighting", code: "AFF-01" },
    { name: "SCBA Operations", code: "SCBA-01" },
    { name: "Flood Rescue", code: "FR-01" },
    { name: "Search & Rescue", code: "SAR-01" },
    { name: "Road Traffic Accident Response", code: "RTAR-01" },
  ];
  const courseIds: string[] = [];
  for (const c of courseData) {
    const course = await prisma.course.create({
      data: { name: c.name, code: c.code },
    }).catch(async () => {
      return prisma.course.findFirst({ where: { code: c.code } });
    });
    if (course) courseIds.push(course.id);
  }

  // ── 10 TRAINING SCHEDULES ─────────────────────────────────────────────────────
  const trainingSchedules = [
    { title: "Basic Fire Safety Training Batch 1", courseIdx: 0, trainerName: "Shri Sudhir Patil", status: "SCHEDULED", startDays: 5, endDays: 7 },
    { title: "Hazmat Response Course – Q1 2026", courseIdx: 1, trainerName: "Dr Anjali Deshmukh", status: "SCHEDULED", startDays: 10, endDays: 12 },
    { title: "Rope Rescue Advanced – April 2026", courseIdx: 2, trainerName: "Shri Rajesh Jadhav", status: "SCHEDULED", startDays: 15, endDays: 18 },
    { title: "First Aid & CPR – Station Officers", courseIdx: 3, trainerName: "Dr Meena Kulkarni", status: "SCHEDULED", startDays: 3, endDays: 3 },
    { title: "ICS Level 1 Certification", courseIdx: 4, trainerName: "Shri Ganesh Bhosale", status: "ONGOING", startDays: -2, endDays: 2 },
    { title: "Advanced Fire Fighting – Urban", courseIdx: 5, trainerName: "Shri Suresh Shinde", status: "COMPLETED", startDays: -30, endDays: -28 },
    { title: "SCBA Operations Refresher", courseIdx: 6, trainerName: "Shri Vinod Kadam", status: "COMPLETED", startDays: -45, endDays: -43 },
    { title: "Flood Rescue Preparedness", courseIdx: 7, trainerName: "Shri Amol Pawar", status: "COMPLETED", startDays: -60, endDays: -57 },
    { title: "Search & Rescue – Confined Space", courseIdx: 8, trainerName: "Shri Nilesh Gaikwad", status: "COMPLETED", startDays: -90, endDays: -88 },
    { title: "Road Traffic Accident Response", courseIdx: 9, trainerName: "Shri Sachin More", status: "CANCELLED", startDays: -15, endDays: -13 },
  ];

  for (const ts of trainingSchedules) {
    const courseId = courseIds.length > ts.courseIdx ? courseIds[ts.courseIdx] : courseIds[0];
    if (!courseId) continue;
    await prisma.trainingSchedule.create({
      data: {
        courseId,
        title: ts.title,
        startDate: daysFromNow(ts.startDays),
        endDate: daysFromNow(ts.endDays),
        trainerName: ts.trainerName,
        status: ts.status as "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED",
        maxParticipants: 20,
      },
    }).catch(() => null);
  }
  console.log("Training schedules seeded");

  // ── 12 DRILLS ─────────────────────────────────────────────────────────────────
  const drillsData = [
    { title: "Fire Evacuation Drill – Vashi Sector 17", status: "SCHEDULED", scheduledDays: 7, owner: "Shri Rajesh Patil", ward: "W-04" },
    { title: "Mock Fire – Belapur Corporate Tower", status: "SCHEDULED", scheduledDays: 12, owner: "Shri Suresh Jadhav", ward: "W-03" },
    { title: "HAZMAT Simulation – Airoli TTC MIDC", status: "PLANNED", scheduledDays: 20, owner: "Shri Dinesh Deshmukh", ward: "W-05" },
    { title: "Flood Rescue Exercise – Panvel", status: "PLANNED", scheduledDays: 25, owner: "Shri Mahesh Shinde", ward: "PV-01" },
    { title: "Industrial Fire Drill – Thane MIDC", status: "SCHEDULED", scheduledDays: 5, owner: "Shri Ganesh Kadam", ward: "TH-05" },
    { title: "High-Rise Evacuation – Seawoods Mall", status: "PLANNED", scheduledDays: 18, owner: "Shri Ramesh Bhosale", ward: "W-01" },
    { title: "Tabletop Exercise – Mass Casualty", status: "COMPLETED", scheduledDays: -10, owner: "Shri Vikas More", ward: "W-02" },
    { title: "Chemical Hazard Drill – Nashik MIDC", status: "COMPLETED", scheduledDays: -20, owner: "Shri Sanjay Pawar", ward: "NK-07" },
    { title: "Night Drill – Navi Mumbai Station 3", status: "COMPLETED", scheduledDays: -35, owner: "Shri Ajay Gaikwad", ward: "W-06" },
    { title: "Hospital Evacuation Drill – Pune", status: "COMPLETED", scheduledDays: -50, owner: "Shri Vijay Kale", ward: "P-08" },
    { title: "Port Fire Exercise – Mumbai Harbour", status: "CLOSED", scheduledDays: -90, owner: "Shri Nilesh Salvi", ward: "MU-01" },
    { title: "Forest Fire Simulation – Matheran", status: "REQUESTED", scheduledDays: 30, owner: "Shri Yogesh Kulkarni", ward: "RG-03" },
  ];

  for (const drill of drillsData) {
    const drillTypeId = drillTypeIds.length > 0 ? drillTypeIds[0] : undefined;
    await prisma.drill.create({
      data: {
        title: drill.title,
        drillTypeId,
        scheduledAt: daysFromNow(drill.scheduledDays),
        owner: drill.owner,
        status: drill.status as "REQUESTED" | "PLANNED" | "SCHEDULED" | "COMPLETED" | "CLOSED",
        ward: drill.ward,
      },
    }).catch(() => null);
  }
  console.log("Drills seeded");

  // ── FIRMS (for renewals) ──────────────────────────────────────────────────────
  const firmsData = [
    { firmName: "Hiranandani Constructions Pvt Ltd", firmCode: "HC-001", address: "Hiranandani Gardens, Powai, Mumbai", businessType: "Construction" },
    { firmName: "Reliance Chemical Industries", firmCode: "RCI-001", address: "Patalganga MIDC, Raigad", businessType: "Chemical" },
    { firmName: "Bajaj Auto Parts Factory", firmCode: "BAP-001", address: "Akurdi, Pune 411035", businessType: "Automotive" },
    { firmName: "Tata Motors Assembly Plant", firmCode: "TMA-001", address: "Pimpri, Pune 411018", businessType: "Automotive" },
    { firmName: "Hotel Taj Mahal Palace", firmCode: "TMP-001", address: "Apollo Bunder, Colaba, Mumbai 400001", businessType: "Hospitality" },
    { firmName: "Wockhardt Hospital Navi Mumbai", firmCode: "WHN-001", address: "Sector 11, Kharghar, Navi Mumbai 410210", businessType: "Healthcare" },
    { firmName: "Marico Industries Ltd", firmCode: "MIL-001", address: "Jalgaon MIDC, Jalgaon 425001", businessType: "FMCG" },
    { firmName: "NCP Cold Storages", firmCode: "NCS-001", address: "Turbhe, Navi Mumbai 400705", businessType: "Storage" },
    { firmName: "Phoenix Marketcity Mall", firmCode: "PMM-001", address: "LBS Road, Kurla West, Mumbai 400070", businessType: "Retail" },
    { firmName: "Godrej Properties Ltd", firmCode: "GPL-001", address: "Pirojshanagar, Vikhroli, Mumbai 400079", businessType: "Real Estate" },
    { firmName: "Thermax Limited", firmCode: "THL-001", address: "Chinchwad, Pune 411019", businessType: "Industrial" },
    { firmName: "Raymond Limited Factory", firmCode: "RLF-001", address: "Thane 400601", businessType: "Textile" },
    { firmName: "Larsen & Toubro Edutech", firmCode: "LTE-001", address: "Powai, Mumbai 400072", businessType: "Education" },
    { firmName: "Forbes Marshall Steam", firmCode: "FMS-001", address: "Chinchwad, Pune 411033", businessType: "Engineering" },
    { firmName: "Cipla Pharma Plant Goa Rd", firmCode: "CPG-001", address: "Vikhroli, Mumbai 400083", businessType: "Pharmaceutical" },
    { firmName: "HDFC Bank Data Centre", firmCode: "HBD-001", address: "Chandivali, Andheri East, Mumbai 400072", businessType: "Banking" },
    { firmName: "Ultratech Cement Plant", firmCode: "UCP-001", address: "Awarpur, Chandrapur 442902", businessType: "Cement" },
    { firmName: "Kirloskar Electric Factory", firmCode: "KEF-001", address: "Kothrud, Pune 411038", businessType: "Electrical" },
    { firmName: "Navi Mumbai SEZ Developers", firmCode: "NSD-001", address: "Dronagiri, Navi Mumbai 400707", businessType: "Construction" },
    { firmName: "Sahyadri Hospitals Nashik", firmCode: "SHN-001", address: "Nashik Road, Nashik 422101", businessType: "Healthcare" },
  ];

  const firmIds: string[] = [];
  for (const f of firmsData) {
    const firm = await prisma.firm.create({
      data: {
        firmName: f.firmName,
        firmCode: f.firmCode,
        address: f.address,
        businessType: f.businessType,
      },
    }).catch(async () => {
      return prisma.firm.findFirst({ where: { firmCode: f.firmCode } });
    });
    if (firm) firmIds.push(firm.id);
  }

  // ── 20 RENEWAL APPLICATIONS ───────────────────────────────────────────────────
  const renewalStatuses = [
    "PENDING","PENDING","PENDING","PENDING","PENDING","PENDING","PENDING","PENDING",
    "APPROVED","APPROVED","APPROVED","APPROVED","APPROVED","APPROVED",
    "UNDER_REVIEW","UNDER_REVIEW","UNDER_REVIEW",
    "REJECTED","REJECTED","REJECTED",
  ];
  const renewalCertTypes = ["NOC","B_FORM","FITNESS","NOC","B_FORM","FITNESS","NOC","B_FORM","FITNESS","NOC","B_FORM","FITNESS","NOC","B_FORM","FITNESS","NOC","B_FORM","FITNESS","NOC","B_FORM"];

  // Some expiry dates within 30 days
  const renewalExpiryDays = [10, 20, 25, 5, 15, 90, 180, 365, 8, 12, 45, 60, -10, -30, 28, 3, 180, -5, 60, 120];

  for (let i = 0; i < 20; i++) {
    const firmId = firmIds.length > i ? firmIds[i] : firmIds[0];
    if (!firmId) continue;
    const refNo = `RNW-2024-${String(2001 + i).padStart(4, "0")}`;
    await prisma.renewalApplication.create({
      data: {
        refNo,
        firmId,
        certType: renewalCertTypes[i] as "NOC" | "B_FORM" | "FITNESS",
        expiryDate: daysFromNow(renewalExpiryDays[i]),
        submittedAt: daysAgo(30 - i),
        status: renewalStatuses[i] as "PENDING" | "APPROVED" | "REJECTED" | "UNDER_REVIEW",
      },
    }).catch(() => null);
  }
  console.log("Renewal applications seeded");

  // ── OBJECT INSTANCES / LOCATIONS for INSPECTIONS ──────────────────────────────
  const buildingCategory = await prisma.buildingCategory.upsert({
    where: { id: "demo-building-cat" },
    update: {},
    create: { id: "demo-building-cat", name: "General Building" },
  }).catch(async () =>
    prisma.buildingCategory.findFirst({ where: { name: "General Building" } })
  );

  const buildingObjectType = await prisma.objectType.create({
    data: { name: "Building", categoryId: buildingCategory!.id },
  }).catch(async () => {
    return prisma.objectType.findFirst({ where: { name: "Building" } });
  });

  const locationInstances: string[] = [];
  if (buildingObjectType) {
    const locationNames = [
      "Seawoods Mall – Block A", "Belapur IT Tower", "Vashi Market Complex",
      "Airoli Pharma Unit", "Thane MIDC Factory", "CBD Belapur Office Complex",
      "Panvel Bus Terminal", "Dombivli Textile Mill", "Kalamboli Warehouse",
      "Ghansoli Hospital",
    ];
    for (const loc of locationNames) {
      const inst = await prisma.objectInstance.create({
        data: {
          objectTypeId: buildingObjectType.id,
          isActive: true,
          serialNo: loc.replace(/\s+/g, "-").toUpperCase().substring(0, 20),
        },
      }).catch(() => null);
      if (inst) locationInstances.push(inst.id);
    }
  }

  // ── 10 SCHEDULED INSPECTIONS ─────────────────────────────────────────────────
  if (locationInstances.length > 0) {
    const inspectionData = [
      { title: "Annual Fire Safety Inspection – Seawoods Mall", status: "SCHEDULED", days: 8 },
      { title: "Quarterly Inspection – Belapur IT Tower", status: "SCHEDULED", days: 14 },
      { title: "Fire NOC Verification – Vashi Market", status: "SCHEDULED", days: 3 },
      { title: "Post-Incident Inspection – Airoli Pharma", status: "IN_PROGRESS", days: -1 },
      { title: "Routine Safety Check – Thane MIDC", status: "COMPLETED", days: -15 },
      { title: "Pre-Occupancy Inspection – Belapur Office", status: "SCHEDULED", days: 21 },
      { title: "Renewal Inspection – Panvel Bus Terminal", status: "SCHEDULED", days: 10 },
      { title: "Compliance Audit Inspection – Dombivli Mill", status: "COMPLETED", days: -30 },
      { title: "Surprise Inspection – Kalamboli Warehouse", status: "COMPLETED", days: -45 },
      { title: "Annual Check – Ghansoli Hospital", status: "CANCELLED", days: -5 },
    ];

    for (let i = 0; i < inspectionData.length; i++) {
      const locId = locationInstances[i % locationInstances.length];
      const insp = inspectionData[i];
      await prisma.scheduledInspection.create({
        data: {
          title: insp.title,
          locationId: locId,
          inspectorId: superAdmin.id,
          scheduledAt: daysFromNow(insp.days),
          status: insp.status as "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED",
        },
      }).catch(() => null);
    }
    console.log("Scheduled inspections seeded");
  }

  // ── DEVIATIONS ────────────────────────────────────────────────────────────────
  const deviationDescs = [
    "Fire extinguisher missing in server room corridor",
    "Emergency exit door blocked by stacked goods",
    "Smoke detector non-functional on 3rd floor",
    "Fire hose reel not accessible – cabinet locked",
    "Fire safety signage missing on stairwells B and C",
    "Sprinkler head obstructed by false ceiling",
    "Fire pump not operational during test",
    "Exit lighting non-functional in basement parking",
    "Electrical panel room door left open continuously",
    "Hydrant valve corroded and non-operational",
  ];
  const deviationStatuses = ["OPEN","OPEN","OPEN","OPEN","OPEN","CLOSED","CLOSED","CLOSED","CLOSED","CLOSED"];

  for (let i = 0; i < deviationDescs.length; i++) {
    const devTypeId = deviationTypeIds.length > 0 ? deviationTypeIds[i % deviationTypeIds.length] : undefined;
    await prisma.deviation.create({
      data: {
        description: deviationDescs[i],
        deviationTypeId: devTypeId,
        status: deviationStatuses[i],
        imageUrls: [],
        createdAt: daysAgo(20 - i * 2),
      },
    }).catch(() => null);
  }
  console.log("Deviations seeded");

  // ── 8 AUDITS + OBSERVATIONS ───────────────────────────────────────────────────
  const auditData = [
    { auditNo: "AUD-2024-001", status: "IN_PROGRESS", scheduledDays: -5, typeIdx: 0 },
    { auditNo: "AUD-2024-002", status: "PLANNED", scheduledDays: 10, typeIdx: 1 },
    { auditNo: "AUD-2024-003", status: "PLANNED", scheduledDays: 20, typeIdx: 2 },
    { auditNo: "AUD-2024-004", status: "COMPLETED", scheduledDays: -30, typeIdx: 3 },
    { auditNo: "AUD-2024-005", status: "COMPLETED", scheduledDays: -60, typeIdx: 0 },
    { auditNo: "AUD-2024-006", status: "IN_PROGRESS", scheduledDays: -3, typeIdx: 1 },
    { auditNo: "AUD-2024-007", status: "PLANNED", scheduledDays: 30, typeIdx: 2 },
    { auditNo: "AUD-2024-008", status: "COMPLETED", scheduledDays: -90, typeIdx: 3 },
  ];

  const observationData = [
    // Audit 1 observations
    [
      { task: "Fire Extinguisher Inspection", obs: "CO2 extinguishers in Block A expired. 12 units need replacement.", risk: "HIGH", critical: true, status: "OPEN" },
      { task: "Sprinkler System Check", obs: "Sprinkler heads in parking basement partially blocked by overhead storage.", risk: "MEDIUM", critical: false, status: "OPEN" },
      { task: "Emergency Lighting", obs: "3 emergency lights non-functional on staircase C.", risk: "MEDIUM", critical: false, status: "CLOSED" },
    ],
    // Audit 2 observations
    [
      { task: "Fire Alarm Panel", obs: "Fire alarm panel shows zone 4 fault. Fault persisting for 3 days.", risk: "HIGH", critical: true, status: "OPEN" },
      { task: "Evacuation Plan", obs: "Evacuation floor plans not updated after recent floor renovation.", risk: "LOW", critical: false, status: "OPEN" },
    ],
    // Audit 3 – no observations yet (planned)
    [],
    // Audit 4 – completed, all closed
    [
      { task: "Hose Reel Pressure Test", obs: "Hose reel pressure below standard on 2nd floor.", risk: "MEDIUM", critical: false, status: "CLOSED" },
      { task: "Exit Signage", obs: "Exit signs faded in basement car park.", risk: "LOW", critical: false, status: "CLOSED" },
    ],
    // Audit 5 – completed
    [
      { task: "SCBA Storage", obs: "2 SCBA sets found with expired cylinder charges.", risk: "HIGH", critical: true, status: "OPEN" },
      { task: "Fire Pump Annual Check", obs: "Jockey pump pressure switch showing intermittent faults.", risk: "HIGH", critical: true, status: "OPEN" },
      { task: "Hydrant Pressure", obs: "Roof-level hydrant pressure below specified 3.5 bar.", risk: "MEDIUM", critical: false, status: "OPEN" },
    ],
    // Audit 6 – in progress
    [
      { task: "First Aid Kit Inventory", obs: "First aid kits incomplete – missing tourniquets and burn dressings.", risk: "MEDIUM", critical: false, status: "OPEN" },
      { task: "Chemical Storage", obs: "Flammable solvents stored without proper ventilation or bonding.", risk: "HIGH", critical: true, status: "OPEN" },
    ],
    // Audit 7 – planned, no observations
    [],
    // Audit 8 – completed
    [
      { task: "Training Records", obs: "Fire safety training records not maintained for contract staff.", risk: "LOW", critical: false, status: "CLOSED" },
    ],
  ];

  for (let i = 0; i < auditData.length; i++) {
    const a = auditData[i];
    const typeId = auditTypeIds.length > a.typeIdx ? auditTypeIds[a.typeIdx] : auditTypeIds[0];
    if (!typeId) continue;

    const locId = locationInstances.length > 0 ? locationInstances[i % locationInstances.length] : undefined;

    const audit = await prisma.audit.create({
      data: {
        auditNo: a.auditNo,
        typeId,
        locationId: locId,
        scheduledAt: daysFromNow(a.scheduledDays),
        conductedAt: a.status === "COMPLETED" ? daysAgo(Math.abs(a.scheduledDays)) : undefined,
        auditorTeam: ["Shri Suresh Patil", "Smt Rekha Kadam"],
        status: a.status as "PLANNED" | "IN_PROGRESS" | "COMPLETED",
      },
    }).catch(() => null);

    if (audit) {
      const observations = observationData[i] ?? [];
      for (const obs of observations) {
        await prisma.auditObservation.create({
          data: {
            auditId: audit.id,
            taskName: obs.task,
            observation: obs.obs,
            riskLevel: obs.risk,
            imageUrls: [],
            isCritical: obs.critical,
            status: obs.status,
          },
        }).catch(() => null);
      }
    }
  }
  console.log("Audits and observations seeded");

  console.log("\n Seed complete!");
  console.log("-----------------------------------------");
  console.log("   Super Admin Login:");
  console.log("   Email:    superadmin@firedrive.gov.in");
  console.log("   Password: Fire@Admin#2026");
  console.log("-----------------------------------------");
  console.log("Demo data summary:");
  console.log("  50 Employees | 30 NOC Applications | 25 Incidents");
  console.log("  15 Vehicles  | 15 Store Items       | 10 Trainings");
  console.log("  12 Drills    | 20 Renewals          | 10 Inspections");
  console.log("  8 Audits     | 10 Deviations");
  console.log("-----------------------------------------");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
