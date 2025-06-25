import {
  Autocomplete,
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { CustomTable } from "components/Table";
import { useNavigate } from "react-router";
import { StatusSelect } from "components/SelectStatus";

const data = [
  {
    id: 1,
    title:
      "Title test Title test Title test Title test Title test Title test Title test Title test ",
    created_by: "name",
    status: "complete",
  },
  {
    id: 2,

    title: "Title 2",
    created_by: "name",
    status: "incomplete",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const columns = [
    {
      key: "title",
      label: "Title",
      render: (row: any) => (
        <Box
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/task/manage", { state: row.id })}
        >
          <Typography
            color="primary"
            variant="body2"
            fontWeight={700}
            sx={{
              overflow: "hidden",
              WebkitLineClamp: 1,
              display: "-webkit-box",
              textOverflow: "ellipsis",
              WebkitBoxOrient: "vertical",
            }}
          >
            {row.title}
          </Typography>
        </Box>
      ),
      flex: 1,
    },
    { key: "created_by", label: "Created By", flex: 0.5 },
    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <Box sx={{ width: 220 }}>
          <StatusSelect value={row.status} onChange={() => {}} />
        </Box>
      ),
      flex: 0.5,
    },
  ];

  return (
    <Stack direction="column" flex={1}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ flexWrap: "wrap" }}
        spacing={{ xs: 1, md: 2 }}
      >
        <Typography variant="h5" fontWeight={700}>
          Task Management
        </Typography>

        <Button
          size="large"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/task/manage")}
        >
          CREATE
        </Button>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ flexWrap: "wrap", mt: 4 }}
        spacing={{ xs: 1, md: 2 }}
      >
        <TextField sx={{ width: 400 }} placeholder="Search by Tasks" />

        <Box sx={{ width: 220 }}>
          <StatusSelect value="" onChange={() => {}} />
        </Box>
      </Stack>

      <Box flex={1} mt={{ sm: 3 }}>
        <CustomTable columns={columns} rows={data} />
      </Box>
    </Stack>
  );
}
