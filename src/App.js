import "./App.css";
import { BrowserRouter } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./Layout/Layout";

function App() {
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
