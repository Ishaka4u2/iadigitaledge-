import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import logoApp from "@/assets/logo-app.png";
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});
type FormValues = z.infer<typeof formSchema>;
const Index = () => {
  const navigate = useNavigate();
  const {
    login,
    isAuthenticated,
    isLoading
  } = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  const onSubmit = async (data: FormValues) => {
    await login(data.email.split("@")[0], data.password);
  };
  const handleCreateAccount = () => {
    navigate("/register");
  };
  return <div className="min-h-screen flex flex-col md:flex-row items-stretch bg-white">
      {/* Left side - Brand content */}
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center text-white bg-amber-500 py-0 px-0">
        <div className="max-w-md mx-auto py-[33px]">
          <div className="mb-8 text-center md:text-left">
            <img src={logoApp} alt="Digital Edge Logo" className="h-24 mx-auto md:mx-0 mb-4" />
            <h1 className="font-bold mb-4 text-2xl">Digital Edge</h1>
            <p className="text-base">Pioneering new digital solutions to connect with the services you love.</p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 bg-white p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-2xl font-semibold mb-6 text-center">Log in to Your Account</h2>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="email" render={({
                field
              }) => <FormItem>
                      <FormControl>
                        <Input placeholder="Email or phone number" {...field} className="h-12 text-lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                
                <FormField control={form.control} name="password" render={({
                field
              }) => <FormItem>
                      <FormControl>
                        <Input type="password" placeholder="Password" {...field} className="h-12 text-lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                
                <Button type="submit" disabled={isLoading} className="w-full h-12 text-lg font-semibold bg-amber-500 hover:bg-amber-400 text-gray-950">
                  {isLoading ? "Logging in..." : "Log In"}
                </Button>

                <div className="text-center">
                  <Button variant="link" className="text-blue-600">
                    Forgot Password?
                  </Button>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <div className="text-center bg-slate-50">
                  <Button type="button" onClick={handleCreateAccount} className="bg-green-600 hover:bg-green-700 h-12 px-6 text-base" disabled={isLoading}>
                    Create New Account
                  </Button>
                </div>
              </form>
            </Form>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>By continuing, you agree to our Terms of Service, Privacy Policy and Cookie Policy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Index;