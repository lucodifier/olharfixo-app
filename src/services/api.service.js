import axios from "axios";

const api = axios.create({
  baseURL: "http://ativo.mirus.com.br/api",
});

export default api;
