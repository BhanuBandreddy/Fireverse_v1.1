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

interface Building {
  id: string;
  name: string;
  category: string;
  qrCode: string;
  objectCount: number;
  lastInspection: string;
  status: string;
}

const MOCK_ROWS: Building[] = [
  { id: "1", name: "Sunrise Tower", category: "Commercial", qrCode: "QR-BLD-001", objectCount: 24, lastInspection: "2026-03-15", status: "ACTIVE" },
  { id: "2", name: "MIDC Factory Block A", category: "Industrial", qrCode: "QR-BLD-002", objectCount: 38, lastInspection: "2026-02-28", status: "ACTIVE" },
  { id: "3", name: "City General Hospital", category: "Hospital", qrCode: "QR-BLD-003", objectCount: 56, lastInspection: "2026-01-20", status: "ACTIVE" },
  { id: "4", name: "Green Valley Apartments", category: "Residential", qrCode: "QR-BLD-004", objectCount: 12, lastInspection: "2025-12-10", status: "ACTIVE" },
  { id: "5", name: "NMMC School Building", category: "Educational", qrCode: "QR-BLD-005", objectCount: 18, lastInspection: "2026-03-30", status: "ACTIVE" },
];

const headers = [
  { key: "name", header: "Building Name" },
  { key: "category", header: "Category" },
  { key: "qrCode", header: "QR Code" },
  { key: "objectCount", header: "Objects" },
  { key: "lastInspection", header: "Last Inspection" },
  { key: "status", header: "Status" },
];

export default function BuildingList() {
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
        title="Buildings"
        subtitle="Registered buildings for fire safety inspection"
        breadcrumbs={[{ label: "Fire Inspection", href: "/fire-inspection" }, { label: "Buildings" }]}
        action={<Button renderIcon={Add} href="/fire-inspection/buildings/new">Add Building</Button>}
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
                        <OverflowMenuItem itemText="Inspect" />
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
