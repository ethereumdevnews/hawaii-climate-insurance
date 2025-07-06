import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Thermometer, Droplets, Mountain, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import usgsMapImage from "@assets/Image_1751005103664.jpeg";
import hpiaMapImage from "@assets/Image 1_1751009945223.jpeg";

interface RiskZone {
  id: string;
  name: string;
  island: string;
  coordinates: { lat: number; lng: number };
  risks: {
    volcanic: number;
    earthquake: number;
    flood: number;
    tsunami: number;
  };
  overallRisk: number;
  population: number;
  zipCodes: string[];
}

interface HeatmapProps {
  selectedRiskType?: 'volcanic' | 'earthquake' | 'flood' | 'tsunami' | 'overall';
  onZoneSelect?: (zone: RiskZone) => void;
}

export default function ClimateRiskHeatmap({ selectedRiskType = 'overall', onZoneSelect }: HeatmapProps) {
  const [activeRiskType, setActiveRiskType] = useState<'volcanic' | 'earthquake' | 'flood' | 'tsunami' | 'overall'>(selectedRiskType);
  const [selectedZone, setSelectedZone] = useState<RiskZone | null>(null);

  const riskZones: RiskZone[] = [
    // Kauai
    {
      id: 'kauai-north',
      name: 'North Shore Kauai',
      island: 'kauai',
      coordinates: { lat: 22.2074, lng: -159.5261 },
      risks: { volcanic: 15, earthquake: 25, flood: 85, tsunami: 70 },
      overallRisk: 49,
      population: 8500,
      zipCodes: ['96714', '96722']
    },
    // Oahu
    {
      id: 'oahu-honolulu',
      name: 'Honolulu Metro',
      island: 'oahu',
      coordinates: { lat: 21.3099, lng: -157.8581 },
      risks: { volcanic: 20, earthquake: 45, flood: 55, tsunami: 65 },
      overallRisk: 46,
      population: 390000,
      zipCodes: ['96813', '96814', '96815', '96822']
    },
    // Big Island
    {
      id: 'hawaii-hilo',
      name: 'Hilo',
      island: 'hawaii',
      coordinates: { lat: 19.7297, lng: -155.0900 },
      risks: { volcanic: 85, earthquake: 75, flood: 60, tsunami: 70 },
      overallRisk: 73,
      population: 45000,
      zipCodes: ['96720', '96721']
    },
    {
      id: 'hawaii-puna',
      name: 'Puna District',
      island: 'hawaii',
      coordinates: { lat: 19.4969, lng: -154.9253 },
      risks: { volcanic: 95, earthquake: 85, flood: 45, tsunami: 55 },
      overallRisk: 70,
      population: 15000,
      zipCodes: ['96778', '96749']
    }
  ];

  const getRiskLevel = (risk: number): string => {
    if (risk >= 75) return 'Extreme';
    if (risk >= 60) return 'High';
    if (risk >= 40) return 'Moderate';
    return 'Low';
  };

  const getRiskIcon = (type: string) => {
    switch (type) {
      case 'volcanic': return <Mountain className="h-4 w-4" />;
      case 'earthquake': return <Zap className="h-4 w-4" />;
      case 'flood': return <Droplets className="h-4 w-4" />;
      case 'tsunami': return <Thermometer className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const handleZoneClick = (zone: RiskZone) => {
    setSelectedZone(zone);
    onZoneSelect?.(zone);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Climate Risk Assessment</h2>
          <p className="text-muted-foreground">Official USGS geological maps and Hawaii risk zone data</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={activeRiskType} onValueChange={(value: any) => setActiveRiskType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overall">Overall Risk</SelectItem>
              <SelectItem value="volcanic">Volcanic Risk</SelectItem>
              <SelectItem value="earthquake">Earthquake Risk</SelectItem>
              <SelectItem value="flood">Flood Risk</SelectItem>
              <SelectItem value="tsunami">Tsunami Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* USGS Geological Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mountain className="h-4 w-4" />
            USGS Geological Survey Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <img 
              src={usgsMapImage} 
              alt="USGS Hawaii Geological Survey Map" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs">
              <p className="text-gray-600">Source: USGS Hawaiian Volcano Observatory</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HPIA Lava Zone Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            HPIA Lava Zone Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <img 
              src={hpiaMapImage} 
              alt="HPIA Hawaii Lava Zone Map" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs">
              <p className="text-gray-600">Source: Hawaii Property Insurance Association</p>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <h4 className="font-semibold text-red-800">Zones 1 & 2</h4>
              </div>
              <p className="text-sm text-red-700">HPIA coverage required</p>
              <p className="text-xs text-red-600">Highest volcanic risk</p>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h4 className="font-semibold text-green-800">Zones 3-9</h4>
              </div>
              <p className="text-sm text-green-700">Private insurance available</p>
              <p className="text-xs text-green-600">Lower volcanic risk</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Zone List */}
      <div className="grid gap-4">
        {riskZones.map((zone) => {
          const riskValue = activeRiskType === 'overall' ? zone.overallRisk : zone.risks[activeRiskType];
          return (
            <Card 
              key={zone.id} 
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                selectedZone?.id === zone.id && "ring-2 ring-blue-500"
              )}
              onClick={() => handleZoneClick(zone)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{zone.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {zone.island} Island • Population: {zone.population.toLocaleString()}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {zone.zipCodes.map(zip => (
                        <Badge key={zip} variant="outline" className="text-xs">
                          {zip}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={riskValue >= 60 ? 'destructive' : 'secondary'}>
                      {getRiskLevel(riskValue)}
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-1">
                      {riskValue}% risk
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedZone && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {selectedZone.name} Risk Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center gap-1">
                  <Mountain className="h-3 w-3" />
                  Volcanic
                </span>
                <Badge variant={selectedZone.risks.volcanic >= 60 ? 'destructive' : 'secondary'}>
                  {getRiskLevel(selectedZone.risks.volcanic)}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Earthquake
                </span>
                <Badge variant={selectedZone.risks.earthquake >= 60 ? 'destructive' : 'secondary'}>
                  {getRiskLevel(selectedZone.risks.earthquake)}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center gap-1">
                  <Droplets className="h-3 w-3" />
                  Flood
                </span>
                <Badge variant={selectedZone.risks.flood >= 60 ? 'destructive' : 'secondary'}>
                  {getRiskLevel(selectedZone.risks.flood)}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center gap-1">
                  <Thermometer className="h-3 w-3" />
                  Tsunami
                </span>
                <Badge variant={selectedZone.risks.tsunami >= 60 ? 'destructive' : 'secondary'}>
                  {getRiskLevel(selectedZone.risks.tsunami)}
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                Get Quote for This Area
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                View One-Click Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}