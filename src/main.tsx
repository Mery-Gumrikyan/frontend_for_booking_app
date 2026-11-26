import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import "./index.css";
import App from "./App.tsx";

import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";

const theme = {
  token: {
    colorPrimary: "#0a538c",
    colorInfo: "#0284c7",
    colorSuccess: "#10b981",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    borderRadius: 12,
    colorTextHeading: "#0b1f3a",
    colorText: "#1e293b",
    colorBgLayout: "#f8fafc",
  },
};

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ConfigProvider theme={theme}>
      <BrowserRouter>
        <StrictMode>
          <App />
        </StrictMode>
      </BrowserRouter>
    </ConfigProvider>
  </Provider>,
);
