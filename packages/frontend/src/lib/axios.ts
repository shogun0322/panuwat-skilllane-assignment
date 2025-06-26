import axios from "axios";
import { getUserToken } from "utils/auth";

const axiosCustom = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
  timeout: 10000,
});

axiosCustom.interceptors.request.use(
  (config) => {
    const accessToken = getUserToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// axiosCustom.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosCustom;
