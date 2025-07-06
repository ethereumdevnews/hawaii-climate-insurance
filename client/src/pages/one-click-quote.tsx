import Header from "@/components/header";
import OneClickQuote from "@/components/one-click-quote";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import hpiaMapImage from "@assets/Image 1_1751009870268.jpeg";

export default function OneClickQuotePage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              One-Click Insurance Quote
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get instant insurance quotes based on your property's specific location risks. 
              Our AI analyzes USGS volcanic hazard data, FEMA flood zones, and earthquake risks 
              to provide accurate coverage recommendations.
            </p>
          </div>
          


          <OneClickQuote />
        </div>
      </div>
    </div>
  );
}