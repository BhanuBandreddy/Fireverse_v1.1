import { Grid, Column, Tile, Heading } from "@carbon/react";
import { GroupedBarChart, DonutChart } from "@carbon/charts-react";
import { ScaleTypes } from "@carbon/charts";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Warning, InProgress, CheckmarkOutline, Fire } from "@carbon/icons-react";

const barData = [
  { group: "Fire", key: "Jan", value: 5 },
  { group: "Fire", key: "Feb", value: 4 },
  { group: "Fire", key: "Mar", value: 7 },
  { group: "Fire", key: "Apr", value: 3 },
  { group: "Rescue", key: "Jan", value: 3 },
  { group: "Rescue", key: "Feb", value: 5 },
  { group: "Rescue", key: "Mar", value: 4 },
  { group: "Rescue", key: "Apr", value: 2 },
  { group: "Hazmat", key: "Jan", value: 1 },
  { group: "Hazmat", key: "Feb", value: 2 },
  { group: "Hazmat", key: "Mar", value: 1 },
  { group: "Hazmat", key: "Apr", value: 2 },
];

const donutData = [
  { group: "Open", value: 7 },
  { group: "In Progress", value: 12 },
  { group: "Closed Today", value: 3 },
  { group: "Critical", value: 2 },
];

const recentIncidents = [
  { incNo: "INC-2026-042", title: "Factory fire Sector 7", type: "Fire", priority: "CRITICAL", status: "IN_PROGRESS", date: "2026-04-04 07:30" },
  { incNo: "INC-2026-041", title: "Road accident near flyover", type: "Rescue", priority: "HIGH", status: "OPEN", date: "2026-04-03 22:15" },
  { incNo: "INC-2026-040", title: "Gas leak residential area", type: "Hazmat", priority: "HIGH", status: "IN_PROGRESS", date: "2026-04-03 18:45" },
  { incNo: "INC-2026-039", title: "Electrical fire office block", type: "Fire", priority: "MEDIUM", status: "CLOSED", date: "2026-04-03 14:20" },
];

export default function IncidentDashboard() {
  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <PageHeader title="Incident Management" subtitle="Active incidents, response tracking and escalation" />
      </Column>

      <Column lg={4} md={2} sm={4}>
        <StatCard label="Open Incidents" value={7} Icon={Warning} colorToken="--cds-support-error" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="In Progress" value={12} Icon={InProgress} colorToken="--cds-support-warning" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Closed Today" value={3} Icon={CheckmarkOutline} colorToken="--cds-support-success" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Critical" value={2} Icon={Fire} colorToken="--cds-support-error" />
      </Column>

      <Column lg={8} md={4} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Monthly Incidents by Type</Heading>
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
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Current Incident Status</Heading>
          <DonutChart
            data={donutData}
            options={{
              height: "260px",
              donut: { center: { label: "Incidents" } },
              legend: { enabled: true },
            }}
          />
        </Tile>
      </Column>

      <Column lg={16} md={8} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem", marginBottom: "2rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Recent Incidents</Heading>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--cds-border-subtle)" }}>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Inc No</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Title</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Type</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Priority</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Status</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentIncidents.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--cds-border-subtle-01)" }}>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-primary)" }}>{r.incNo}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{r.title}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{r.type}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{r.priority}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{r.status.replace(/_/g, " ")}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Tile>
      </Column>
    </Grid>
  );
}
