import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Box, Alert, Button } from "@mui/material";

function MyFallbackComponent({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Box sx={{ p: 4 }}>
      <Alert severity="error" sx={{ mb: 2 }}>
        <strong>เกิดข้อผิดพลาด</strong>
        <br />
        {error.message}
      </Alert>
      <Button variant="contained" color="error" onClick={resetErrorBoundary}>
        ลองใหม่
      </Button>
    </Box>
  );
}

// default function export!
export default function MyErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      FallbackComponent={MyFallbackComponent}
      onReset={() => window.location.reload()}
    >
      {children}
    </ErrorBoundary>
  );
}
