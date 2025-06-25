import { lazy } from "react";
import { Outlet } from "react-router";

const LoginPage = lazy(() => import("../pages/Login"));

const PublishRoutes = {
  path: "/",
  element: <Outlet />,
  children: [
    { path: "", element: <LoginPage /> },
    { path: "*", element: <LoginPage /> },
  ],
};

export default PublishRoutes;
