import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const setUserHeader = (userId) => {
  if (userId) {
    api.defaults.headers.common["X-User-Id"] = userId;
  } else {
    delete api.defaults.headers.common["X-User-Id"];
  }
};

export const loginApi = (payload) => api.post("/auth/login", payload);
export const listBikesApi = () => api.get("/bikes");
export const addBikeApi = (payload) => api.post("/bikes", payload);
export const bookBikeApi = (payload) => api.post("/bookings", payload);
export const getBookingsApi = () => api.get("/bookings");
export const getAdminOverviewApi = () => api.get("/admin/overview");

export default api;
