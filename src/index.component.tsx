// React
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App/App.component";
import { StoreProvider } from "./context/StoreContexst";

// Component

ReactDOM.render(
  (
    <StoreProvider>
      <App />
    </StoreProvider>
  ),
  document.getElementById("root"),
);
