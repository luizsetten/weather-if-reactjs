import Axios from "axios";
import { toast } from "react-toastify";

const api = Axios.create({
  baseURL: "http://192.168.0.112:3333/",
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("@weatherData/userToken");
  // eslint-disable-next-line no-param-reassign
  if (token) config.headers = { authorization: `Bearer ${token}` };
  return config;
});

api.interceptors.response.use(
  (config) => {
    return config;
  },
  (configErr) => {
    if (configErr.status === 401) {
      sessionStorage.removeItem("@weatherData/userToken");
      // Navegar para tela inicial
    }

    return configErr;
  }
);

export default api;
