import { Accessibility, Heart, Baby, HelpCircle, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SpecialAssistanceSection = () => {
  const assistanceFeatures = [
    {
      icon: Accessibility,
      title: "Wheelchair Navigation",
      description: "Dedicated ramps and routes for wheelchair accessibility",
      color: "text-blue-500",
    },
    {
      icon: Heart,
      title: "Senior Citizen Priority",
      description: "Fast-track darshan for elderly devotees",
      color: "text-purple-500",
    },
    {
      icon: Baby,
      title: "Family Assistance",
      description: "Special facilities for women with children",
      color: "text-pink-500",
    },
    {
      icon: HelpCircle,
      title: "Helpdesk Locator",
      description: "Find nearest assistance point instantly",
      color: "text-green-500",
    },
    {
      icon: Volume2,
      title: "Audio Guidance",
      description: "Voice navigation for visually impaired pilgrims",
      color: "text-orange-500",
    },
  ];

  return (
    <section id="special-assistance" className="py-24 bg-gradient-to-br from-pink-50 via-background to-purple-50 dark:from-pink-950/20 dark:via-background dark:to-purple-950/20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <Badge className="mb-4 bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900 dark:text-pink-300">
            <Heart className="w-3 h-3 mr-1" />
            Inclusive Access
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Special Assistance Features
          </h2>
          <p className="text-xl text-muted-foreground">
            Ensuring every devotee has a comfortable and accessible temple
            experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {assistanceFeatures.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-4 rounded-lg bg-muted/50 w-fit mb-4">
                <feature.icon className={`w-10 h-10 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Accessibility Stats */}
        <div className="max-w-5xl mx-auto p-8 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-200 animate-scale-in">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Assistance Services Today
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-card">
              <div className="text-4xl font-bold text-primary mb-2">450+</div>
              <div className="text-sm text-muted-foreground">
                Wheelchair Assists
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-card">
              <div className="text-4xl font-bold text-accent mb-2">1,200+</div>
              <div className="text-sm text-muted-foreground">
                Senior Priority Passes
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-card">
              <div className="text-4xl font-bold text-success mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">
                Help Desk Available
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialAssistanceSection;
