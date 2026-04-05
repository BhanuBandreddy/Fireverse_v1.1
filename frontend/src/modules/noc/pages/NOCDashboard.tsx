import { Grid, Column, Tile, Heading } from "@carbon/react";
import { GroupedBarChart, DonutChart } from "@carbon/charts-react";
import { ScaleTypes } from "@carbon/charts";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { DocumentSigned, CheckmarkOutline, Certificate, Time } from "@carbon/icons-react";

const barData = [
  { group: "Provisional", key: "Jan", value: 8 },
  { group: "Provisional", key: "Feb", value: 10 },
  { group: "Provisional", key: "Mar", value: 12 },
  { group: "Provisional", key: "Apr", value: 7 },
  { group: "Final", key: "Jan", value: 5 },
  { group: "Final", key: "Feb", value: 7 },
  { group: "Final", key: "Mar", value: 9 },
  { group: "Final", key: "Apr", value: 6 },
  { group: "Temporary", key: "Jan", value: 3 },
  { group: "Temporary", key: "Feb", value: 4 },
  { group: "Temporary", key: "Mar", value: 2 },
  { group: "Temporary", key: "Apr", value: 5 },
];

const donutData = [
  { group: "Provisional", value: 32 },
  { group: "Final", value: 27 },
  { group: "Amendment", value: 15 },
  { group: "Temporary", value: 11 },
];

const recentApplications = [
  { appNo: "NOC-2026-001", applicant: "Sharma Builders Pvt Ltd", type: "PROVISIONAL", status: "PENDING", city: "Navi Mumbai" },
  { appNo: "NOC-2026-002", applicant: "Reliance Mall MIDC", type: "FINAL", status: "APPROVED", city: "Thane" },
  { appNo: "NOC-2026-003", applicant: "City Hospital Trust", type: "AMENDMENT", status: "UNDER_REVIEW", city: "Pune" },
  { appNo: "NOC-2026-004", applicant: "Greenfield Housing", type: "TEMPORARY", status: "PENDING", city: "Aurangabad" },
];

export default function NOCDashboard() {
  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <PageHeader title="NOC Management" subtitle="No Objection Certificate applications and tracking" />
      </Column>

      <Column lg={4} md={2} sm={4}>
        <StatCard label="Total Applications" value={85} Icon={DocumentSigned} colorToken="--cds-support-info" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Pending Review" value={38} Icon={Time} colorToken="--cds-support-warning" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Approved" value={32} Icon={CheckmarkOutline} colorToken="--cds-support-success" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Certificates Issued" value={29} Icon={Certificate} colorToken="--cds-support-success" />
      </Column>

      <Column lg={8} md={4} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Monthly Applications by Type</Heading>
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
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Applications by NOC Type</Heading>
          <DonutChart
            data={donutData}
            options={{
              height: "260px",
              donut: { center: { label: "NOC Types" } },
              legend: { enabled: true },
            }}
          />
        </Tile>
      </Column>

      <Column lg={16} md={8} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem", marginBottom: "2rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Recent Applications</Heading>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--cds-border-subtle)" }}>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>App No</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Applicant</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Type</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>City</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((a, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--cds-border-subtle-01)" }}>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-primary)" }}>{a.appNo}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{a.applicant}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{a.type}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{a.city}</td>
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
