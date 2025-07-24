import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PenTool, Home, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FlashMessages from './FlashMessages';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link 
              to="/posts" 
              className="flex items-center space-x-2 text-2xl font-bold text-foreground hover:text-primary transition-colors"
            >
              <PenTool className="h-8 w-8 text-primary" />
              <span>BlogApp</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/posts">
                <Button 
                  variant={isActive('/posts') ? 'default' : 'ghost'}
                  className="flex items-center space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Posts</span>
                </Button>
              </Link>
              
              <Link to="/posts/new">
                <Button 
                  variant={isActive('/posts/new') ? 'default' : 'outline'}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Post</span>
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <FlashMessages />
    </div>
  );
};

export default Layout;