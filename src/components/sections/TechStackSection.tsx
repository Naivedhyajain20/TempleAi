import { Code, Database, Cloud, Cpu, Globe, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TechStackSection = () => {
  const technologies = [
    {
      category: "Frontend",
      icon: Code,
      color: "text-blue-500",
      techs: ["Next.js 14", "React 18", "TypeScript", "Tailwind CSS"],
    },
    {
      category: "Backend",
      icon: Database,
      color: "text-green-500",
      techs: ["Node.js", "PostgreSQL", "Redis", "GraphQL"],
    },
    {
      category: "AI/ML",
      icon: Cpu,
      color: "text-purple-500",
      techs: ["TensorFlow", "PyTorch", "OpenCV", "scikit-learn"],
    },
    {
      category: "IoT",
      icon: Zap,
      color: "text-orange-500",
      techs: ["MQTT", "Arduino", "Raspberry Pi", "LoRaWAN"],
    },
    {
      category: "Cloud",
      icon: Cloud,
      color: "text-cyan-500",
      techs: ["AWS", "Docker", "Kubernetes", "Terraform"],
    },
    {
      category: "Real-time",
      icon: Globe,
      color: "text-red-500",
      techs: ["WebSockets", "Socket.io", "Redis Pub/Sub", "Kafka"],
    },
  ];

  return (
    <section id="tech-stack" className="py-24 bg-gradient-to-br from-indigo-50 via-background to-blue-50 dark:from-indigo-950/20 dark:via-background dark:to-blue-950/20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <Badge className="mb-4 bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-300">
            <Code className="w-3 h-3 mr-1" />
            Enterprise Grade
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Technology Stack
          </h2>
          <p className="text-xl text-muted-foreground">
            Built on cutting-edge technologies for reliability, scalability, and
            performance
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-card border border-border hover:shadow-lg hover:border-primary/50 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-muted">
                  <tech.icon className={`w-6 h-6 ${tech.color}`} />
                </div>
                <h3 className="text-lg font-semibold">{tech.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {tech.techs.map((t, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Architecture Highlights */}
        <div className="max-w-5xl mx-auto p-8 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-200 animate-scale-in">
          <h3 className="text-2xl font-bold mb-6 text-center">
            System Architecture
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-card">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-warning" />
                High Performance
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Sub-second response times</li>
                <li>• 99.9% uptime SLA</li>
                <li>• Auto-scaling infrastructure</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-card">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Cloud className="w-4 h-4 text-accent" />
                Cloud Native
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Microservices architecture</li>
                <li>• Containerized deployment</li>
                <li>• Multi-region redundancy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
