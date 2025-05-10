
import React from 'react';
import { Brain } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-auto">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-gray-800 flex items-center">
                <span>Think</span>
                <span className="text-primary">Spark</span>
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Igniting minds with innovative learning solutions powered by AI.
              Explore, learn, and grow with our educational platform.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary text-sm">Home</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary text-sm">Innovation Hub</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary text-sm">Quiz Arena</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary text-sm">AI Assistant</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary text-sm">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary text-sm">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary text-sm">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} ThinkSpark Education. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
