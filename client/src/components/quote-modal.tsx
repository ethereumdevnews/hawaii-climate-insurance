import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const quoteFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  zipCode: z.string().min(5, "Hawaii ZIP code required"),
  island: z.enum(['oahu', 'maui', 'kauai', 'molokai', 'lanai', 'hawaii'], {
    required_error: "Please select your island"
  }),
  homeType: z.enum(['single-family', 'condo', 'townhouse', 'apartment']),
  homeAge: z.number().min(0).max(200),
  foundationType: z.enum(['concrete-slab', 'raised-foundation', 'basement', 'pier-beam']),
  earthquakeRiskZone: z.enum(['high', 'moderate', 'low']).optional(),
  distanceToFaultLine: z.number().min(0).max(100).optional(),
  insuranceType: z.enum(['earthquake', 'flood', 'volcano']),
  coverageAmount: z.number().min(50000).max(2000000),
  floodZone: z.string().optional(),
  elevationFeet: z.number().min(0).max(14000).optional(),
  lavaZone: z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9']).optional(),
  distanceToVolcano: z.number().min(0).max(200).optional(),
});

type QuoteFormData = z.infer<typeof quoteFormSchema>;

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: number | null;
  onCustomerCreated: (customerId: number) => void;
}

export default function QuoteModal({ 
  isOpen, 
  onClose, 
  customerId, 
  onCustomerCreated 
}: QuoteModalProps) {
  const [step, setStep] = useState(1);
  const [quoteResult, setQuoteResult] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      insuranceType: 'earthquake',
      coverageAmount: 250000,
      homeType: 'single-family',
      homeAge: 20,
      foundationType: 'concrete-slab',
      earthquakeRiskZone: 'moderate',
      distanceToFaultLine: 5,
      elevationFeet: 100,
      lavaZone: '3',
      distanceToVolcano: 10,
    }
  });

  const quoteMutation = useMutation({
    mutationFn: async (data: QuoteFormData) => {
      const quoteData = {
        customerInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || "",
          dateOfBirth: data.dateOfBirth,
          zipCode: data.zipCode,
          island: data.island,
          homeType: data.homeType,
          homeAge: data.homeAge,
          foundationType: data.foundationType,
          earthquakeRiskZone: data.earthquakeRiskZone,
          distanceToFaultLine: data.distanceToFaultLine,
        },
        insuranceType: data.insuranceType,
        coverageAmount: data.coverageAmount,
        propertyInfo: {
          homeType: data.homeType,
          homeAge: data.homeAge,
          foundationType: data.foundationType,
          floodZone: data.floodZone,
          elevationFeet: data.elevationFeet,
          lavaZone: data.lavaZone,
          distanceToVolcano: data.distanceToVolcano,
        }
      };

      const response = await apiRequest('POST', '/api/quotes', quoteData);
      return response.json();
    },
    onSuccess: (data) => {
      setQuoteResult(data);
      setStep(3);
      if (data.customer && !customerId) {
        onCustomerCreated(data.customer.id);
      }
      // Invalidate activities cache to refresh sidebar
      if (data.customer) {
        queryClient.invalidateQueries({ 
          queryKey: ['/api/customers', data.customer.id, 'activities'] 
        });
      }
      toast({
        title: "Quote Generated Successfully",
        description: `Your ${data.quote.insuranceType} insurance quote is ready!`,
      });
    },
    onError: (error) => {
      console.error('Quote generation failed:', error);
      toast({
        title: "Quote Generation Failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: QuoteFormData) => {
    quoteMutation.mutate(data);
  };

  const handleClose = () => {
    setStep(1);
    setQuoteResult(null);
    form.reset();
    onClose();
  };

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < step) return "completed";
    if (stepNumber === step) return "current";
    return "upcoming";
  };

  const insuranceType = form.watch("insuranceType");

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-neutral-900">
            Get Your Insurance Quote
          </DialogTitle>
          <p className="text-neutral-600">
            Fill out the form below to get a personalized quote
          </p>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[
            { number: 1, label: "Personal Info" },
            { number: 2, label: "Coverage Details" },
            { number: 3, label: "Your Quote" }
          ].map(({ number, label }) => {
            const status = getStepStatus(number);
            return (
              <div key={number} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${status === 'completed' ? 'bg-secondary text-white' : 
                    status === 'current' ? 'bg-primary text-white' : 
                    'bg-neutral-200 text-neutral-500'}
                `}>
                  {status === 'completed' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    number
                  )}
                </div>
                <span className={`ml-2 text-sm ${
                  status === 'current' ? 'font-medium text-primary' : 'text-neutral-500'
                }`}>
                  {label}
                </span>
                {number < 3 && (
                  <div className={`flex-1 h-px mx-4 ${
                    status === 'completed' ? 'bg-secondary' : 'bg-neutral-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="island"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hawaiian Island</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your island" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="oahu">Oahu</SelectItem>
                          <SelectItem value="maui">Maui</SelectItem>
                          <SelectItem value="hawaii">Hawaii (Big Island)</SelectItem>
                          <SelectItem value="kauai">Kauai</SelectItem>
                          <SelectItem value="molokai">Molokai</SelectItem>
                          <SelectItem value="lanai">Lanai</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={() => setStep(2)}
                    className="bg-primary text-white hover:bg-blue-700"
                  >
                    Continue to Coverage Details
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Coverage Details */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="insuranceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Insurance Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="earthquake">ETHquake (Blockchain/EtherISC)</SelectItem>
                            <SelectItem value="flood">Flood (FEMA Coverage)</SelectItem>
                            <SelectItem value="volcano">Volcano Insurance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coverageAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coverage Amount</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="50000" 
                            max="2000000"
                            step="1000"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <>
                  <Separator />
                  <h4 className="font-medium text-neutral-900">Property Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="homeType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Home Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="single-family">Single Family Home</SelectItem>
                              <SelectItem value="condo">Condominium</SelectItem>
                              <SelectItem value="townhouse">Townhouse</SelectItem>
                              <SelectItem value="apartment">Apartment</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="homeAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Home Age (years)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              max="200"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="foundationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Foundation Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="concrete-slab">Concrete Slab</SelectItem>
                              <SelectItem value="raised-foundation">Raised Foundation</SelectItem>
                              <SelectItem value="basement">Basement</SelectItem>
                              <SelectItem value="pier-beam">Pier & Beam</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="earthquakeRiskZone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Earthquake Risk Zone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select risk zone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="high">High Risk</SelectItem>
                              <SelectItem value="moderate">Moderate Risk</SelectItem>
                              <SelectItem value="low">Low Risk</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {insuranceType === 'flood' && (
                    <>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h5 className="font-medium text-blue-900 mb-2">🏛️ FEMA Flood Insurance</h5>
                        <p className="text-sm text-blue-700 mb-2">
                          Coverage provided through the National Flood Insurance Program (NFIP):
                        </p>
                        <ul className="text-xs text-blue-600 space-y-1">
                          <li>• Federal flood insurance backed by FEMA</li>
                          <li>• Coverage for Hawaii's unique flood risks</li>
                          <li>• Tsunami and heavy rainfall protection</li>
                          <li>• Required for properties in high-risk flood zones</li>
                          <li>• FEMA flood zone mapping and designations</li>
                        </ul>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="floodZone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>FEMA Flood Zone (if known)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., AE, X, VE" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="elevationFeet"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Elevation (feet above sea level)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0" 
                                  max="14000"
                                  placeholder="100"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}

                  {insuranceType === 'volcano' && (
                    <>
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <h5 className="font-medium text-orange-900 mb-2">Volcano Insurance Coverage</h5>
                        <p className="text-sm text-orange-700 mb-2">
                          Protects against volcanic eruption damage including:
                        </p>
                        <ul className="text-xs text-orange-600 space-y-1">
                          <li>• Fire damage from lava flows</li>
                          <li>• Explosions and volcanic projectiles</li>
                          <li>• Ash fall and volcanic dust damage</li>
                          <li>• Toxic gas exposure damage</li>
                          <li>• Structural damage from volcanic activity</li>
                        </ul>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="lavaZone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lava Flow Hazard Zone</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select lava zone" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">Zone 1 (Highest Risk)</SelectItem>
                                  <SelectItem value="2">Zone 2 (High Risk)</SelectItem>
                                  <SelectItem value="3">Zone 3 (Moderate Risk)</SelectItem>
                                  <SelectItem value="4">Zone 4 (Moderate Risk)</SelectItem>
                                  <SelectItem value="5">Zone 5 (Lower Risk)</SelectItem>
                                  <SelectItem value="6">Zone 6 (Lower Risk)</SelectItem>
                                  <SelectItem value="7">Zone 7 (Low Risk)</SelectItem>
                                  <SelectItem value="8">Zone 8 (Low Risk)</SelectItem>
                                  <SelectItem value="9">Zone 9 (Lowest Risk)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="distanceToVolcano"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Distance to Nearest Active Volcano (miles)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0" 
                                  max="200"
                                  placeholder="10"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}

                  {insuranceType === 'earthquake' && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-2">🔗 ETHquake Blockchain Insurance</h5>
                      <p className="text-sm text-blue-700 mb-2">
                        Revolutionary parametric insurance powered by Ethereum blockchain:
                      </p>
                      <ul className="text-xs text-blue-600 space-y-1">
                        <li>• EtherISC smart contracts for automated claims</li>
                        <li>• Instant payouts based on seismic data triggers</li>
                        <li>• Transparent, immutable coverage on-chain</li>
                        <li>• No traditional claims adjusters needed</li>
                        <li>• Lower costs through DeFi reinsurance pools</li>
                      </ul>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="distanceToFaultLine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Distance to Nearest Fault Line (miles, if known)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="100"
                            placeholder="5"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>

                <div className="flex space-x-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit"
                    disabled={quoteMutation.isPending}
                    className="flex-1 bg-primary text-white hover:bg-blue-700"
                  >
                    {quoteMutation.isPending ? "Generating Quote..." : "Generate Quote"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>

        {/* Step 3: Quote Results */}
        {step === 3 && quoteResult && (
          <div className="space-y-4">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Your Quote is Ready!
              </h3>
              <p className="text-neutral-600">
                Here's your personalized {quoteResult.quote.insuranceType} insurance quote
              </p>
            </div>

            <Card className="bg-neutral-50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-neutral-900">Monthly Premium:</span>
                    <span className="text-2xl font-bold text-secondary">
                      ${quoteResult.quote.monthlyPremium}/month
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-neutral-900">Coverage Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Coverage Amount:</span>
                        <span>${quoteResult.quote.coverageAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Insurance Type:</span>
                        <Badge variant="secondary" className="capitalize">
                          {quoteResult.quote.insuranceType}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {quoteResult.aiInsights?.recommendations && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium text-neutral-900 mb-2">AI Recommendations</h4>
                        <ul className="text-sm text-neutral-600 space-y-1">
                          {quoteResult.aiInsights.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <span className="text-secondary mr-2">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                onClick={handleClose}
                className="flex-1"
              >
                Get Another Quote
              </Button>
              <Button className="flex-1 bg-primary text-white hover:bg-blue-700">
                Purchase Policy
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
