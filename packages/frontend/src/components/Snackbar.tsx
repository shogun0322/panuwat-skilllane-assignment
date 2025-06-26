import { Alert, Snackbar, useMediaQuery, useTheme } from "@mui/material";

import { alertStore } from "store/alert";

export default function GlobalAlert() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { show, message, type, clearAlert } = alertStore();

  return (
    <Snackbar
      anchorOrigin={
        isMobile
          ? { vertical: "bottom", horizontal: "center" }
          : { vertical: "top", horizontal: "center" }
      }
      open={show}
      message={message}
      autoHideDuration={2000}
      onClose={() => clearAlert()}
    >
      {type ? (
        <Alert severity={type} sx={{ width: 400 }} variant="filled">
          {message}
        </Alert>
      ) : undefined}
    </Snackbar>
  );
}
