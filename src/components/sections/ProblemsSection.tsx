import { Users, Clock, AlertTriangle, Car, Info, Accessibility, Eye } from "lucide-react";

const problems = [
  {
    icon: Users,
    title: "Overcrowding",
    description: "Massive crowds during festivals create dangerous situations and discomfort",
    color: "text-red-500",
  },
  {
    icon: Clock,
    title: "Long Queues",
    description: "Devotees wait hours without real-time information or estimated times",
    color: "text-orange-500",
  },
  {
    icon: AlertTriangle,
    title: "Risk of Stampedes",
    description: "Lack of crowd monitoring leads to dangerous stampede situations",
    color: "text-red-600",
  },
  {
    icon: Car,
    title: "Traffic Jams",
    description: "Poor traffic management causes congestion and delays for pilgrims",
    color: "text-yellow-500",
  },
  {
    icon: Info,
    title: "No Real-Time Info",
    description: "Devotees lack access to live updates about crowds and wait times",
    color: "text-blue-500",
  },
  {
    icon: Accessibility,
    title: "Limited Accessibility",
    description: "Inadequate facilities for elderly, disabled, and families with children",
    color: "text-purple-500",
  },
  {
    icon: Eye,
    title: "Manual Monitoring",
    description: "Outdated manual systems can't handle modern crowd management needs",
    color: "text-gray-500",
  },
];

const ProblemsSection = () => {
  return (
    <section id="problems" className="py-24 bg-muted/30 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Challenges We Solve
          </h2>
          <p className="text-xl text-muted-foreground">
            Traditional temple management faces critical issues that impact safety
            and devotee experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <problem.icon className={`w-12 h-12 ${problem.color} mb-4`} />
              <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
              <p className="text-muted-foreground">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;
