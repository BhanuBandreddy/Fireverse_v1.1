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

interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  department: string;
  designation: string;
  status: string;
  joiningDate: string;
}

const MOCK_ROWS: Employee[] = [
  { id: "1", employeeCode: "EMP-001", name: "Rajesh Kumar", department: "Operations", designation: "Fire Officer", status: "ACTIVE", joiningDate: "2020-03-15" },
  { id: "2", employeeCode: "EMP-002", name: "Priya Sharma", department: "Administration", designation: "Admin Officer", status: "ACTIVE", joiningDate: "2019-07-01" },
  { id: "3", employeeCode: "EMP-003", name: "Amit Patil", department: "Training", designation: "Training Instructor", status: "ACTIVE", joiningDate: "2021-01-10" },
  { id: "4", employeeCode: "EMP-004", name: "Sunita Desai", department: "Technical", designation: "Fire Engineer", status: "INACTIVE", joiningDate: "2018-11-20" },
  { id: "5", employeeCode: "EMP-005", name: "Vikram Singh", department: "Operations", designation: "Station Officer", status: "ACTIVE", joiningDate: "2022-05-18" },
  { id: "6", employeeCode: "EMP-006", name: "Meena Joshi", department: "Logistics", designation: "Logistics Coordinator", status: "ACTIVE", joiningDate: "2023-02-28" },
];

const headers = [
  { key: "employeeCode", header: "Employee Code" },
  { key: "name", header: "Name" },
  { key: "department", header: "Department" },
  { key: "designation", header: "Designation" },
  { key: "joiningDate", header: "Joining Date" },
  { key: "status", header: "Status" },
];

export default function EmployeeList() {
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
        title="Employees"
        subtitle="Manage all fire department employees"
        breadcrumbs={[{ label: "Fire Administration", href: "/fire-admin" }, { label: "Employees" }]}
        action={<Button renderIcon={Add} href="/fire-admin/employees/new">Add Employee</Button>}
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
