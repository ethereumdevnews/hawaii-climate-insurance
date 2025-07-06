import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  FileText, 
  UserCircle, 
  Check, 
  Info, 
  Shield,
  Star,
  Users,
  Upload
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { usePremiumCalculator } from "@/lib/insurance-calculator";
import { getTranslation, getCurrentLanguage } from "@/lib/i18n";
import { useLocation } from "wouter";

interface SidebarProps {
  customerId: number | null;
  onOpenQuoteModal: () => void;
  onOpenDocumentUpload: () => void;
  onOpenAdvancedFeatures: () => void;
}

export default function Sidebar({ customerId, onOpenQuoteModal, onOpenDocumentUpload, onOpenAdvancedFeatures }: SidebarProps) {
  const [insuranceType, setInsuranceType] = useState<'earthquake' | 'flood' | 'volcano'>('earthquake');
  const [coverageAmount, setCoverageAmount] = useState([100000]);
  const [island, setIsland] = useState<'oahu' | 'maui' | 'kauai' | 'molokai' | 'lanai' | 'hawaii'>('oahu');
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLanguage(getCurrentLanguage());
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);
  
  const { premium, isLoading: calculatorLoading } = usePremiumCalculator({
    insuranceType,
    coverageAmount: coverageAmount[0],
    enabled: true
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['/api/customers', customerId, 'activities'],
    enabled: !!customerId
  });

  const formatCoverageAmount = (amount: number) => {
    return `$${(amount / 1000)}K`;
  };

  const formatPremium = (amount: number) => {
    return `$${amount}/mo`;
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="insurance-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="ghost" 
            className="w-full justify-start p-3 h-auto"
            onClick={onOpenQuoteModal}
          >
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Calculator className="text-primary w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="font-medium text-neutral-900">{getTranslation('sidebar.getQuote', currentLanguage)}</p>
              <p className="text-xs text-neutral-500">{getTranslation('sidebar.quoteSubtitle', currentLanguage)}</p>
            </div>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start p-3 h-auto"
            onClick={() => setLocation('/claims')}
          >
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <FileText className="text-secondary w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="font-medium text-neutral-900">{getTranslation('sidebar.fileClaim', currentLanguage)}</p>
              <p className="text-xs text-neutral-500">{getTranslation('sidebar.claimSubtitle', currentLanguage)}</p>
            </div>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start p-3 h-auto"
            onClick={onOpenAdvancedFeatures}
          >
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <UserCircle className="text-purple-600 w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="font-medium text-neutral-900">Advanced Tools</p>
              <p className="text-xs text-neutral-500">AR, Simulation, Learning</p>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Premium Calculator */}
      <Card className="insurance-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral-900">{getTranslation('sidebar.calculator', currentLanguage)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Insurance Type
            </label>
            <Select value={insuranceType} onValueChange={(value: 'earthquake' | 'flood' | 'volcano') => setInsuranceType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="earthquake">{getTranslation('sidebar.ethquake', currentLanguage)}</SelectItem>
                <SelectItem value="flood">{getTranslation('sidebar.flood', currentLanguage)}</SelectItem>
                <SelectItem value="volcano">{getTranslation('sidebar.volcano', currentLanguage)}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Hawaiian Island
            </label>
            <Select value={island} onValueChange={(value: 'oahu' | 'maui' | 'kauai' | 'molokai' | 'lanai' | 'hawaii') => setIsland(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oahu">Oahu</SelectItem>
                <SelectItem value="maui">Maui</SelectItem>
                <SelectItem value="hawaii">Hawaii (Big Island)</SelectItem>
                <SelectItem value="kauai">Kauai</SelectItem>
                <SelectItem value="molokai">Molokai</SelectItem>
                <SelectItem value="lanai">Lanai</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Coverage Amount
            </label>
            <Slider
              value={coverageAmount}
              onValueChange={setCoverageAmount}
              max={2000000}
              min={50000}
              step={25000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-neutral-500 mt-1">
              <span>$50K</span>
              <span className="font-medium text-primary">
                {formatCoverageAmount(coverageAmount[0])}
              </span>
              <span>$2M</span>
            </div>
          </div>
          
          <div className="premium-calculator">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-600">Estimated Premium:</span>
              {calculatorLoading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <span className="text-lg font-semibold text-secondary">
                  {formatPremium(premium)}
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-1">Based on your profile and coverage</p>
          </div>
          
          <Button 
            className="w-full bg-primary text-white hover:bg-blue-700"
            onClick={onOpenQuoteModal}
          >
            Get Detailed Quote
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {customerId && (
        <Card className="insurance-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-neutral-900">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activitiesLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="activity-item">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activities && activities.length > 0 ? (
              activities.map((activity: any) => (
                <div key={activity.id} className="activity-item">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'quote_generated' ? 'bg-secondary' : 'bg-blue-500'
                  }`}>
                    {activity.type === 'quote_generated' ? (
                      <Check className="text-white w-3 h-3" />
                    ) : (
                      <Info className="text-white w-3 h-3" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900 capitalize">
                      {activity.type.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-neutral-500">{activity.description}</p>
                    <p className="text-xs text-neutral-400">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-neutral-500 py-4">
                <p className="text-sm">No recent activity</p>
                <p className="text-xs">Start by getting a quote!</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Hawaii Resources */}
      <Card className="insurance-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral-900">Hawaii Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <h5 className="font-medium text-green-900 mb-1">Climate Risk Heatmap</h5>
            <p className="text-xs text-green-700 mb-2">
              Interactive map showing volcanic, earthquake, flood & tsunami risks
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-green-700 border-green-300 hover:bg-green-100"
              onClick={() => setLocation('/risk-map')}
            >
              View Risk Map
            </Button>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-1">FEMA Flood Maps</h5>
            <p className="text-xs text-blue-700 mb-2">
              Check your property's flood zone designation
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-blue-700 border-blue-300 hover:bg-blue-100"
              onClick={() => window.open('https://msc.fema.gov/portal', '_blank')}
            >
              View FEMA Flood Maps
            </Button>
          </div>
          
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <h5 className="font-medium text-orange-900 mb-1">High-Risk Lava Zones</h5>
            <p className="text-xs text-orange-700 mb-2">
              Hawaii Property Insurance Association for high-risk properties
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-orange-700 border-orange-300 hover:bg-orange-100 text-xs"
              onClick={() => window.open('https://www.hpiainfo.com', '_blank')}
            >
              Visit HPIA
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <Card className="bg-gradient-to-r from-primary to-secondary text-white">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-white fill-current">
              {/* Shield */}
              <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" fill="currentColor"/>
            </svg>
          </div>
          <h4 className="font-semibold mb-2">ETHquake Blockchain Insurance</h4>
          <p className="text-xs opacity-80 mb-1">• Parametric earthquake insurance smart contract policies powered by EtherISC</p>
          <p className="text-sm opacity-90">ETHquake + FEMA Flood + Volcano Coverage</p>
          <p className="text-xs opacity-75 mt-2">Licensed State of Hawaii Property & Casualty, Life & Health, and Notary Public</p>
          <div className="flex justify-center items-center space-x-4 mt-4 text-xs">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>Hawaii Specialist</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
