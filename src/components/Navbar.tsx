import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield } from "lucide-react";
import AdminDialog from "./AdminDialog";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#problems", label: "Challenges" },
    { href: "#crowd-prediction", label: "AI Prediction" },
    { href: "#queue-management", label: "Queue System" },
    { href: "#iot-sensors", label: "IoT Sensors" },
    { href: "#emergency-alerts", label: "Safety Alerts" },
    { href: "#traffic-management", label: "Traffic" },
    { href: "#mobile-app", label: "Mobile App" },
    { href: "#special-assistance", label: "Assistance" },
    { href: "#temple-map", label: "Temple Map" },
    { href: "#tech-stack", label: "Technology" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="#home" className="flex items-center space-x-2">
            <span className="text-2xl">🛕</span>
            <span className="font-bold text-xl bg-gradient-warm bg-clip-text text-transparent">
              SomPath
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                size="sm"
                asChild
                className="hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <a href={link.href}>{link.label}</a>
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAdminOpen(true)}
              className="ml-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </Button>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 space-y-2 animate-fade-in">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 rounded-md hover:bg-muted transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAdminOpen(true);
                setIsOpen(false);
              }}
              className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin Dashboard
            </Button>
          </div>
        )}
      </div>

      <AdminDialog open={adminOpen} onOpenChange={setAdminOpen} />
    </nav>
  );
};

export default Navbar;
