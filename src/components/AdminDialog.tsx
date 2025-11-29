import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LayoutDashboard, TrendingUp, Users, AlertCircle, Radio, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdminDialog = ({ open, onOpenChange }: AdminDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            Admin Dashboard
          </DialogTitle>
          <DialogDescription>
            Comprehensive control panel for temple authorities and staff
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Dashboard Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <Users className="w-6 h-6 text-primary mb-2" />
              <div className="text-2xl font-bold">12,456</div>
              <div className="text-xs text-muted-foreground">
                Current Visitors
              </div>
            </div>
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <AlertCircle className="w-6 h-6 text-warning mb-2" />
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs text-muted-foreground">Active Alerts</div>
            </div>
            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <Activity className="w-6 h-6 text-success mb-2" />
              <div className="text-2xl font-bold">98%</div>
              <div className="text-xs text-muted-foreground">System Health</div>
            </div>
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <Radio className="w-6 h-6 text-accent mb-2" />
              <div className="text-2xl font-bold">245</div>
              <div className="text-xs text-muted-foreground">IoT Devices</div>
            </div>
          </div>

          {/* Crowd Distribution Chart */}
          <div className="p-6 rounded-lg bg-muted/30">
            <h3 className="text-lg font-semibold mb-4">
              Live Crowd Distribution
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Main Hall</span>
                  <span className="font-semibold text-destructive">85%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-destructive transition-all duration-500"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Prasad Area</span>
                  <span className="font-semibold text-warning">60%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-[60%] bg-warning transition-all duration-500"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Parking</span>
                  <span className="font-semibold text-success">40%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-[40%] bg-success transition-all duration-500"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Features */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-6 rounded-xl bg-card border border-border">
              <TrendingUp className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">AI Predictions</h3>
              <p className="text-sm text-muted-foreground">
                Forecast crowd levels for next 7 days with ML models
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <AlertCircle className="w-8 h-8 text-warning mb-3" />
              <h3 className="font-semibold mb-2">Alerts Center</h3>
              <p className="text-sm text-muted-foreground">
                Centralized management of all safety and system alerts
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <Radio className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-semibold mb-2">Device Status</h3>
              <p className="text-sm text-muted-foreground">
                Monitor all IoT sensors and CCTV cameras in real-time
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDialog;
