import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/auth/register.jsx";
import LandingPage from "./pages/landing.jsx";
import Login from "./pages/auth/login.jsx";
import VerifyEmail from "./pages/auth/verifyEmail.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx";
import Home from "./pages/home/home.jsx";
import ForgotPassword from "./pages/auth/forgot-password.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<ProtectedRoute />} > 
          <Route path="/home" element={<Home />} />
        </Route>
     
      </Routes>
    </BrowserRouter>
  );
}

export default App;
