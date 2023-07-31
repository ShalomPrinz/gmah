import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000/api";

const get = axios.get;
const post = axios.post;
const put = axios.put;
/** remove is an alias for delete, which is a reserved keyword in js */
const remove = axios.delete;

export { get, post, put, remove };
