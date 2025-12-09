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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AIAssistanceSection = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "ai",
      content:
        "Hello! I'm your AI assistant for temples in Gujarat. Ask me anything about Somnath Temple or other sacred sites - locations, timings, facilities, and more!",
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSendQuery = () => {
    if (!query.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { type: "user", content: query }]);

    // Simulate AI response based on query
    const response = getAIResponse(query);
    setMessages((prev) => [...prev, { type: "ai", content: response }]);

    setQuery("");
  };

  const getAIResponse = (userQuery: string) => {
    const lowerQuery = userQuery.toLowerCase();

    // Facilities and Locations
    if (
      lowerQuery.includes("washroom") ||
      lowerQuery.includes("bathroom") ||
      lowerQuery.includes("toilet") ||
      lowerQuery.includes("restroom")
    ) {
      return "Clean and well-maintained washrooms are available at multiple locations: East Gate (main entrance), North Gate, South Gate, and near the temple premises. They are accessible 24/7 with separate facilities for men, women, and families. Wheelchair accessible washrooms are also available.";
    }

    if (
      lowerQuery.includes("main gate") ||
      lowerQuery.includes("entrance") ||
      lowerQuery.includes("enter")
    ) {
      return "The main entrance is the East Gate, located on the eastern side facing the Arabian Sea. It features security checks, metal detectors, and separate queues for men and women. The gate opens at 6:00 AM daily.";
    }

    if (
      lowerQuery.includes("exit gate") ||
      lowerQuery.includes("exit") ||
      lowerQuery.includes("leave")
    ) {
      return "Exit gates are available at North Gate and South Gate. The North Gate is the main exit and leads directly to the parking area. All gates have security personnel and are monitored 24/7.";
    }

    if (
      lowerQuery.includes("parking") ||
      lowerQuery.includes("park") ||
      lowerQuery.includes("vehicle")
    ) {
      return "Parking facilities: Two-wheeler parking is free at all gates. Four-wheeler parking costs ₹20-50 per vehicle (₹20 for cars, ₹50 for SUVs/buses). Valet parking available for ₹100. North Gate has the largest parking area with 500+ spaces.";
    }

    if (lowerQuery.includes("drinking water") || lowerQuery.includes("water")) {
      return "Free drinking water stations are available throughout the temple premises, including near all gates, main hall, and prayer areas. Bottled water is available at ₹10-20 from temple counters.";
    }

    if (
      lowerQuery.includes("lost and found") ||
      lowerQuery.includes("lost") ||
      lowerQuery.includes("found")
    ) {
      return "Lost and Found counter is located near the East Gate security office. Please report lost items immediately. Common items like phones, wallets, and bags are usually recovered within 24 hours.";
    }

    // Timings and Schedule
    if (
      lowerQuery.includes("timing") ||
      lowerQuery.includes("time") ||
      lowerQuery.includes("open") ||
      lowerQuery.includes("close")
    ) {
      return "Temple Timings: Open 6:00 AM to 9:00 PM daily. Aarti Schedule: Mangal Aarti (6:30 AM), Bhog Aarti (12:00 PM), Sandhya Aarti (7:00 PM), Shayan Aarti (9:00 PM). Special darshan during festivals may extend hours.";
    }

    if (lowerQuery.includes("aarti") || lowerQuery.includes("prayer")) {
      return "Daily Aarti Schedule: Mangal Aarti (6:30 AM), Bhog Aarti (12:00 PM), Sandhya Aarti (7:00 PM), Shayan Aarti (9:00 PM). Special aartis during festivals. Visitors can participate in evening aarti from 6:30 PM onwards.";
    }

    if (
      lowerQuery.includes("darshan") ||
      lowerQuery.includes("see") ||
      lowerQuery.includes("view")
    ) {
      return "Normal darshan is free and available throughout opening hours. Special darshan tickets cost ₹100-500 (₹100 general, ₹300 VIP, ₹500 VVIP). Online booking available at temple website. Queue time: 30 mins to 2 hours during peak season.";
    }

    // Food and Prasad
    if (lowerQuery.includes("prasad") || lowerQuery.includes("prashad")) {
      return "Free prasad (sweet rice) is distributed at temple counters throughout the day. Special prasad during festivals. Annakoot prasad available during special occasions. All prasad is prepared in hygienic conditions following traditional methods.";
    }

    if (
      lowerQuery.includes("food") ||
      lowerQuery.includes("eat") ||
      lowerQuery.includes("restaurant")
    ) {
      return "Temple premises have vegetarian food stalls serving Gujarati thali (₹80-150), snacks, and beverages. Jain food options available. Nearby restaurants: Bhagat Tarachand (famous for dal bati), other local eateries within 500m. All food is vegetarian and hygienic.";
    }

    if (lowerQuery.includes("jain") || lowerQuery.includes("jain food")) {
      return "Jain food stalls are available within temple premises, serving pure Jain vegetarian meals without onion, garlic, or root vegetables. Jain prasad and snacks available at designated counters.";
    }

    // History and Information
    if (
      lowerQuery.includes("history") ||
      lowerQuery.includes("story") ||
      lowerQuery.includes("about")
    ) {
      return "Somnath Temple is one of the 12 Jyotirlingas, dedicated to Lord Shiva. The temple has been destroyed and rebuilt 17 times. Current structure built in 1951 by Sardar Vallabhbhai Patel. The temple houses one of the 12 sacred Shiva lingams.";
    }

    if (
      lowerQuery.includes("architecture") ||
      lowerQuery.includes("design") ||
      lowerQuery.includes("building")
    ) {
      return "The temple follows Chalukya style architecture with intricate carvings. Main features: 7-storey structure, 108 pillars, beautiful sculptures, and a 6.5 ft Shiva lingam. The temple complex spans 5 acres with beautiful gardens.";
    }

    if (
      lowerQuery.includes("significance") ||
      lowerQuery.includes("importance") ||
      lowerQuery.includes("sacred")
    ) {
      return "Somnath is the first among the 12 Jyotirlingas. It's believed that Lord Shiva appeared as a divine light (Jyotirlingam) here. The temple represents the victory of good over evil and has immense spiritual significance.";
    }

    // Special Services and Accessibility
    if (
      lowerQuery.includes("wheelchair") ||
      lowerQuery.includes("disabled") ||
      lowerQuery.includes("handicap")
    ) {
      return "Wheelchair accessible ramps available at all gates. Wheelchair rental available at ₹50/day. Special darshan queues for elderly and disabled. Braille signage available. Assistance personnel available 24/7.";
    }

    if (
      lowerQuery.includes("guide") ||
      lowerQuery.includes("tour") ||
      lowerQuery.includes("audio")
    ) {
      return "Audio guides available in Hindi, English, Gujarati for ₹50. Temple guides available for ₹200-500 for group tours. Self-guided information boards in multiple languages throughout the premises.";
    }

    if (
      lowerQuery.includes("photography") ||
      lowerQuery.includes("camera") ||
      lowerQuery.includes("photo")
    ) {
      return "Photography allowed in outer areas. No photography inside main sanctum. Professional photography services available. Drone photography not permitted. Tripods allowed with permission.";
    }

    if (
      lowerQuery.includes("dress") ||
      lowerQuery.includes("clothing") ||
      lowerQuery.includes("wear")
    ) {
      return "Modest clothing required. Men: Full pants, covered shoulders. Women: Salwar kameez, saree, or long kurti with leggings. Scarves available for covering head. No shorts, sleeveless tops, or revealing clothing.";
    }
    if (
      lowerQuery.includes("donation") ||
      lowerQuery.includes("contribute") ||
      lowerQuery.includes("offer")
    ) {
      return "Donation boxes available throughout temple. Hundi (donation box) in main hall. Online donations accepted. All donations go towards temple maintenance and charitable activities.";
    }

    if (
      lowerQuery.includes("crowd") ||
      lowerQuery.includes("bheed") ||
      lowerQuery.includes("crowded")
    ) {
      return "Somnath Temple typically witnesses 25,000–30,000 visitors per day, based on annual footfall data of around 9.8 million pilgrims. Crowd levels rise significantly during festivals and peak seasons, often exceeding 50,000 daily..";
    }

    // Festivals and Events
    if (
      lowerQuery.includes("festival") ||
      lowerQuery.includes("celebration") ||
      lowerQuery.includes("event")
    ) {
      return "Major festivals: Maha Shivaratri (Feb-March), Shravan month celebrations, Kartik Purnima. Special events during Navratri, Diwali. Temple decorated beautifully during festivals with extended hours.";
    }

    if (lowerQuery.includes("special day") || lowerQuery.includes("occasion")) {
      return "Special occasions: Monday (special significance for Shiva devotees), Purnima days, Hindu festivals. Special pujas and ceremonies conducted. Increased crowd expected during these days.";
    }

    // Transportation and Nearby
    if (
      lowerQuery.includes("how to reach") ||
      lowerQuery.includes("transport") ||
      lowerQuery.includes("bus") ||
      lowerQuery.includes("train")
    ) {
      return "By Road: 5km from Somnath Railway Station, 7km from Veraval. Regular buses from Ahmedabad, Rajkot, Surat. By Train: Somnath Express, Saurashtra Express. By Air: Nearest airport is Diu (80km) or Rajkot (200km).";
    }

    if (
      lowerQuery.includes("nearby") ||
      lowerQuery.includes("around") ||
      lowerQuery.includes("attraction")
    ) {
      return "Nearby attractions: Somnath Beach (2km), Triveni Ghat (3km), Junagadh (100km), Diu (80km). Shopping: Local markets for handicrafts, religious items. Stay options: Hotels from ₹500-5000, guesthouses available.";
    }

    if (
      lowerQuery.includes("accommodation") ||
      lowerQuery.includes("hotel") ||
      lowerQuery.includes("stay")
    ) {
      return "Hotels: From budget (₹500-1500) to luxury (₹3000-5000). Recommended: Somnath Beach Resort, Lord Somnath Hotel, Temple View Hotel. Advance booking recommended during festivals. Dormitory facilities available for pilgrims.";
    }

    // Emergency and Safety
    if (
      lowerQuery.includes("emergency") ||
      lowerQuery.includes("medical") ||
      lowerQuery.includes("doctor") ||
      lowerQuery.includes("hospital")
    ) {
      return "Medical center within temple premises (24/7). Nearest hospital: Somnath General Hospital (2km). Ambulance service available. First aid stations at all gates. Emergency contact: Temple security (+91-2876-231234).";
    }

    if (lowerQuery.includes("safety") || lowerQuery.includes("security")) {
      return "High security with CCTV cameras, metal detectors, and trained personnel. Separate queues for men/women. Child protection measures in place. Emergency evacuation plans available. Safe for all visitors.";
    }

    // General Questions
    if (
      lowerQuery.includes("best time") ||
      lowerQuery.includes("when to visit") ||
      lowerQuery.includes("season")
    ) {
      return "Best time: October to March (pleasant weather). Avoid April-June (hot), July-September (monsoon). Festivals make visits special but crowded. Early morning or evening visits recommended for peaceful darshan.";
    }

    if (
      lowerQuery.includes("cost") ||
      lowerQuery.includes("fee") ||
      lowerQuery.includes("price") ||
      lowerQuery.includes("ticket")
    ) {
      return "Entry: Free for all. Special darshan: ₹100-500. Parking: ₹20-50. Audio guide: ₹50. Photography permit: ₹100. Food: ₹50-200. Total budget: ₹200-1000 per person for a comfortable visit.";
    }

    if (
      lowerQuery.includes("children") ||
      lowerQuery.includes("kid") ||
      lowerQuery.includes("family")
    ) {
      return "Family-friendly temple with special queues for children. Kids under 5 free entry. Baby care facilities available. Interactive displays for children. Pram rental available. Safe and welcoming environment.";
    }

    // Fallback responses
    if (
      lowerQuery.includes("hello") ||
      lowerQuery.includes("hi") ||
      lowerQuery.includes("namaste")
    ) {
      return "Namaste! Welcome to Somnath Temple. I'm your AI assistant. I can help you with information about temple timings, locations, facilities, history, and everything you need for a wonderful pilgrimage experience. What would you like to know?";
    }

    if (lowerQuery.includes("thank") || lowerQuery.includes("thanks")) {
      return "You're welcome! May Lord Shiva bless you with peace and prosperity. Have a wonderful visit to Somnath Temple. Jai Somnath! 🙏";
    }

    // Default response for unrecognized queries
    return "I understand you're asking about Somnath Temple. While I have extensive information about temple facilities, timings, history, and visitor services, could you please rephrase your question or ask about specific aspects like locations, timings, food, parking, or history? I'm here to provide detailed and accurate information to make your visit memorable!";
  };

  const quickQueries = [
    "Where is the washroom?",
    "Temple timings?",
    "Parking location?",
    "How to reach the main gate?",
  ];

  return (
    <section
      id="ai-assistance"
      className="py-24 bg-gradient-to-br from-blue-50 via-background to-cyan-50 dark:from-blue-950/20 dark:via-background dark:to-cyan-950/20"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300">
            <Bot className="w-3 h-3 mr-1" />
            AI-Powered Assistant
          </Badge>
          <h1 className="text-4xl  bg-gradient-spiritual bg-clip-text text-transparent md:text-5xl font-bold mb-4">
            Temple AI Assistant
          </h1>
          <p className="text-xl text-muted-foreground font-serif">
            Get instant answers about{" "}
            <span className="bg-gradient-warm bg-clip-text text-transparent">
              Somnath Temple
            </span>{" "}
            and other sacred sites in Gujarat. Ask about locations, timings,
            facilities, and everything you need to know.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-primary" />
                Chat with Temple AI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto space-y-4 p-4 bg-muted/30 rounded-lg">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Query Buttons */}
              <div className="flex flex-wrap gap-2">
                {quickQueries.map((q, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(q)}
                    className="text-xs"
                  >
                    {q}
                  </Button>
                ))}
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about temple locations, timings, facilities..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendQuery()}
                  className="flex-1"
                />
                {isSupported && (
                  <Button
                    onClick={isListening ? stopListening : startListening}
                    size="icon"
                    variant={isListening ? "destructive" : "outline"}
                    className={isListening ? "animate-pulse" : ""}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </Button>
                )}
                <Button onClick={handleSendQuery} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card className="text-center p-6">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Location Guide</h3>
              <p className="text-sm text-muted-foreground">
                Find washrooms, gates, parking, and all facilities
              </p>
            </Card>
            <Card className="text-center p-6">
              <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Timings & Events</h3>
              <p className="text-sm text-muted-foreground">
                Temple hours, aarti times, and festival schedules
              </p>
            </Card>
            <Card className="text-center p-6">
              <Info className="w-8 h-8 text-success mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Temple Info</h3>
              <p className="text-sm text-muted-foreground">
                History, rituals, prasad, and visitor guidelines
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAssistanceSection;
