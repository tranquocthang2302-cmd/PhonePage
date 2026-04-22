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
              "AbEIqDGVFyoJvugrostsrROKy1L5pWFfXZUZBwcHGHhXj8NXA4I0neUZniboR-0a_6xWU3hKwpqzN1gm",
            currency: "USD",
            locale: "vi_VN",
            vault: false,
            intent: "capture",
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
