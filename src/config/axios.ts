import Axios from "axios";

const api = Axios.create({
  baseURL: "http://192.168.0.106:80/",
});

export default api;
