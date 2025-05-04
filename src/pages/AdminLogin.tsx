
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useOnboarding } from "@/contexts/OnboardingContext";
import OnboardingLayout from "@/components/OnboardingLayout";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const AdminLogin = () => {
  const { login } = useOnboarding();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      // Check if this is an admin email (simple check)
      if (!data.email.endsWith("@admin.com")) {
        toast({
          variant: "destructive",
          title: "Access denied",
          description: "This email is not authorized for admin access",
        });
        setIsLoading(false);
        return;
      }
      
      await signIn(data.email, data.password);
      
      // For backward compatibility with OnboardingContext
      login(true);
      
      toast({
        title: "Admin login successful",
        description: "Welcome to the admin dashboard!",
      });
      
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Admin login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnboardingLayout 
      title="Admin Login"
      subtitle="Sign in with your administrator credentials"
      showLogout={false}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Admin Sign In</CardTitle>
          <CardDescription>
            Enter your admin credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@admin.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t pt-4">
          <div className="text-sm text-center text-onboarding-gray-600 w-full">
            <a href="#" className="text-onboarding-blue hover:underline">
              Forgot your password?
            </a>
          </div>
          <div className="text-sm text-center w-full">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/login")}
            >
              Employee Login
            </Button>
          </div>
        </CardFooter>
      </Card>
    </OnboardingLayout>
  );
};

export default AdminLogin;
