import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Camera, 
  Scan, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  Target,
  Ruler,
  Home,
  Shield,
  Zap,
  Wind
} from "lucide-react";

interface RiskAssessment {
  riskType: 'volcano' | 'earthquake' | 'flood' | 'hurricane';
  riskLevel: 'low' | 'moderate' | 'high' | 'extreme';
  confidence: number;
  factors: string[];
  recommendations: string[];
}

interface PropertyAnalysis {
  foundationType: string;
  roofMaterial: string;
  structuralIntegrity: number;
  proximityToHazards: {
    volcano: number;
    fault: number;
    coast: number;
  };
  elevationFeet: number;
  vegetationDensity: number;
  assessmentComplete: boolean;
}

export default function ARPropertyAssessment() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [analysis, setAnalysis] = useState<PropertyAnalysis | null>(null);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Camera access required for AR property assessment');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate AR scanning process
    const scanInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(scanInterval);
          setIsScanning(false);
          generateAnalysis();
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const generateAnalysis = () => {
    // Simulate property analysis results
    const mockAnalysis: PropertyAnalysis = {
      foundationType: 'Concrete Slab',
      roofMaterial: 'Metal Roofing',
      structuralIntegrity: 85,
      proximityToHazards: {
        volcano: 12.5, // miles
        fault: 3.2,    // miles
        coast: 0.8     // miles
      },
      elevationFeet: 150,
      vegetationDensity: 65,
      assessmentComplete: true
    };

    const mockRiskAssessments: RiskAssessment[] = [
      {
        riskType: 'volcano',
        riskLevel: 'high',
        confidence: 0.85,
        factors: [
          'Lava Zone 2 location',
          'Downslope from Kilauea',
          'Previous lava flow path nearby',
          'Volcanic gas exposure risk'
        ],
        recommendations: [
          'Install volcanic ash barriers',
          'Consider HPIA volcano insurance',
          'Create evacuation plan',
          'Seal windows and ventilation'
        ]
      },
      {
        riskType: 'earthquake',
        riskLevel: 'moderate',
        confidence: 0.72,
        factors: [
          'Moderate seismic zone',
          'Good foundation type',
          'Distance from major fault',
          'Newer construction standards'
        ],
        recommendations: [
          'Secure heavy furniture',
          'Install automatic gas shutoffs',
          'Consider ETHquake blockchain insurance',
          'Retrofit older sections if any'
        ]
      },
      {
        riskType: 'flood',
        riskLevel: 'moderate',
        confidence: 0.68,
        factors: [
          'Close to coastline',
          'Moderate elevation',
          'Tsunami evacuation zone',
          'Heavy rainfall risk'
        ],
        recommendations: [
          'FEMA flood insurance required',
          'Install flood barriers',
          'Elevate utilities',
          'Create flood evacuation plan'
        ]
      },
      {
        riskType: 'hurricane',
        riskLevel: 'high',
        confidence: 0.78,
        factors: [
          'Exposed coastal location',
          'High wind exposure',
          'Storm surge risk',
          'Debris impact potential'
        ],
        recommendations: [
          'Install storm shutters',
          'Reinforce roof connections',
          'Trim vegetation regularly',
          'Stock emergency supplies'
        ]
      }
    ];

    setAnalysis(mockAnalysis);
    setRiskAssessments(mockRiskAssessments);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'extreme': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskIcon = (type: string) => {
    switch (type) {
      case 'volcano': return '🌋';
      case 'earthquake': return '🏔️';
      case 'flood': return '🌊';
      case 'hurricane': return '🌀';
      default: return '⚠️';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-6 h-6 text-primary" />
            <span>Augmented Reality Property Risk Assessment</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Camera Interface */}
          <div className="relative">
            <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ display: cameraActive ? 'block' : 'none' }}
              />
              
              {!cameraActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-4">AR Property Assessment</p>
                    <Button onClick={startCamera} className="bg-primary hover:bg-primary/90">
                      <Camera className="w-4 h-4 mr-2" />
                      Start Camera
                    </Button>
                  </div>
                </div>
              )}

              {/* AR Overlay */}
              {cameraActive && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Scanning reticle */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-32 h-32 border-2 border-primary rounded-lg animate-pulse">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>
                    </div>
                  </div>

                  {/* Feature detection markers */}
                  {analysis && (
                    <>
                      <div className="absolute top-20 left-10 pointer-events-auto">
                        <Badge className="bg-blue-500 text-white">
                          <Home className="w-3 h-3 mr-1" />
                          Foundation: {analysis.foundationType}
                        </Badge>
                      </div>
                      <div className="absolute top-20 right-10 pointer-events-auto">
                        <Badge className="bg-green-500 text-white">
                          <Ruler className="w-3 h-3 mr-1" />
                          Elevation: {analysis.elevationFeet}ft
                        </Badge>
                      </div>
                      <div className="absolute bottom-20 left-10 pointer-events-auto">
                        <Badge className="bg-purple-500 text-white">
                          <Target className="w-3 h-3 mr-1" />
                          Integrity: {analysis.structuralIntegrity}%
                        </Badge>
                      </div>
                    </>
                  )}

                  {/* Scanning progress */}
                  {isScanning && (
                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-64">
                      <div className="bg-black/70 text-white p-3 rounded-lg">
                        <p className="text-sm text-center mb-2">Scanning Property...</p>
                        <Progress value={scanProgress} className="h-2" />
                        <p className="text-xs text-center mt-1">{scanProgress}% Complete</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Camera Controls */}
            {cameraActive && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                <Button
                  onClick={startScan}
                  disabled={isScanning || !!analysis}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Scan className="w-4 h-4 mr-2" />
                  {isScanning ? 'Scanning...' : 'Start Assessment'}
                </Button>
                <Button onClick={stopCamera} variant="outline">
                  Stop Camera
                </Button>
              </div>
            )}
          </div>

          {/* Analysis Results */}
          {analysis && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
                <TabsTrigger value="structure">Structure</TabsTrigger>
                <TabsTrigger value="insurance">Insurance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Home className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm text-neutral-600">Foundation</p>
                      <p className="font-semibold">{analysis.foundationType}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Shield className="w-8 h-8 mx-auto mb-2 text-green-500" />
                      <p className="text-sm text-neutral-600">Structural Integrity</p>
                      <p className="font-semibold">{analysis.structuralIntegrity}%</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <MapPin className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                      <p className="text-sm text-neutral-600">Elevation</p>
                      <p className="font-semibold">{analysis.elevationFeet} ft</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Wind className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                      <p className="text-sm text-neutral-600">Roof Material</p>
                      <p className="font-semibold">{analysis.roofMaterial}</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Hazard Proximity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>🌋 Nearest Volcano</span>
                        <span className="font-semibold">{analysis.proximityToHazards.volcano} miles</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>🏔️ Nearest Fault Line</span>
                        <span className="font-semibold">{analysis.proximityToHazards.fault} miles</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>🌊 Distance to Coast</span>
                        <span className="font-semibold">{analysis.proximityToHazards.coast} miles</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="risks" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {riskAssessments.map((risk, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <span className="text-2xl">{getRiskIcon(risk.riskType)}</span>
                          <span className="capitalize">{risk.riskType} Risk</span>
                          <Badge className={getRiskColor(risk.riskLevel)}>
                            {risk.riskLevel}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm text-neutral-600 mb-2">
                            Confidence: {(risk.confidence * 100).toFixed(0)}%
                          </p>
                          <Progress value={risk.confidence * 100} />
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Risk Factors:</h4>
                          <ul className="text-sm space-y-1">
                            {risk.factors.map((factor, i) => (
                              <li key={i} className="flex items-center space-x-2">
                                <AlertTriangle className="w-3 h-3 text-orange-500" />
                                <span>{factor}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Recommendations:</h4>
                          <ul className="text-sm space-y-1">
                            {risk.recommendations.map((rec, i) => (
                              <li key={i} className="flex items-center space-x-2">
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="structure" className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Structural assessment based on visual analysis. Professional inspection recommended for detailed evaluation.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Foundation Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-semibold">{analysis.foundationType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Condition:</span>
                        <Badge className="bg-green-100 text-green-800">Good</Badge>
                      </div>
                      <div>
                        <span>Earthquake Resistance:</span>
                        <Progress value={78} className="mt-2" />
                        <p className="text-xs text-neutral-600 mt-1">78% - Above Average</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Roof Assessment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Material:</span>
                        <span className="font-semibold">{analysis.roofMaterial}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wind Resistance:</span>
                        <Badge className="bg-blue-100 text-blue-800">Excellent</Badge>
                      </div>
                      <div>
                        <span>Hurricane Rating:</span>
                        <Progress value={92} className="mt-2" />
                        <p className="text-xs text-neutral-600 mt-1">92% - Hurricane Resistant</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="insurance" className="space-y-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Insurance Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="text-blue-800 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-white rounded-lg border">
                        <h4 className="font-semibold mb-2">🌋 Volcano Coverage</h4>
                        <p className="text-sm mb-2">HPIA Required</p>
                        <p className="text-xs">Lava zone 2 location requires state coverage</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg border">
                        <h4 className="font-semibold mb-2">🏔️ ETHquake</h4>
                        <p className="text-sm mb-2">Recommended</p>
                        <p className="text-xs">Blockchain parametric coverage ideal</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg border">
                        <h4 className="font-semibold mb-2">🌊 Flood (FEMA)</h4>
                        <p className="text-sm mb-2">Required</p>
                        <p className="text-xs">Coastal location mandates coverage</p>
                      </div>
                    </div>

                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <strong>Estimated Coverage:</strong> Based on AR assessment, recommended total coverage is $450,000 - $650,000 with combined premium of $285-$420/month.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}