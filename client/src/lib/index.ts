import Cookies from "js-cookie";

/**
 * Store an authentication token in a browser cookie named "token".
 *
 * Creates a cookie named "token" with the provided value that expires in 1 day.
 *
 * @param token - The token value to persist in the cookie
 */
export function setToken(token: string) {
  Cookies.set("token", token, { expires: 1 });
}

/**
 * Retrieve the persisted authentication token from the "token" cookie.
 *
 * @returns The token string if the cookie exists, `null` otherwise.
 */
export function getToken():string | null {
  return Cookies.get("token") || null;
}

/**
 * Removes the browser cookie used to persist the authentication token ("token").
 */
export function removeToken() {
  Cookies.remove("token");
}