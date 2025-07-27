import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";

ReactDOM.render(
  <AuthProvider>        {/* ← this is crucial */}
    <App />
  </AuthProvider>,
  document.getElementById("root")
);
