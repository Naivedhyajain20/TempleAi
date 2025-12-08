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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemsSection />
      <CrowdPredictionSection />
      <QueueManagementSection />
      <TempleMapSection />
      <IoTSensorsSection />
      <EmergencyAlertsSection />
      <TrafficManagementSection />
      <SpecialAssistanceSection />
      <AIAssistanceSection />
      <MobileAppSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
