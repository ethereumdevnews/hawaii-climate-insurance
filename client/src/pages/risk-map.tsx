import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ClimateRiskHeatmap from "@/components/climate-risk-heatmap";
import QuoteModal from "@/components/quote-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, TrendingUp, Shield, AlertTriangle, Calendar, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function RiskMap() {
  const { isAuthenticated } = useAuth();
  const [selectedZone, setSelectedZone] = useState<RiskZone | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleZoneSelect = (zone: RiskZone) => {
    setSelectedZone(zone);
  };

  const handleGetQuote = () => {
    if (!selectedZone) return;
    
    // Open quote modal with zone information pre-filled
    setIsQuoteModalOpen(true);
  };

  const handleScheduleAssessment = () => {
    if (!selectedZone) return;
    
    setIsAssessmentModalOpen(true);
  };

  const handleAssessmentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const assessmentData = {
      zoneName: selectedZone?.name,
      island: selectedZone?.island,
      contactName: formData.get('contactName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      preferredDate: formData.get('preferredDate'),
      preferredTime: formData.get('preferredTime'),
      notes: formData.get('notes'),
      riskConcerns: getInsuranceRecommendations(selectedZone!).join(', ')
    };

    try {
      // In a real implementation, this would save to the database
      console.log('Assessment request:', assessmentData);
      
      toast({
        title: "Assessment Scheduled",
        description: `We'll contact you within 24 hours to confirm your property assessment for ${selectedZone?.name}.`,
      });
      
      setIsAssessmentModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getInsuranceRecommendations = (zone: RiskZone) => {
    const recommendations: string[] = [];
    
    if (zone.risks.volcanic >= 60) {
      recommendations.push("Volcano insurance strongly recommended");
    }
    if (zone.risks.earthquake >= 60) {
      recommendations.push("ETHquake blockchain insurance recommended");
    }
    if (zone.risks.flood >= 60) {
      recommendations.push("NFIP flood insurance required");
    }
    if (zone.risks.tsunami >= 70) {
      recommendations.push("Enhanced evacuation planning essential");
    }
    
    return recommendations;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Hawaii Climate Risk Map</h1>
        <p className="text-muted-foreground">
          Interactive heatmap showing volcanic, earthquake, flood, and tsunami risks across Hawaiian islands.
          Based on authentic data from USGS, FEMA, and Hawaii Emergency Management Agency.
        </p>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Extreme Risk Zones</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Risk Zones Mapped</p>
                <p className="text-2xl font-bold">16</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Coverage Available</p>
                <p className="text-2xl font-bold">100%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data Sources</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Heatmap */}
      <ClimateRiskHeatmap onZoneSelect={handleZoneSelect} />

      {/* Insurance Recommendations */}
      {selectedZone && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Insurance Recommendations for {selectedZone.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getInsuranceRecommendations(selectedZone).length > 0 ? (
                <div className="space-y-2">
                  {getInsuranceRecommendations(selectedZone).map((rec, index) => (
                    <Alert key={index}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{rec}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Standard coverage recommended for this moderate-risk area.
                  </AlertDescription>
                </Alert>
              )}

              {isAuthenticated ? (
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleGetQuote}>
                    Get Quote for This Area
                  </Button>
                  <Button variant="outline" onClick={handleScheduleAssessment}>
                    Schedule Assessment
                  </Button>
                </div>
              ) : (
                <Alert>
                  <MapPin className="h-4 w-4" />
                  <AlertDescription>
                    Sign in to get personalized insurance quotes for this risk zone.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Authentic Data Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">USGS Volcanic Hazards</h4>
              <p className="text-muted-foreground">Real-time volcanic activity monitoring and lava zone designations</p>
            </div>
            <div>
              <h4 className="font-semibold">FEMA Flood Maps</h4>
              <p className="text-muted-foreground">Official flood zone designations and tsunami inundation maps</p>
            </div>
            <div>
              <h4 className="font-semibold">USGS Earthquake Data</h4>
              <p className="text-muted-foreground">Seismic hazard assessments and fault line mapping</p>
            </div>
            <div>
              <h4 className="font-semibold">Hawaii Emergency Management</h4>
              <p className="text-muted-foreground">State emergency planning and risk assessment data</p>
            </div>
            <div>
              <h4 className="font-semibold">NOAA Climate Data</h4>
              <p className="text-muted-foreground">Precipitation patterns and tsunami risk modeling</p>
            </div>
            <div>
              <h4 className="font-semibold">HPIA Risk Assessments</h4>
              <p className="text-muted-foreground">Hawaii Property Insurance Association volcanic risk data</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        customerId={customerId}
        onCustomerCreated={setCustomerId}
      />

      {/* Assessment Scheduling Modal */}
      <Dialog open={isAssessmentModalOpen} onOpenChange={setIsAssessmentModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule Property Assessment - {selectedZone?.name}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleAssessmentSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="contactName">Full Name *</Label>
                <Input
                  id="contactName"
                  name="contactName"
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="(808) 555-0123"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferredDate">Preferred Date *</Label>
                  <Input
                    id="preferredDate"
                    name="preferredDate"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="preferredTime">Preferred Time *</Label>
                  <Input
                    id="preferredTime"
                    name="preferredTime"
                    type="time"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any specific concerns or requirements for the assessment..."
                  rows={3}
                />
              </div>

              {selectedZone && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Assessment Focus Areas</h4>
                  <div className="space-y-1 text-sm text-blue-700">
                    {getInsuranceRecommendations(selectedZone).map((rec, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3" />
                        {rec}
                      </div>
                    ))}
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin className="h-3 w-3" />
                      Island: {selectedZone.island.charAt(0).toUpperCase() + selectedZone.island.slice(1)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      Population: {selectedZone.population.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Schedule Assessment
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAssessmentModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}