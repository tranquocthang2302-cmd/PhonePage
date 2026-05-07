import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistor, store } from "./redux/store";
import App from "./App";
import { GlobalStyle } from "./styles/GlobalStyles";
import reportWebVitals from "./reportWebVitals";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
// Import component vào đây
import ContactWidget from "./components/ContactWidget/ContactWidget";
// import TawkMessenger from "./components/TawkMessenger/TawkMessenger";
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <GlobalStyle />
      <PersistGate loading={null} persistor={persistor}>
        <PayPalScriptProvider
          options={{
            "client-id":
              "AfaF-0pw7yE6O5pwnfUOS0WS2eLZCN2QGvdOOZpDIt3kUGqquXWYguKI35IHiTh8O9OtiqcJ8AW56Xim",
            currency: "USD",
            locale: "vi_VN",
            vault: false,
            intent: "capture",
            "disable-funding": "card",
          }}
        >
          <App />

          <ContactWidget />
          {/* <TawkMessenger /> */}
        </PayPalScriptProvider>
      </PersistGate>
    </Provider>
  </QueryClientProvider>,
);

reportWebVitals();
