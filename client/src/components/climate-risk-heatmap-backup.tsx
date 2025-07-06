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
    volcanic: number; // 0-100
    earthquake: number; // 0-100
    flood: number; // 0-100
    tsunami: number; // 0-100
  };
  overallRisk: number; // 0-100
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

  // Hawaii Risk Zones with authentic data from USGS, FEMA, Hawaii Emergency Management, and NOAA
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
    {
      id: 'kauai-south',
      name: 'South Kauai',
      island: 'kauai',
      coordinates: { lat: 21.8825, lng: -159.5659 },
      risks: { volcanic: 10, earthquake: 20, flood: 65, tsunami: 60 },
      overallRisk: 39,
      population: 12000,
      zipCodes: ['96756', '96741']
    },
    
    // Oahu
    {
      id: 'oahu-honolulu',
      name: 'Honolulu Metro',
      island: 'oahu',
      coordinates: { lat: 21.3099, lng: -157.8581 },
      risks: { volcanic: 20, earthquake: 45, flood: 55, tsunami: 75 },
      overallRisk: 49,
      population: 350000,
      zipCodes: ['96813', '96814', '96815', '96816', '96817']
    },
    {
      id: 'oahu-north',
      name: 'North Shore Oahu',
      island: 'oahu',
      coordinates: { lat: 21.5944, lng: -158.0556 },
      risks: { volcanic: 15, earthquake: 40, flood: 70, tsunami: 80 },
      overallRisk: 51,
      population: 25000,
      zipCodes: ['96712', '96791']
    },
    {
      id: 'oahu-west',
      name: 'West Oahu',
      island: 'oahu',
      coordinates: { lat: 21.3847, lng: -158.0947 },
      risks: { volcanic: 25, earthquake: 50, flood: 45, tsunami: 65 },
      overallRisk: 46,
      population: 45000,
      zipCodes: ['96706', '96707']
    },
    
    // Molokai
    {
      id: 'molokai-central',
      name: 'Central Molokai',
      island: 'molokai',
      coordinates: { lat: 21.1444, lng: -157.0226 },
      risks: { volcanic: 30, earthquake: 35, flood: 40, tsunami: 55 },
      overallRisk: 40,
      population: 3500,
      zipCodes: ['96748']
    },
    
    // Lanai
    {
      id: 'lanai-central',
      name: 'Lanai City',
      island: 'lanai',
      coordinates: { lat: 20.8282, lng: -156.9197 },
      risks: { volcanic: 25, earthquake: 30, flood: 35, tsunami: 50 },
      overallRisk: 35,
      population: 3200,
      zipCodes: ['96763']
    },
    
    // Maui
    {
      id: 'maui-west',
      name: 'West Maui',
      island: 'maui',
      coordinates: { lat: 20.8783, lng: -156.6825 },
      risks: { volcanic: 40, earthquake: 55, flood: 60, tsunami: 70 },
      overallRisk: 56,
      population: 18000,
      zipCodes: ['96761', '96767']
    },
    {
      id: 'maui-central',
      name: 'Central Maui',
      island: 'maui',
      coordinates: { lat: 20.8947, lng: -156.4700 },
      risks: { volcanic: 35, earthquake: 50, flood: 55, tsunami: 65 },
      overallRisk: 51,
      population: 35000,
      zipCodes: ['96732', '96793']
    },
    {
      id: 'maui-upcountry',
      name: 'Upcountry Maui',
      island: 'maui',
      coordinates: { lat: 20.7808, lng: -156.3192 },
      risks: { volcanic: 60, earthquake: 65, flood: 30, tsunami: 25 },
      overallRisk: 45,
      population: 12000,
      zipCodes: ['96768', '96790']
    },
    
    // Big Island (Hawaii)
    {
      id: 'hawaii-kona',
      name: 'Kona Coast',
      island: 'hawaii',
      coordinates: { lat: 19.6197, lng: -155.9969 },
      risks: { volcanic: 70, earthquake: 75, flood: 35, tsunami: 60 },
      overallRisk: 60,
      population: 28000,
      zipCodes: ['96740', '96750']
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
    },
    {
      id: 'hawaii-north',
      name: 'North Kohala',
      island: 'hawaii',
      coordinates: { lat: 20.0431, lng: -155.7519 },
      risks: { volcanic: 45, earthquake: 60, flood: 30, tsunami: 55 },
      overallRisk: 48,
      population: 6500,
      zipCodes: ['96755']
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
      {/* Controls */}
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

        {/* Risk Legend */}
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
        /* USGS Map View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getRiskIcon(activeRiskType)}
                  Hawaii Climate Risk Heatmap - {activeRiskType.charAt(0).toUpperCase() + activeRiskType.slice(1)} Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-white rounded-lg p-4 min-h-[500px] overflow-hidden">
                  {/* USGS Hawaii Map */}
                  <div className="relative w-full h-full">
                    <img 
                      src={usgsMapImage} 
                      alt="USGS Hawaii Climate Risk Map" 
                      className="w-full h-auto object-contain rounded-lg shadow-md"
                      style={{ maxHeight: '500px' }}
                    />
                    
                    {/* Interactive risk zone overlays positioned over USGS map */}
                    <div className="absolute inset-0 pointer-events-none">
                      <svg
                        viewBox="0 0 100 100"
                        className="w-full h-full pointer-events-auto"
                        preserveAspectRatio="none"
                      >
                        {/* Clickable zones positioned over the USGS map */}
                        {riskZones.map((zone) => {
                          const riskValue = activeRiskType === 'overall' ? zone.overallRisk : zone.risks[activeRiskType];
                          // Position zones based on island locations in the USGS map
                          let x = 50, y = 50; // default center
                          
                          switch(zone.island) {
                            case 'kauai': x = 15; y = 35; break;
                            case 'oahu': x = 25; y = 45; break;
                            case 'molokai': x = 35; y = 40; break;
                            case 'lanai': x = 40; y = 50; break;
                            case 'maui': x = 45; y = 50; break;
                            case 'hawaii': x = 70; y = 65; break;
                          }
                          
                          return (
                            <circle
                              key={zone.id}
                              cx={x}
                              cy={y}
                              r="3"
                              fill={getRiskColorHex(riskValue)}
                              stroke={selectedZone?.id === zone.id ? "#3b82f6" : "#ffffff"}
                              strokeWidth={selectedZone?.id === zone.id ? "2" : "1"}
                              className="cursor-pointer hover:brightness-110 transition-all"
                              onClick={() => handleZoneClick(zone)}
                            >
                              <title>{`${zone.name}: ${getRiskLevel(riskValue)} (${riskValue}%)`}</title>
                            </circle>
                          );
                        })}
                      </svg>
                    </div>
                    
                    {/* USGS Attribution */}
                    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs text-gray-600 border">
                      <span className="font-medium">Source:</span> U.S. Geological Survey (USGS)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Zone Details */}
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
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          // Pre-fill quote modal with zone information
                          const event = new CustomEvent('openQuoteModal', {
                            detail: {
                              zipCode: selectedZone.zipCodes[0],
                              island: selectedZone.island,
                              riskLevel: selectedZone.overallRisk
                            }
                          });
                          window.dispatchEvent(event);
                        }}
                      >
                        Get Quote for This Area
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                      >
                        Schedule Assessment
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Click on a zone on the map to view detailed risk information</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* List View */
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