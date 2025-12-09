import { Button } from "@/components/ui/button";
import { ArrowRight, Activity } from "lucide-react";
import templeHero from "@/assets/temple-hero.jpg";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-100 mix-blend-overlay"
          style={{ backgroundImage: `url(${templeHero})` }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 pt-32">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 animate-pulse">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              AI-Powered Pilgrimage Management
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Transforming Temple{" "}
            <span className="bg-gradient-warm bg-clip-text text-transparent">
              Pilgrimages
            </span>{" "}
            with AI & IoT
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Ensuring safety, efficiency, and a seamless spiritual experience for
            millions of devotees across Gujarat's sacred temples
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-gradient-warm text-white hover:opacity-90 transition-opacity"
              asChild
            >
              <a href="#crowd-prediction" className="flex items-center gap-2">
                Explore Features
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
              asChild
            >
              <a href="#contact">Contact Us</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            <div className="p-6 rounded-lg bg-card/50 backdrop-blur border border-border animate-scale-in">
              <div className="text-4xl font-bold text-primary">10M+</div>
              <div className="text-muted-foreground mt-2">Annual Devotees</div>
            </div>
            <div className="p-6 rounded-lg bg-card/50 backdrop-blur border border-border animate-scale-in [animation-delay:200ms]">
              <div className="text-4xl font-bold text-accent">99.9%</div>
              <div className="text-muted-foreground mt-2">Safety Record</div>
            </div>
            <div className="p-6 rounded-lg bg-card/50 backdrop-blur border border-border animate-scale-in [animation-delay:400ms]">
              <div className="text-4xl font-bold text-success">24/7</div>
              <div className="text-muted-foreground mt-2">Real Time Live Monitoring</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default HeroSection;
