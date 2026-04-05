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

interface Drill {
  id: string;
  title: string;
  drillType: string;
  locationId: string;
  scheduledAt: string;
  status: string;
  owner: string;
}

const MOCK_ROWS: Drill[] = [
  { id: "1", title: "Commercial Complex Evacuation", drillType: "Building Evacuation", locationId: "Sunrise Tower", scheduledAt: "2026-04-10 10:00", status: "SCHEDULED", owner: "R. Kumar" },
  { id: "2", title: "Industrial Fire Response", drillType: "Fire Fighting", locationId: "MIDC Sector 7", scheduledAt: "2026-04-15 09:00", status: "PLANNED", owner: "P. Sharma" },
  { id: "3", title: "Hospital Evacuation Drill", drillType: "Building Evacuation", locationId: "City Hospital", scheduledAt: "2026-04-22 14:00", status: "PLANNED", owner: "A. Patil" },
  { id: "4", title: "School Fire Safety Drill", drillType: "Building Evacuation", locationId: "NMMC School", scheduledAt: "2026-03-28 11:00", status: "COMPLETED", owner: "S. Desai" },
  { id: "5", title: "Hazmat Spill Response", drillType: "Hazmat Response", locationId: "MIDC Taloja", scheduledAt: "2026-03-20 10:30", status: "COMPLETED", owner: "V. Singh" },
];

const headers = [
  { key: "title", header: "Drill Title" },
  { key: "drillType", header: "Drill Type" },
  { key: "locationId", header: "Location" },
  { key: "scheduledAt", header: "Scheduled At" },
  { key: "owner", header: "Owner" },
  { key: "status", header: "Status" },
];

export default function DrillList() {
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
        title="Mock Drills"
        subtitle="All planned and completed mock drills"
        breadcrumbs={[{ label: "Mock Drill", href: "/mock-drill" }, { label: "Drills" }]}
        action={<Button renderIcon={Add} href="/mock-drill/drills/new">Plan Drill</Button>}
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
