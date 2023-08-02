const serverAddress = import.meta.env.DEV
  ? "http://localhost:5000/"
  : window.location.origin + "/";

const config = {
  serverAddress,
};

export default config;
