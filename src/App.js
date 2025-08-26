import "./App.css";
import { BrowserRouter } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./Layout/Layout";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ScrollToTop from "./ScrollTop/ScrollToTop";
function App() {
  if (process.env.NODE_ENV === "production") {
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    console.warn = () => {};
    console.error = () => {};
  }
  // client id
  const CLIENT_ID =
    "288981358654-vrhl2uqu61r1ju40blnk4ibde6sbnu47.apps.googleusercontent.com";
  //
  return (
    <div className="App">
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <Provider store={store}>
          <BrowserRouter>
            <ScrollToTop />
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
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
