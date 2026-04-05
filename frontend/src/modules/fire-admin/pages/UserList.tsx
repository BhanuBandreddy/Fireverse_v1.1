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

interface SystemUser {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

const MOCK_ROWS: SystemUser[] = [
  { id: "1", username: "superadmin", email: "superadmin@fireverse.gov.in", role: "Super Admin", status: "ACTIVE", lastLogin: "2026-04-04 09:15" },
  { id: "2", username: "fire_chief", email: "chief@fireverse.gov.in", role: "Fire Chief", status: "ACTIVE", lastLogin: "2026-04-03 18:30" },
  { id: "3", username: "noc_officer", email: "noc@fireverse.gov.in", role: "NOC Officer", status: "ACTIVE", lastLogin: "2026-04-04 08:45" },
  { id: "4", username: "audit_inspector", email: "audit@fireverse.gov.in", role: "Audit Inspector", status: "INACTIVE", lastLogin: "2026-03-28 14:00" },
];

const headers = [
  { key: "username", header: "Username" },
  { key: "email", header: "Email" },
  { key: "role", header: "Role" },
  { key: "lastLogin", header: "Last Login" },
  { key: "status", header: "Status" },
];

export default function UserList() {
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
        title="Users & Roles"
        subtitle="Manage system users and role assignments"
        breadcrumbs={[{ label: "Fire Administration", href: "/fire-admin" }, { label: "Users & Roles" }]}
        action={<Button renderIcon={Add} href="/fire-admin/users/new">Add User</Button>}
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
