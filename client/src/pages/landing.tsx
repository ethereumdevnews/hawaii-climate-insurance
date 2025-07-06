import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Users, Globe } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="px-6 py-4 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Aloha Shield AI</span>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => window.location.href = '/home'}>
              Demo
            </Button>
            <Button onClick={() => window.location.href = '/api/login'}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            ETHquake Blockchain Insurance for Hawaii
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Revolutionary blockchain-based parametric insurance with EtherISC smart contracts. 
            Licensed Hawaii Property & Casualty coverage for earthquake, volcano, and flood risks.
          </p>
          <div className="space-x-4">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              onClick={() => window.location.href = '/api/login'}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-3"
              onClick={() => window.location.href = '/home'}
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Blockchain ETHquake</CardTitle>
                <CardDescription>
                  Decentralized parametric earthquake insurance with instant smart contract payouts
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Hawaii Licensed Coverage</CardTitle>
                <CardDescription>
                  State-licensed Property & Casualty protection for volcanoes, earthquakes, and FEMA floods
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Globe className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Local Expertise</CardTitle>
                <CardDescription>
                  Built specifically for Hawaii residents with deep understanding of local risks and regulations
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Experience the Future of Insurance
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join Hawaii residents protected by blockchain technology and AI-powered risk assessment
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => window.location.href = '/api/login'}
          >
            Sign In to Get Started
          </Button>
        </div>
      </section>
    </div>
  );
}