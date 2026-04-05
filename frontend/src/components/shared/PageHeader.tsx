import { Heading, Breadcrumb, BreadcrumbItem } from "@carbon/react";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, breadcrumbs, action }: Props) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      {breadcrumbs && (
        <Breadcrumb style={{ marginBottom: "0.5rem" }}>
          {breadcrumbs.map((b, i) => (
            <BreadcrumbItem key={i} href={b.href} isCurrentPage={!b.href}>
              {b.label}
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <Heading style={{ fontSize: "1.75rem", fontWeight: 600 }}>{title}</Heading>
          {subtitle && (
            <p style={{ color: "var(--cds-text-secondary)", marginTop: "0.25rem", fontSize: "0.875rem" }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
