import { Brain, Cloud, Calendar, TrendingUp, Users, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import aiPrediction from "@/assets/ai-prediction.jpg";

const CrowdPredictionSection = () => {
  const predictions = [
    { day: "Today", level: "High", color: "bg-red-500", crowd: "85%" },
    { day: "Tomorrow", level: "Medium", color: "bg-yellow-500", crowd: "60%" },
    { day: "Day After Tomorrow", level: "Very High", color: "bg-red-600", crowd: "95%" },
  ];

  const factors = [
    { icon: Cloud, label: "Weather Data", value: "Clear Sky" },
    { icon: Calendar, label: "Festival Calendar", value: "Navratri" },
    { icon: TrendingUp, label: "Historical Trends", value: "Peak Season" },
    { icon: Users, label: "Current Capacity", value: "12,500" },
  ];

  return (
    <section id="crowd-prediction" className="py-24 bg-gradient-to-br from-purple-50 via-background to-pink-50 dark:from-purple-950/20 dark:via-background dark:to-pink-950/20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300">
            <Brain className="w-3 h-3 mr-1" />
            AI-Powered Intelligence
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Crowd Prediction System
          </h2>
          <p className="text-xl text-muted-foreground">
            Advanced ML algorithms predict crowd surges using weather, festivals,
            and historical data
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* AI Prediction Image */}
          <div className="animate-slide-in-left">
            <img 
              src={aiPrediction} 
              alt="AI Prediction Dashboard" 
              className="rounded-2xl shadow-2xl w-full h-full object-cover"
            />
          </div>
          {/* Predictions and Factors */}
          <div className="space-y-6 animate-slide-in-right">
            {/* Predictions Card */}
            <div className="p-8 rounded-2xl bg-card border border-border shadow-lg">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary" />
                Crowd Forecast
              </h3>
              <div className="space-y-4">
                {predictions.map((pred, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div>
                      <div className="font-semibold">{pred.day}</div>
                      <div className="text-sm text-muted-foreground">
                        {pred.level} Crowd
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${pred.color} rounded-full flex items-center justify-center text-white font-bold`}>
                        {pred.crowd}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contributing Factors */}
            <div className="p-6 rounded-xl bg-card border border-border shadow-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Contributing Factors
              </h3>
              <div className="space-y-3">
                {factors.map((factor, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <factor.icon className="w-6 h-6 text-primary" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{factor.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {factor.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrowdPredictionSection;
