import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, FileText, Camera, Clock, CheckCircle, XCircle } from "lucide-react";

export default function Claims() {
  const [claimType, setClaimType] = useState("");

  const recentClaims = [
    {
      id: "CLM-2025-001",
      type: "ETHquake",
      status: "approved",
      amount: "$45,000",
      date: "2025-06-20",
      description: "Magnitude 6.2 earthquake damage to foundation"
    },
    {
      id: "CLM-2025-002", 
      type: "Flood",
      status: "processing",
      amount: "$23,500",
      date: "2025-06-18",
      description: "Heavy rainfall flooding in Hilo area"
    },
    {
      id: "CLM-2025-003",
      type: "Volcano",
      status: "pending",
      amount: "$78,000",
      date: "2025-06-15",
      description: "Lava flow damage to property structure"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case "denied":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "denied":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Claims Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            File new claims and track existing ones for your Hawaii natural disaster insurance coverage.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File New Claim */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                File New Claim
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Claim Type
                </label>
                <Select value={claimType} onValueChange={setClaimType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select insurance type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ethquake">ETHquake Insurance</SelectItem>
                    <SelectItem value="flood">FEMA Flood Insurance</SelectItem>
                    <SelectItem value="volcano">Volcano Insurance (HPIA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Policy Number
                </label>
                <Input placeholder="Enter your policy number" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Loss
                </label>
                <Input type="date" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Damage Amount
                </label>
                <Input placeholder="$0.00" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description of Damage
                </label>
                <Textarea 
                  placeholder="Describe the damage and circumstances..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload photos of damage</p>
                <Button variant="outline" size="sm">
                  Choose Files
                </Button>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Submit Claim
              </Button>

              {claimType === "ethquake" && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">ETHquake Blockchain Claims</h4>
                  <p className="text-sm text-blue-700">
                    ETHquake claims may be automatically processed based on seismic data triggers. 
                    If earthquake parameters are met, your claim could be approved instantly.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Claims */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Recent Claims
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentClaims.map((claim) => (
                  <div key={claim.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{claim.id}</h4>
                        <p className="text-sm text-gray-600">{claim.type} Insurance</p>
                      </div>
                      <Badge className={`flex items-center space-x-1 ${getStatusColor(claim.status)}`}>
                        {getStatusIcon(claim.status)}
                        <span className="capitalize">{claim.status}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{claim.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Filed: {claim.date}</span>
                      <span className="font-medium text-gray-900">{claim.amount}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  View All Claims
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Claims Process Info */}
        <Card className="bg-gradient-to-r from-blue-600 to-teal-600 text-white mt-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Claims Processing Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">ETHquake Claims</h3>
                <p className="text-sm text-blue-100">
                  Automated processing based on seismic data. Instant payouts when earthquake parameters are verified on blockchain.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">FEMA Flood Claims</h3>
                <p className="text-sm text-blue-100">
                  Standard NFIP processing timeline. Federal backing ensures reliable claim resolution within 30 days.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Volcano Claims (HPIA)</h3>
                <p className="text-sm text-blue-100">
                  HPIA specialized review for volcanic damage. Comprehensive evaluation for lava flow and volcanic activity claims.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}