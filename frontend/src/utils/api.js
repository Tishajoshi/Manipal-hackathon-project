import axios from "axios";

// Prefer CRA proxy (frontend/package.json "proxy" -> http://localhost:8000)
// or allow overriding via REACT_APP_API_BASE
const baseURL = process.env.REACT_APP_API_BASE || "/";

const api = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;


