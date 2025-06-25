import {
  Box,
  Button,
  Paper,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useLocation, useNavigate } from "react-router";
import { CloudUpload } from "@mui/icons-material";

import { useForm } from "react-hook-form";
import RichTextEditor from "components/RichTextEditor";

export interface TaskManagementFormInputs {
  title: string;
  description: string;
  image: string;
  status: string;
}

export const formValidation = {
  title: {
    required: "Title is required",
    minLength: { value: 6, message: "At least 6 characters" },
  },

  description: {
    required: "Description is required",
  },
};

export default function ManageTask() {
  const navigate = useNavigate();
  const { state } = useLocation();

  console.log("shogun test ", state);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskManagementFormInputs>();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      //   setSelectedFile(file);
    }
  };

  const handleSubmitData = (data: TaskManagementFormInputs) => {
    console.log("shogun test Login data", data);
  };

  const gotoHome = () => {
    navigate(-1);
  };

  return (
    <Stack width={"100%"}>
      <Typography
        variant="h5"
        color="primary"
        fontWeight={700}
        sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={() => gotoHome()}
      >
        <ArrowBackIosIcon sx={{ width: "17px", height: "17px", mr: 1 }} />
        Create Task Detail
      </Typography>

      <Stack
        sx={{
          mt: 4,
          flex: 1,
          mx: "auto",
          width: "100%",
          maxWidth: "640px",
        }}
      >
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
            flexDirection: "column",
            mt: { xs: 3 },
            p: { xs: 2, md: 3 },
            position: "relative",
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

              <RichTextEditor
                value=""
                onChange={() => {}}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Image
              </Typography>
              <input
                type="file"
                accept="image/png,image/jpeg"
                id="image-upload"
                style={{ display: "none" }}
                onChange={handleFileUpload}
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
                  {/* {selectedFile && (
                    <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                      Selected: {selectedFile.name}
                    </Typography>
                  )} */}
                </UploadArea>
              </label>
            </Box>
          </Stack>
          <Stack
            mt="auto"
            spacing={1}
            direction="row"
            justifyContent="flex-end"
          >
            <Button variant="outlined" onClick={() => gotoHome()}>
              CANCEL
            </Button>
            <Button variant="contained" type="submit">
              SAVE
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  );
}

const UploadArea = styled(Paper)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(6),
  textAlign: "center",
  cursor: "pointer",
  transition: "border-color 0.3s ease",
  "&:hover": {
    borderColor: theme.palette.primary.main,
  },
}));
