import { Smartphone, Clock, Map, AlertCircle, Globe, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import mobileApp from "@/assets/mobile-app.jpg";

const MobileAppSection = () => {
  const appFeatures = [
    {
      icon: Clock,
      title: "Live Queue Times",
      description: "See real-time waiting times before you visit",
    },
    {
      icon: Smartphone,
      title: "Digital Darshan Pass",
      description: "Book and manage your temple visit digitally",
    },
    {
      icon: Map,
      title: "Interactive Temple Map",
      description: "Navigate the temple complex with ease",
    },
    {
      icon: AlertCircle,
      title: "Emergency Contacts",
      description: "Quick access to help and emergency services",
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Available in Hindi, Gujarati, and English",
    },
    {
      icon: Bell,
      title: "Push Notifications",
      description: "Get updates about your queue status and alerts",
    },
  ];

  return (
    <section id="mobile-app" className="py-24 bg-gradient-to-br from-violet-50 via-background to-purple-50 dark:from-violet-950/20 dark:via-background dark:to-purple-950/20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <Badge className="mb-4 bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900 dark:text-violet-300">
            <Smartphone className="w-3 h-3 mr-1" />
            Mobile Experience
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Pilgrim Mobile App
          </h2>
          <p className="text-xl text-muted-foreground">
            Complete temple experience in your pocket - plan, navigate, and stay
            informed
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-4 animate-slide-in-left order-2 lg:order-1">
            {appFeatures.map((feature, index) => (
              <div
                key={index}
                className="p-5 rounded-xl bg-card border border-border hover:shadow-lg hover:border-primary/50 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <feature.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* App Image */}
          <div className="animate-slide-in-right order-1 lg:order-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 opacity-20 blur-3xl rounded-full"></div>
              <img 
                src={mobileApp} 
                alt="Mobile App Interface" 
                className="relative rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Download the app now
              </p>
              <div className="flex gap-3 justify-center">
                <Badge className="bg-black text-white px-4 py-2">
                  📱 iOS App Store
                </Badge>
                <Badge className="bg-green-600 text-white px-4 py-2">
                  🤖 Google Play
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;
