import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  AlertCircle, 
  Radio, 
  Activity, 
  Shield, 
  Cpu, 
  Database, 
  FileText,
  Terminal,
  Zap,
  Globe
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdminDialog = ({ open, onOpenChange }: AdminDialogProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [logs, setLogs] = useState<string[]>([]);

  // Simulated log generation
  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString();
      const events = [
        "Node 42: Crowd surge detected (+15%)",
        "Sensor 8: Battery level low",
        "Main Sanctum: Queue 1 throughput optimized",
        "Global Sync: Latency normal (24ms)",
        "Security: Patrol B-4 checked in",
        "AI: Forecast adjusted for morning session",
      ];
      setLogs(prev => [`[${timestamp}] ${events[Math.floor(Math.random() * events.length)]}`, ...prev].slice(0, 10));
    }, 4000);
    return () => clearInterval(interval);
  }, [open]);

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "crowd", label: "Crowd Analytics", icon: Users },
    { id: "security", label: "Security Hub", icon: Shield },
    { id: "iot", label: "IoT Mesh", icon: Radio },
    { id: "system", label: "System Health", icon: Activity },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px] w-[95vw] h-[85vh] p-0 overflow-hidden bg-black/95 border-white/5 backdrop-blur-3xl rounded-[3rem]">
        <div className="flex h-full">
          {/* Dashboard Sidebar */}
          <aside className="w-72 border-r border-white/5 bg-white/[0.02] p-8 flex flex-col pt-12">
            <div className="flex items-center gap-3 mb-10 px-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl text-white tracking-tighter leading-none">COMMAND</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-black">Operation Center</span>
              </div>
            </div>

            <nav className="space-y-2 flex-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all group",
                    activeTab === item.id
                      ? "bg-primary text-white shadow-lg shadow-primary/10"
                      : "text-white/40 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-white" : "text-white/20 group-hover:text-primary transition-colors")} />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="pt-8 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-white/20 tracking-widest px-2">
                <span>Auth Level</span>
                <span className="text-emerald-500">Master</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-white/60">
                  <Cpu className="w-3.5 h-3.5 text-primary" /> Core Load
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[42%] bg-primary animate-pulse" />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Dashboard Area */}
          <div className="flex-1 overflow-y-auto scrollbar-hide p-10 pt-12 relative">
            <DialogHeader className="mb-10 px-2">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-4xl font-black text-white tracking-tighter mb-2 leading-none uppercase">
                    {activeTab} <span className="text-primary">Matrix</span>
                  </DialogTitle>
                  <DialogDescription className="text-white/40 text-sm font-medium uppercase tracking-[0.2em]">
                    Real-time situational intelligence
                  </DialogDescription>
                </div>
                <div className="flex gap-4">
                  <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">System Online</span>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
              {/* Quick Gauges */}
              <div className="grid grid-cols-4 gap-6">
                {[
                  { label: "Active Pilgrims", val: "12,456", icon: Users, color: "text-primary" },
                  { label: "Alert Level", val: "Critical 02", icon: AlertCircle, color: "text-red-500" },
                  { label: "Signal Mesh", val: "99.8%", icon: Radio, color: "text-blue-500" },
                  { label: "AI Latency", val: "24ms", icon: Activity, color: "text-emerald-500" },
                ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 relative overflow-hidden group">
                    <stat.icon className={cn("w-6 h-6 mb-3", stat.color)} />
                    <div className="text-3xl font-black text-white mb-1">{stat.val}</div>
                    <div className="text-[10px] font-black uppercase text-white/30 tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Data Visualization Grid */}
              <div className="grid grid-cols-12 gap-8">
                {/* Live Distribution Map (Placeholder) */}
                <div className="col-span-8 p-8 rounded-[3rem] bg-white/[0.03] border border-white/10 h-[400px] relative overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Crowd Distribution Map</h3>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[9px] font-bold text-white/40 uppercase">Hot Zone</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                     <Globe className="w-64 h-64 text-primary animate-spin-slow" />
                  </div>
                  <div className="relative z-10 space-y-6">
                    {[
                      { label: "Main Sanctum", val: 85, color: "from-red-500 to-orange-500" },
                      { label: "Entrance Gate 1", val: 45, color: "from-orange-500 to-yellow-500" },
                      { label: "Parking Area A", val: 30, color: "from-blue-500 to-cyan-500" },
                      { label: "Prasad Counter", val: 62, color: "from-primary to-orange-400" },
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-xs font-bold text-white/80">{item.label}</span>
                          <span className="text-xs font-black text-white">{item.val}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full bg-gradient-to-r", item.color)}
                            style={{ width: `${item.val}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Log Console */}
                <div className="col-span-4 flex flex-col gap-8">
                  <div className="flex-1 p-8 rounded-[3rem] bg-black border border-white/10 relative overflow-hidden flex flex-col shadow-2xl">
                    <div className="flex items-center gap-2 mb-6">
                      <Terminal className="w-4 h-4 text-emerald-500" />
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Live System Log</h3>
                    </div>
                    <div className="space-y-4 flex-1 overflow-hidden font-mono text-[10px] leading-relaxed text-emerald-500/60">
                      {logs.map((log, i) => (
                        <div key={i} className="animate-in slide-in-from-top-2 fade-in duration-300">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 rounded-[3rem] bg-primary/10 border border-primary/20 relative overflow-hidden group">
                    <Database className="w-8 h-8 text-primary mb-4" />
                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Backup Vault</h4>
                    <p className="text-xs text-white/40 leading-relaxed translate-y-0 group-hover:-translate-y-1 transition-transform">
                      All security feeds and biometric data secured in 256-bit encryption.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDialog;
