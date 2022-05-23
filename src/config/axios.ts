import Axios from "axios";
import { toast } from "react-toastify";

const api = Axios.create({
  baseURL: "http://192.168.0.112:3333/",
});

api.interceptors.request.use((request) => {
  const token = sessionStorage.getItem("@weatherData/userToken");
  // eslint-disable-next-line no-param-reassign
  if (token) request.headers = { authorization: `Bearer ${token}` };
  return request;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      sessionStorage.removeItem("@weatherData/userToken");
      window.location.href = "/";
    }

    return error;
  }
);

export default api;
