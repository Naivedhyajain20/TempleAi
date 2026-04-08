import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield } from "lucide-react";
import AdminDialog from "./AdminDialog";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onSectionChange: (section: string) => void;
  activeSection: string;
}

const Navbar: React.FC<NavbarProps> = ({ onSectionChange, activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "problems", label: "Challenges" },
    { id: "crowd-prediction", label: "AI Prediction" },
    { id: "queue-management", label: "Queue System" },
    { id: "iot-sensors", label: "IoT Sensors" },
    { id: "emergency-alerts", label: "Safety Alerts" },
    { id: "traffic-management", label: "Traffic" },
    { id: "mobile-app", label: "Mobile App" },
    { id: "special-assistance", label: "Assistance" },
    { id: "temple-map", label: "Temple Map" },
    { id: "tech-stack", label: "Technology" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/10 bg-background/75 backdrop-blur-2xl">
      <div className="h-full w-full px-4">
        <div className="flex h-full items-center gap-4">
          <button
            onClick={() => onSectionChange("home")}
            className="flex shrink-0 items-center gap-2.5 px-2 group"
            aria-label="Go to home"
          >
            <span className="text-4xl transition-transform group-hover:scale-110">
              🛕
            </span>
            <span className="bg-gradient-warm bg-clip-text text-4xl font-black tracking-tight text-transparent">
              SomPath
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden min-w-0 flex-1 items-center gap-3 lg:flex">
            <div className="relative min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.03] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pr-1">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => onSectionChange(link.id)}
                    className={cn(
                      "h-10 whitespace-nowrap rounded-full px-4 text-[13px] font-semibold tracking-[0.01em] transition-all duration-200",
                      activeSection === link.id
                        ? "bg-primary text-white shadow-[0_6px_20px_rgba(255,107,0,0.35)]"
                        : "text-white/65 hover:bg-white/[0.06] hover:text-white",
                    )}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setAdminOpen(true)}
              className="h-11 shrink-0 rounded-full border-primary/60 px-6 text-primary transition-all hover:bg-primary hover:text-white"
            >
              <Shield className="mr-2 h-4 w-4" />
              Admin
            </Button>
            <div className="shrink-0">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-primary" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="absolute left-4 right-4 top-20 rounded-[1.75rem] border border-white/10 bg-background/95 p-6 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-300 lg:hidden">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onSectionChange(link.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "rounded-xl px-4 py-3 text-left text-xs font-semibold transition-all",
                    activeSection === link.id
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-white/70 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {link.label}
                </button>
              ))}
            </div>
            <div className="h-[1px] bg-white/10 my-4" />
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setAdminOpen(true);
                setIsOpen(false);
              }}
              className="w-full border-primary text-primary hover:bg-primary hover:text-white rounded-2xl"
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
