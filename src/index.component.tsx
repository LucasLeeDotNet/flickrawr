// React
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App/App.component";
import { StoreProvider } from "./context/StoreContext";

// Component

ReactDOM.render(
  (
    <StoreProvider>
      <App />
    </StoreProvider>
  ),
  document.getElementById("root"),
);
