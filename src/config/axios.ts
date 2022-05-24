import Axios from "axios";
import { toast } from "react-toastify";

const api = Axios.create({
  baseURL: process.env.REACT_APP_API_URL,
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
    // if (error?.response?.data?.message)
    //   toast.error(error.response.data.message);

    // if (error?.response?.data?.error) toast.error(error.response.data.error);

    if (error.response.status === 401) {
      sessionStorage.removeItem("@weatherData/userToken");
      setTimeout(() => {
        window.location.href = "/";
      }, 5000);
    }

    return error;
  }
);

export default api;
