import Router from "./pages/Router";

import "./App.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Router />
      <ToastContainer rtl />
    </>
  );
}

export default App;
