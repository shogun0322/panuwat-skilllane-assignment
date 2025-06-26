import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ErrorBoundary from "ErrorBoundary";
import PrivateRoutes from "routes/PrivateRoutes";
import PublishRoutes from "routes/PublishRoutes";
import { ThemeProvider } from "@emotion/react";

import theme from "theme";
import { isAuthenticated } from "utils/auth";
import GlobalLoad from "components/Load";
import GlobalAlert from "components/Snackbar";

export default function App() {
  const routes = isAuthenticated() ? PrivateRoutes : PublishRoutes;
  const router = createBrowserRouter([routes]);

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <GlobalLoad />
        <GlobalAlert />
        <RouterProvider
          router={router}
          errorElement={<div>error</div>}
          fallbackElement={<div />}
        />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
