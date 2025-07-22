import jwtDecode from "jwt-decode";

export function getToken() {
  return localStorage.getItem("accessToken");
}

export function getUserFromToken() {
  try {
    const token = getToken();
    if (!token) return null;
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
}

export function isVerified() {
  const user = getUserFromToken();
  return user?.is_email_verified || false;
}
