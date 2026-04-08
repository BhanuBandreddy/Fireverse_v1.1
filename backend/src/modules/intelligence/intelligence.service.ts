import { prisma } from "../../lib/prisma";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IntelligenceResult {
  answer: string;
  data?: Record<string, unknown>[];
  chart?: { labels: string[]; values: number[]; type: string };
  module: string;
  intent: string;
}

export interface KPI {
  label: string;
  value: number;
  unit?: string;
  status: "ok" | "warn" | "critical";
}

export interface Alert {
  module: string;
  message: string;
  severity: "info" | "warn" | "critical";
}

export interface ExecutiveSummary {
  kpis: KPI[];
  alerts: Alert[];
}

// ─── Intent definitions ────────────────────────────────────────────────────────

interface IntentDef {
  key: string;
  keywords: string[];
  handler: () => Promise<IntelligenceResult>;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function scoreIntent(query: string, keywords: string[]): number {
  let score = 0;
  for (const kw of keywords) {
    if (query.includes(kw)) score += 1;
  }
  return score;
}

// ─── Intent Handlers ──────────────────────────────────────────────────────────

async function handleOverallSummary(): Promise<IntelligenceResult> {
  const [
    activeEmployees,
    openIncidents,
    inProgressIncidents,
    pendingNoc,
    pendingRenewals,
    activeVehicles,
    upcomingDrills,
    plannedAudits,
    inProgressAudits,
  ] = await Promise.all([
    prisma.employee.count({ where: { isActive: true } }),
    prisma.incident.count({ where: { status: "OPEN" } }),
    prisma.incident.count({ where: { status: "IN_PROGRESS" } }),
    prisma.nOCApplication.count({ where: { status: "PENDING" } }),
    prisma.renewalApplication.count({ where: { status: "PENDING" } }),
    prisma.vehicle.count({ where: { isActive: true } }),
    prisma.drill.count({ where: { status: "SCHEDULED" } }),
    prisma.audit.count({ where: { status: "PLANNED" } }),
    prisma.audit.count({ where: { status: "IN_PROGRESS" } }),
  ]);

  const data: Record<string, unknown>[] = [
    { module: "Employees", metric: "Active Employees", value: activeEmployees },
    { module: "Incidents", metric: "Open Incidents", value: openIncidents },
    { module: "Incidents", metric: "In-Progress Incidents", value: inProgressIncidents },
    { module: "NOC", metric: "Pending NOC Applications", value: pendingNoc },
    { module: "Renewals", metric: "Pending Renewals", value: pendingRenewals },
    { module: "Vehicles", metric: "Active Vehicles", value: activeVehicles },
    { module: "Drills", metric: "Upcoming Scheduled Drills", value: upcomingDrills },
    { module: "Audits", metric: "Planned + In-Progress Audits", value: plannedAudits + inProgressAudits },
  ];

  const answer = `System Overview: ${activeEmployees} active employees, ${openIncidents + inProgressIncidents} active incidents (${openIncidents} open, ${inProgressIncidents} in progress), ${pendingNoc} pending NOC applications, ${pendingRenewals} pending renewals, ${activeVehicles} active vehicles, ${upcomingDrills} scheduled drills, ${plannedAudits + inProgressAudits} active audits.`;

  return { answer, data, module: "Dashboard", intent: "overall_summary" };
}

async function handleIncidentSummary(): Promise<IntelligenceResult> {
  const [openCount, inProgressCount, closedCount, activeIncidents] = await Promise.all([
    prisma.incident.count({ where: { status: "OPEN" } }),
    prisma.incident.count({ where: { status: "IN_PROGRESS" } }),
    prisma.incident.count({ where: { status: "CLOSED" } }),
    prisma.incident.findMany({
      where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
      select: { incidentNo: true, title: true, priority: true, address: true, status: true, reportedAt: true },
      orderBy: { reportedAt: "desc" },
      take: 10,
    }),
  ]);

  const chart = {
    labels: ["Open", "In Progress", "Closed"],
    values: [openCount, inProgressCount, closedCount],
    type: "bar",
  };

  const answer = `Incident Summary: ${openCount} open, ${inProgressCount} in progress, ${closedCount} closed. ${activeIncidents.length} active incidents listed.`;

  return {
    answer,
    data: activeIncidents as unknown as Record<string, unknown>[],
    chart,
    module: "Incident",
    intent: "incident_summary",
  };
}

async function handleCriticalIncidents(): Promise<IntelligenceResult> {
  const incidents = await prisma.incident.findMany({
    where: {
      AND: [
        { status: { not: "CLOSED" } },
        { OR: [{ priority: "CRITICAL" }, { severity: "VERY_HIGH" }] },
      ],
    },
    select: {
      incidentNo: true,
      title: true,
      priority: true,
      severity: true,
      address: true,
      status: true,
      reportedAt: true,
    },
    orderBy: { reportedAt: "desc" },
  });

  const answer =
    incidents.length === 0
      ? "No critical or high-severity active incidents at this time."
      : `${incidents.length} critical/high-severity incident(s) requiring immediate attention.`;

  return {
    answer,
    data: incidents as unknown as Record<string, unknown>[],
    module: "Incident",
    intent: "critical_incidents",
  };
}

async function handleNocSummary(): Promise<IntelligenceResult> {
  const [pending, approved, rejected, underReview, recent] = await Promise.all([
    prisma.nOCApplication.count({ where: { status: "PENDING" } }),
    prisma.nOCApplication.count({ where: { status: "APPROVED" } }),
    prisma.nOCApplication.count({ where: { status: "REJECTED" } }),
    prisma.nOCApplication.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.nOCApplication.findMany({
      select: {
        applicationNo: true,
        applicantName: true,
        projectName: true,
        city: true,
        status: true,
        nocType: true,
      },
      orderBy: { id: "desc" },
      take: 5,
    }),
  ]);

  const chart = {
    labels: ["Pending", "Approved", "Rejected", "Under Review"],
    values: [pending, approved, rejected, underReview],
    type: "pie",
  };

  const answer = `NOC Applications: ${pending} pending, ${approved} approved, ${rejected} rejected, ${underReview} under review. Total: ${pending + approved + rejected + underReview}.`;

  return {
    answer,
    data: recent as unknown as Record<string, unknown>[],
    chart,
    module: "NOC",
    intent: "noc_summary",
  };
}

async function handleNocPending(): Promise<IntelligenceResult> {
  const applications = await prisma.nOCApplication.findMany({
    where: { status: { in: ["PENDING", "UNDER_REVIEW"] } },
    select: {
      applicationNo: true,
      applicantName: true,
      projectName: true,
      city: true,
      ward: true,
      status: true,
      nocType: true,
    },
    orderBy: { id: "desc" },
  });

  const answer = `${applications.length} NOC application(s) are pending or under review.`;

  return {
    answer,
    data: applications as unknown as Record<string, unknown>[],
    module: "NOC",
    intent: "noc_pending",
  };
}

async function handleEmployeeSummary(): Promise<IntelligenceResult> {
  const [total, active, byDept] = await Promise.all([
    prisma.employee.count(),
    prisma.employee.count({ where: { isActive: true } }),
    prisma.employee.groupBy({
      by: ["departmentId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
  ]);

  const deptIds = byDept.map((d) => d.departmentId).filter(Boolean) as string[];
  const departments = await prisma.department.findMany({
    where: { id: { in: deptIds } },
    select: { id: true, name: true },
  });
  const deptMap = new Map(departments.map((d) => [d.id, d.name]));

  const deptData = byDept.map((d) => ({
    department: deptMap.get(d.departmentId ?? "") ?? "Unassigned",
    count: d._count.id,
  }));

  const chart = {
    labels: deptData.map((d) => d.department),
    values: deptData.map((d) => d.count),
    type: "bar",
  };

  const answer = `Employee Summary: ${total} total employees, ${active} active (${total - active} inactive). Top 5 departments shown.`;

  return {
    answer,
    data: deptData,
    chart,
    module: "HR",
    intent: "employee_summary",
  };
}

async function handleVehicleStatus(): Promise<IntelligenceResult> {
  const [active, inactive, inactiveList] = await Promise.all([
    prisma.vehicle.count({ where: { isActive: true } }),
    prisma.vehicle.count({ where: { isActive: false } }),
    prisma.vehicle.findMany({
      where: { isActive: false },
      select: { registrationNo: true, make: true, model: true, bodyType: true },
    }),
  ]);

  const chart = {
    labels: ["Active", "Inactive"],
    values: [active, inactive],
    type: "doughnut",
  };

  const answer = `Fleet Status: ${active} active vehicles, ${inactive} inactive/off-road.`;

  return {
    answer,
    data: inactiveList as unknown as Record<string, unknown>[],
    chart,
    module: "Vehicle",
    intent: "vehicle_status",
  };
}

async function handleVehicleOffline(): Promise<IntelligenceResult> {
  const vehicles = await prisma.vehicle.findMany({
    where: { isActive: false },
    select: {
      registrationNo: true,
      make: true,
      model: true,
      bodyType: true,
    },
  });

  const answer =
    vehicles.length === 0
      ? "All vehicles are currently operational."
      : `${vehicles.length} vehicle(s) are offline/out of service.`;

  return {
    answer,
    data: vehicles as unknown as Record<string, unknown>[],
    module: "Vehicle",
    intent: "vehicle_offline",
  };
}

async function handleEquipmentStatus(): Promise<IntelligenceResult> {
  const lowStockItems = await prisma.inventoryItem.findMany({
    where: {
      item: {
        reorderLevel: { not: null },
      },
    },
    include: {
      item: { select: { name: true, code: true, reorderLevel: true, uom: true } },
      warehouse: { select: { name: true } },
    },
  });

  const belowReorder = lowStockItems.filter(
    (inv) => inv.item.reorderLevel !== null && inv.quantity <= (inv.item.reorderLevel ?? 0)
  );

  const data = belowReorder.map((inv) => ({
    itemName: inv.item.name,
    itemCode: inv.item.code,
    warehouse: inv.warehouse.name,
    currentQuantity: inv.quantity,
    reorderLevel: inv.item.reorderLevel,
    uom: inv.item.uom,
  }));

  const answer =
    belowReorder.length === 0
      ? "All inventory items are above reorder levels."
      : `${belowReorder.length} item(s) are at or below reorder level and need restocking.`;

  return { answer, data, module: "Equipment", intent: "equipment_status" };
}

async function handleTrainingSummary(): Promise<IntelligenceResult> {
  const [scheduled, ongoing, completed, cancelled, upcoming] = await Promise.all([
    prisma.trainingSchedule.count({ where: { status: "SCHEDULED" } }),
    prisma.trainingSchedule.count({ where: { status: "ONGOING" } }),
    prisma.trainingSchedule.count({ where: { status: "COMPLETED" } }),
    prisma.trainingSchedule.count({ where: { status: "CANCELLED" } }),
    prisma.trainingSchedule.findMany({
      where: { status: { in: ["SCHEDULED", "ONGOING"] } },
      select: { title: true, startDate: true, endDate: true, trainerName: true, status: true },
      orderBy: { startDate: "asc" },
      take: 10,
    }),
  ]);

  const chart = {
    labels: ["Scheduled", "Ongoing", "Completed", "Cancelled"],
    values: [scheduled, ongoing, completed, cancelled],
    type: "bar",
  };

  const answer = `Training Summary: ${scheduled} scheduled, ${ongoing} ongoing, ${completed} completed, ${cancelled} cancelled.`;

  return {
    answer,
    data: upcoming as unknown as Record<string, unknown>[],
    chart,
    module: "Training",
    intent: "training_summary",
  };
}

async function handleDrillSummary(): Promise<IntelligenceResult> {
  const [requested, planned, scheduled, completed, closed, activeDrills] = await Promise.all([
    prisma.drill.count({ where: { status: "REQUESTED" } }),
    prisma.drill.count({ where: { status: "PLANNED" } }),
    prisma.drill.count({ where: { status: "SCHEDULED" } }),
    prisma.drill.count({ where: { status: "COMPLETED" } }),
    prisma.drill.count({ where: { status: "CLOSED" } }),
    prisma.drill.findMany({
      where: { status: { in: ["SCHEDULED", "PLANNED"] } },
      select: { title: true, status: true, scheduledAt: true, owner: true, ward: true },
      orderBy: { scheduledAt: "asc" },
      take: 10,
    }),
  ]);

  const chart = {
    labels: ["Requested", "Planned", "Scheduled", "Completed", "Closed"],
    values: [requested, planned, scheduled, completed, closed],
    type: "bar",
  };

  const answer = `Mock Drill Summary: ${scheduled} scheduled, ${planned} planned, ${requested} requested, ${completed} completed, ${closed} closed.`;

  return {
    answer,
    data: activeDrills as unknown as Record<string, unknown>[],
    chart,
    module: "Mock Drill",
    intent: "drill_summary",
  };
}

async function handleRenewalSummary(): Promise<IntelligenceResult> {
  const [pending, approved, rejected, underReview, recent] = await Promise.all([
    prisma.renewalApplication.count({ where: { status: "PENDING" } }),
    prisma.renewalApplication.count({ where: { status: "APPROVED" } }),
    prisma.renewalApplication.count({ where: { status: "REJECTED" } }),
    prisma.renewalApplication.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.renewalApplication.findMany({
      select: { refNo: true, certType: true, expiryDate: true, status: true, submittedAt: true },
      orderBy: { submittedAt: "desc" },
      take: 10,
    }),
  ]);

  const chart = {
    labels: ["Pending", "Approved", "Rejected", "Under Review"],
    values: [pending, approved, rejected, underReview],
    type: "pie",
  };

  const answer = `Renewal Applications: ${pending} pending, ${approved} approved, ${rejected} rejected, ${underReview} under review.`;

  return {
    answer,
    data: recent as unknown as Record<string, unknown>[],
    chart,
    module: "Renewal",
    intent: "renewal_summary",
  };
}

async function handleRenewalExpiring(): Promise<IntelligenceResult> {
  const now = new Date();
  const in30Days = new Date();
  in30Days.setDate(in30Days.getDate() + 30);

  const expiring = await prisma.renewalApplication.findMany({
    where: {
      expiryDate: { gte: now, lte: in30Days },
      status: { not: "REJECTED" },
    },
    select: {
      refNo: true,
      certType: true,
      expiryDate: true,
      status: true,
    },
    orderBy: { expiryDate: "asc" },
  });

  const answer =
    expiring.length === 0
      ? "No renewal certificates expiring in the next 30 days."
      : `${expiring.length} renewal certificate(s) expiring within the next 30 days.`;

  return {
    answer,
    data: expiring as unknown as Record<string, unknown>[],
    module: "Renewal",
    intent: "renewal_expiring",
  };
}

async function handleInspectionSummary(): Promise<IntelligenceResult> {
  const [scheduled, inProgress, completed, cancelled] = await Promise.all([
    prisma.scheduledInspection.count({ where: { status: "SCHEDULED" } }),
    prisma.scheduledInspection.count({ where: { status: "IN_PROGRESS" } }),
    prisma.scheduledInspection.count({ where: { status: "COMPLETED" } }),
    prisma.scheduledInspection.count({ where: { status: "CANCELLED" } }),
  ]);

  const chart = {
    labels: ["Scheduled", "In Progress", "Completed", "Cancelled"],
    values: [scheduled, inProgress, completed, cancelled],
    type: "bar",
  };

  const answer = `Inspection Summary: ${scheduled} scheduled, ${inProgress} in progress, ${completed} completed, ${cancelled} cancelled.`;

  return {
    answer,
    chart,
    module: "Inspection",
    intent: "inspection_summary",
  };
}

async function handleAuditSummary(): Promise<IntelligenceResult> {
  const [planned, inProgress, completed, openCritical] = await Promise.all([
    prisma.audit.count({ where: { status: "PLANNED" } }),
    prisma.audit.count({ where: { status: "IN_PROGRESS" } }),
    prisma.audit.count({ where: { status: "COMPLETED" } }),
    prisma.auditObservation.count({ where: { status: "OPEN", isCritical: true } }),
  ]);

  const chart = {
    labels: ["Planned", "In Progress", "Completed"],
    values: [planned, inProgress, completed],
    type: "bar",
  };

  const answer = `Audit Summary: ${planned} planned, ${inProgress} in progress, ${completed} completed. ${openCritical} open critical observation(s).`;

  return {
    answer,
    chart,
    module: "Audit",
    intent: "audit_summary",
  };
}

async function handleOpenObservations(): Promise<IntelligenceResult> {
  const observations = await prisma.auditObservation.findMany({
    where: { status: "OPEN" },
    select: {
      taskName: true,
      observation: true,
      riskLevel: true,
      isCritical: true,
      audit: { select: { auditNo: true } },
    },
    orderBy: { isCritical: "desc" },
  });

  const critical = observations.filter((o) => o.isCritical).length;
  const answer = `${observations.length} open audit observation(s), of which ${critical} are critical.`;

  return {
    answer,
    data: observations.map((o) => ({
      auditNo: o.audit.auditNo,
      taskName: o.taskName,
      observation: o.observation,
      riskLevel: o.riskLevel,
      isCritical: o.isCritical,
    })),
    module: "Audit",
    intent: "open_observations",
  };
}

async function handleDeviations(): Promise<IntelligenceResult> {
  const [openDeviations, openDiscrepancies, recentDeviations] = await Promise.all([
    prisma.deviation.count({ where: { status: "OPEN" } }),
    prisma.vehicleDiscrepancy.count({ where: { status: "OPEN" } }),
    prisma.deviation.findMany({
      where: { status: "OPEN" },
      select: { description: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const answer = `Open Deviations: ${openDeviations} inspection deviations + ${openDiscrepancies} vehicle discrepancies currently unresolved.`;

  return {
    answer,
    data: recentDeviations as unknown as Record<string, unknown>[],
    module: "Inspection",
    intent: "deviations",
  };
}

async function handleMonthlyIncidents(): Promise<IntelligenceResult> {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const incidents = await prisma.incident.findMany({
    where: { reportedAt: { gte: sixMonthsAgo } },
    select: { reportedAt: true },
    orderBy: { reportedAt: "asc" },
  });

  const monthCounts: Record<string, number> = {};
  for (const incident of incidents) {
    const key = incident.reportedAt.toISOString().substring(0, 7); // YYYY-MM
    monthCounts[key] = (monthCounts[key] ?? 0) + 1;
  }

  const sortedKeys = Object.keys(monthCounts).sort();
  const labels = sortedKeys.map((k) => {
    const [year, month] = k.split("-");
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleString("en-IN", {
      month: "short",
      year: "numeric",
    });
  });
  const values = sortedKeys.map((k) => monthCounts[k]);

  const answer = `Monthly Incident Trend (last 6 months): ${incidents.length} total incidents across ${sortedKeys.length} months.`;

  return {
    answer,
    chart: { labels, values, type: "line" },
    module: "Incident",
    intent: "monthly_incidents",
  };
}

async function handleUpcomingEvents(): Promise<IntelligenceResult> {
  const now = new Date();
  const in30Days = new Date();
  in30Days.setDate(in30Days.getDate() + 30);

  const [upcomingTrainings, upcomingDrills, upcomingInspections] = await Promise.all([
    prisma.trainingSchedule.findMany({
      where: { startDate: { gte: now, lte: in30Days }, status: "SCHEDULED" },
      select: { title: true, startDate: true, trainerName: true, status: true },
      orderBy: { startDate: "asc" },
    }),
    prisma.drill.findMany({
      where: {
        scheduledAt: { gte: now, lte: in30Days },
        status: { in: ["SCHEDULED", "PLANNED"] },
      },
      select: { title: true, scheduledAt: true, status: true, owner: true },
      orderBy: { scheduledAt: "asc" },
    }),
    prisma.scheduledInspection.findMany({
      where: { scheduledAt: { gte: now, lte: in30Days }, status: "SCHEDULED" },
      select: { title: true, scheduledAt: true, status: true },
      orderBy: { scheduledAt: "asc" },
    }),
  ]);

  const data: Record<string, unknown>[] = [
    ...upcomingTrainings.map((t) => ({ type: "Training", ...t })),
    ...upcomingDrills.map((d) => ({ type: "Drill", ...d })),
    ...upcomingInspections.map((i) => ({ type: "Inspection", ...i })),
  ];

  data.sort((a, b) => {
    const aDate = (a.startDate ?? a.scheduledAt) as Date;
    const bDate = (b.startDate ?? b.scheduledAt) as Date;
    return new Date(aDate).getTime() - new Date(bDate).getTime();
  });

  const answer = `Upcoming events in next 30 days: ${upcomingTrainings.length} training(s), ${upcomingDrills.length} drill(s), ${upcomingInspections.length} inspection(s).`;

  return { answer, data, module: "Dashboard", intent: "upcoming_events" };
}

async function handleAttendanceSummary(): Promise<IntelligenceResult> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [totalEmployees, todayRecords] = await Promise.all([
    prisma.employee.count({ where: { isActive: true } }),
    prisma.attendance.findMany({
      where: { date: { gte: today, lt: tomorrow } },
      select: {
        employee: { select: { firstName: true, lastName: true, employeeCode: true } },
        status: true,
        checkIn: true,
        checkOut: true,
        shiftType: true,
      },
      take: 50,
    }),
  ]);

  const present = todayRecords.filter((r) => r.status === "PRESENT").length;
  const absent = todayRecords.filter((r) => r.status === "ABSENT").length;

  const answer = `Attendance Summary: ${totalEmployees} active employees. Today: ${todayRecords.length} records (${present} present, ${absent} absent).`;

  return {
    answer,
    data: todayRecords as unknown as Record<string, unknown>[],
    module: "HR",
    intent: "attendance_summary",
  };
}

function handleUnknown(query: string): IntelligenceResult {
  return {
    answer: `I couldn't match your query "${query}" to a known topic. I can answer questions about: incidents, NOC applications, employees, vehicles, equipment/inventory, training, drills, renewals, inspections, audits, deviations, monthly trends, upcoming events, attendance, and overall system summaries. Please try rephrasing using those keywords.`,
    module: "Dashboard",
    intent: "unknown",
  };
}

// ─── Intent registry ──────────────────────────────────────────────────────────

function buildIntents(): IntentDef[] {
  return [
    {
      key: "overall_summary",
      keywords: ["summary", "overview", "status", "all modules", "report", "dashboard", "overall"],
      handler: handleOverallSummary,
    },
    {
      key: "incident_summary",
      keywords: ["incident", "fire report", "emergency", "fire call"],
      handler: handleIncidentSummary,
    },
    {
      key: "critical_incidents",
      keywords: ["critical", "high priority", "urgent", "severe", "very high"],
      handler: handleCriticalIncidents,
    },
    {
      key: "noc_summary",
      keywords: ["noc", "no objection", "certificate", "noc application"],
      handler: handleNocSummary,
    },
    {
      key: "noc_pending",
      keywords: ["pending noc", "awaiting noc", "under review noc", "noc pending", "noc awaiting"],
      handler: handleNocPending,
    },
    {
      key: "employee_summary",
      keywords: ["employee", "staff", "manpower", "personnel", "workforce", "headcount"],
      handler: handleEmployeeSummary,
    },
    {
      key: "vehicle_status",
      keywords: ["vehicle", "fleet", "fire engine", "truck", "tanker", "fire tender"],
      handler: handleVehicleStatus,
    },
    {
      key: "vehicle_offline",
      keywords: ["offline", "breakdown", "out of service", "repair", "non-operational", "inactive vehicle"],
      handler: handleVehicleOffline,
    },
    {
      key: "equipment_status",
      keywords: ["equipment", "inventory", "stock", "store", "low stock", "reorder"],
      handler: handleEquipmentStatus,
    },
    {
      key: "training_summary",
      keywords: ["training", "course", "learning", "training schedule"],
      handler: handleTrainingSummary,
    },
    {
      key: "drill_summary",
      keywords: ["drill", "mock", "exercise", "simulation", "mock drill"],
      handler: handleDrillSummary,
    },
    {
      key: "renewal_summary",
      keywords: ["renewal", "certificate renewal", "renew", "b-form", "fitness certificate"],
      handler: handleRenewalSummary,
    },
    {
      key: "renewal_expiring",
      keywords: ["expiring", "expire soon", "due", "expiry", "about to expire"],
      handler: handleRenewalExpiring,
    },
    {
      key: "inspection_summary",
      keywords: ["inspection", "building check", "scheduled inspection", "fire inspection"],
      handler: handleInspectionSummary,
    },
    {
      key: "audit_summary",
      keywords: ["audit", "compliance audit", "observation", "fire audit"],
      handler: handleAuditSummary,
    },
    {
      key: "open_observations",
      keywords: ["open observation", "critical finding", "risk finding", "audit finding"],
      handler: handleOpenObservations,
    },
    {
      key: "deviations",
      keywords: ["deviation", "violation", "non-compliance", "deficiency", "discrepancy"],
      handler: handleDeviations,
    },
    {
      key: "monthly_incidents",
      keywords: ["this month", "monthly trend", "last 3 months", "monthly", "trend", "6 months"],
      handler: handleMonthlyIncidents,
    },
    {
      key: "upcoming_events",
      keywords: ["upcoming", "next week", "scheduled events", "what is coming", "coming up", "next 30 days"],
      handler: handleUpcomingEvents,
    },
    {
      key: "attendance_summary",
      keywords: ["attendance", "present", "absent", "today", "check in", "check out"],
      handler: handleAttendanceSummary,
    },
  ];
}

// ─── Main exported query function ────────────────────────────────────────────

export async function queryIntelligence(query: string): Promise<IntelligenceResult> {
  const normalised = query.toLowerCase().trim();
  const intents = buildIntents();

  let topIntent: IntentDef | null = null;
  let topScore = 0;

  for (const intent of intents) {
    const score = scoreIntent(normalised, intent.keywords);
    if (score > topScore) {
      topScore = score;
      topIntent = intent;
    }
  }

  if (!topIntent || topScore === 0) {
    return handleUnknown(query);
  }

  try {
    return await topIntent.handler();
  } catch (err) {
    console.error(`[Intelligence] Error in intent '${topIntent.key}':`, err);
    return {
      answer: `Error processing your query for intent '${topIntent.key}'. Please try again.`,
      module: "Dashboard",
      intent: topIntent.key,
    };
  }
}

// ─── Executive Summary ────────────────────────────────────────────────────────

export async function getExecutiveSummary(): Promise<ExecutiveSummary> {
  const [
    activeEmployees,
    openIncidents,
    criticalIncidents,
    pendingNoc,
    pendingRenewals,
    activeVehicles,
    inactiveVehicles,
    upcomingDrills,
    openCriticalObservations,
    lowStockItems,
  ] = await Promise.all([
    prisma.employee.count({ where: { isActive: true } }),
    prisma.incident.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
    prisma.incident.count({
      where: {
        AND: [
          { status: { not: "CLOSED" } },
          { OR: [{ priority: "CRITICAL" }, { severity: "VERY_HIGH" }] },
        ],
      },
    }),
    prisma.nOCApplication.count({ where: { status: "PENDING" } }),
    prisma.renewalApplication.count({ where: { status: "PENDING" } }),
    prisma.vehicle.count({ where: { isActive: true } }),
    prisma.vehicle.count({ where: { isActive: false } }),
    prisma.drill.count({ where: { status: { in: ["SCHEDULED", "PLANNED"] } } }),
    prisma.auditObservation.count({ where: { status: "OPEN", isCritical: true } }),
    // Low stock: items where quantity <= reorderLevel — we need all inventory to filter
    prisma.inventoryItem.findMany({
      where: { item: { reorderLevel: { not: null } } },
      select: { quantity: true, item: { select: { reorderLevel: true } } },
    }),
  ]);

  const lowStockCount = (lowStockItems as { quantity: number; item: { reorderLevel: number | null } }[]).filter(
    (inv) => inv.item.reorderLevel !== null && inv.quantity <= (inv.item.reorderLevel ?? 0)
  ).length;

  const kpis: KPI[] = [
    {
      label: "Active Employees",
      value: activeEmployees,
      status: activeEmployees > 0 ? "ok" : "warn",
    },
    {
      label: "Active Incidents",
      value: openIncidents,
      status: openIncidents === 0 ? "ok" : openIncidents <= 5 ? "warn" : "critical",
    },
    {
      label: "Critical Incidents",
      value: criticalIncidents,
      status: criticalIncidents === 0 ? "ok" : "critical",
    },
    {
      label: "Pending NOC Applications",
      value: pendingNoc,
      status: pendingNoc === 0 ? "ok" : pendingNoc <= 10 ? "warn" : "critical",
    },
    {
      label: "Pending Renewals",
      value: pendingRenewals,
      status: pendingRenewals === 0 ? "ok" : pendingRenewals <= 5 ? "warn" : "critical",
    },
    {
      label: "Active Vehicles",
      value: activeVehicles,
      status: activeVehicles > 0 ? "ok" : "critical",
    },
    {
      label: "Inactive Vehicles",
      value: inactiveVehicles,
      status: inactiveVehicles === 0 ? "ok" : inactiveVehicles <= 2 ? "warn" : "critical",
    },
    {
      label: "Upcoming Drills",
      value: upcomingDrills,
      status: "ok",
    },
    {
      label: "Open Critical Audit Observations",
      value: openCriticalObservations,
      status: openCriticalObservations === 0 ? "ok" : "critical",
    },
    {
      label: "Low Stock Items",
      value: lowStockCount,
      status: lowStockCount === 0 ? "ok" : lowStockCount <= 3 ? "warn" : "critical",
    },
  ];

  const alerts: Alert[] = [];

  if (criticalIncidents > 0) {
    alerts.push({
      module: "Incident",
      message: `${criticalIncidents} critical/high-severity incident(s) are open and require immediate attention.`,
      severity: "critical",
    });
  }

  if (openIncidents > 5) {
    alerts.push({
      module: "Incident",
      message: `${openIncidents} active incidents are currently in progress.`,
      severity: "warn",
    });
  }

  if (openCriticalObservations > 0) {
    alerts.push({
      module: "Audit",
      message: `${openCriticalObservations} critical audit observation(s) remain unresolved.`,
      severity: "critical",
    });
  }

  if (lowStockCount > 0) {
    alerts.push({
      module: "Equipment",
      message: `${lowStockCount} inventory item(s) are below reorder level and need immediate restocking.`,
      severity: lowStockCount > 3 ? "critical" : "warn",
    });
  }

  if (inactiveVehicles > 0) {
    alerts.push({
      module: "Vehicle",
      message: `${inactiveVehicles} vehicle(s) are currently offline or out of service.`,
      severity: inactiveVehicles > 2 ? "critical" : "warn",
    });
  }

  if (pendingNoc > 10) {
    alerts.push({
      module: "NOC",
      message: `${pendingNoc} NOC applications are pending review.`,
      severity: "warn",
    });
  }

  if (pendingRenewals > 5) {
    alerts.push({
      module: "Renewal",
      message: `${pendingRenewals} renewal applications are pending approval.`,
      severity: "warn",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      module: "Dashboard",
      message: "All systems are operating normally. No critical alerts at this time.",
      severity: "info",
    });
  }

  return { kpis, alerts };
}
