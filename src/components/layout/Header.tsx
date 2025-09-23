import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="font-bold text-xl">
            <span className="text-primary">CORE</span>
            <span className="text-secondary"> Capture</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Início
          </Link>
          <Link to="/#recursos" className="text-muted-foreground hover:text-foreground transition-colors">
            Recursos
          </Link>
          <Link to="/#precos" className="text-muted-foreground hover:text-foreground transition-colors">
            Preços
          </Link>
          <Link to="/#contato" className="text-muted-foreground hover:text-foreground transition-colors">
            Contato
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 p-0"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <Button asChild variant="ghost">
            <Link to="/auth">Login</Link>
          </Button>
          
          <Button asChild className="bg-secondary hover:bg-secondary/90 text-black">
            <Link to="/auth">Começar</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};