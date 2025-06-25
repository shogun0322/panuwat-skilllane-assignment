import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ErrorBoundary from "ErrorBoundary";
import PrivateRoutes from "routes/PrivateRoutes";
import PublishRoutes from "routes/PublishRoutes";
import { ThemeProvider } from "@emotion/react";
import theme from "theme";
import { isAuthenticated } from "utils/auth";

export default function App() {
  console.log('shogun test ', isAuthenticated());
  
  const routes = isAuthenticated() ? PrivateRoutes : PublishRoutes;

  const router = createBrowserRouter([routes]);

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <RouterProvider
          router={router}
          errorElement={<div>error</div>}
          fallbackElement={<div />}
        />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
