import { Grid, Column, Tile, Heading } from "@carbon/react";
import { GroupedBarChart, DonutChart } from "@carbon/charts-react";
import { ScaleTypes } from "@carbon/charts";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Group, Building, Badge, Time } from "@carbon/icons-react";

const attendanceData = [
  { group: "Present", key: "Mon", value: 210 },
  { group: "Present", key: "Tue", value: 205 },
  { group: "Present", key: "Wed", value: 218 },
  { group: "Present", key: "Thu", value: 212 },
  { group: "Present", key: "Fri", value: 198 },
  { group: "Absent", key: "Mon", value: 38 },
  { group: "Absent", key: "Tue", value: 43 },
  { group: "Absent", key: "Wed", value: 30 },
  { group: "Absent", key: "Thu", value: 36 },
  { group: "Absent", key: "Fri", value: 50 },
];

const deptData = [
  { group: "Operations", value: 120 },
  { group: "Administration", value: 45 },
  { group: "Training", value: 38 },
  { group: "Technical", value: 28 },
  { group: "Logistics", value: 17 },
];

const recentEmployees = [
  { name: "Rajesh Kumar", dept: "Operations", joined: "2024-01-15", status: "ACTIVE" },
  { name: "Priya Sharma", dept: "Administration", joined: "2024-02-10", status: "ACTIVE" },
  { name: "Amit Patil", dept: "Training", joined: "2024-03-05", status: "ACTIVE" },
  { name: "Sunita Desai", dept: "Technical", joined: "2024-04-20", status: "INACTIVE" },
];

export default function FireAdminDashboard() {
  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <PageHeader title="Fire Administration" subtitle="HR, users, shifts, attendance and documents" />
      </Column>

      <Column lg={4} md={2} sm={4}>
        <StatCard label="Active Employees" value={248} Icon={Group} colorToken="--cds-support-info" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Departments" value={12} Icon={Building} colorToken="--cds-support-success" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Designations" value={8} Icon={Badge} colorToken="--cds-support-info" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Active Shifts" value={3} Icon={Time} colorToken="--cds-support-warning" />
      </Column>

      <Column lg={8} md={4} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Weekly Attendance Trend</Heading>
          <GroupedBarChart
            data={attendanceData}
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
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Department Distribution</Heading>
          <DonutChart
            data={deptData}
            options={{
              height: "260px",
              donut: { center: { label: "Staff" } },
              legend: { enabled: true },
            }}
          />
        </Tile>
      </Column>

      <Column lg={16} md={8} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem", marginBottom: "2rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Recently Joined Employees</Heading>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--cds-border-subtle)" }}>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Name</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Department</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Joined</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentEmployees.map((e, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--cds-border-subtle-01)" }}>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-primary)" }}>{e.name}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{e.dept}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{e.joined}</td>
                  <td style={{ padding: "0.75rem 0.5rem" }}>
                    <span style={{ color: e.status === "ACTIVE" ? "var(--cds-support-success)" : "var(--cds-text-secondary)", fontWeight: 600, fontSize: "0.75rem" }}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Tile>
      </Column>
    </Grid>
  );
}
