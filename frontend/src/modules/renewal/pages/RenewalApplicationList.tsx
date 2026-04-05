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

interface RenewalApp {
  id: string;
  refNo: string;
  firmName: string;
  certType: string;
  status: string;
  expiryDate: string;
}

const MOCK_ROWS: RenewalApp[] = [
  { id: "1", refNo: "RNW-2026-001", firmName: "Sharma Builders Pvt Ltd", certType: "Fire NOC", status: "APPROVED", expiryDate: "2026-12-31" },
  { id: "2", refNo: "RNW-2026-002", firmName: "Reliance Mall MIDC", certType: "Trade License", status: "PENDING", expiryDate: "2026-06-15" },
  { id: "3", refNo: "RNW-2026-003", firmName: "City Hospital Trust", certType: "Fire Equipment", status: "UNDER_REVIEW", expiryDate: "2026-09-30" },
  { id: "4", refNo: "RNW-2026-004", firmName: "Metro Cinema Hall", certType: "Fire NOC", status: "PENDING", expiryDate: "2026-07-20" },
  { id: "5", refNo: "RNW-2026-005", firmName: "Tech Park Ltd", certType: "Lift Certificate", status: "APPROVED", expiryDate: "2026-11-01" },
  { id: "6", refNo: "RNW-2026-006", firmName: "Greenfield Housing", certType: "Fire NOC", status: "REJECTED", expiryDate: "2026-05-31" },
];

const headers = [
  { key: "refNo", header: "Ref No" },
  { key: "firmName", header: "Firm Name" },
  { key: "certType", header: "Certificate Type" },
  { key: "expiryDate", header: "Expiry Date" },
  { key: "status", header: "Status" },
];

export default function RenewalApplicationList() {
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
        title="Renewal Applications"
        subtitle="Certificate and NOC renewal applications"
        breadcrumbs={[{ label: "Renewal Management", href: "/renewal" }, { label: "Applications" }]}
        action={<Button renderIcon={Add} href="/renewal/applications/new">New Application</Button>}
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
