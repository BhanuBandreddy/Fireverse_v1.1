import { Grid, Column, Tile, Heading, Tag } from "@carbon/react";
import { GroupedBarChart, DonutChart } from "@carbon/charts-react";
import { ScaleTypes } from "@carbon/charts";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  Group,
  DocumentSigned,
  Warning,
  Renew,
  Van,
  Building,
  Package,
  Education,
  Alarm,
  Security,
  Fire,
} from "@carbon/icons-react";
const moduleHealth = [
  { label: "Fire Admin", icon: Building, count: 124, status: "Operational", color: "--cds-support-success", path: "/fire-admin" },
  { label: "NOC Management", icon: DocumentSigned, count: 38, status: "5 Pending", color: "--cds-support-warning", path: "/noc" },
  { label: "Fire Inspection", icon: Fire, count: 67, status: "Operational", color: "--cds-support-success", path: "/fire-inspection" },
  { label: "Renewal Mgmt", icon: Renew, count: 22, status: "3 Due", color: "--cds-support-warning", path: "/renewal" },
  { label: "Equipment", icon: Package, count: 891, status: "Operational", color: "--cds-support-success", path: "/equipment" },
  { label: "Vehicle & GPS", icon: Van, count: 42, status: "2 Offline", color: "--cds-support-error", path: "/vehicle-gps" },
  { label: "Incident Mgmt", icon: Warning, count: 7, status: "Active", color: "--cds-support-error", path: "/incident" },
  { label: "Training", icon: Education, count: 5, status: "This Month", color: "--cds-support-info", path: "/training" },
  { label: "Mock Drill", icon: Alarm, count: 3, status: "Scheduled", color: "--cds-support-info", path: "/mock-drill" },
  { label: "Audit Mgmt", icon: Security, count: 12, status: "Operational", color: "--cds-support-success", path: "/audit" },
];

const barData = [
  { group: "Incidents", key: "Jan", value: 12 },
  { group: "Incidents", key: "Feb", value: 8 },
  { group: "Incidents", key: "Mar", value: 15 },
  { group: "Incidents", key: "Apr", value: 7 },
  { group: "NOC Apps", key: "Jan", value: 20 },
  { group: "NOC Apps", key: "Feb", value: 18 },
  { group: "NOC Apps", key: "Mar", value: 25 },
  { group: "NOC Apps", key: "Apr", value: 22 },
  { group: "Drills", key: "Jan", value: 4 },
  { group: "Drills", key: "Feb", value: 6 },
  { group: "Drills", key: "Mar", value: 3 },
  { group: "Drills", key: "Apr", value: 5 },
];

const donutData = [
  { group: "Open", value: 7 },
  { group: "In Progress", value: 12 },
  { group: "Closed", value: 84 },
];

type TagType = "warm-gray" | "red" | "blue" | "green";

const alerts: { type: TagType; title: string; text: string }[] = [
  { type: "warm-gray", title: "NOC Pending", text: "5 NOC applications awaiting review — Zone 3, Navi Mumbai" },
  { type: "red", title: "Incident Active", text: "Fire incident reported at Sector 7 — crew dispatched" },
  { type: "blue", title: "Training Scheduled", text: "Fire Safety Training scheduled 15 Apr — Station Alpha" },
  { type: "green", title: "Audit Completed", text: "Annual fire audit for Building C — All clear, no deviations" },
];

export default function GlobalDashboard() {
  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <PageHeader
          title="Welcome, Super Admin"
          subtitle="Super Admin · Maharashtra Fire &amp; Emergency Services (NMMC)"
        />
      </Column>

      <Column lg={4} md={2} sm={4}>
        <StatCard label="Active Employees" value={248} Icon={Group} colorToken="--cds-support-info" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Open NOC Applications" value={38} Icon={DocumentSigned} colorToken="--cds-support-warning" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Open Incidents" value={7} Icon={Warning} colorToken="--cds-support-error" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Pending Renewals" value={22} Icon={Renew} colorToken="--cds-support-warning" />
      </Column>

      <Column lg={8} md={4} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Monthly Activity Trend</Heading>
          <GroupedBarChart
            data={barData}
            options={{
              height: "280px",
              axes: { left: { mapsTo: "value" }, bottom: { mapsTo: "key", scaleType: ScaleTypes.LABELS } },
              legend: { enabled: true },
            }}
          />
        </Tile>
      </Column>
      <Column lg={8} md={4} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Incident Status Breakdown</Heading>
          <DonutChart
            data={donutData}
            options={{
              height: "280px",
              donut: { center: { label: "Incidents" } },
              legend: { enabled: true },
            }}
          />
        </Tile>
      </Column>

      <Column lg={16} md={8} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem" }}>
          <Heading style={{ marginBottom: "1.5rem", fontSize: "1rem" }}>Module Health Overview</Heading>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
            {moduleHealth.map((m) => (
              <a key={m.label} href={m.path} style={{ textDecoration: "none" }}>
                <Tile
                  style={{
                    padding: "1rem",
                    cursor: "pointer",
                    borderLeft: `4px solid var(${m.color})`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <m.icon size={20} />
                    <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--cds-text-primary)" }}>
                      {m.label}
                    </span>
                  </div>
                  <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--cds-text-primary)" }}>{m.count}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--cds-text-secondary)" }}>{m.status}</p>
                </Tile>
              </a>
            ))}
          </div>
        </Tile>
      </Column>

      <Column lg={16} md={8} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem", marginBottom: "2rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Recent System Alerts</Heading>
          {alerts.map((a, i) => (
            <div
              key={i}
              style={{
                padding: "0.75rem 1rem",
                marginBottom: "0.5rem",
                background: "var(--cds-layer)",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Tag type={a.type} style={{ minWidth: "fit-content" }}>
                {a.title}
              </Tag>
              <span style={{ fontSize: "0.875rem", color: "var(--cds-text-secondary)" }}>{a.text}</span>
            </div>
          ))}
        </Tile>
      </Column>
    </Grid>
  );
}
