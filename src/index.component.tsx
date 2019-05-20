// React
import React from "react";
import ReactDOM from "react-dom";

// Component
import App from "./components/App/App.component";
import { StoreProvider } from "./context/StoreContext";

ReactDOM.render(
  (
    <StoreProvider>
      <App />
    </StoreProvider>
  ),
  document.getElementById("root"),
);
