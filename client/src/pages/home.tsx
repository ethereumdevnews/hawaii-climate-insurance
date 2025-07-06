import { useState } from "react";
import Header from "@/components/header";
import ChatInterface from "@/components/chat-interface";
import Sidebar from "@/components/sidebar";
import QuoteModal from "@/components/quote-modal";
import DocumentUpload from "@/components/document-upload";
import VolcanoRiskSimulation from "@/components/volcano-risk-simulation";
import EmergencyKitGenerator from "@/components/emergency-kit-generator";
import ClimateLearningModule from "@/components/climate-learning-module";
import ARPropertyAssessment from "@/components/ar-property-assessment";
import LanguageSelector from "@/components/language-selector";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isAdvancedFeaturesOpen, setIsAdvancedFeaturesOpen] = useState(false);
  const [isDocumentUploadOpen, setIsDocumentUploadOpen] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <ChatInterface 
              customerId={currentCustomerId}
              onCustomerIdentified={setCurrentCustomerId}
            />
          </div>
          
          <div className="lg:col-span-1">
            <Sidebar 
              customerId={currentCustomerId}
              onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
              onOpenDocumentUpload={() => setIsDocumentUploadOpen(true)}
              onOpenAdvancedFeatures={() => setIsAdvancedFeaturesOpen(true)}
            />
          </div>
        </div>
      </div>

      <QuoteModal 
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        customerId={currentCustomerId}
        onCustomerCreated={setCurrentCustomerId}
      />
      
      <Dialog open={isDocumentUploadOpen} onOpenChange={setIsDocumentUploadOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Document Upload</DialogTitle>
          </DialogHeader>
          <DocumentUpload customerId={currentCustomerId} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAdvancedFeaturesOpen} onOpenChange={setIsAdvancedFeaturesOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Advanced Features</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="volcano" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="volcano">Volcano Risk</TabsTrigger>
              <TabsTrigger value="emergency">Emergency Kit</TabsTrigger>
              <TabsTrigger value="learning">Learning</TabsTrigger>
              <TabsTrigger value="ar">AR Assessment</TabsTrigger>
            </TabsList>
            <TabsContent value="volcano">
              <VolcanoRiskSimulation />
            </TabsContent>
            <TabsContent value="emergency">
              <EmergencyKitGenerator />
            </TabsContent>
            <TabsContent value="learning">
              <ClimateLearningModule />
            </TabsContent>
            <TabsContent value="ar">
              <ARPropertyAssessment />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
