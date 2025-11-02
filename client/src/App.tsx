import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import AuthPage from "./components/AuthPage";
import HomePage from "./pages/HomePage";

function App() {
  const { user, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#6A89A7",
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#BDDDFC",
              secondary: "#384959",
            },
          },
          error: {
            iconTheme: {
              primary: "#ff4b4b",
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  );
}

export default App;
