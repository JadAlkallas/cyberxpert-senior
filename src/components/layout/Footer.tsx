
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-cyber-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-cyber-orange flex items-center justify-center">
                <span className="text-white font-bold text-lg">CX</span>
              </div>
              <span className="text-xl font-bold">CyberXpert</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Advanced security posture analysis for modern applications. Detect vulnerabilities before they become threats.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-cyber-orange transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-cyber-orange transition-colors text-sm">
                  Log In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-400 hover:text-cyber-orange transition-colors text-sm">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info & Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact & Legal</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm">
                <span>Email: </span>
                <a href="mailto:contact@cyberxpert.com" className="hover:text-cyber-orange transition-colors">
                  contact@cyberxpert.com
                </a>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-cyber-orange transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-cyber-orange transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          &copy; {currentYear} CyberXpert. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
