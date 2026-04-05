import { useState } from "react";
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Pagination,
  Button,
  OverflowMenu,
  OverflowMenuItem,
} from "@carbon/react";
import { Add } from "@carbon/icons-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface Audit {
  id: string;
  auditNo: string;
  type: string;
  locationId: string;
  scheduledAt: string;
  conductedAt: string;
  status: string;
}

const MOCK_ROWS: Audit[] = [
  { id: "1", auditNo: "AUD-2026-012", type: "Fire Safety", locationId: "Sunrise Tower", scheduledAt: "2026-04-02", conductedAt: "2026-04-02", status: "COMPLETED" },
  { id: "2", auditNo: "AUD-2026-011", type: "Equipment", locationId: "Station Alpha", scheduledAt: "2026-04-05", conductedAt: "-", status: "PLANNED" },
  { id: "3", auditNo: "AUD-2026-010", type: "Building Compliance", locationId: "MIDC Office Park", scheduledAt: "2026-03-28", conductedAt: "2026-03-28", status: "COMPLETED" },
  { id: "4", auditNo: "AUD-2026-009", type: "Operational", locationId: "HQ", scheduledAt: "2026-03-20", conductedAt: "2026-03-21", status: "COMPLETED" },
  { id: "5", auditNo: "AUD-2026-008", type: "Fire Safety", locationId: "Green Valley Apts", scheduledAt: "2026-04-10", conductedAt: "-", status: "IN_PROGRESS" },
];

const headers = [
  { key: "auditNo", header: "Audit No" },
  { key: "type", header: "Type" },
  { key: "locationId", header: "Location" },
  { key: "scheduledAt", header: "Scheduled At" },
  { key: "conductedAt", header: "Conducted At" },
  { key: "status", header: "Status" },
];

export default function AuditList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = MOCK_ROWS.filter((r) =>
    Object.values(r).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  );
  const sliced = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <PageHeader
        title="Audits"
        subtitle="All fire safety and compliance audits"
        breadcrumbs={[{ label: "Audit Management", href: "/audit" }, { label: "Audits" }]}
        action={<Button renderIcon={Add} href="/audit/inspections/new">Plan Audit</Button>}
      />
      <DataTable rows={sliced} headers={headers}>
        {({ rows, headers: hdrs, getTableProps, getHeaderProps, getRowProps }) => (
          <TableContainer>
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch
                  value={search}
                  onChange={(e) => {
                    setSearch((e as React.ChangeEvent<HTMLInputElement>).target.value);
                    setPage(1);
                  }}
                />
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {hdrs.map((h) => (
                    <TableHeader {...getHeaderProps({ header: h })}>
                      {h.header}
                    </TableHeader>
                  ))}
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>
                        {cell.info.header === "status" ? (
                          <StatusBadge status={String(cell.value)} />
                        ) : (
                          cell.value
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <OverflowMenu aria-label="row actions" flipped>
                        <OverflowMenuItem itemText="View" />
                        <OverflowMenuItem itemText="Edit" />
                        <OverflowMenuItem itemText="Delete" hasDivider isDelete />
                      </OverflowMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              totalItems={filtered.length}
              pageSize={pageSize}
              pageSizes={[10, 20, 50]}
              page={page}
              onChange={({ page: p, pageSize: ps }) => {
                setPage(p);
                setPageSize(ps);
              }}
            />
          </TableContainer>
        )}
      </DataTable>
    </>
  );
}
