import axios from "axios";

const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || "").trim().replace(/\/$/, "");
if (!BACKEND_URL) {
  console.error("REACT_APP_BACKEND_URL is not set. Create app/frontend/.env and restart npm start.");
} else if (process.env.NODE_ENV !== "production") {
  console.info("API backend:", BACKEND_URL);
}
export const API_BASE = `${BACKEND_URL}/api`;

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("slv_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;

export const formatErr = (e) => {
  const d = e?.response?.data?.detail;
  if (!d) return e?.message || "Something went wrong";
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map(x => x.msg || JSON.stringify(x)).join(" ");
  return JSON.stringify(d);
};
