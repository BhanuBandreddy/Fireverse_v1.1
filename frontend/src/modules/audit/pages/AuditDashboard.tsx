import { Grid, Column, Tile, Heading } from "@carbon/react";
import { GroupedBarChart, DonutChart } from "@carbon/charts-react";
import { ScaleTypes } from "@carbon/charts";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { CalendarAdd, InProgress, CheckmarkOutline, Warning } from "@carbon/icons-react";

const barData = [
  { group: "Planned", key: "Jan", value: 5 },
  { group: "Planned", key: "Feb", value: 7 },
  { group: "Planned", key: "Mar", value: 4 },
  { group: "Planned", key: "Apr", value: 6 },
  { group: "Completed", key: "Jan", value: 6 },
  { group: "Completed", key: "Feb", value: 8 },
  { group: "Completed", key: "Mar", value: 7 },
  { group: "Completed", key: "Apr", value: 7 },
];

const donutData = [
  { group: "Fire Safety", value: 14 },
  { group: "Equipment", value: 8 },
  { group: "Building Compliance", value: 4 },
  { group: "Operational", value: 2 },
];

const recentAudits = [
  { auditNo: "AUD-2026-012", type: "Fire Safety", location: "Sunrise Tower", scheduled: "2026-04-02", conducted: "2026-04-02", status: "COMPLETED" },
  { auditNo: "AUD-2026-011", type: "Equipment", location: "Station Alpha", scheduled: "2026-04-05", conducted: "-", status: "PLANNED" },
  { auditNo: "AUD-2026-010", type: "Building Compliance", location: "MIDC Office Park", scheduled: "2026-03-28", conducted: "2026-03-28", status: "COMPLETED" },
  { auditNo: "AUD-2026-009", type: "Operational", location: "HQ", scheduled: "2026-03-20", conducted: "2026-03-21", status: "COMPLETED" },
];

export default function AuditDashboard() {
  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <PageHeader title="Audit Management" subtitle="Fire safety audits, inspections and compliance tracking" />
      </Column>

      <Column lg={4} md={2} sm={4}>
        <StatCard label="Planned" value={6} Icon={CalendarAdd} colorToken="--cds-support-info" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="In Progress" value={2} Icon={InProgress} colorToken="--cds-support-warning" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Completed" value={28} Icon={CheckmarkOutline} colorToken="--cds-support-success" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Critical Observations" value={9} Icon={Warning} colorToken="--cds-support-error" />
      </Column>

      <Column lg={8} md={4} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Monthly Audit Activity</Heading>
          <GroupedBarChart
            data={barData}
            options={{
              height: "260px",
              axes: { left: { mapsTo: "value" }, bottom: { mapsTo: "key", scaleType: ScaleTypes.LABELS } },
              legend: { enabled: true },
            }}
          />
        </Tile>
      </Column>
      <Column lg={8} md={4} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Audits by Type</Heading>
          <DonutChart
            data={donutData}
            options={{
              height: "260px",
              donut: { center: { label: "Audits" } },
              legend: { enabled: true },
            }}
          />
        </Tile>
      </Column>

      <Column lg={16} md={8} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem", marginBottom: "2rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Recent Audits</Heading>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--cds-border-subtle)" }}>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Audit No</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Type</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Location</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Scheduled</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Conducted</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAudits.map((a, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--cds-border-subtle-01)" }}>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-primary)" }}>{a.auditNo}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{a.type}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{a.location}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{a.scheduled}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{a.conducted}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Tile>
      </Column>
    </Grid>
  );
}
