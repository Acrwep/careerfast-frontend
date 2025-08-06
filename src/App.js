import "./App.css";
import { BrowserRouter } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./Layout/Layout";
import { Provider } from "react-redux";
import { store } from "./Redux/store";

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
      <Provider store={store}>
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
      </Provider>
    </div>
  );
}

export default App;
