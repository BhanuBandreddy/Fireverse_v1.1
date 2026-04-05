import { Grid, Column, Tile, Heading } from "@carbon/react";
import { GroupedBarChart, DonutChart } from "@carbon/charts-react";
import { ScaleTypes } from "@carbon/charts";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { CalendarAdd, Education, Group, Checkmark } from "@carbon/icons-react";

const barData = [
  { group: "Attendees", key: "Jan", value: 32 },
  { group: "Attendees", key: "Feb", value: 45 },
  { group: "Attendees", key: "Mar", value: 38 },
  { group: "Attendees", key: "Apr", value: 30 },
  { group: "Sessions", key: "Jan", value: 5 },
  { group: "Sessions", key: "Feb", value: 8 },
  { group: "Sessions", key: "Mar", value: 6 },
  { group: "Sessions", key: "Apr", value: 5 },
];

const donutData = [
  { group: "Fire Safety", value: 45 },
  { group: "First Aid", value: 28 },
  { group: "Rescue Ops", value: 18 },
  { group: "Hazmat", value: 9 },
];

const upcomingSessions = [
  { title: "Basic Fire Safety", course: "Fire Safety 101", trainer: "R. Kumar", start: "2026-04-08", participants: 25, status: "SCHEDULED" },
  { title: "Advanced Rescue Ops", course: "Rescue Operations", trainer: "P. Sharma", start: "2026-04-12", participants: 18, status: "SCHEDULED" },
  { title: "Hazmat Handling", course: "Hazmat Level 2", trainer: "A. Patil", start: "2026-04-15", participants: 12, status: "PLANNED" },
  { title: "First Aid Refresher", course: "First Aid CPR", trainer: "S. Desai", start: "2026-04-20", participants: 30, status: "PLANNED" },
];

export default function TrainingDashboard() {
  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <PageHeader title="Training & Drill" subtitle="Training sessions, course management and attendance tracking" />
      </Column>

      <Column lg={4} md={2} sm={4}>
        <StatCard label="Scheduled Sessions" value={8} Icon={CalendarAdd} colorToken="--cds-support-info" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Total Courses" value={24} Icon={Education} colorToken="--cds-support-success" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Attendees This Month" value={145} Icon={Group} colorToken="--cds-support-info" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Completion Rate" value="87%" Icon={Checkmark} colorToken="--cds-support-success" />
      </Column>

      <Column lg={8} md={4} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Monthly Training Activity</Heading>
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
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Training by Course Type</Heading>
          <DonutChart
            data={donutData}
            options={{
              height: "260px",
              donut: { center: { label: "Sessions" } },
              legend: { enabled: true },
            }}
          />
        </Tile>
      </Column>

      <Column lg={16} md={8} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem", marginBottom: "2rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Upcoming Training Sessions</Heading>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--cds-border-subtle)" }}>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Session Title</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Course</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Trainer</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Start Date</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Participants</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingSessions.map((s, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--cds-border-subtle-01)" }}>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-primary)" }}>{s.title}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{s.course}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{s.trainer}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{s.start}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{s.participants}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Tile>
      </Column>
    </Grid>
  );
}
