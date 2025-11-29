import { AlertTriangle, Bell, Phone, Radio as RadioIcon, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const EmergencyAlertsSection = () => {
  const alertFeatures = [
    {
      icon: AlertTriangle,
      title: "Crowd Surge Detection",
      description: "AI detects abnormal crowd movements instantly",
      responseTime: "< 3 seconds",
    },
    {
      icon: Shield,
      title: "Stampede Risk Warnings",
      description: "Early warning system prevents dangerous situations",
      responseTime: "< 5 seconds",
    },
    {
      icon: Phone,
      title: "Medical Emergency Alert",
      description: "One-tap emergency medical assistance activation",
      responseTime: "Immediate",
    },
    {
      icon: Bell,
      title: "Panic Button",
      description: "Emergency button accessible throughout the temple",
      responseTime: "Instant",
    },
    {
      icon: RadioIcon,
      title: "Multi-Channel Notification",
      description: "Alerts sent to police, staff, and medical teams simultaneously",
      responseTime: "Real-time",
    },
  ];

  return (
    <section id="emergency-alerts" className="py-24 bg-gradient-to-br from-red-50 via-background to-orange-50 dark:from-red-950/20 dark:via-background dark:to-orange-950/20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <Badge className="mb-4 bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300">
            <Shield className="w-3 h-3 mr-1" />
            Safety First
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Emergency Alert & Safety System
          </h2>
          <p className="text-xl text-muted-foreground">
            Instant response system ensures the safety of every devotee with
            multi-layer alert mechanisms
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {alertFeatures.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl bg-card border border-border hover:shadow-lg hover:border-destructive/50 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-destructive/10">
                  <feature.icon className="w-6 h-6 text-destructive" />
                </div>
                <Badge variant="outline" className="text-xs text-destructive">
                  {feature.responseTime}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Alert Protocol */}
        <div className="max-w-5xl mx-auto p-8 rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-200 animate-scale-in">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Emergency Response Protocol
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-destructive/20 flex items-center justify-center">
                <span className="font-bold text-destructive">1</span>
              </div>
              <div className="font-semibold mb-1">Detect</div>
              <div className="text-xs text-muted-foreground">
                AI identifies threat
              </div>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-destructive/20 flex items-center justify-center">
                <span className="font-bold text-destructive">2</span>
              </div>
              <div className="font-semibold mb-1">Alert</div>
              <div className="text-xs text-muted-foreground">
                Notify all stakeholders
              </div>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-destructive/20 flex items-center justify-center">
                <span className="font-bold text-destructive">3</span>
              </div>
              <div className="font-semibold mb-1">Respond</div>
              <div className="text-xs text-muted-foreground">
                Deploy emergency teams
              </div>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-success/20 flex items-center justify-center">
                <span className="font-bold text-success">✓</span>
              </div>
              <div className="font-semibold mb-1">Resolve</div>
              <div className="text-xs text-muted-foreground">
                Situation managed
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmergencyAlertsSection;
