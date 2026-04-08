import { useState, useRef, useEffect } from "react";
import {
  Bot,
  MessageCircle,
  Send,
  MapPin,
  Clock,
  Info,
  Mic,
  MicOff,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const AIAssistanceSection = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "ai",
      content:
        "Namaste! I'm your Temple AI Concierge. I've analyzed the current grid: Crowd levels are 15% higher than usual today. How can I assist your pilgrimage?",
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Insights Data
  const insights = [
    { title: "Peak Alert", desc: "Expect surge at 12:00 PM Aarti", icon: TrendingUp, color: "text-orange-500" },
    { title: "Safe Passage", desc: "Gate 2 throughput is optimal", icon: Shield, color: "text-emerald-500" },
    { title: "Weather Sync", desc: "Clear skies for evening darshan", icon: Zap, color: "text-blue-500" },
  ];

  // --- HIGH-DENSITY TEMPLE KNOWLEDGE BASE ---
  const TEMPLE_KNOWLEDGE = {
    rituals: {
      aarti: {
        keywords: ["aarti", "prayer", "pooja", "puja", "shringar"],
        content: "The daily Aarti schedule is as follows:\n- **Mangal Aarti**: 06:15 AM (Morning opening)\n- **Shringar Aarti**: 07:00 AM (Deity decoration)\n- **Bhog Aarti**: 12:00 PM (Mid-day offering)\n- **Sandhya Aarti**: 07:00 PM (Evening transition)\n- **Shayan Aarti**: 09:15 PM (Night closing)\n\n*Note: Special Shringar Darshan occurs throughout the day except during Bhog.*",
        suggestions: ["Book Puja Slot", "View Live Stream"]
      },
      darshan: {
        keywords: ["darshan", "see", "view", "idol", "shiva"],
        content: "General Darshan is free and available from 06:00 AM to 09:00 PM. \n- **VIP Darshan**: ₹500 (Priority entry)\n- **Senior Citizens**: Free priority lane available at East Gate.\n- **Peak Hours**: 10:00 AM - 01:00 PM and 06:00 PM - 08:00 PM.",
        suggestions: ["Check Queue Time", "VIP Booking"]
      }
    },
    infrastructure: {
      washrooms: {
        keywords: ["washroom", "toilet", "restroom", "bathroom", "loo"],
        content: "We have 4 high-hygiene zones:\n1. **East Gate**: Near the main security check.\n2. **North Gate**: Near the parking exit.\n3. **Prasad Counter**: Behind the main dining hall.\n4. **Public Plaza**: Opposite the digital museum.\n*All zones have accessible facilities for the disabled.*",
        suggestions: ["Show on Map", "Find nearest"]
      },
      parking: {
        keywords: ["parking", "park", "car", "bike", "vehicle", "scooter"],
        content: "Parking is managed in 3 main zones:\n- **Zone A (North)**: Large vehicles and SUVs (₹50).\n- **Zone B (East)**: Two-wheelers only (Free).\n- **Zone C (VIP)**: Nearest to main gate (₹100).\n*Valet services are available at the East Gate drop-off.*",
        suggestions: ["Check Availability", "Navigate to Zone A"]
      },
      gates: {
        keywords: ["gate", "entry", "exit", "entrance"],
        content: "- **East Gate**: The main ceremonial entrance. Security check takes ~10 mins.\n- **North Gate**: Closest to the main parking and bus stand.\n- **South Gate**: Direct access to the VIP lounge and administrative block.",
        suggestions: ["Check Gate Wait Time"]
      }
    },
    history: {
      about: {
        keywords: ["history", "rebuilt", "construction", "story", "patel", "chalukya"],
        content: "Somnath is the first of the 12 Jyotirlingas. \n- **Architectural Style**: Chalukya (Kailash Mahameru Prasad).\n- **Reconstruction**: It has been destroyed and rebuilt 7 times (historically 17). The current structure was envisioned by **Sardar Vallabhbhai Patel** in 1951.\n- **Significance**: It stands on the shore of the Arabian Sea, exactly where there is no land between the temple shore and the South Pole.",
        suggestions: ["Audio Guide", "Museum Info"]
      }
    },
    logistics: {
      travel: {
        keywords: ["reach", "reach", "bus", "train", "airport", "diu", "rajkot", "transport"],
        content: "How to get here:\n- **Train**: Somnath Station (SMNH) is 5km away. Veraval (VRL) is 7km.\n- **Air**: Nearest airport is Diu (90km) or Rajkot (200km).\n- **Road**: NH8D connects Veraval to the rest of Gujarat. State transport buses run every 30 mins from Ahmedabad.",
        suggestions: ["Hire Taxi", "Bus Schedule"]
      },
      accommodation: {
        keywords: ["stay", "hotel", "room", "dormitory", "sleep", "lodge"],
        content: "Temple management offers several guest houses:\n- **Sagar Darshan**: Sea-front premium rooms.\n- **Lilavati Guest House**: Standard family rooms.\n- **Maheshwari Bhawan**: Economical stays.\n*We recommend booking 15 days in advance during festivals.*",
        suggestions: ["Check Room Availability"]
      }
    },
    emergency: {
      medical: {
        keywords: ["doctor", "medical", "hospital", "ambulance", "hurt", "emergency"],
        content: "24/7 dedicated first-aid clinic is available between Gate 1 and the High-Mast tower. For critical cases, an ambulance is stationed at the South Gate. Contact: **+91 2876 231234**.",
        suggestions: ["Call Emergency", "First Aid Info"]
      }
    }
  };

  const getAIResponse = (userQuery: string) => {
    const query = userQuery.toLowerCase();
    
    // Weighted search across categories
    let bestMatch: any = null;
    let maxWeight = 0;

    Object.values(TEMPLE_KNOWLEDGE).forEach(category => {
      Object.values(category).forEach((item: any) => {
        let weight = 0;
        item.keywords.forEach((kw: string) => {
          if (query.includes(kw)) weight++;
        });

        if (weight > maxWeight) {
          maxWeight = weight;
          bestMatch = item;
        }
      });
    });

    if (bestMatch && maxWeight > 0) {
      return {
        content: bestMatch.content,
        suggestions: bestMatch.suggestions
      };
    }

    // Default Fallback
    return {
      content: "I've scanned our neural archives but couldn't find a direct match. Based on your input, here are common topics pilgrims ask about:\n- **Rituals**: Aarti times and Pujas.\n- **Infrastructure**: Washrooms, Parking, and Gates.\n- **History**: The story of Somnath.\n- **Emergency**: Medical and Security help.",
      suggestions: ["Aarti Timings", "Parking Info", "History"]
    };
  };

  const handleSendQuery = () => {
    if (!query.trim()) return;
    const userMessage = query;
    setMessages((prev) => [...prev, { type: "user", content: userMessage, suggestions: [] }]);
    setQuery("");
    
    // Simulate AI thinking and response
    setTimeout(() => {
      const response = getAIResponse(userMessage);
      setMessages((prev) => [...prev, { 
        type: "ai", 
        content: response.content,
        suggestions: response.suggestions
      }]);
    }, 800);
  };

  return (
    <section id="ai-assistance" className="h-full w-full flex flex-col pt-10">
      <div className="container mx-auto px-4 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-12 h-[calc(100vh-200px)]">
          
          {/* Left: Chat Interface */}
          <div className="flex-1 flex flex-col h-full">
            <div className="mb-8 animate-in fade-in slide-in-from-left-5 duration-700">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors uppercase tracking-[0.2em] font-black text-[10px] px-4 py-1.5">
                <Sparkles className="w-3 h-3 mr-2" />
                Neural Assistant Active
              </Badge>
              <h2 className="text-5xl font-black text-white tracking-tighter mb-4 leading-none">
                TEMPLE <span className="text-primary italic">CONCIERGE</span>
              </h2>
              <p className="text-white/40 font-medium uppercase tracking-widest text-xs">
                Real-time predictive support for your sacred journey
              </p>
            </div>

            <div className="flex-1 glass-panel rounded-[3rem] border-white/5 flex flex-col overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide relative z-10">
                {messages.map((msg: any, i) => (
                  <div key={i} className={cn("flex w-full animate-in fade-in slide-in-from-bottom-2 duration-500", msg.type === "user" ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[80%] p-6 rounded-3xl text-sm font-medium leading-relaxed shadow-xl",
                      msg.type === "user" 
                        ? "bg-primary text-white rounded-tr-none border border-white/10" 
                        : "bg-white/5 backdrop-blur-3xl text-white/90 rounded-tl-none border border-white/5"
                    )}>
                      <div className="whitespace-pre-line">{msg.content}</div>
                      {msg.type === "ai" && msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {msg.suggestions.map((suggestion: string, sIdx: number) => (
                            <button 
                              key={sIdx}
                              onClick={() => {
                                setQuery(suggestion);
                                // Optional: Auto-send if desired, but letting user edit is safer
                              }}
                              className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase text-primary hover:bg-primary hover:text-white transition-all"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-8 pt-4 border-t border-white/5 relative z-10 bg-black/40 backdrop-blur-xl">
                <div className="flex gap-4 p-2 bg-white/5 rounded-3xl border border-white/10 focus-within:border-primary/40 transition-all shadow-inner">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about live crowd, timings, or sacred history..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendQuery()}
                    className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder:text-white/20 outline-none"
                  />
                  <div className="flex gap-2 pr-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-2xl hover:bg-white/10 text-white/40 hover:text-white"
                    >
                      <Mic className="w-5 h-5" />
                    </Button>
                    <Button 
                      onClick={handleSendQuery}
                      size="icon"
                      className="rounded-2xl bg-primary hover:bg-orange-600 shadow-lg shadow-primary/20"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Proactive Insights Sidebar */}
          <div className="w-full lg:w-96 flex flex-col gap-8 pt-12 animate-in fade-in slide-in-from-right-10 duration-1000">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 px-2 flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-primary" /> Proactive Insights
              </h3>
              
              <div className="grid gap-4">
                {insights.map((insight, i) => (
                  <div key={i} className="p-6 rounded-[2.5rem] bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all group scale-100 hover:scale-[1.02] cursor-default">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-primary/20 transition-all">
                        <insight.icon className={cn("w-5 h-5", insight.color)} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1 group-hover:text-primary transition-colors">{insight.title}</h4>
                        <p className="text-xs text-white/40 leading-relaxed font-medium">
                          {insight.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-[3rem] bg-gradient-to-br from-primary/20 to-transparent border border-primary/10 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                <Bot className="w-32 h-32 text-primary" />
              </div>
              <div className="relative z-10">
                <h4 className="text-sm font-black text-white uppercase tracking-widest mb-3">AI Capacity Hub</h4>
                <p className="text-xs text-white/50 leading-relaxed font-medium mb-6">
                  Processing 4.2M data points per second across 12 sacred sites.
                </p>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase text-primary tracking-widest group-hover:gap-3 transition-all">
                  Export Dataset <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default AIAssistanceSection;
