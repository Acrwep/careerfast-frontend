import "./App.css";
import { BrowserRouter } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./Layout/Layout";

function App() {
  //hide console and errors in the production
  if (process.env.NODE_ENV === "production") {
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    console.warn = () => {};
    console.error = () => {};
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Layout />
        <ToastContainer
          position="top-right"
          autoClose={700}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={true}
          draggable={false}
          pauseOnHover={true}
          theme="light"
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
