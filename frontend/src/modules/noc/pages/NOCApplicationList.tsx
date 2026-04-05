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

interface NOCApplication {
  id: string;
  applicationNo: string;
  applicantName: string;
  nocType: string;
  status: string;
  city: string;
  createdAt: string;
}

const MOCK_ROWS: NOCApplication[] = [
  { id: "1", applicationNo: "NOC-2026-001", applicantName: "Sharma Builders Pvt Ltd", nocType: "PROVISIONAL", status: "PENDING", city: "Navi Mumbai", createdAt: "2026-01-10" },
  { id: "2", applicationNo: "NOC-2026-002", applicantName: "Reliance Mall MIDC", nocType: "FINAL", status: "APPROVED", city: "Thane", createdAt: "2026-01-15" },
  { id: "3", applicationNo: "NOC-2026-003", applicantName: "City Hospital Trust", nocType: "AMENDMENT", status: "UNDER_REVIEW", city: "Pune", createdAt: "2026-02-01" },
  { id: "4", applicationNo: "NOC-2026-004", applicantName: "Greenfield Housing", nocType: "TEMPORARY", status: "PENDING", city: "Aurangabad", createdAt: "2026-02-20" },
  { id: "5", applicationNo: "NOC-2026-005", applicantName: "Tech Park Ltd", nocType: "FINAL", status: "APPROVED", city: "Pune", createdAt: "2026-03-05" },
  { id: "6", applicationNo: "NOC-2026-006", applicantName: "Metro Cinema Hall", nocType: "PROVISIONAL", status: "REJECTED", city: "Mumbai", createdAt: "2026-03-18" },
];

const headers = [
  { key: "applicationNo", header: "Application No" },
  { key: "applicantName", header: "Applicant Name" },
  { key: "nocType", header: "NOC Type" },
  { key: "city", header: "City" },
  { key: "createdAt", header: "Applied On" },
  { key: "status", header: "Status" },
];

export default function NOCApplicationList() {
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
        title="NOC Applications"
        subtitle="All No Objection Certificate applications"
        breadcrumbs={[{ label: "NOC Management", href: "/noc" }, { label: "Applications" }]}
        action={<Button renderIcon={Add} href="/noc/applications/new">New Application</Button>}
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
