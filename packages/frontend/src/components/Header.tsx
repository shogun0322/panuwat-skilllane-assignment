import { useNavigate } from "react-router";

import { Box, Stack } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { clearUserToken } from "utils/auth";

export default function Header() {
  const navigate = useNavigate();
  return (
    <Stack
      direction="row"
      sx={{
        height: "73px",
        px: { xs: 2, md: 14 },
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <img
        width={116}
        height={40}
        alt="panuwat"
        src="/images/login/logo.webp"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      />

      <Box onClick={() => clearUserToken()} sx={{ cursor: "pointer" }}>
        <AccountCircleIcon color="primary" height={20} width={20} />
      </Box>
    </Stack>
  );
}
