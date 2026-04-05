import { Tile } from "@carbon/react";

interface Props {
  label: string;
  value: number | string;
  Icon: React.ComponentType<{ size?: number }>;
  colorToken?: string;
}

export function StatCard({ label, value, Icon, colorToken = "--cds-support-info" }: Props) {
  return (
    <Tile style={{ padding: "1.5rem", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: "0.875rem", color: "var(--cds-text-secondary)", marginBottom: "0.5rem" }}>
            {label}
          </p>
          <p style={{ fontSize: "2rem", fontWeight: 600, color: "var(--cds-text-primary)" }}>{value}</p>
        </div>
        <div style={{ color: `var(${colorToken})` }}>
          <Icon size={32} />
        </div>
      </div>
    </Tile>
  );
}
