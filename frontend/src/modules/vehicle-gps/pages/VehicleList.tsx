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

interface Vehicle {
  id: string;
  registrationNo: string;
  make: string;
  model: string;
  bodyType: string;
  stationId: string;
  gpsStatus: string;
}

const MOCK_ROWS: Vehicle[] = [
  { id: "1", registrationNo: "MH-04-F-0001", make: "TATA Motors", model: "LPT 1613", bodyType: "Fire Engine", stationId: "Station Alpha", gpsStatus: "ACTIVE" },
  { id: "2", registrationNo: "MH-04-F-0002", make: "Ashok Leyland", model: "Captain 3516", bodyType: "Water Tanker", stationId: "Station Beta", gpsStatus: "ACTIVE" },
  { id: "3", registrationNo: "MH-04-F-0003", make: "Force Motors", model: "Traveller 3350", bodyType: "Rescue Van", stationId: "Station Alpha", gpsStatus: "OFFLINE" },
  { id: "4", registrationNo: "MH-04-F-0004", make: "TATA Motors", model: "Xenon XT", bodyType: "Command Vehicle", stationId: "HQ", gpsStatus: "ACTIVE" },
  { id: "5", registrationNo: "MH-04-F-0005", make: "Mahindra", model: "Bolero Camper", bodyType: "First Response", stationId: "Station Gamma", gpsStatus: "ACTIVE" },
  { id: "6", registrationNo: "MH-04-F-0006", make: "TATA Motors", model: "407", bodyType: "Ambulance", stationId: "Station Beta", gpsStatus: "OFFLINE" },
];

const headers = [
  { key: "registrationNo", header: "Registration No" },
  { key: "make", header: "Make" },
  { key: "model", header: "Model" },
  { key: "bodyType", header: "Body Type" },
  { key: "stationId", header: "Station" },
  { key: "gpsStatus", header: "GPS Status" },
];

export default function VehicleList() {
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
        title="Vehicles"
        subtitle="Fleet vehicles and GPS tracking status"
        breadcrumbs={[{ label: "Vehicle & GPS", href: "/vehicle-gps" }, { label: "Vehicles" }]}
        action={<Button renderIcon={Add} href="/vehicle-gps/vehicles/new">Add Vehicle</Button>}
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
                        {cell.info.header === "gpsStatus" ? (
                          <StatusBadge status={String(cell.value)} />
                        ) : (
                          cell.value
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <OverflowMenu aria-label="row actions" flipped>
                        <OverflowMenuItem itemText="View" />
                        <OverflowMenuItem itemText="Track GPS" />
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
