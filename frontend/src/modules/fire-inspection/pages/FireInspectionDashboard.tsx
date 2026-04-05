import { Grid, Column, Tile, Heading } from "@carbon/react";
import { GroupedBarChart, DonutChart } from "@carbon/charts-react";
import { ScaleTypes } from "@carbon/charts";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { CalendarAdd, InProgress, CheckmarkOutline, Warning } from "@carbon/icons-react";

const barData = [
  { group: "Scheduled", key: "Jan", value: 10 },
  { group: "Scheduled", key: "Feb", value: 8 },
  { group: "Scheduled", key: "Mar", value: 12 },
  { group: "Scheduled", key: "Apr", value: 6 },
  { group: "Completed", key: "Jan", value: 35 },
  { group: "Completed", key: "Feb", value: 40 },
  { group: "Completed", key: "Mar", value: 38 },
  { group: "Completed", key: "Apr", value: 29 },
];

const donutData = [
  { group: "Residential", value: 45 },
  { group: "Commercial", value: 30 },
  { group: "Industrial", value: 18 },
  { group: "Hospital", value: 12 },
  { group: "Educational", value: 9 },
];

const recentInspections = [
  { building: "Sunrise Tower", category: "Commercial", inspector: "R. Kumar", date: "2026-04-01", status: "COMPLETED" },
  { building: "MIDC Factory Block A", category: "Industrial", inspector: "P. Sharma", date: "2026-04-02", status: "IN_PROGRESS" },
  { building: "City General Hospital", category: "Hospital", inspector: "A. Patil", date: "2026-04-03", status: "SCHEDULED" },
  { building: "Green Valley Apts", category: "Residential", inspector: "S. Desai", date: "2026-04-04", status: "SCHEDULED" },
];

export default function FireInspectionDashboard() {
  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <PageHeader title="Fire Inspection" subtitle="Building fire safety inspections, deviations and audit trails" />
      </Column>

      <Column lg={4} md={2} sm={4}>
        <StatCard label="Scheduled" value={24} Icon={CalendarAdd} colorToken="--cds-support-info" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="In Progress" value={5} Icon={InProgress} colorToken="--cds-support-warning" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Completed" value={142} Icon={CheckmarkOutline} colorToken="--cds-support-success" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Open Deviations" value={18} Icon={Warning} colorToken="--cds-support-error" />
      </Column>

      <Column lg={8} md={4} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Monthly Inspection Trend</Heading>
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
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Buildings by Category</Heading>
          <DonutChart
            data={donutData}
            options={{
              height: "260px",
              donut: { center: { label: "Buildings" } },
              legend: { enabled: true },
            }}
          />
        </Tile>
      </Column>

      <Column lg={16} md={8} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem", marginBottom: "2rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Recent Inspections</Heading>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--cds-border-subtle)" }}>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Building</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Category</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Inspector</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Date</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentInspections.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--cds-border-subtle-01)" }}>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-primary)" }}>{r.building}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{r.category}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{r.inspector}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{r.date}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{r.status.replace(/_/g, " ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Tile>
      </Column>
    </Grid>
  );
}
