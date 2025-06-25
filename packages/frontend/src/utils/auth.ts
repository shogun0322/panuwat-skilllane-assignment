import Cookies from "js-cookie";

export const getUserToken = () => Cookies.get("USER_TOKEN_KEY");

export const isAuthenticated = () => {
  return getUserToken();
};
