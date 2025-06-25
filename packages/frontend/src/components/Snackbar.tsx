import { Alert, Snackbar, useMediaQuery, useTheme } from "@mui/material";

export default function CustomStackbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isOpen = false;
  const message = "I love snacks";
  const type = "success"; // 'error'

  return (
    <Snackbar
      anchorOrigin={
        isMobile
          ? { vertical: "bottom", horizontal: "center" }
          : { vertical: "top", horizontal: "center" }
      }
      open={isOpen}
      message={message}
      autoHideDuration={3000}
    >
      <Alert severity={type} sx={{ width: 400 }} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
