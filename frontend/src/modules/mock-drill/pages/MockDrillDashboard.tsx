import { Grid, Column, Tile, Heading } from "@carbon/react";
import { GroupedBarChart, DonutChart } from "@carbon/charts-react";
import { ScaleTypes } from "@carbon/charts";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { RequestQuote, CalendarAdd, Time, CheckmarkOutline } from "@carbon/icons-react";

const barData = [
  { group: "Scheduled", key: "Jan", value: 4 },
  { group: "Scheduled", key: "Feb", value: 5 },
  { group: "Scheduled", key: "Mar", value: 3 },
  { group: "Scheduled", key: "Apr", value: 3 },
  { group: "Completed", key: "Jan", value: 10 },
  { group: "Completed", key: "Feb", value: 12 },
  { group: "Completed", key: "Mar", value: 11 },
  { group: "Completed", key: "Apr", value: 9 },
];

const donutData = [
  { group: "Building Evacuation", value: 18 },
  { group: "Fire Fighting", value: 12 },
  { group: "Rescue Operations", value: 8 },
  { group: "Hazmat Response", value: 4 },
];

const upcomingDrills = [
  { title: "Commercial Complex Evacuation", type: "Building Evacuation", location: "Sunrise Tower", scheduled: "2026-04-10", owner: "R. Kumar", status: "SCHEDULED" },
  { title: "Industrial Fire Response", type: "Fire Fighting", location: "MIDC Sector 7", scheduled: "2026-04-15", owner: "P. Sharma", status: "PLANNED" },
  { title: "Hospital Evacuation Drill", type: "Building Evacuation", location: "City Hospital", scheduled: "2026-04-22", owner: "A. Patil", status: "PLANNED" },
];

export default function MockDrillDashboard() {
  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <PageHeader title="Mock Drill" subtitle="Emergency mock drill planning, scheduling and reporting" />
      </Column>

      <Column lg={4} md={2} sm={4}>
        <StatCard label="Requested" value={5} Icon={RequestQuote} colorToken="--cds-support-info" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Planned" value={8} Icon={CalendarAdd} colorToken="--cds-support-info" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Scheduled" value={3} Icon={Time} colorToken="--cds-support-warning" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Completed" value={42} Icon={CheckmarkOutline} colorToken="--cds-support-success" />
      </Column>

      <Column lg={8} md={4} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Monthly Drill Activity</Heading>
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
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Drills by Type</Heading>
          <DonutChart
            data={donutData}
            options={{
              height: "260px",
              donut: { center: { label: "Drills" } },
              legend: { enabled: true },
            }}
          />
        </Tile>
      </Column>

      <Column lg={16} md={8} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem", marginBottom: "2rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Upcoming Mock Drills</Heading>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--cds-border-subtle)" }}>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Title</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Type</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Location</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Scheduled</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Owner</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingDrills.map((d, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--cds-border-subtle-01)" }}>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-primary)" }}>{d.title}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{d.type}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{d.location}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{d.scheduled}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{d.owner}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{d.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Tile>
      </Column>
    </Grid>
  );
}
