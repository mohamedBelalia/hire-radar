import Cookies from "js-cookie";

export function setToken(token: string) {
  Cookies.set("token", token, { expires: 1 });
}

export function getToken() {
  return Cookies.get("token");
}
