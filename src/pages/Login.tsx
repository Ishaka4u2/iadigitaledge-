
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/AuthForm";
import logoApp from "@/assets/logo-app.png";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Get the path they were trying to access before being redirected to login
  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    // If already authenticated, redirect to the dashboard or previous location
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <div className="w-full max-w-md mb-8 text-center">
        <div className="mb-4">
          <img 
            src={logoApp} 
            alt="IA Digital Edge Logo" 
            className="w-[170px] h-[50px] mx-auto object-contain"
          />
        </div>
        <p className="text-muted-foreground">Your one-stop digital services platform</p>
      </div>
      <AuthForm isLogin={true} />
    </div>
  );
};

export default Login;
