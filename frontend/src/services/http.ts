import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

const get = axios.get;

export { get };
