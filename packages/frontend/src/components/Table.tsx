import React from "react";
import {
  Box,
  Table,
  styled,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableContainer,
  CircularProgress,
  TablePagination,
} from "@mui/material";

// ====== Interfaces ======
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T, idx: number) => React.ReactNode;
  flex: number;
}

export interface MuiTableProps<T> {
  columns: TableColumn<T>[];
  rows?: T[] | null;
  loading?: boolean;
  emptyText?: string;
  getRowKey?: (row: T, idx: number) => string | number;
  page: number;
  rowsPerPage: number;
  totalRows: number;
  handleChangePage: (newPage: number) => void;
  handleChangeRowsPerPage: (newRowsPerPage: number) => void;
}

// ====== Main Component ======
export function CustomTable<T>({
  columns,
  rows,
  loading = false,
  getRowKey,
  page,
  rowsPerPage,
  totalRows,
  handleChangePage,
  handleChangeRowsPerPage,
  emptyText,
}: MuiTableProps<T>) {
  const flexTotal = columns.reduce((sum, col) => sum + (col.flex ?? 1), 0);

  return (
    <TableContainerCustom>
      {loading ? (
        <Box
          p={4}
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={"300px"}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead sx={{ background: "#FAFAFA" }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key as string}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!rows || rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <EmptyStateBox>
                    <img
                      alt="No data"
                      src="/images/table/not-found.svg"
                      width={352}
                      height={155}
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </EmptyStateBox>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, idx) => (
                <TableRow key={getRowKey ? getRowKey(row, idx) : idx}>
                  {columns.map((col) => (
                    <TableCell
                      key={col.key as string}
                      sx={{
                        width: `${((col.flex ?? 1) / flexTotal) * 100}%`,
                        verticalAlign: "middle",
                      }}
                    >
                      {col.render
                        ? col.render(row, idx)
                        : (row as any)[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
      {rows && rows.length !== 0 && (
        <ResponsiveTablePagination
          count={totalRows}
          page={page - 1}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => handleChangePage(newPage)}
          onRowsPerPageChange={(event) =>
            handleChangeRowsPerPage(parseInt(event.target.value, 10))
          }
        />
      )}
    </TableContainerCustom>
  );
}

// ====== Styled components ======
const TableContainerCustom = styled(TableContainer)`
  height: 100%;
  display: flex;
  border-radius: 4px;
  position: relative;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e5e5e5;
`;

const ResponsiveTablePagination = styled(TablePagination)(({ theme }) => ({
  height: 52,
  marginTop: "auto",
  background: "#fff",
  borderTop: "1px solid #eee",
  [theme.breakpoints.down("sm")]: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100vw",
    zIndex: 10,
    margin: 0,
    borderRadius: 0,
    boxShadow: "0 -2px 16px 0 rgba(0,0,0,0.04)",
  },
}));

const EmptyStateBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.down("sm")]: {
    minHeight: "40vh",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(1),
  },
}));
