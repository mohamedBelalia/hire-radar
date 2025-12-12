import Cookies from "js-cookie";

export function setToken(token: string) {
  Cookies.set("token", token, { expires: 1 });
}

export function getToken():string | null {
  return Cookies.get("token") || null;
}

export function removeToken() {
  Cookies.remove("token");
}