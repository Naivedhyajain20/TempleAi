import { MapPin, Search, Navigation, Accessibility, Box } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Temple3D from "@/components/Temple3D";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const TempleMapSection = () => {
  const [showHeatmap, setShowHeatmap] = useState(true);

  const pois = [
    { name: "Main Gate", icon: "🚪", type: "Entry" },
    { name: "Garbhagriha", icon: "🕉️", type: "Sacred" },
    { name: "Prasad Counter", icon: "🍽️", type: "Service" },
    { name: "Medical Room", icon: "⚕️", type: "Emergency" },
    { name: "Washrooms", icon: "🚻", type: "Facility" },
    { name: "Water Points", icon: "💧", type: "Facility" },
  ];

  // Mock crowd density data points [lat, lng, intensity]
  const crowdData = [
    [23.02295, 72.57819, 0.8], // Main gate - high crowd
    [23.02305, 72.57825, 0.6], // Garbhagriha area - medium
    [23.02285, 72.57815, 0.4], // Prasad counter - low
    [23.02315, 72.57835, 0.9], // Another high crowd area
    [23.02275, 72.57805, 0.3], // Low crowd area
    [23.02325, 72.57845, 0.7], // Medium-high
  ];

  // Heatmap Layer Component
  const HeatmapLayer: React.FC = () => {
    const map = useMap();

    useEffect(() => {
      const circles: L.Circle[] = [];

      if (showHeatmap) {
        console.log("Adding heatmap circles...");
        crowdData.forEach(([lat, lng, intensity], index) => {
          // Map intensity (0-1) to color
          let color = "green";
          if (intensity > 0.8) color = "darkred";
          else if (intensity > 0.6) color = "red";
          else if (intensity > 0.4) color = "orange";
          else if (intensity > 0.2) color = "yellow";

          console.log(`Adding circle ${index}:`, {
            lat,
            lng,
            intensity,
            color,
          });

          const circle = L.circle([lat, lng], {
            color: color,
            fillColor: color,
            fillOpacity: intensity * 0.6,
            radius: 50 + intensity * 100, // Larger radius for visibility
            weight: 2,
          }).addTo(map);

          circles.push(circle);
        });
        console.log(`Added ${circles.length} circles to map`);
      }

      return () => {
        console.log("Removing heatmap circles...");
        circles.forEach((circle) => {
          if (map.hasLayer(circle)) {
            map.removeLayer(circle);
          }
        });
      };
    }, [map, showHeatmap]);

    return <></>;
  };

  return (
    <section
      id="temple-map"
      className="py-24 bg-gradient-to-br from-emerald-50 via-background to-teal-50 dark:from-emerald-950/20 dark:via-background dark:to-teal-950/20"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
          <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-300">
            <MapPin className="w-3 h-3 mr-1" />
            Interactive Navigation
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Temple Map & Navigation
          </h2>
          <p className="text-xl text-muted-foreground">
            Explore with interactive 2D map or immersive 3D visualization
          </p>
        </div>

        {/* Map View Tabs */}
        <Tabs defaultValue="2d" className="max-w-7xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="3d" className="flex items-center gap-2">
              <Box className="w-4 h-4" />
              3D Model
            </TabsTrigger>
            <TabsTrigger value="2d" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              2D Map
            </TabsTrigger>
          </TabsList>

          <TabsContent value="3d" className="animate-fade-in">
            <Temple3D />
          </TabsContent>

          <TabsContent value="2d" className="animate-fade-in">
            <div className="max-w-6xl mx-auto">
              {/* Map Controls */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Search POI
                </Button>
                <Button variant="outline" size="sm">
                  <Navigation className="w-4 h-4 mr-2" />
                  My Location
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  onClick={() => setShowHeatmap(!showHeatmap)}
                >
                  {showHeatmap ? "Hide" : "Show"} Heatmap
                </Button>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Map Display */}
                <div className="lg:col-span-2 animate-scale-in">
                  <div className="aspect-video rounded-2xl border-2 border-border shadow-lg overflow-hidden">
                    <MapContainer
                      center={[23.02295, 72.57819]}
                      zoom={18}
                      style={{ height: "100%", width: "100%" }}
                      className="leaflet-container"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <HeatmapLayer />
                    </MapContainer>
                  </div>

                  {/* Map Legend */}
                  <div className="mt-4 p-4 rounded-lg bg-card border border-border">
                    <div className="text-sm font-semibold mb-2">
                      Crowd Density
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-xs">Low</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                        <span className="text-xs">Medium</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span className="text-xs">High</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* POI List */}
                <div className="animate-slide-in-right">
                  <div className="p-6 rounded-2xl bg-card border border-border shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Points of Interest
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {pois.map((poi, index) => (
                        <div
                          key={index}
                          className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{poi.icon}</span>
                            <div className="flex-1">
                              <div className="font-medium text-sm">
                                {poi.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {poi.type}
                              </div>
                            </div>
                            <Navigation className="w-4 h-4 text-primary" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 p-4 rounded-lg bg-success/10 border border-success/20">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-success" />
                      <span className="text-sm font-medium text-success">
                        Location services enabled
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default TempleMapSection;
