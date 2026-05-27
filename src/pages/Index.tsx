import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ProblemsSection from "@/components/sections/ProblemsSection";
import CrowdPredictionSection from "@/components/sections/CrowdPredictionSection";
import QueueManagementSection from "@/components/sections/QueueManagementSection";
import IoTSensorsSection from "@/components/sections/IoTSensorsSection";
import EmergencyAlertsSection from "@/components/sections/EmergencyAlertsSection";
import TrafficManagementSection from "@/components/sections/TrafficManagementSection";
import MobileAppSection from "@/components/sections/MobileAppSection";
import SpecialAssistanceSection from "@/components/sections/SpecialAssistanceSection";
import AIAssistanceSection from "@/components/sections/AIAssistanceSection";
import TempleMapSection from "@/components/sections/TempleMapSection";
import ContactSection from "@/components/sections/ContactSection";
import Temple3D from "@/components/Temple3D";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current && (window as any).gsap) {
      const gsap = (window as any).gsap;
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      );
    }
  }, [activeSection]);

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <HeroSection />;
      case "problems":
        return <ProblemsSection />;
      case "crowd-prediction":
        return <CrowdPredictionSection />;
      case "queue-management":
        return <QueueManagementSection />;
      case "iot-sensors":
        return <IoTSensorsSection />;
      case "emergency-alerts":
        return <EmergencyAlertsSection />;
      case "traffic-management":
        return <TrafficManagementSection />;
      case "mobile-app":
        return <MobileAppSection />;
      case "special-assistance":
        return <SpecialAssistanceSection />;
      case "temple-map":
        return <TempleMapSection />;
      case "tech-stack":
        return <AIAssistanceSection />;
      case "contact":
        return <ContactSection />;
      default:
        return <HeroSection />;
    }
  };

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-background selection:bg-primary selection:text-white">
      <Navbar
        onSectionChange={setActiveSection}
        activeSection={activeSection}
      />

      {/* Persistant 3D Background */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <Temple3D />
      </div>

      <main className="relative z-10 min-h-dvh w-full pt-16 flex flex-col">
        <div
          ref={sectionRef}
          key={activeSection}
          className="flex-1 overflow-y-auto scrollbar-hide"
        >
          {renderSection()}
          <Footer />
        </div>
      </main>

      {/* Modern UI Accents */}
      <div className="fixed bottom-8 left-8 z-20 pointer-events-none hidden md:block">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-[10px] font-mono text-white/40 uppercase tracking-widest">
          Active Node: <span className="text-primary">{activeSection}</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
