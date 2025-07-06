import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, Mail, MessageCircle, Clock, HelpCircle, FileText, Shield } from "lucide-react";

export default function Support() {
  const [selectedCategory, setSelectedCategory] = useState("");

  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      description: "Speak directly with our Hawaii insurance specialists",
      contact: "(808) 555-ALOHA",
      hours: "Mon-Fri 7AM-7PM HST, Sat 8AM-4PM HST",
      availability: "Available Now"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support", 
      description: "Get detailed responses to complex insurance questions",
      contact: "support@alohashield.ai",
      hours: "24/7 - Response within 4 hours",
      availability: "Always Available"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Live Chat",
      description: "Real-time assistance with our AI-powered chat",
      contact: "Chat with AI Agent",
      hours: "24/7 Instant Response",
      availability: "Online"
    }
  ];

  const faqItems = [
    {
      question: "How does ETHquake blockchain insurance work?",
      answer: "ETHquake uses Ethereum smart contracts with parametric triggers based on USGS seismic data. When an earthquake meets specific magnitude, location, and depth criteria affecting your property, the smart contract automatically initiates payment without traditional claims processing delays."
    },
    {
      question: "What's covered under FEMA flood insurance in Hawaii?",
      answer: "FEMA flood insurance covers damage from tsunamis, heavy rainfall, storm surge, and flash flooding. Coverage includes up to $250,000 for building structure and $100,000 for contents. All flood zones in Hawaii are eligible, with rates based on your specific flood risk designation."
    },
    {
      question: "Why do I need volcano insurance through HPIA?",
      answer: "Standard homeowner's insurance typically excludes volcanic activity. HPIA provides essential coverage for lava flow damage, volcanic ash, fire and explosion from volcanic activity. This is crucial for properties in Hawaii's active volcanic regions, especially lava zones 1-3."
    },
    {
      question: "How quickly are ETHquake claims processed?",
      answer: "ETHquake claims are processed automatically when earthquake parameters are met. Payouts typically occur within 24-48 hours of the triggering seismic event, compared to weeks or months for traditional earthquake insurance claims."
    },
    {
      question: "Can I combine different types of coverage?",
      answer: "Yes, we recommend comprehensive protection combining ETHquake, FEMA flood, and volcano insurance. Each covers distinct risks specific to Hawaii's unique geological and climate conditions. Our specialists can design a complete coverage package for your property."
    },
    {
      question: "What documentation do I need for a claim?",
      answer: "For ETHquake claims, documentation is minimal due to automated processing. For flood and volcano claims, you'll need photos of damage, repair estimates, and proof of loss. Our OCR system can process documents instantly to expedite your claim."
    }
  ];

  const resources = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Hawaii Property Insurance Association (HPIA)",
      description: "Official resource for volcano insurance coverage",
      link: "hpiainfo.com"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "FEMA Flood Zone Maps",
      description: "Check your property's flood risk designation",
      link: "msc.fema.gov"
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      title: "USGS Earthquake Information",
      description: "Real-time seismic activity monitoring",
      link: "earthquake.usgs.gov"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Support & Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get help with your Hawaii climate insurance questions and access essential resources for natural disaster preparedness.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Support */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Support Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select support category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claims">Claims Assistance</SelectItem>
                    <SelectItem value="coverage">Coverage Questions</SelectItem>
                    <SelectItem value="billing">Billing & Payments</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="general">General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <Input placeholder="Brief description of your issue" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <Textarea 
                  placeholder="Describe your question or issue in detail..."
                  className="min-h-[120px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Information
                </label>
                <Input placeholder="Your email or phone number" />
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Submit Support Request
              </Button>
            </CardContent>
          </Card>

          {/* Contact Methods */}
          <div className="space-y-6">
            {contactMethods.map((method, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="text-blue-600">
                        {method.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {method.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {method.description}
                      </p>
                      <p className="font-medium text-blue-600 mb-1">
                        {method.contact}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        {method.hours}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600 font-medium">
                          {method.availability}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="bg-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Hawaii Insurance Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="text-white">
                      {resource.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{resource.title}</h3>
                  <p className="text-sm text-blue-100 mb-3">{resource.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-blue-600 border-white hover:bg-white"
                  >
                    Visit {resource.link}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}