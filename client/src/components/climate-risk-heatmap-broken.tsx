import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Thermometer, Droplets, Mountain, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import usgsMapImage from "@assets/Image_1751005103664.jpeg";

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
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const riskZones: RiskZone[] = [
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
    {
      id: 'oahu-honolulu',
      name: 'Honolulu Metro',
      island: 'oahu',
      coordinates: { lat: 21.3099, lng: -157.8581 },
      risks: { volcanic: 20, earthquake: 45, flood: 55, tsunami: 75 },
      overallRisk: 49,
      population: 350000,
      zipCodes: ['96813', '96814', '96815']
    },
    {
      id: 'hawaii-hilo',
      name: 'Hilo Bay Area',
      island: 'hawaii',
      coordinates: { lat: 19.7297, lng: -155.0900 },
      risks: { volcanic: 85, earthquake: 80, flood: 75, tsunami: 85 },
      overallRisk: 81,
      population: 45000,
      zipCodes: ['96720', '96721']
    },
    {
      id: 'hawaii-puna',
      name: 'Puna District (Lava Zone 1)',
      island: 'hawaii',
      coordinates: { lat: 19.4697, lng: -154.9728 },
      risks: { volcanic: 95, earthquake: 90, flood: 40, tsunami: 70 },
      overallRisk: 74,
      population: 8500,
      zipCodes: ['96778']
    }
  ];

  const getRiskColor = (riskValue: number): string => {
    if (riskValue >= 80) return 'bg-red-600';
    if (riskValue >= 60) return 'bg-red-400';
    if (riskValue >= 40) return 'bg-yellow-500';
    if (riskValue >= 20) return 'bg-yellow-300';
    return 'bg-green-400';
  };

  const getRiskColorHex = (riskValue: number): string => {
    if (riskValue >= 80) return '#dc2626';
    if (riskValue >= 60) return '#f87171';
    if (riskValue >= 40) return '#eab308';
    if (riskValue >= 20) return '#fde047';
    return '#4ade80';
  };

  const getRiskLevel = (riskValue: number): string => {
    if (riskValue >= 80) return 'Extreme';
    if (riskValue >= 60) return 'High';
    if (riskValue >= 40) return 'Moderate';
    if (riskValue >= 20) return 'Low';
    return 'Very Low';
  };

  const getRiskIcon = (riskType: string) => {
    switch (riskType) {
      case 'volcanic': return <Mountain className="h-4 w-4" />;
      case 'earthquake': return <Zap className="h-4 w-4" />;
      case 'flood': return <Droplets className="h-4 w-4" />;
      case 'tsunami': return <Droplets className="h-4 w-4" />;
      default: return <Thermometer className="h-4 w-4" />;
    }
  };

  const handleZoneClick = (zone: RiskZone) => {
    setSelectedZone(zone);
    onZoneSelect?.(zone);
  };

  useEffect(() => {
    setActiveRiskType(selectedRiskType);
  }, [selectedRiskType]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Select value={activeRiskType} onValueChange={(value: any) => setActiveRiskType(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select risk type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overall">Overall Risk</SelectItem>
              <SelectItem value="volcanic">Volcanic Risk</SelectItem>
              <SelectItem value="earthquake">Earthquake Risk</SelectItem>
              <SelectItem value="flood">Flood Risk</SelectItem>
              <SelectItem value="tsunami">Tsunami Risk</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
            >
              Map
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Risk Level:</span>
          <div className="flex gap-1">
            <div className={cn("w-4 h-4 rounded", getRiskColor(90))} title="Extreme (80-100)" />
            <div className={cn("w-4 h-4 rounded", getRiskColor(70))} title="High (60-79)" />
            <div className={cn("w-4 h-4 rounded", getRiskColor(50))} title="Moderate (40-59)" />
            <div className={cn("w-4 h-4 rounded", getRiskColor(30))} title="Low (20-39)" />
            <div className={cn("w-4 h-4 rounded", getRiskColor(10))} title="Very Low (0-19)" />
          </div>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="space-y-6">
          {/* USGS Map Section - Top */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                USGS Hawaii Geological Survey Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-white rounded-lg p-4 min-h-[400px] overflow-hidden">
                <div className="relative w-full h-full">
                  <img 
                    src={usgsMapImage} 
                    alt="USGS Hawaii Climate Risk Map" 
                    className="w-full h-auto object-contain rounded-lg shadow-md"
                    style={{ maxHeight: '400px' }}
                  />
                  
                  <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs text-gray-600 border">
                    <span className="font-medium">Source:</span> U.S. Geological Survey (USGS)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Risk Heatmap - Bottom */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getRiskIcon(activeRiskType)}
                    Interactive Risk Heatmap - {activeRiskType.charAt(0).toUpperCase() + activeRiskType.slice(1)} Risk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg p-8 min-h-[500px] overflow-hidden">
                    {/* Hawaii Island Chain SVG Map */}
                    <svg
                      viewBox="0 0 800 400"
                      className="w-full h-full"
                      style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))' }}
                    >
                      {/* Ocean background */}
                      <defs>
                        <pattern id="waves" patternUnits="userSpaceOnUse" width="40" height="8">
                          <path d="M0,4 Q10,0 20,4 T40,4" stroke="#60a5fa" strokeWidth="0.5" fill="none" opacity="0.3"/>
                        </pattern>
                      </defs>
                      <rect width="800" height="400" fill="url(#waves)" />

                      {/* Kauai Island */}
                      <g transform="translate(50, 80)">
                        <path
                          d="M0,20 Q5,0 15,5 Q25,2 35,8 Q40,15 38,25 Q35,35 25,38 Q15,40 8,35 Q0,30 0,20"
                          fill={selectedZone?.island === 'kauai' ? '#3b82f6' : '#10b981'}
                          stroke="#065f46"
                          strokeWidth="1"
                          className="cursor-pointer hover:brightness-110 transition-all"
                          onClick={() => {
                            const kauaiZone = riskZones.find(z => z.island === 'kauai');
                            if (kauaiZone) handleZoneClick(kauaiZone);
                          }}
                        />
                        {riskZones.filter(z => z.island === 'kauai').map((zone, index) => {
                          const riskValue = activeRiskType === 'overall' ? zone.overallRisk : zone.risks[activeRiskType];
                          return (
                            <circle
                              key={zone.id}
                              cx={10 + (index * 12)}
                              cy={20}
                              r="4"
                              fill={getRiskColorHex(riskValue)}
                              stroke={selectedZone?.id === zone.id ? "#3b82f6" : "#ffffff"}
                              strokeWidth={selectedZone?.id === zone.id ? "3" : "2"}
                              className="cursor-pointer hover:brightness-110 transition-all"
                              onClick={() => handleZoneClick(zone)}
                            >
                              <title>{`${zone.name}: ${getRiskLevel(riskValue)} (${riskValue}%)`}</title>
                            </circle>
                          );
                        })}
                        <text x="20" y="55" textAnchor="middle" className="text-xs font-semibold fill-gray-700">Kauai</text>
                      </g>

                      {/* Oahu Island */}
                      <g transform="translate(180, 120)">
                        <path
                          d="M0,15 Q8,0 18,3 Q28,0 38,6 Q45,12 43,22 Q40,32 30,35 Q20,38 10,35 Q0,28 0,15"
                          fill={selectedZone?.island === 'oahu' ? '#3b82f6' : '#10b981'}
                          stroke="#065f46"
                          strokeWidth="1"
                          className="cursor-pointer hover:brightness-110 transition-all"
                          onClick={() => {
                            const oahuZone = riskZones.find(z => z.island === 'oahu');
                            if (oahuZone) handleZoneClick(oahuZone);
                          }}
                        />
                        {riskZones.filter(z => z.island === 'oahu').map((zone, index) => {
                          const riskValue = activeRiskType === 'overall' ? zone.overallRisk : zone.risks[activeRiskType];
                          return (
                            <circle
                              key={zone.id}
                              cx={10 + (index * 10)}
                              cy={18}
                              r="4"
                              fill={getRiskColorHex(riskValue)}
                              stroke={selectedZone?.id === zone.id ? "#3b82f6" : "#ffffff"}
                              strokeWidth={selectedZone?.id === zone.id ? "3" : "2"}
                              className="cursor-pointer hover:brightness-110 transition-all"
                              onClick={() => handleZoneClick(zone)}
                            >
                              <title>{`${zone.name}: ${getRiskLevel(riskValue)} (${riskValue}%)`}</title>
                            </circle>
                          );
                        })}
                        <text x="22" y="55" textAnchor="middle" className="text-xs font-semibold fill-gray-700">Oahu</text>
                      </g>

                      {/* Molokai Island */}
                      <g transform="translate(320, 110)">
                        <path
                          d="M0,8 Q12,0 24,2 Q36,0 48,6 Q52,12 48,18 Q36,22 24,20 Q12,22 0,18 Q-2,12 0,8"
                          fill={selectedZone?.island === 'molokai' ? '#3b82f6' : '#10b981'}
                          stroke="#065f46"
                          strokeWidth="1"
                          className="cursor-pointer hover:brightness-110 transition-all"
                          onClick={() => {
                            const molokaiZone = riskZones.find(z => z.island === 'molokai');
                            if (molokaiZone) handleZoneClick(molokaiZone);
                          }}
                        />
                        <text x="24" y="40" textAnchor="middle" className="text-xs font-semibold fill-gray-700">Molokai</text>
                      </g>

                      {/* Lanai Island */}
                      <g transform="translate(340, 160)">
                        <circle
                          cx="12"
                          cy="12"
                          r="12"
                          fill={selectedZone?.island === 'lanai' ? '#3b82f6' : '#10b981'}
                          stroke="#065f46"
                          strokeWidth="1"
                          className="cursor-pointer hover:brightness-110 transition-all"
                          onClick={() => {
                            const lanaiZone = riskZones.find(z => z.island === 'lanai');
                            if (lanaiZone) handleZoneClick(lanaiZone);
                          }}
                        />
                        <text x="12" y="40" textAnchor="middle" className="text-xs font-semibold fill-gray-700">Lanai</text>
                      </g>

                      {/* Maui Island */}
                      <g transform="translate(380, 140)">
                        <path
                          d="M0,25 Q5,10 15,8 Q25,5 35,10 Q45,8 55,15 Q60,25 55,35 Q45,45 35,42 Q25,45 15,40 Q5,45 0,35 Q-2,30 0,25"
                          fill={selectedZone?.island === 'maui' ? '#3b82f6' : '#10b981'}
                          stroke="#065f46"
                          strokeWidth="1"
                          className="cursor-pointer hover:brightness-110 transition-all"
                          onClick={() => {
                            const mauiZone = riskZones.find(z => z.island === 'maui');
                            if (mauiZone) handleZoneClick(mauiZone);
                          }}
                        />
                        <text x="30" y="70" textAnchor="middle" className="text-xs font-semibold fill-gray-700">Maui</text>
                      </g>

                      {/* Big Island (Hawaii) */}
                      <g transform="translate(550, 160)">
                        <path
                          d="M0,40 Q8,20 20,15 Q35,10 50,18 Q65,15 80,25 Q90,35 88,50 Q85,65 75,75 Q65,85 50,82 Q35,88 20,80 Q8,85 2,70 Q-2,55 0,40"
                          fill={selectedZone?.island === 'hawaii' ? '#3b82f6' : '#10b981'}
                          stroke="#065f46"
                          strokeWidth="1"
                          className="cursor-pointer hover:brightness-110 transition-all"
                          onClick={() => {
                            const hawaiiZone = riskZones.find(z => z.island === 'hawaii');
                            if (hawaiiZone) handleZoneClick(hawaiiZone);
                          }}
                        />
                        {riskZones.filter(z => z.island === 'hawaii').map((zone, index) => {
                          const riskValue = activeRiskType === 'overall' ? zone.overallRisk : zone.risks[activeRiskType];
                          const positions = [
                            { x: 25, y: 35 }, // Zone 1
                            { x: 45, y: 30 }, // Zone 2
                            { x: 20, y: 55 }, // Zone 3
                            { x: 60, y: 50 }  // Zone 4
                          ];
                          const pos = positions[index] || { x: 40, y: 45 };
                          return (
                            <circle
                              key={zone.id}
                              cx={pos.x}
                              cy={pos.y}
                              r="5"
                              fill={getRiskColorHex(riskValue)}
                              stroke={selectedZone?.id === zone.id ? "#3b82f6" : "#ffffff"}
                              strokeWidth={selectedZone?.id === zone.id ? "3" : "2"}
                              className="cursor-pointer hover:brightness-110 transition-all"
                              onClick={() => handleZoneClick(zone)}
                            >
                              <title>{`${zone.name}: ${getRiskLevel(riskValue)} (${riskValue}%)`}</title>
                            </circle>
                          );
                        })}
                        <text x="45" y="115" textAnchor="middle" className="text-xs font-semibold fill-gray-700">Big Island</text>
                      </g>

                      {/* Risk indicator for currently selected risk type */}
                      <text x="400" y="30" textAnchor="middle" className="text-lg font-bold fill-gray-700">
                        Hawaii Climate Risk Map - {activeRiskType.charAt(0).toUpperCase() + activeRiskType.slice(1)} Risk
                      </text>
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Zone Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedZone ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">{selectedZone.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedZone.island.charAt(0).toUpperCase() + selectedZone.island.slice(1)} Island
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <Mountain className="h-4 w-4" />
                            Volcanic Risk
                          </span>
                          <Badge variant={selectedZone.risks.volcanic >= 60 ? 'destructive' : 'secondary'}>
                            {getRiskLevel(selectedZone.risks.volcanic)}
                          </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Earthquake Risk
                          </span>
                          <Badge variant={selectedZone.risks.earthquake >= 60 ? 'destructive' : 'secondary'}>
                            {getRiskLevel(selectedZone.risks.earthquake)}
                          </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <Droplets className="h-4 w-4" />
                            Flood Risk
                          </span>
                          <Badge variant={selectedZone.risks.flood >= 60 ? 'destructive' : 'secondary'}>
                            {getRiskLevel(selectedZone.risks.flood)}
                          </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <Droplets className="h-4 w-4" />
                            Tsunami Risk
                          </span>
                          <Badge variant={selectedZone.risks.tsunami >= 60 ? 'destructive' : 'secondary'}>
                            {getRiskLevel(selectedZone.risks.tsunami)}
                          </Badge>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">Overall Risk Score</span>
                          <Badge variant={selectedZone.overallRisk >= 60 ? 'destructive' : 'secondary'}>
                            {selectedZone.overallRisk}%
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Population: {selectedZone.population.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ZIP Codes: {selectedZone.zipCodes.join(', ')}
                        </div>
                      </div>

                      <div className="pt-4 space-y-2">
                        <Button size="sm" className="w-full">
                          Get Quote for This Area
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          Schedule Assessment
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Click on a zone on the interactive map to view detailed risk information</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}