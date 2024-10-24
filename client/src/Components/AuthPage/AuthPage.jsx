import React, { useState } from "react";
import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import "./AuthPage.css";
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      <div className="auth-container">
        {isLogin ? <LoginPage /> : <RegisterPage />}
      </div>
    </div>
  );
};

export default AuthPage;
