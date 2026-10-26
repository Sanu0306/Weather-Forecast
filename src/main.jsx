import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { Weatherprovider } from "./Context/Weather.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Weatherprovider>
          <App />
        </Weatherprovider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
