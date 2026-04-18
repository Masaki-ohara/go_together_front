// src/utils/auth.ts
export const saveAuthHeaders = (res: Response) => {
  localStorage.setItem("access-token", res.headers.get("access-token") || "");
  localStorage.setItem("client", res.headers.get("client") || "");
  localStorage.setItem("uid", res.headers.get("uid") || "");
};