import { Ticket, Clock, Users, Calendar, Accessibility } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import QueueDemo from "@/components/QueueDemo";

const QueueManagementSection = () => {
  const features = [
    {
      icon: Ticket,
      title: "Digital Token System",
      description: "Get a digital token via mobile app or kiosk",
      status: "Active",
    },
    {
      icon: Users,
      title: "Virtual Queue",
      description: "Wait from anywhere within the temple complex",
      status: "Live",
    },
    {
      icon: Clock,
      title: "Live Waiting Time",
      description: "Real-time updates on your expected wait",
      status: "Real-time",
    },
    {
      icon: Calendar,
      title: "Slot Booking",
      description: "Pre-book your darshan time slot online",
      status: "Available",
    },
    {
      icon: Accessibility,
      title: "Priority Lane",
      description: "Fast-track for elderly, disabled & pregnant women",
      status: "Enabled",
    },
  ];

  return (
    <section id="queue-management" className="py-24 bg-gradient-to-br from-cyan-50 via-background to-teal-50 dark:from-cyan-950/20 dark:via-background dark:to-teal-950/20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <Badge className="mb-4 bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900 dark:text-cyan-300">
            <Ticket className="w-3 h-3 mr-1" />
            Smart Queue System
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Smart Queue Management
          </h2>
          <p className="text-xl text-muted-foreground">
            Modern digital queue system eliminates physical waiting and reduces
            crowd congestion
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl bg-card border border-border hover:shadow-lg hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <feature.icon className="w-10 h-10 text-primary" />
                <Badge variant="outline" className="text-xs">
                  {feature.status}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Live Queue Demo */}
        <div className="max-w-6xl mx-auto animate-fade-in">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900 dark:text-cyan-300">
              <Clock className="w-3 h-3 mr-1" />
              Live Demo
            </Badge>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              Try the Live Queue System
            </h3>
            <p className="text-muted-foreground">
              Real-time simulation with animated updates every 3 seconds
            </p>
          </div>
          <QueueDemo />
        </div>
      </div>
    </section>
  );
};

export default QueueManagementSection;
