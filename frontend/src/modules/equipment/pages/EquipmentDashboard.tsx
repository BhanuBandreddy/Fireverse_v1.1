import { Grid, Column, Tile, Heading } from "@carbon/react";
import { GroupedBarChart, DonutChart } from "@carbon/charts-react";
import { ScaleTypes } from "@carbon/charts";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Package, IbmDb2Warehouse, DocumentAdd, Tools } from "@carbon/icons-react";

const barData = [
  { group: "Issued", key: "Jan", value: 45 },
  { group: "Issued", key: "Feb", value: 52 },
  { group: "Issued", key: "Mar", value: 38 },
  { group: "Issued", key: "Apr", value: 41 },
  { group: "Returned", key: "Jan", value: 30 },
  { group: "Returned", key: "Feb", value: 35 },
  { group: "Returned", key: "Mar", value: 28 },
  { group: "Returned", key: "Apr", value: 25 },
];

const donutData = [
  { group: "Fire Extinguisher", value: 145 },
  { group: "Hose & Nozzle", value: 89 },
  { group: "PPE", value: 72 },
  { group: "Breathing Apparatus", value: 48 },
  { group: "Rescue Tools", value: 69 },
];

const recentMRs = [
  { mrNo: "MR-2026-014", item: "Fire Extinguisher CO2 5kg", qty: 20, warehouse: "Station Alpha", status: "APPROVED" },
  { mrNo: "MR-2026-013", item: "Safety Helmet - Red", qty: 15, warehouse: "HQ Store", status: "PENDING" },
  { mrNo: "MR-2026-012", item: "Breathing Apparatus Set", qty: 5, warehouse: "Station Beta", status: "IN_PROGRESS" },
  { mrNo: "MR-2026-011", item: "Fire Hose 25mm x 15m", qty: 10, warehouse: "Station Alpha", status: "COMPLETED" },
];

export default function EquipmentDashboard() {
  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <PageHeader title="Equipment & Store" subtitle="Inventory, warehouses, material requisitions and assets" />
      </Column>

      <Column lg={4} md={2} sm={4}>
        <StatCard label="Total Items" value={423} Icon={Package} colorToken="--cds-support-info" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Warehouses" value={6} Icon={IbmDb2Warehouse} colorToken="--cds-support-success" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Open MRs" value={14} Icon={DocumentAdd} colorToken="--cds-support-warning" />
      </Column>
      <Column lg={4} md={2} sm={4}>
        <StatCard label="Assets" value={287} Icon={Tools} colorToken="--cds-support-info" />
      </Column>

      <Column lg={8} md={4} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Monthly Issue / Return Trend</Heading>
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
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Inventory by Category</Heading>
          <DonutChart
            data={donutData}
            options={{
              height: "260px",
              donut: { center: { label: "Items" } },
              legend: { enabled: true },
            }}
          />
        </Tile>
      </Column>

      <Column lg={16} md={8} sm={4}>
        <Tile style={{ padding: "1.5rem", marginTop: "1rem", marginBottom: "2rem" }}>
          <Heading style={{ marginBottom: "1rem", fontSize: "1rem" }}>Recent Material Requisitions</Heading>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--cds-border-subtle)" }}>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>MR No</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Item</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Qty</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Warehouse</th>
                <th style={{ textAlign: "left", padding: "0.5rem", color: "var(--cds-text-secondary)" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentMRs.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--cds-border-subtle-01)" }}>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-primary)" }}>{r.mrNo}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{r.item}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{r.qty}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: "var(--cds-text-secondary)" }}>{r.warehouse}</td>
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
