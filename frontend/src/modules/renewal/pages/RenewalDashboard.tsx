import { Grid, Column, Tile, Heading } from "@carbon/react";
import { GroupedBarChart, DonutChart } from "@carbon/charts-react";
import { ScaleTypes } from "@carbon/charts";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Building, Document, Time, CheckmarkOutline } from "@carbon/icons-react";

const barData = [
  { group: "Applications", key: "Jan", value: 18 },
  { group: "Applications", key: "Feb", value: 22 },
  { group: "Applications", key: "Mar", value: 15 },
  { group: "Applications", key: "Apr", value: 12 },
  { group: "Approved", key: "Jan", value: 12 },
  { group: "Approved", key: "Feb", value: 15 },
  { group: "Approved", key: "Mar", value: 10 },
  { group: "Approved", key: "Apr", value: 8 },
];

const donutData = [
  { group: "Fire NOC Renewal", value: 42 },
  { group: "Trade License", value: 28 },
  { group: "Fire Equipment", value: 15 },
  { group: "Lift Certificate", value: 4 },
];

const recentRenewals = [
  { refNo: "RNW-2026-001", firm: "Sharma Builders Pvt Ltd", certType: "Fire NOC", status: "APPROVED", expiry: "2026-12-31" },
  { refNo: "RNW-2026-002", firm: "Reliance Mall", certType: "Trade License", status: "PENDING", expiry: "2026-06-15" },
  { refNo: "RNW-2026-003", firm: "City Hospital", certType: "Fire Equipment", status: "UNDER_REVIEW", expiry: "2026-09-30" },
  { refNo: "RNW-2026-004", firm: "Metro Cinema", certType: "Fire NOC", status: "PENDING", expiry: "2026-07-20" },
];

export default function RenewalDashboard() {
  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <PageHeader title="Renewal Management" subtitle="Certificate renewals, firm registrations and approvals" />
      </Column>

      <Column lg={4} md={2} sm={4}>
        <StatCard label="Registered Firms" value={156} Icon={Building} colorToken="--cds-support-info" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Total Applications" value={89} Icon={Document} colorToken="--cds-support-info" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Pending Renewals" value={34} Icon={Time} colorToken="--cds-support-warning" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Approved" value={55} Icon={CheckmarkOutline} colorToken="--cds-support-success" />
      </Column>

      <Column lg={8} md={4} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Monthly Renewal Applications</Heading>
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
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Applications by Certificate Type</Heading>
          <DonutChart
            data={donutData}
            options={{
              height: "260px",
              donut: { center: { label: "Cert Types" } },
              legend: { enabled: true },
            }}
          />
        </Tile>
      </Column>

      <Column lg={16} md={8} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem", marginBottom: "2rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Recent Renewal Applications</Heading>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--cds-border-subtle)" }}>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Ref No</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Firm Name</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Certificate Type</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Expiry</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRenewals.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--cds-border-subtle-01)" }}>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-primary)" }}>{r.refNo}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{r.firm}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{r.certType}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{r.expiry}</td>
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
