const serverAddress = import.meta.env.DEV
  ? "http://localhost:5000/"
  : window.location.href;

const config = {
  serverAddress,
};

export default config;
