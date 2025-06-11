
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b-2 border-black sticky top-0 z-10 bg-background">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-foreground relative">
            <span className="text-neon-purple">CV</span>Skaparen
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-neon-purple"></div>
          </h1>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Meny"
              className="border-2 border-black hover:border-neon-purple"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>          <nav className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex absolute md:relative top-full left-0 right-0 md:top-auto bg-background md:bg-transparent p-4 md:p-0 border-b-2 border-black md:border-none flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-8`}>
            <a href="#" className="font-medium text-lg hover:text-neon-purple transition-colors duration-200 uppercase tracking-wide border-b-2 border-transparent hover:border-neon-purple pb-1">Mallar</a>
            <a href="#" className="font-medium text-lg hover:text-neon-purple transition-colors duration-200 uppercase tracking-wide border-b-2 border-transparent hover:border-neon-purple pb-1">Priser</a>
          </nav>
        </div>
      </header>
      <main>
        {children}
      </main>
      <footer className="border-t-2 border-black bg-background py-10 mt-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-display font-bold mb-4 text-neon-purple uppercase tracking-wide">CVSkaparen</h3>
              <p className="text-muted-foreground">
                Skapa professionella CV:n anpassade för den svenska arbetsmarknaden med hjälp av AI.
              </p>
            </div>            <div className="md:col-span-2 flex justify-center md:justify-end md:pr-16">
              <div>
                <h4 className="font-medium mb-3 uppercase tracking-wide">Företag</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-neon-purple transition-colors">Om oss</a></li>
                  <li><a href="#" className="hover:text-neon-purple transition-colors">Kontakt</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t-2 border-black mt-8 pt-6 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CVSkaparen. Alla rättigheter förbehållna.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
