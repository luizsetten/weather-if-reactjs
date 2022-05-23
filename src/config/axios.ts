import Axios from "axios";

const api = Axios.create({
  baseURL: "http://192.168.0.112:3333/",
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("@weatherData/userToken");
  // eslint-disable-next-line no-param-reassign
  if (token) config.headers = { authorization: `Bearer ${token}` };
  return config;
});

export default api;
