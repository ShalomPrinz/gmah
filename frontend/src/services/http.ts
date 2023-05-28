import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

const get = axios.get;
const post = axios.post;
const put = axios.put;

export { get, post, put };
