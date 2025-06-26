import { lazy } from "react";
import { Outlet } from "react-router";

import { Box } from "@mui/material";
import Header from "components/Header";
import CustomStackbar from "components/Snackbar";

const HomePage = lazy(() => import("../pages/Home"));
const ManageTaskPage = lazy(() => import("../pages/Task/Manage"));

const RenderPrivateRoute = () => {
  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
      <CustomStackbar />
      <header style={{ height: `73px` }}>
        <Header />
      </header>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          px: { xs: 2, md: 14 },
          pt: { xs: 4, md: 6 },
          pb: { xs: 8, md: 7 },
          backgroundColor: "#F8FAFC",
        }}
      >
        <Outlet />
      </Box>
    </div>
  );
};
const PrivateRoutes = {
  path: "",
  element: <RenderPrivateRoute />,
  children: [
    { path: "", element: <HomePage /> },
    { path: "task/manage", element: <ManageTaskPage /> },
  ],
};

export default PrivateRoutes;
