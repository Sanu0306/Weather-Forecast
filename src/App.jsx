import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import WeatherDashboard from "./WeatherDashboard.jsx";
import { useAuth } from "./Context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { token } = useAuth();

  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/" replace /> : <Login />}
      />

      <Route
        path="/signup"
        element={token ? <Navigate to="/" replace /> : <Signup />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <WeatherDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
