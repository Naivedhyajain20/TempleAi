import { Car, MapPin, Bus, Navigation, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TrafficManagementSection = () => {
  const features = [
    {
      icon: Car,
      title: "Live Parking Status",
      description: "Real-time availability of parking spaces",
      value: "342 / 500",
      status: "Available",
    },
    {
      icon: BarChart3,
      title: "Vehicle Counting",
      description: "Automated entry/exit vehicle tracking",
      value: "2,456",
      status: "Today",
    },
    {
      icon: Bus,
      title: "Shuttle Services",
      description: "Live shuttle bus timings and routes",
      value: "Every 15min",
      status: "Active",
    },
    {
      icon: Navigation,
      title: "Traffic Diversion",
      description: "Real-time route optimization alerts",
      value: "3 Routes",
      status: "Optimized",
    },
  ];

  return (
    <section id="traffic-management" className="py-24 bg-gradient-to-br from-blue-50 via-background to-indigo-50 dark:from-blue-950/20 dark:via-background dark:to-indigo-950/20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300">
            <Car className="w-3 h-3 mr-1" />
            Smart Mobility
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Intelligent Traffic & Parking
          </h2>
          <p className="text-xl text-muted-foreground">
            AI-powered traffic management reduces congestion and improves pilgrim
            accessibility
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-card border border-border hover:shadow-lg hover:border-accent/50 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {feature.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">
                    {feature.description}
                  </p>
                  <div className="text-2xl font-bold text-accent">
                    {feature.value}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Integration Info */}
        <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200 animate-scale-in">
          <h3 className="text-2xl font-bold mb-4 text-center">
            Integrated with City Traffic Control
          </h3>
          <p className="text-center text-muted-foreground mb-6">
            Our system seamlessly integrates with local police and traffic
            authorities for coordinated management
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-card text-center">
              <MapPin className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="font-semibold">GPS Tracking</div>
              <div className="text-sm text-muted-foreground">All shuttles</div>
            </div>
            <div className="p-4 rounded-lg bg-card text-center">
              <Navigation className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="font-semibold">Smart Routing</div>
              <div className="text-sm text-muted-foreground">AI optimized</div>
            </div>
            <div className="p-4 rounded-lg bg-card text-center">
              <BarChart3 className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="font-semibold">Analytics</div>
              <div className="text-sm text-muted-foreground">Real-time data</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrafficManagementSection;
