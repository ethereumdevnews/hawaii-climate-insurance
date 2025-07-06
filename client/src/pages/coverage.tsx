import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Waves, Mountain } from "lucide-react";

export default function Coverage() {
  const coverageTypes = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "ETHquake Insurance",
      subtitle: "Blockchain Parametric Coverage",
      description: "Revolutionary earthquake insurance powered by Ethereum smart contracts with automated claims processing based on seismic data triggers.",
      features: [
        "Instant payouts when earthquake parameters are met",
        "Transparent blockchain technology",
        "Lower costs through automation",
        "No traditional claims process delays"
      ],
      coverage: "Up to $2,000,000",
      premium: "Starting at $45/month",
      available: true
    },
    {
      icon: <Waves className="w-6 h-6" />,
      title: "FEMA Flood Insurance",
      subtitle: "Federal Flood Coverage",
      description: "Comprehensive flood protection through the National Flood Insurance Program, including tsunami and heavy rainfall coverage specific to Hawaii.",
      features: [
        "FEMA flood zone mapping compliance",
        "Tsunami protection coverage",
        "Heavy rainfall and storm surge protection",
        "Federal backing and guarantee"
      ],
      coverage: "Up to $250,000 structure / $100,000 contents",
      premium: "Starting at $65/month",
      available: true
    },
    {
      icon: <Mountain className="w-6 h-6" />,
      title: "Volcano Insurance",
      subtitle: "HPIA Lava Coverage",
      description: "Essential volcano and lava coverage for high-risk zones through the Hawaii Property Insurance Association, providing protection where private insurers don't.",
      features: [
        "Lava flow damage protection",
        "Volcanic ash and debris coverage",
        "Fire and explosion from volcanic activity",
        "HPIA insurer of last resort protection"
      ],
      coverage: "Up to $1,500,000",
      premium: "Starting at $85/month",
      available: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hawaii Climate Insurance Coverage
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive protection against Hawaii's unique natural disaster risks with innovative blockchain technology and traditional federal coverage options.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {coverageTypes.map((coverage, index) => (
            <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-blue-600">
                    {coverage.icon}
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {coverage.title}
                </CardTitle>
                <p className="text-sm text-blue-600 font-medium">
                  {coverage.subtitle}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {coverage.description}
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm">Key Features:</h4>
                  <ul className="space-y-1">
                    {coverage.features.map((feature, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Coverage Limit:</span>
                    <span className="text-sm font-bold text-gray-900">{coverage.coverage}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Premium:</span>
                    <span className="text-sm font-bold text-blue-600">{coverage.premium}</span>
                  </div>
                </div>

                <div className="pt-4">
                  {coverage.available ? (
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Get Quote
                    </Button>
                  ) : (
                    <Button disabled className="w-full">
                      Coming Soon
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                Why Choose Aloha Shield AI?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <Shield className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Hawaii Specialized</h3>
                  <p className="text-sm text-blue-100">
                    Purpose-built for Hawaii's unique geological and climate risks
                  </p>
                </div>
                <div className="text-center">
                  <Zap className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Blockchain Innovation</h3>
                  <p className="text-sm text-blue-100">
                    Cutting-edge parametric insurance with instant automated payouts
                  </p>
                </div>
                <div className="text-center">
                  <Badge className="w-8 h-8 mx-auto mb-3 bg-white/20" />
                  <h3 className="font-semibold mb-2">Licensed & Trusted</h3>
                  <p className="text-sm text-blue-100">
                    State of Hawaii licensed Property & Casualty, Life & Health
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}