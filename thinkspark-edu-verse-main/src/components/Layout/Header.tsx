
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, LogOut, User, BookOpen, Activity, Layout, Brain } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const Header: React.FC = () => {
  const { user, logout, toggleAIAssistant } = useAppContext();
  
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-2">
        <Brain className="h-8 w-8 text-primary" />
        <Link to="/" className="text-xl font-bold text-gray-800 flex items-center">
          <span>Think</span>
          <span className="text-primary">Spark</span>
        </Link>
      </div>
      
      {user && (
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link to="/innovation" className="text-gray-600 hover:text-primary transition-colors">
            Innovation Hub
          </Link>
          <Link to="/quiz" className="text-gray-600 hover:text-primary transition-colors">
            Quiz Arena
          </Link>
          <Link to="/classes" className="text-gray-600 hover:text-primary transition-colors">
            Classes
          </Link>
        </nav>
      )}
      
      <div className="flex items-center space-x-3">
        {user ? (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleAIAssistant}
              className="border-accent border-2 text-accent hover:bg-accent hover:text-white"
            >
              <Layout className="mr-2 h-4 w-4" /> AI Assistant
            </Button>
            
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-9 w-9 p-0">
                  <div className="relative h-9 w-9 rounded-full overflow-hidden flex items-center justify-center bg-primary text-white">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Activity className="mr-2 h-4 w-4" />
                  Your Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
