import { Grid, Column, Tile, Heading } from "@carbon/react";
import { GroupedBarChart, DonutChart } from "@carbon/charts-react";
import { ScaleTypes } from "@carbon/charts";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Van, Location, CalendarAdd, Warning } from "@carbon/icons-react";

const barData = [
  { group: "Deployed", key: "Jan", value: 18 },
  { group: "Deployed", key: "Feb", value: 22 },
  { group: "Deployed", key: "Mar", value: 15 },
  { group: "Deployed", key: "Apr", value: 20 },
  { group: "Maintenance", key: "Jan", value: 4 },
  { group: "Maintenance", key: "Feb", value: 3 },
  { group: "Maintenance", key: "Mar", value: 5 },
  { group: "Maintenance", key: "Apr", value: 2 },
];

const donutData = [
  { group: "Fire Engine", value: 18 },
  { group: "Water Tanker", value: 12 },
  { group: "Rescue Van", value: 8 },
  { group: "Command Vehicle", value: 4 },
];

const recentVehicles = [
  { regNo: "MH-04-F-0001", make: "TATA Motors", model: "Fire Tender", gps: "ACTIVE", station: "Station Alpha" },
  { regNo: "MH-04-F-0002", make: "Ashok Leyland", model: "Water Tanker", gps: "ACTIVE", station: "Station Beta" },
  { regNo: "MH-04-F-0003", make: "Force Motors", model: "Rescue Van", gps: "OFFLINE", station: "Station Alpha" },
  { regNo: "MH-04-F-0004", make: "TATA Motors", model: "Command Vehicle", gps: "ACTIVE", station: "HQ" },
];

export default function VehicleGPSDashboard() {
  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <PageHeader title="Vehicle & GPS" subtitle="Fleet management, GPS tracking and inspection due dates" />
      </Column>

      <Column lg={4} md={2} sm={4}>
        <StatCard label="Total Vehicles" value={42} Icon={Van} colorToken="--cds-support-info" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Active GPS" value={38} Icon={Location} colorToken="--cds-support-success" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Inspections Due" value={7} Icon={CalendarAdd} colorToken="--cds-support-warning" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Open Discrepancies" value={4} Icon={Warning} colorToken="--cds-support-error" />
      </Column>

      <Column lg={8} md={4} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Monthly Fleet Deployment</Heading>
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
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Fleet by Vehicle Type</Heading>
          <DonutChart
            data={donutData}
            options={{
              height: "260px",
              donut: { center: { label: "Vehicles" } },
              legend: { enabled: true },
            }}
          />
        </Tile>
      </Column>

      <Column lg={16} md={8} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem", marginBottom: "2rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Vehicle Fleet Overview</Heading>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--cds-border-subtle)" }}>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Reg No</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Make</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Model</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Station</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>GPS Status</th>
              </tr>
            </thead>
            <tbody>
              {recentVehicles.map((v, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--cds-border-subtle-01)" }}>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-primary)" }}>{v.regNo}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{v.make}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{v.model}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{v.station}</td>
                  <td style={{ padding: "0.75rem 0.5rem" }}>
                    <span style={{ color: v.gps === "ACTIVE" ? "var(--cds-support-success)" : "var(--cds-support-error)", fontWeight: 600 }}>
                      {v.gps}
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
