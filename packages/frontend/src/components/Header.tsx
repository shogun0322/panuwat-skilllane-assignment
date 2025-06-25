import { Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Header() {
  return (
    <Box
      sx={{
        height: "100%",
        px: { xs: 2, md: 14 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <img src="/images/login/logo.webp" width={116} height={40} />

      <AccountCircleIcon color="primary" height={20} width={20} />
    </Box>
  );
}
