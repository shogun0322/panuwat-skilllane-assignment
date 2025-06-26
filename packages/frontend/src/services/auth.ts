import axiosCustom from "lib/axios";
import { setUserToken } from "utils/auth";

export async function loginApi(data: { email: string; password: string }) {
  const res = await axiosCustom.post("/auth/login", data);
  setUserToken(res.data.accessToken);
  return res.data;
}
