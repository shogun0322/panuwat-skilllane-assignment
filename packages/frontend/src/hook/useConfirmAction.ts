import { useState } from "react";

export function useConfirmAction<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [open, setOpen] = useState(false);

  const request = (payload: T) => {
    setData(payload);
    setOpen(true);
  };

  const confirm = (onConfirm: (payload: T) => void) => {
    if (data) onConfirm(data);
    setOpen(false);
    setData(null);
  };

  const cancel = () => {
    setOpen(false);
    setData(null);
  };

  return { open, data, request, confirm, cancel };
}
