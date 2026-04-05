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

interface TrainingSession {
  id: string;
  title: string;
  courseName: string;
  startDate: string;
  endDate: string;
  trainerName: string;
  maxParticipants: number;
  status: string;
}

const MOCK_ROWS: TrainingSession[] = [
  { id: "1", title: "Basic Fire Safety", courseName: "Fire Safety 101", startDate: "2026-04-08", endDate: "2026-04-10", trainerName: "R. Kumar", maxParticipants: 25, status: "SCHEDULED" },
  { id: "2", title: "Advanced Rescue Ops", courseName: "Rescue Operations", startDate: "2026-04-12", endDate: "2026-04-14", trainerName: "P. Sharma", maxParticipants: 18, status: "SCHEDULED" },
  { id: "3", title: "Hazmat Handling Level 2", courseName: "Hazmat Level 2", startDate: "2026-04-15", endDate: "2026-04-16", trainerName: "A. Patil", maxParticipants: 12, status: "PLANNED" },
  { id: "4", title: "First Aid & CPR", courseName: "First Aid CPR", startDate: "2026-04-20", endDate: "2026-04-20", trainerName: "S. Desai", maxParticipants: 30, status: "PLANNED" },
  { id: "5", title: "Breathing Apparatus Usage", courseName: "BA Training", startDate: "2026-03-25", endDate: "2026-03-25", trainerName: "V. Singh", maxParticipants: 20, status: "COMPLETED" },
];

const headers = [
  { key: "title", header: "Session Title" },
  { key: "courseName", header: "Course" },
  { key: "trainerName", header: "Trainer" },
  { key: "startDate", header: "Start Date" },
  { key: "endDate", header: "End Date" },
  { key: "maxParticipants", header: "Max Participants" },
  { key: "status", header: "Status" },
];

export default function TrainingScheduleList() {
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
        title="Training Schedule"
        subtitle="Planned and completed training sessions"
        breadcrumbs={[{ label: "Training & Drill", href: "/training" }, { label: "Schedule" }]}
        action={<Button renderIcon={Add} href="/training/schedule/new">Add Session</Button>}
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
