import Cookies from "js-cookie";

const userTokenKey = "USER_TOKEN_KEY";

export const setUserToken = async (token: string) => {
  await Cookies.set(userTokenKey, token, { expires: 7 });
  window.location.reload();
};

export const clearUserToken = async () => {
  await Cookies.remove(userTokenKey);
  window.location.reload();
};

export const getUserToken = () => Cookies.get(userTokenKey) || "";

export const isAuthenticated = () => {
  return getUserToken();
};
