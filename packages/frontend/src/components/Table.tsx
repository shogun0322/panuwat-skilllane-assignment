import React from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
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
}

export function CustomTable<T>({
  columns,
  rows,
  loading = false,
  getRowKey,
}: MuiTableProps<T>) {
  if (loading) {
    return (
      <Box
        p={4}
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={"100%"}
      >
        <CircularProgress />
      </Box>
    );
  }
  const flexTotal = columns.reduce((sum, col) => sum + (col.flex ?? 1), 0);

  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: 2, height: "100%", position: "relative" }}
    >
      <Table>
        <TableHead sx={{ background: "#FAFAFA" }}>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key as string}>{col.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        {!rows || rows.length === 0 ? (
          <Box
            sx={{
              top: "50%",
              left: "50%",
              position: "absolute",
              transform: "translate(-50%, -50%)",
            }}
          >
            <img src="/images/table/not-found.png" />
          </Box>
        ) : (
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={getRowKey ? getRowKey(row, idx) : idx}>
                {columns.map((col) => (
                  <TableCell
                    key={col.key as string}
                    sx={{ width: `${((col.flex ?? 1) / flexTotal) * 100}%` }}
                  >
                    {col.render ? col.render(row, idx) : (row as any)[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
}
