import React from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

type StatusType = "" | "incomplete" | "complete";

export interface StatusSelectProps {
  value: StatusType;
  onChange: (event: SelectChangeEvent<StatusType>) => void;
}

const statusOptions: { value: StatusType; label: string }[] = [
  { value: "incomplete", label: "Incomplete" },
  { value: "complete", label: "Complete" },
];

const getStatusBg = (status: StatusType) => {
  switch (status) {
    case "complete":
      return "#C8E6C9"; // Green
    case "incomplete":
      return "#EEEEEE"; // Grey
    default:
      return "#FAFAFA"; // Placeholder
  }
};

export const StatusSelect: React.FC<StatusSelectProps> = ({
  value,
  onChange,
}) => (
  <FormControl fullWidth>
    <Select
      value={value}
      onChange={onChange}
      displayEmpty
      sx={{
        transition: "background 0.2s",
        backgroundColor: getStatusBg(value),
      }}
    >
      <MenuItem value="" disabled>
        Status
      </MenuItem>
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
