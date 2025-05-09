import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
const Landing = () => {
  const {
    isAuthenticated
  } = useAuth();
  return <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-cyber-black to-cyber-dark-gray text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Secure Your Code <span className="text-cyber-orange">Proactively</span>
                </h1>
                <p className="text-lg text-gray-300">
                  CyberXpert provides advanced security posture analysis for modern applications. 
                  Identify vulnerabilities before they become threats.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  {!isAuthenticated ? <>
                      <Link to="/signup">
                        <Button size="lg" className="bg-cyber-orange hover:bg-cyber-orange/90">
                          Start Securing Your App
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                      <Link to="/login">
                        <Button size="lg" variant="outline" className="border-white text-white bg-cyber-orange">
                          Log In
                        </Button>
                      </Link>
                    </> : <Link to="/home">
                      <Button size="lg" className="bg-cyber-orange hover:bg-cyber-orange/90">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>}
                </div>
              </div>
              
              <div className="hidden lg:block relative">
                <div className="relative rounded-md overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent z-10"></div>
                  <img src="https://images.unsplash.com/photo-1518770660439-4636190af475" alt="Cyber Security" className="w-full h-full object-cover" />
                </div>
                <div className="absolute top-0 right-0 -mr-6 -mt-6 bg-cyber-orange rounded-full w-20 h-20 flex items-center justify-center font-bold text-white animate-pulse-glow">
                  New
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Advanced Security Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-cyber-orange/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyber-orange">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Vulnerability Detection</h3>
                <p className="text-gray-600">
                  Identify security vulnerabilities in your codebase before they can be exploited.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-cyber-orange/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyber-orange">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
                <p className="text-gray-600">
                  Get detailed analytics and visualizations of your application's security posture.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-cyber-orange/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyber-orange">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Remediation Guidance</h3>
                <p className="text-gray-600">
                  Receive actionable recommendations to fix security issues and improve your code quality.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to secure your application?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of developers and security teams who trust CyberXpert for their security needs.
            </p>
            {!isAuthenticated ? <Link to="/signup">
                <Button size="lg" className="bg-cyber-orange hover:bg-cyber-orange/90">
                  Get Started Now
                </Button>
              </Link> : <Link to="/home">
                <Button size="lg" className="bg-cyber-orange hover:bg-cyber-orange/90">
                  Go to Dashboard
                </Button>
              </Link>}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default Landing;