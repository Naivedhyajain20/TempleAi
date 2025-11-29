import { Camera, Radio, TrendingUp, FileText, MapPin, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import iotSensors from "@/assets/iot-sensors.jpg";

const IoTSensorsSection = () => {
  const capabilities = [
    {
      icon: Radio,
      title: "IoT Crowd Sensors",
      description: "Real-time density measurement at key locations",
      metric: "250+ sensors",
    },
    {
      icon: Camera,
      title: "AI CCTV Analytics",
      description: "Computer vision for crowd behavior analysis",
      metric: "150+ cameras",
    },
    {
      icon: MapPin,
      title: "Heatmap Generation",
      description: "Live crowd density visualization across temple",
      metric: "5-sec refresh",
    },
    {
      icon: TrendingUp,
      title: "Density Alerts",
      description: "Automatic warnings for dangerous crowd levels",
      metric: "Instant alerts",
    },
    {
      icon: FileText,
      title: "Auto Reports",
      description: "Automated daily and incident reporting",
      metric: "24/7 logging",
    },
  ];

  return (
    <section id="iot-sensors" className="py-24 bg-gradient-to-br from-green-50 via-background to-teal-50 dark:from-green-950/20 dark:via-background dark:to-teal-950/20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <Badge className="mb-4 bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300">
            <Radio className="w-3 h-3 mr-1" />
            IoT + AI Integration
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            IoT Sensors & CCTV Analytics
          </h2>
          <p className="text-xl text-muted-foreground">
            Advanced hardware and AI integration for real-time crowd monitoring
            and safety
          </p>
        </div>

        {/* IoT Image */}
        <div className="max-w-4xl mx-auto mb-12 animate-scale-in">
          <img 
            src={iotSensors} 
            alt="IoT Sensors and CCTV" 
            className="rounded-2xl shadow-2xl w-full h-64 md:h-96 object-cover"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl bg-card border border-border hover:shadow-lg hover:border-success/50 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <capability.icon className="w-6 h-6 text-success" />
                </div>
                <Badge variant="outline" className="text-xs">
                  {capability.metric}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold mb-2">{capability.title}</h3>
              <p className="text-muted-foreground text-sm">
                {capability.description}
              </p>
            </div>
          ))}
        </div>

        {/* Live Monitoring Display */}
        <div className="mt-12 max-w-5xl mx-auto">
          <div className="p-8 rounded-2xl bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-200 animate-scale-in">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-success" />
              Live System Status
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium">IoT Sensors</span>
                </div>
                <div className="text-2xl font-bold text-success">98%</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
              <div className="p-4 rounded-lg bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium">CCTV Cameras</span>
                </div>
                <div className="text-2xl font-bold text-success">100%</div>
                <div className="text-xs text-muted-foreground">Operational</div>
              </div>
              <div className="p-4 rounded-lg bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                  <span className="text-sm font-medium">Alerts Today</span>
                </div>
                <div className="text-2xl font-bold text-warning">3</div>
                <div className="text-xs text-muted-foreground">Resolved</div>
              </div>
              <div className="p-4 rounded-lg bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-sm font-medium">Data Points</span>
                </div>
                <div className="text-2xl font-bold text-accent">15K</div>
                <div className="text-xs text-muted-foreground">Per Hour</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IoTSensorsSection;
