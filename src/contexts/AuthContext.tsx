
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface User {
  username: string;
  email?: string;
  fullName?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string; transferPin?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on initial load
    const storedUser = localStorage.getItem("iadigital_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("iadigital_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we're just simulating authentication
      
      // Basic validation
      if (!username || !password) {
        throw new Error("Username and password are required");
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create user object
      const userData: User = { username };
      
      // Store in localStorage
      localStorage.setItem("iadigital_user", JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      
      // Show success toast
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      
      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User> & { password: string; transferPin?: string }) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we're just simulating registration
      
      // Basic validation
      if (!userData.username || !userData.password) {
        throw new Error("Username and password are required");
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Extract password and transferPin from userData (don't store password)
      const { password, transferPin, ...userWithoutPassword } = userData;
      
      // Store transfer PIN if provided
      if (transferPin) {
        localStorage.setItem("iadigital_pin", transferPin);
      }
      
      // Store in localStorage
      localStorage.setItem("iadigital_user", JSON.stringify(userWithoutPassword));
      
      // Update state
      setUser(userWithoutPassword as User);
      
      // Show success toast
      toast({
        title: "Account Created",
        description: "Your account has been created successfully!",
      });
      
      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear user from localStorage
    localStorage.removeItem("iadigital_user");
    
    // Update state
    setUser(null);
    
    // Show success toast
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    
    // Navigate to login page
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
