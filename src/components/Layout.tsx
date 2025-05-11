
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
      <header className="border-b border-white/5 bg-luxury-dark/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-gold gold-glow">
            ResumeCraft
          </h1>
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Meny"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <nav className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex absolute md:relative top-full left-0 right-0 md:top-auto bg-luxury-dark/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none p-4 md:p-0 border-b border-white/5 md:border-none flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-8`}>
            <a href="#" className="font-medium hover:text-gold transition-colors duration-200 relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-gold after:transition-all hover:after:w-full">Hur det fungerar</a>
            <a href="#" className="font-medium hover:text-gold transition-colors duration-200 relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-gold after:transition-all hover:after:w-full">Mallar</a>
            <a href="#" className="font-medium hover:text-gold transition-colors duration-200 relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-gold after:transition-all hover:after:w-full">Priser</a>
          </nav>
        </div>
      </header>
      <main>
        {children}
      </main>
      <footer className="border-t border-white/5 bg-luxury-dark/80 backdrop-blur-md py-10 mt-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-display font-bold mb-4 text-gold">ResumeCraft</h3>
              <p className="text-muted-foreground">
                Skapa professionella CV:n anpassade för den svenska arbetsmarknaden med hjälp av AI.
              </p>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-3">Tjänster</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-gold transition-colors">CV Skapare</a></li>
                  <li><a href="#" className="hover:text-gold transition-colors">Personligt brev</a></li>
                  <li><a href="#" className="hover:text-gold transition-colors">LinkedIn optimering</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Företag</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-gold transition-colors">Om oss</a></li>
                  <li><a href="#" className="hover:text-gold transition-colors">Karriär</a></li>
                  <li><a href="#" className="hover:text-gold transition-colors">Kontakt</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Juridiskt</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-gold transition-colors">Integritetspolicy</a></li>
                  <li><a href="#" className="hover:text-gold transition-colors">Användarvillkor</a></li>
                  <li><a href="#" className="hover:text-gold transition-colors">Cookies</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 mt-8 pt-6 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ResumeCraft. Alla rättigheter förbehållna.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
