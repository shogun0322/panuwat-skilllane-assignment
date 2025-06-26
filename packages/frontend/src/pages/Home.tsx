import { useEffect } from "react";
import { useNavigate } from "react-router";

import {
  Box,
  Stack,
  Dialog,
  Button,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { CustomTable } from "components/Table";
import { StatusSelect } from "components/SelectStatus";

import { updateTaskStatus } from "services/task";

import { taskStore } from "store/task";
import { loadStore } from "store/load";
import { alertStore } from "store/alert";
import { useConfirmAction } from "hook/useConfirmAction";

let timer: any;

export default function Home() {
  const navigate = useNavigate();
  const {
    page,
    limit,
    total,
    tasks,
    title,
    status,
    changePage,
    getTaskList,
    changeLimit,
    searchWithTitle,
    changeFilterStatus,
  } = taskStore();
  const { setLoad } = loadStore();
  const { setAlert } = alertStore();

  const confirm = useConfirmAction<{
    id: string;
    status: "INCOMPLETE" | "COMPLETE";
  }>();

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
    {
      key: "created_by",
      label: "Created By",
      flex: 0.5,
      render: (row: any) => (
        <Typography variant="body2">{row.user.email}</Typography>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <Box sx={{ width: 220 }}>
          <StatusSelect
            value={row.status}
            onChange={(e: any) =>
              confirm.request({ id: row.id, status: e.target.value })
            }
          />
        </Box>
      ),
      flex: 0.5,
    },
  ];

  const handleUpdateStatus = async (
    id: string,
    status: "INCOMPLETE" | "COMPLETE"
  ) => {
    try {
      setLoad();
      await updateTaskStatus({ id, status });
      setAlert("Update Task Status Success", "success");
    } catch (error) {
      setAlert("Create Task Status Error", "error");
    } finally {
      setLoad();
      getTaskList(setAlert, setLoad);
    }
  };
  const handleChangeTitle = (value: string) => {
    clearTimeout(timer);
    timer = setTimeout(() => searchWithTitle(value), 1000);
  };

  useEffect(() => {
    getTaskList(setAlert, setLoad);
  }, [title, status, getTaskList, setAlert, setLoad, limit, page]);

  return (
    <Stack direction="column" flex={1}>
      <Dialog open={confirm.open} onClose={confirm.cancel}>
        <DialogTitle>ยืนยันการเปลี่ยนแปลง</DialogTitle>
        <DialogContent>คุณต้องการเปลี่ยนข้อมูลใช่หรือไม่?</DialogContent>
        <DialogActions>
          <Button onClick={confirm.cancel}>ยกเลิก</Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() =>
              confirm.confirm((data) =>
                handleUpdateStatus(data.id, data.status)
              )
            }
          >
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>

      <Stack
        justifyContent="space-between"
        sx={{ flexWrap: "wrap" }}
        spacing={{ xs: 1, md: 2 }}
        direction={{ xs: "column", md: "row" }}
        alignItems={{ md: "center" }}
      >
        <Typography variant="h5" fontWeight={700}>
          Task Management
        </Typography>

        <Button
          size="large"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/task/manage")}
          sx={{ width: "126px" }}
        >
          CREATE
        </Button>
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ md: "center" }}
        justifyContent="space-between"
        sx={{ flexWrap: "wrap", mt: 4 }}
        spacing={{ xs: 1, md: 2 }}
      >
        <TextField
          sx={{ width: { xs: "100%", md: 400 } }}
          placeholder="Search by Tasks"
          onChange={(e) => handleChangeTitle(e.target.value)}
        />

        <Box sx={{ width: { xs: "100%", md: 200 } }}>
          <StatusSelect
            value={status}
            onChange={(e: any) => changeFilterStatus(e.target.value)}
          />
        </Box>
      </Stack>

      <Box
        mt={3}
        flex={1}
        sx={{ width: { xs: "90vw", md: "100%" }, overflow: "scroll" }}
      >
        <CustomTable
          columns={columns}
          rows={tasks}
          page={page}
          rowsPerPage={limit}
          totalRows={total}
          handleChangePage={(e) => changePage(e + 1)}
          handleChangeRowsPerPage={(e) => changeLimit(e)}
        />
      </Box>
    </Stack>
  );
}
