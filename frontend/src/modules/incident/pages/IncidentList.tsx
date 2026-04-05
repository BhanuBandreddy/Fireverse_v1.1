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

interface Incident {
  id: string;
  incidentNo: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  reportedAt: string;
  address: string;
}

const MOCK_ROWS: Incident[] = [
  { id: "1", incidentNo: "INC-2026-042", title: "Factory fire Sector 7", type: "Fire", status: "IN_PROGRESS", priority: "CRITICAL", reportedAt: "2026-04-04 07:30", address: "Sector 7, MIDC, Navi Mumbai" },
  { id: "2", incidentNo: "INC-2026-041", title: "Road accident near flyover", type: "Rescue", status: "OPEN", priority: "HIGH", reportedAt: "2026-04-03 22:15", address: "Thane-Belapur Road, Airoli" },
  { id: "3", incidentNo: "INC-2026-040", title: "Gas leak residential area", type: "Hazmat", status: "IN_PROGRESS", priority: "HIGH", reportedAt: "2026-04-03 18:45", address: "Sector 15, Vashi, Navi Mumbai" },
  { id: "4", incidentNo: "INC-2026-039", title: "Electrical fire office block", type: "Fire", status: "CLOSED", priority: "MEDIUM", reportedAt: "2026-04-03 14:20", address: "CBD Belapur, Navi Mumbai" },
  { id: "5", incidentNo: "INC-2026-038", title: "Building collapse debris removal", type: "Rescue", status: "CLOSED", priority: "HIGH", reportedAt: "2026-04-02 09:00", address: "Sanpada, Navi Mumbai" },
  { id: "6", incidentNo: "INC-2026-037", title: "Vehicle fire on expressway", type: "Fire", status: "CLOSED", priority: "MEDIUM", reportedAt: "2026-04-01 16:30", address: "Mumbai-Pune Expressway KM 42" },
  { id: "7", incidentNo: "INC-2026-036", title: "Chemical spill in warehouse", type: "Hazmat", status: "OPEN", priority: "CRITICAL", reportedAt: "2026-04-01 11:15", address: "MIDC Taloja, Navi Mumbai" },
];

const headers = [
  { key: "incidentNo", header: "Incident No" },
  { key: "title", header: "Title" },
  { key: "type", header: "Type" },
  { key: "priority", header: "Priority" },
  { key: "reportedAt", header: "Reported At" },
  { key: "address", header: "Address" },
  { key: "status", header: "Status" },
];

export default function IncidentList() {
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
        title="All Incidents"
        subtitle="Fire, rescue, and hazmat incident reports"
        breadcrumbs={[{ label: "Incident Management", href: "/incident" }, { label: "All Incidents" }]}
        action={<Button renderIcon={Add} href="/incident/new">Report Incident</Button>}
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
                        {["status", "priority"].includes(cell.info.header) ? (
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
                        <OverflowMenuItem itemText="Close Incident" />
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
