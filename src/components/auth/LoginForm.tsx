
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!username.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      console.log("LoginForm: Attempting login for username:", username);
      
      // Call login without role parameter - Django will determine role from user data
      const success = await login(username, password);
      
      console.log("LoginForm: Login result:", success);
      
      if (success) {
        console.log("LoginForm: Login successful, navigating to /action");
        navigate("/action");
      } else {
        console.log("LoginForm: Login failed");
        setErrors({ general: "Login failed. Please check your credentials." });
      }
    } catch (error) {
      console.error("LoginForm: Login error:", error);
      setErrors({ general: "An error occurred during login. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
          {errors.general}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium">
          Username
        </label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          disabled={isSubmitting}
          className={errors.username ? "border-red-500" : ""}
        />
        {errors.username && (
          <p className="text-red-500 text-xs">{errors.username}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          disabled={isSubmitting}
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password}</p>
        )}
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          "Log in"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
