import React, { Suspense, lazy, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./Utils/ProtectedRoute";
import { AuthContext } from "./Store/Context/AuthContext";
import { HashLoader } from "react-spinners";

// Lazy load components
const HomePage = lazy(() => import("./Pages/Home/HomePage"));
const LoginSignup = lazy(() => import("./Pages/LoginSignup/LoginSignup"));
const Navbar = lazy(() => import("./Components/Navbar/Navbar"));
const Dashboard = lazy(() => import("./Pages/Dashboard/Dashboard"));
const ShortenForm = lazy(() =>
  import("./Components/UrlShortenerForm/ShortenForm")
);
const SingleLinkStats = lazy(() =>
  import("./Components/SingleLinkStats/SingleLinkStats")
);
const ErrorPage = lazy(() => import("./Pages/ErrorPage"));

const App = () => {
  const { token } = useContext(AuthContext);

  return (
    <>
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh", // full viewport height
              backgroundColor: "#f0f2f5", // optional background
            }}
          >
            <HashLoader color="#489bfb" size={60} />
          </div>
        }
      >
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={token ? <Navigate to="/app" replace /> : <HomePage />}
          />
          <Route path="/login" element={<LoginSignup />} />

          {/* Protected Routes */}
          <Route
            path="/app/*"
            element={
              <ProtectedRoute>
                <Navbar />
                <Routes>
                  <Route index element={<Dashboard />} />
                  <Route path="shorten" element={<ShortenForm />} />
                  <Route path="link/:id" element={<SingleLinkStats />} />
                  <Route path="*" element={<ErrorPage />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Catch all unmatched routes */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
