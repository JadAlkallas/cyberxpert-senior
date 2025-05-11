
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useData } from "@/context/DataContext";
import Header from "@/components/layout/Header";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Sidebar from "@/components/layout/Sidebar";

const Action = () => {
  const { startAnalysis, isLoading } = useData();
  const [animationActive, setAnimationActive] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate initial page loading
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleStartAnalysis = async () => {
    setAnimationActive(true);
    
    const success = await startAnalysis();
    
    if (success) {
      // Wait just a bit to show the animation
      setTimeout(() => {
        navigate("/reports");
      }, 1000);
    } else {
      setAnimationActive(false);
    }
  };
  
  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center cyber-bg">
            <div className="flex flex-col items-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-white">Loading...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex">
        <Sidebar />
        
        <main className="flex-1 flex items-center justify-center cyber-bg animate-fade-in">
          <div className="cyber-grid absolute inset-0 opacity-20"></div>
          
          <div className="relative z-10 text-center px-4">
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 cyber-text-shadow animate-scale-in">
                CyberXpert Security Analysis
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "200ms" }}>
                Ready to analyze your application for security vulnerabilities? 
                Our advanced AI will scan your codebase and provide a comprehensive security posture.
              </p>
            </div>
            
            <div className="relative animate-scale-in" style={{ animationDelay: "400ms" }}>
              <Button
                size="lg"
                className={`
                  bg-cyber-orange hover:bg-cyber-orange/90 text-white text-xl py-8 px-12
                  ${animationActive ? 'animate-pulse-glow' : ''}
                `}
                onClick={handleStartAnalysis}
                disabled={isLoading || animationActive}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Start Analysis"
                )}
              </Button>
              
              {isLoading && (
                <div className="cyber-container absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-md animate-cyber-loading"></div>
                  
                  {/* Radial dots animation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute h-3 w-3"
                        style={{
                          transform: `rotate(${i * 45}deg) translateY(-30px)`,
                        }}
                      >
                        <div 
                          className="h-2 w-2 bg-cyber-orange rounded-full animate-pulse"
                          style={{
                            animationDelay: `${i * 0.125}s`,
                          }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {isLoading && (
              <p className="mt-8 text-gray-300 animate-pulse">
                Scanning application components... This may take a moment.
              </p>
            )}
          </div>
          
          {/* Animated circles in background */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyber-orange/5 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyber-orange/5 rounded-full animate-spin-slow" style={{ animationDuration: '15s' }}></div>
        </main>
      </div>
    </div>
  );
};

export default Action;
