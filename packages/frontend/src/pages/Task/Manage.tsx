import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import {
  Box,
  Button,
  Paper,
  Stack,
  styled,
  Dialog,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";

import { CloudUpload, Delete, ArrowBackIos } from "@mui/icons-material";

import RichTextEditor from "components/RichTextEditor";

import { taskStore } from "store/task";
import { loadStore } from "store/load";
import { alertStore } from "store/alert";
import { useConfirmAction } from "hook/useConfirmAction";

import {
  createTask,
  deleteTask,
  TaskDetailBody,
  updateTaskDetail,
} from "services/task";
import { uploadImage } from "services/upload";

export const formValidation = {
  title: {
    required: "Title is required",
    minLength: { value: 3, message: "At least 3 characters" },
  },

  description: {
    required: "Description is required",
  },
};

export default function ManageTask() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const isEdit = state;
  const actionText = isEdit ? "Update" : "Create";

  const { setLoad } = loadStore();
  const { setAlert } = alertStore();
  const { getTaskDetailData } = taskStore();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const confirm = useConfirmAction<{ id: string | undefined }>();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
    watch,
  } = useForm<TaskDetailBody>({
    defaultValues: {
      image: null,
    },
  });

  const imageFile = watch("image");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitData = async (data: TaskDetailBody) => {
    try {
      setLoad();
      if (isEdit) {
        await updateTaskDetail({ ...data, image: null, status: "INCOMPLETE" });
      } else {
        await createTask({ ...data, image: null, status: "INCOMPLETE" });
      }
      setLoad();
      setAlert(`${actionText} Task Success`, "success");
      gotoHome();
    } catch (error) {
      setLoad();
      setAlert(`${actionText} Task Error`, "error");
    }
  };

  const handleDeleteData = async (id: string | undefined) => {
    try {
      if (!id) throw new Error("");
      setLoad();
      await deleteTask(id);
      setAlert(`Delete Task Success`, "success");
      gotoHome();
    } catch (error) {
      setAlert(`Delete Task Error`, "error");
    } finally {
      setLoad();
    }
  };

  const gotoHome = () => navigate(-1);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    try {
      setLoad();
      const data = await uploadImage(e.target.files[0]);
      setValue("image", data.url);

      setAlert(`Add Image Success`, "success");
      gotoHome();
    } catch (error) {
      setAlert(`Add Image Error`, "error");
    } finally {
      setLoad();
    }
  };

  const getDetail = async () => {
    const data = (await getTaskDetailData(state, setAlert, setLoad)) as any;
    reset({
      id: data.id,
      title: data.title ?? "",
      description: data.description ?? "",
      image: null, // เสมอ (เพราะฟอร์มต้องการ File)
      status: data.status ?? "",
    });
  };
  useEffect(() => {
    if (isEdit) getDetail();
  }, [state]);

  return (
    <Stack width={"100%"}>
      <Dialog open={confirm.open} onClose={confirm.cancel}>
        <DialogTitle>ยืนยันการเปลี่ยนแปลง</DialogTitle>
        <DialogContent>คุณต้องการลบข้อมูลใช่หรือไม่?</DialogContent>
        <DialogActions>
          <Button onClick={confirm.cancel}>ยกเลิก</Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => confirm.confirm((data) => handleDeleteData(data.id))}
          >
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
      <Typography
        variant="h5"
        color="primary"
        fontWeight={700}
        onClick={() => gotoHome()}
        sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
      >
        <ArrowBackIos sx={{ width: "17px", height: "17px", mr: 1 }} />
        {`${actionText} Task Detail`}
      </Typography>

      <Container>
        <Typography variant="body1" fontWeight={700}>
          Task Information
        </Typography>

        <Typography variant="body2">
          Fill in the basic details of your task.
        </Typography>

        <Paper
          variant="outlined"
          sx={{
            flex: 1,
            display: "flex",
            mt: { xs: 3 },
            p: { xs: 2, md: 3 },
            position: "relative",
            flexDirection: "column",
          }}
          component="form"
          onSubmit={handleSubmit(handleSubmitData)}
        >
          <Stack direction="column" spacing={3} flex={1}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Title <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": { backgroundColor: "white" },
                }}
                placeholder="Enter Title"
                error={!!errors.title}
                helperText={errors.title?.message}
                {...register("title", formValidation.title)}
              />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Description <span style={{ color: "red" }}>*</span>
              </Typography>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field, fieldState }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Image
              </Typography>
              <input
                type="file"
                id="image-upload"
                onChange={handleUpload}
                style={{ display: "none" }}
                accept="image/png,image/jpeg"
              />
              <label htmlFor="image-upload">
                <UploadArea>
                  <CloudUpload
                    sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ mb: 1, textDecoration: "underline" }}
                  >
                    Click to upload or drag and drop
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    PNG or JPG (max. 3MB)
                  </Typography>
                  {getValues("image") && (
                    <Box mt={2}>
                      <img
                        src={getValues("image") || ""}
                        alt="Preview"
                        style={{
                          maxWidth: 180,
                          maxHeight: 120,
                          borderRadius: 8,
                          border: "1px solid #eee",
                        }}
                      />
                      {/* <Typography
                        variant="caption"
                        sx={{ display: "block", mt: 0.5 }}
                      >
                        {imageFile?.name}
                      </Typography> */}
                    </Box>
                  )}
                </UploadArea>
              </label>
              {errors.image && (
                <Typography color="error" variant="caption">
                  {errors.image.message as string}
                </Typography>
              )}
            </Box>
          </Stack>
          <Stack
            pt={2}
            mt="auto"
            spacing={1}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            {isEdit && (
              <Delete
                onClick={() => confirm.request({ id: getValues("id") })}
              />
            )}
            <Stack spacing={1} direction="row">
              <Button variant="outlined" onClick={() => gotoHome()}>
                CANCEL
              </Button>
              <Button variant="contained" type="submit">
                SAVE
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Stack>
  );
}

const UploadArea = styled(Paper)(({ theme }) => ({
  border: `1px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(6),
  textAlign: "center",
  cursor: "pointer",
  transition: "border-color 0.3s ease",
  "&:hover": {
    borderColor: theme.palette.primary.main,
  },
}));

const Container = styled(Stack)`
  flex: 1;
  width: 100%;
  margin-top: 32px;
  max-width: 640px;
  margin-inline: auto;
`;
