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

interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: string;
  quantity: number;
  uom: string;
  reorderLevel: number;
  warehouseName: string;
}

const MOCK_ROWS: InventoryItem[] = [
  { id: "1", code: "ITM-001", name: "Fire Extinguisher CO2 5kg", category: "Fire Extinguisher", quantity: 145, uom: "NOS", reorderLevel: 20, warehouseName: "Station Alpha" },
  { id: "2", code: "ITM-002", name: "Safety Helmet Red", category: "PPE", quantity: 72, uom: "NOS", reorderLevel: 15, warehouseName: "HQ Store" },
  { id: "3", code: "ITM-003", name: "Breathing Apparatus Set", category: "Breathing Apparatus", quantity: 48, uom: "SET", reorderLevel: 5, warehouseName: "Station Beta" },
  { id: "4", code: "ITM-004", name: "Fire Hose 25mm x 15m", category: "Hose & Nozzle", quantity: 89, uom: "NOS", reorderLevel: 10, warehouseName: "Station Alpha" },
  { id: "5", code: "ITM-005", name: "Rescue Cutter Hydraulic", category: "Rescue Tools", quantity: 12, uom: "NOS", reorderLevel: 2, warehouseName: "HQ Store" },
  { id: "6", code: "ITM-006", name: "Fire Proof Suit", category: "PPE", quantity: 35, uom: "NOS", reorderLevel: 8, warehouseName: "Station Gamma" },
  { id: "7", code: "ITM-007", name: "First Aid Kit Standard", category: "Medical", quantity: 60, uom: "KIT", reorderLevel: 12, warehouseName: "HQ Store" },
];

const headers = [
  { key: "code", header: "Item Code" },
  { key: "name", header: "Item Name" },
  { key: "category", header: "Category" },
  { key: "quantity", header: "Quantity" },
  { key: "uom", header: "UOM" },
  { key: "reorderLevel", header: "Reorder Level" },
  { key: "warehouseName", header: "Warehouse" },
];

export default function InventoryList() {
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
        title="Inventory"
        subtitle="All equipment and store inventory items"
        breadcrumbs={[{ label: "Equipment & Store", href: "/equipment" }, { label: "Inventory" }]}
        action={<Button renderIcon={Add} href="/equipment/inventory/new">Add Item</Button>}
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
                      <TableCell key={cell.id}>{cell.value}</TableCell>
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
