import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Ticket, Clock, Users, CheckCircle2, User, Phone } from "lucide-react";
import { toast } from "sonner";

interface QueueToken {
  id: string;
  number: number;
  name: string;
  phone: string;
  status: "waiting" | "processing" | "completed";
  waitTime: number;
  position: number;
}

const QueueDemo = () => {
  const [tokens, setTokens] = useState<QueueToken[]>([]);
  const [currentServing, setCurrentServing] = useState(142);
  const [totalServed, setTotalServed] = useState(2345);
  const [avgWaitTime, setAvgWaitTime] = useState(45);
  const [queueLength, setQueueLength] = useState(23);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Simulate real-time queue updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServing((prev) => prev + 1);
      setTotalServed((prev) => prev + 1);
      setAvgWaitTime((prev) => Math.max(20, prev + Math.floor(Math.random() * 5) - 2));
      setQueueLength((prev) => Math.max(10, prev + Math.floor(Math.random() * 5) - 2));

      // Update token statuses
      setTokens((prevTokens) =>
        prevTokens.map((token) => {
          if (token.status === "waiting" && token.position <= 2) {
            return { ...token, status: "processing" as const };
          }
          if (token.status === "processing") {
            return { ...token, status: "completed" as const };
          }
          if (token.status === "waiting") {
            return {
              ...token,
              position: Math.max(1, token.position - 1),
              waitTime: Math.max(5, token.waitTime - 2),
            };
          }
          return token;
        }).filter((token) => token.status !== "completed")
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const generateToken = () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    const newToken: QueueToken = {
      id: `TKN${Date.now()}`,
      number: currentServing + queueLength + tokens.length + 1,
      name: name.trim(),
      phone: phone.trim(),
      status: "waiting",
      waitTime: avgWaitTime + tokens.length * 5,
      position: queueLength + tokens.length + 1,
    };

    setTokens((prev) => [...prev, newToken]);
    toast.success(`Token Generated: #${newToken.number}`, {
      description: `Welcome ${newToken.name}! Position: ${newToken.position} | Wait: ~${newToken.waitTime} mins`,
    });

    // Clear form
    setName("");
    setPhone("");
  };

  return (
    <div className="space-y-6">
      {/* Live Stats Dashboard */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 animate-scale-in">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-primary" />
            <Badge variant="outline" className="animate-pulse">Live</Badge>
          </div>
          <div className="text-3xl font-bold text-primary mb-1">{currentServing}</div>
          <div className="text-sm text-muted-foreground">Currently Serving</div>
        </div>

        <div className="p-6 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 animate-scale-in" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>
          <div className="text-3xl font-bold text-accent mb-1">{totalServed}</div>
          <div className="text-sm text-muted-foreground">Total Served Today</div>
        </div>

        <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 animate-scale-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-orange-500 mb-1">{avgWaitTime}m</div>
          <div className="text-sm text-muted-foreground">Avg Wait Time</div>
        </div>

        <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 animate-scale-in" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center justify-between mb-2">
            <Ticket className="w-8 h-8 text-cyan-500" />
          </div>
          <div className="text-3xl font-bold text-cyan-500 mb-1">{queueLength}</div>
          <div className="text-sm text-muted-foreground">In Queue</div>
        </div>
      </div>

      {/* Token Generation */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border">
        <h3 className="text-2xl font-bold mb-2">Get Your Digital Token</h3>
        <p className="text-muted-foreground mb-6">
          Enter your details to generate a token and track your queue position in real-time
        </p>
        <div className="grid md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-sm font-medium mb-2 block">
              <User className="w-4 h-4 inline mr-1" />
              Your Name
            </label>
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number
            </label>
            <Input
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              maxLength={10}
              type="tel"
            />
          </div>
          <Button
            size="lg"
            onClick={generateToken}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            <Ticket className="w-5 h-5 mr-2" />
            Generate Token
          </Button>
        </div>
      </div>

      {/* Active Tokens */}
      {tokens.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Your Active Tokens</h3>
          {tokens.map((token, index) => (
            <div
              key={token.id}
              className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-all animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">
                      {token.number}
                    </span>
                  </div>
                  <div>
                    <div className="text-lg font-semibold mb-1">
                      {token.name}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Ticket className="w-3 h-3" />
                        #{token.number}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {token.phone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 max-w-md space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Queue Progress</span>
                    <Badge
                      variant={
                        token.status === "completed"
                          ? "default"
                          : token.status === "processing"
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        token.status === "processing" ? "animate-pulse" : ""
                      }
                    >
                      {token.status === "waiting" && `Position: ${token.position}`}
                      {token.status === "processing" && "Processing Now"}
                      {token.status === "completed" && "Completed"}
                    </Badge>
                  </div>
                  <Progress
                    value={
                      token.status === "completed"
                        ? 100
                        : token.status === "processing"
                        ? 75
                        : Math.max(10, 100 - token.position * 5)
                    }
                    className="h-2"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {token.status === "waiting" && `~${token.waitTime} mins`}
                      {token.status === "processing" && "In Progress"}
                      {token.status === "completed" && "Done"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QueueDemo;
