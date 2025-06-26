import React from "react";
import {
  Box,
  Table,
  Paper,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableContainer,
  CircularProgress,
  TablePagination,
} from "@mui/material";

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
}: MuiTableProps<T>) {
  const flexTotal = columns.reduce((sum, col) => sum + (col.flex ?? 1), 0);

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2,
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
                  <Box py={4}>
                    <img
                      src="/images/table/not-found.png"
                      alt="No data"
                      width={352}
                      height={155}
                    />
                  </Box>
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
        <TablePagination
          component="div"
          count={totalRows}
          page={page - 1}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => handleChangePage(newPage)}
          onRowsPerPageChange={(event) =>
            handleChangeRowsPerPage(parseInt(event.target.value, 10))
          }
          sx={{ height: 52, marginTop: "auto" }}
        />
      )}
    </TableContainer>
  );
}
