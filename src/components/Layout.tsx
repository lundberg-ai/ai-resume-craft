
import React from 'react';
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold font-display text-resume-primary">
            <span className="text-foreground">Resume</span>Craft
          </h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="font-medium text-foreground hover:text-resume-primary transition-colors">How it works</a>
            <a href="#" className="font-medium text-foreground hover:text-resume-primary transition-colors">Templates</a>
            <a href="#" className="font-medium text-foreground hover:text-resume-primary transition-colors">Pricing</a>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t bg-background/80 backdrop-blur-sm py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ResumeCraft. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
