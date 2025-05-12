
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SignupForm from "@/components/auth/SignupForm";

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an Admin account</CardTitle>
            <CardDescription className="text-center">
              Enter your details to create your CyberXpert admin account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
            
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-500">Already have an account?</span>{" "}
              <Link to="/login" className="text-cyber-orange font-medium hover:underline">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Signup;
