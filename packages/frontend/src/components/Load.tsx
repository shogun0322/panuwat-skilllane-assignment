import { loadStore } from "store/load";

import { Backdrop, CircularProgress } from "@mui/material";

export default function GlobalLoad() {
  const { load } = loadStore();
  return (
    <Backdrop open={load} sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}>
      <CircularProgress />
    </Backdrop>
  );
}
