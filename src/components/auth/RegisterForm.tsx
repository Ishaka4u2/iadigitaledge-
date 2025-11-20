
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/contexts/AuthContext";

import logoApp from "@/assets/logo-app.png";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="w-full max-w-md mb-8 text-center">
      <div className="mb-4">
        <img 
          src={logoApp} 
          alt="IA Digital Edge Logo" 
          className="w-[170px] h-[50px] mx-auto object-contain"
        />
      </div>
      <p className="text-muted-foreground">Create an account to get started</p>
      <AuthForm isLogin={false} />
    </div>
  );
};

export default RegisterForm;
