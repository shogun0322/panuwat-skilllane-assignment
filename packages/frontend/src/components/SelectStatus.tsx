import React from "react";
import {
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";

type StatusType = "" | "INCOMPLETE" | "COMPLETE";

export interface StatusSelectProps {
  value: StatusType;
  onChange: (event: SelectChangeEvent<StatusType>) => void;
  showAll?: boolean;
}

const statusOptions: { value: StatusType; label: string }[] = [
  { value: "INCOMPLETE", label: "Incomplete" },
  { value: "COMPLETE", label: "Complete" },
];

const getStatusBg = (status: StatusType) => {
  switch (status) {
    case "COMPLETE":
      return "#C8E6C9"; // Green
    case "INCOMPLETE":
      return "#EEEEEE"; // Grey
    default:
      return "#FAFAFA"; // Placeholder
  }
};

export const StatusSelect: React.FC<StatusSelectProps> = ({
  value,
  onChange,
  showAll = true,
}) => (
  <FormControl fullWidth>
    <Select
      value={value ?? ""}
      onChange={onChange}
      displayEmpty
      sx={{
        transition: "background 0.2s",
        backgroundColor: getStatusBg(value),
      }}
    >
      {!showAll && (
        <MenuItem value="" disabled={showAll}>
          All Status
        </MenuItem>
      )}
      {statusOptions.map((opt) => (
        <MenuItem
          key={opt.value}
          value={opt.value}
          disabled={opt.value === ""}
          sx={{
            backgroundColor: getStatusBg(opt.value),
          }}
        >
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);
