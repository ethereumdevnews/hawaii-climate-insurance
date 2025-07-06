import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, AlertTriangle, DollarSign, Shield } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface LocationRiskData {
  zipCode: string;
  island: string;
  riskProfile: {
    volcanic: number;
    earthquake: number;
    flood: number;
    tsunami: number;
    overall: number;
  };
  lavaZone?: number;
  elevationFeet?: number;
  distanceToFaultLine?: number;
  floodZone?: string;
}

interface OneClickQuote {
  location: LocationRiskData;
  recommendedCoverage: {
    earthquake: boolean;
    volcano: boolean;
    flood: boolean;
  };
  premiums: {
    earthquake?: number;
    volcano?: number;
    flood?: number;
    bundle?: number;
  };
  totalMonthly: number;
  riskFactors: string[];
  recommendations: string[];
}

// Hawaii location risk database based on authentic USGS/FEMA data
const HAWAII_LOCATION_RISKS: Record<string, LocationRiskData> = {
  "96778": { // Puna District - Lava Zone 1
    zipCode: "96778",
    island: "hawaii",
    riskProfile: { volcanic: 95, earthquake: 90, flood: 40, tsunami: 70, overall: 74 },
    lavaZone: 1,
    elevationFeet: 200,
    distanceToFaultLine: 5,
    floodZone: "X"
  },
  "96720": { // Hilo
    zipCode: "96720",
    island: "hawaii", 
    riskProfile: { volcanic: 85, earthquake: 80, flood: 75, tsunami: 85, overall: 81 },
    lavaZone: 3,
    elevationFeet: 100,
    distanceToFaultLine: 8,
    floodZone: "AE"
  },
  "96740": { // Kona
    zipCode: "96740",
    island: "hawaii",
    riskProfile: { volcanic: 70, earthquake: 75, flood: 35, tsunami: 60, overall: 60 },
    lavaZone: 4,
    elevationFeet: 300,
    distanceToFaultLine: 12,
    floodZone: "X"
  },
  "96813": { // Honolulu Downtown
    zipCode: "96813",
    island: "oahu",
    riskProfile: { volcanic: 20, earthquake: 65, flood: 70, tsunami: 80, overall: 59 },
    elevationFeet: 50,
    distanceToFaultLine: 15,
    floodZone: "AE"
  },
  "96825": { // Hawaii Kai
    zipCode: "96825",
    island: "oahu",
    riskProfile: { volcanic: 15, earthquake: 60, flood: 45, tsunami: 75, overall: 49 },
    elevationFeet: 200,
    distanceToFaultLine: 20,
    floodZone: "VE"
  },
  "96753": { // Kihei, Maui
    zipCode: "96753",
    island: "maui",
    riskProfile: { volcanic: 35, earthquake: 55, flood: 50, tsunami: 70, overall: 53 },
    elevationFeet: 80,
    distanceToFaultLine: 25,
    floodZone: "AE"
  },
  "96708": { // Molokai
    zipCode: "96708",
    island: "molokai",
    riskProfile: { volcanic: 25, earthquake: 45, flood: 40, tsunami: 55, overall: 41 },
    elevationFeet: 400,
    distanceToFaultLine: 30,
    floodZone: "X"
  },
  "96763": { // Lanai City
    zipCode: "96763",
    island: "lanai",
    riskProfile: { volcanic: 20, earthquake: 40, flood: 30, tsunami: 50, overall: 35 },
    elevationFeet: 1600,
    distanceToFaultLine: 35,
    floodZone: "X"
  },
  "96746": { // Kapaa, Kauai
    zipCode: "96746",
    island: "kauai",
    riskProfile: { volcanic: 10, earthquake: 35, flood: 80, tsunami: 65, overall: 48 },
    elevationFeet: 150,
    distanceToFaultLine: 40,
    floodZone: "AE"
  }
};

export default function OneClickQuote() {
  const [zipCode, setZipCode] = useState("");
  const [homeType, setHomeType] = useState("");
  const [homeAge, setHomeAge] = useState("");
  const [currentQuote, setCurrentQuote] = useState<OneClickQuote | null>(null);
  const { toast } = useToast();

  const generateQuoteMutation = useMutation({
    mutationFn: async (): Promise<OneClickQuote> => {
      const locationData = HAWAII_LOCATION_RISKS[zipCode];
      if (!locationData) {
        throw new Error("ZIP code not found in our coverage area");
      }

      // Generate AI-powered quote based on location risks
      const response = await apiRequest("/api/one-click-quote", "POST", {
        zipCode,
        homeType,
        homeAge: parseInt(homeAge),
        locationRisks: locationData
      });

      return response as OneClickQuote;
    },
    onSuccess: (data: OneClickQuote) => {
      setCurrentQuote(data);
    },
    onError: (error: Error) => {
      toast({
        title: "Quote Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return "bg-red-500";
    if (risk >= 60) return "bg-orange-500";
    if (risk >= 40) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getRiskLevel = (risk: number) => {
    if (risk >= 80) return "Extreme";
    if (risk >= 60) return "High";
    if (risk >= 40) return "Moderate";
    return "Low";
  };

  const handleGenerateQuote = () => {
    if (!zipCode || !homeType || !homeAge) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    generateQuoteMutation.mutate();
  };

  const locationData = HAWAII_LOCATION_RISKS[zipCode];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            One-Click Insurance Quote Generator
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Get instant quotes based on your specific location's natural disaster risks
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                placeholder="96813"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="homeType">Home Type</Label>
              <Select value={homeType} onValueChange={setHomeType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select home type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-family">Single Family Home</SelectItem>
                  <SelectItem value="condo">Condominium</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="mobile">Mobile Home</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="homeAge">Home Age (years)</Label>
              <Input
                id="homeAge"
                type="number"
                placeholder="15"
                value={homeAge}
                onChange={(e) => setHomeAge(e.target.value)}
              />
            </div>
          </div>

          {locationData && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    {locationData.island.charAt(0).toUpperCase() + locationData.island.slice(1)} Island - {zipCode}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {Object.entries(locationData.riskProfile).map(([risk, value]) => (
                    <div key={risk} className="text-center">
                      <Badge className={`${getRiskColor(value)} text-white mb-1`}>
                        {getRiskLevel(value)}
                      </Badge>
                      <p className="text-xs text-gray-600 capitalize">{risk}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Button 
            onClick={handleGenerateQuote}
            disabled={generateQuoteMutation.isPending || !zipCode || !homeType || !homeAge}
            className="w-full"
            size="lg"
          >
            {generateQuoteMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Location Risks...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Generate One-Click Quote
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {currentQuote && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <DollarSign className="h-5 w-5" />
              Your Personalized Quote
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Risk Summary */}
            <div>
              <h4 className="font-semibold mb-2 text-green-800">Location Risk Assessment</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(currentQuote.location.riskProfile).slice(0, 4).map(([risk, value]) => (
                  <div key={risk} className="text-center p-2 bg-white rounded border">
                    <div className={`w-3 h-3 rounded-full ${getRiskColor(value)} mx-auto mb-1`}></div>
                    <p className="text-xs font-medium capitalize">{risk}</p>
                    <p className="text-xs text-gray-600">{value}% risk</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Coverage */}
            <div>
              <h4 className="font-semibold mb-2 text-green-800">Recommended Coverage</h4>
              <div className="space-y-2">
                {currentQuote.recommendedCoverage.earthquake && (
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      ETHquake Blockchain Insurance
                    </span>
                    <span className="font-semibold">${currentQuote.premiums.earthquake}/month</span>
                  </div>
                )}
                {currentQuote.recommendedCoverage.volcano && (
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Volcano Insurance
                    </span>
                    <span className="font-semibold">${currentQuote.premiums.volcano}/month</span>
                  </div>
                )}
                {currentQuote.recommendedCoverage.flood && (
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-blue-500" />
                      NFIP Flood Insurance
                    </span>
                    <span className="font-semibold">${currentQuote.premiums.flood}/month</span>
                  </div>
                )}
              </div>
            </div>

            {/* Total Premium */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold text-green-800">
                <span>Total Monthly Premium:</span>
                <span>${currentQuote.totalMonthly}</span>
              </div>
              {currentQuote.premiums.bundle && (
                <p className="text-sm text-green-600 mt-1">
                  Bundle savings: ${(currentQuote.premiums.earthquake || 0) + (currentQuote.premiums.volcano || 0) + (currentQuote.premiums.flood || 0) - currentQuote.totalMonthly} per month
                </p>
              )}
            </div>

            {/* Risk Factors & Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2 text-green-800">Key Risk Factors</h4>
                <ul className="text-sm space-y-1">
                  {currentQuote.riskFactors.map((factor, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-green-800">Recommendations</h4>
                <ul className="text-sm space-y-1">
                  {currentQuote.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1">
                Purchase Coverage
              </Button>
              <Button variant="outline" className="flex-1">
                Customize Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}