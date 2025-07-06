import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, Users, Home, AlertTriangle, CheckCircle, Download, ShoppingCart } from "lucide-react";

interface EmergencyItem {
  id: string;
  name: string;
  category: string;
  essential: boolean;
  quantity: string;
  description: string;
  hawaiiSpecific: boolean;
  estimatedCost: number;
}

const EMERGENCY_ITEMS: EmergencyItem[] = [
  // Water & Food
  { id: 'water', name: 'Water (1 gallon per person per day)', category: 'Water & Food', essential: true, quantity: '14 gallons', description: 'For 2 weeks emergency supply', hawaiiSpecific: false, estimatedCost: 35 },
  { id: 'food_nonperishable', name: 'Non-perishable food', category: 'Water & Food', essential: true, quantity: '14 days supply', description: 'Canned goods, dried fruits, nuts', hawaiiSpecific: false, estimatedCost: 150 },
  { id: 'coconut_water', name: 'Coconut water', category: 'Water & Food', essential: false, quantity: '12 cans', description: 'Natural electrolyte replacement', hawaiiSpecific: true, estimatedCost: 24 },
  
  // Shelter & Warmth
  { id: 'emergency_shelter', name: 'Emergency shelter/tent', category: 'Shelter & Warmth', essential: true, quantity: '1 per family', description: 'Waterproof emergency shelter', hawaiiSpecific: false, estimatedCost: 89 },
  { id: 'tarps', name: 'Heavy-duty tarps', category: 'Shelter & Warmth', essential: true, quantity: '2-3 pieces', description: 'Protection from volcanic ash and rain', hawaiiSpecific: true, estimatedCost: 45 },
  { id: 'sleeping_bags', name: 'Sleeping bags', category: 'Shelter & Warmth', essential: true, quantity: '1 per person', description: 'Weather-appropriate sleeping bags', hawaiiSpecific: false, estimatedCost: 120 },
  
  // Safety & Protection
  { id: 'n95_masks', name: 'N95 respirator masks', category: 'Safety & Protection', essential: true, quantity: '20 masks', description: 'Protection from volcanic ash (vog)', hawaiiSpecific: true, estimatedCost: 40 },
  { id: 'safety_goggles', name: 'Safety goggles', category: 'Safety & Protection', essential: true, quantity: '1 per person', description: 'Eye protection from ash and debris', hawaiiSpecific: true, estimatedCost: 60 },
  { id: 'first_aid', name: 'Comprehensive first aid kit', category: 'Safety & Protection', essential: true, quantity: '1 kit', description: 'Including burn treatment supplies', hawaiiSpecific: false, estimatedCost: 75 },
  { id: 'fire_extinguisher', name: 'Fire extinguisher', category: 'Safety & Protection', essential: true, quantity: '2 units', description: 'Class A, B, C fire extinguisher', hawaiiSpecific: false, estimatedCost: 80 },
  
  // Communication & Power
  { id: 'emergency_radio', name: 'Emergency weather radio', category: 'Communication & Power', essential: true, quantity: '1 unit', description: 'Hand-crank or solar powered', hawaiiSpecific: false, estimatedCost: 45 },
  { id: 'portable_chargers', name: 'Portable phone chargers', category: 'Communication & Power', essential: true, quantity: '2 units', description: 'Solar or battery powered', hawaiiSpecific: false, estimatedCost: 60 },
  { id: 'flashlights', name: 'LED flashlights', category: 'Communication & Power', essential: true, quantity: '1 per person', description: 'With extra batteries', hawaiiSpecific: false, estimatedCost: 40 },
  
  // Tools & Supplies
  { id: 'multitools', name: 'Multi-tools/Swiss Army knife', category: 'Tools & Supplies', essential: true, quantity: '1-2 units', description: 'Versatile emergency tools', hawaiiSpecific: false, estimatedCost: 50 },
  { id: 'duct_tape', name: 'Duct tape', category: 'Tools & Supplies', essential: true, quantity: '2 rolls', description: 'Emergency repairs and sealing', hawaiiSpecific: false, estimatedCost: 15 },
  { id: 'rope', name: 'Strong rope/paracord', category: 'Tools & Supplies', essential: true, quantity: '100 feet', description: 'Emergency rescue and securing items', hawaiiSpecific: false, estimatedCost: 25 },
  
  // Hawaii-Specific Items
  { id: 'machete', name: 'Machete or large knife', category: 'Tools & Supplies', essential: false, quantity: '1 unit', description: 'Clearing vegetation and debris', hawaiiSpecific: true, estimatedCost: 35 },
  { id: 'reef_safe_sunscreen', name: 'Reef-safe sunscreen', category: 'Personal Care', essential: false, quantity: '2 bottles', description: 'Hawaii-compliant sun protection', hawaiiSpecific: true, estimatedCost: 30 },
  { id: 'insect_repellent', name: 'Tropical insect repellent', category: 'Personal Care', essential: false, quantity: '2 bottles', description: 'Protection from mosquitoes and flies', hawaiiSpecific: true, estimatedCost: 20 },
  
  // Documents & Cash
  { id: 'important_documents', name: 'Important documents (copies)', category: 'Documents & Cash', essential: true, quantity: '1 waterproof container', description: 'ID, insurance, medical records', hawaiiSpecific: false, estimatedCost: 25 },
  { id: 'emergency_cash', name: 'Emergency cash', category: 'Documents & Cash', essential: true, quantity: '$500-1000', description: 'Small bills for emergencies', hawaiiSpecific: false, estimatedCost: 500 },
  
  // Medications
  { id: 'medications', name: 'Prescription medications', category: 'Medications', essential: true, quantity: '30-day supply', description: 'All family member medications', hawaiiSpecific: false, estimatedCost: 100 },
  { id: 'otc_medications', name: 'Over-the-counter medications', category: 'Medications', essential: true, quantity: 'Basic supply', description: 'Pain relievers, antacids, etc.', hawaiiSpecific: false, estimatedCost: 40 },
  
  // Island-Specific Items
  { id: 'water_purification', name: 'Water purification tablets', category: 'Water & Food', essential: false, quantity: '100 tablets', description: 'For remote islands with limited water sources', hawaiiSpecific: true, estimatedCost: 20 },
  { id: 'fishing_kit', name: 'Basic fishing kit', category: 'Tools & Supplies', essential: false, quantity: '1 kit', description: 'Survival fishing for coastal areas', hawaiiSpecific: true, estimatedCost: 45 },
  { id: 'solar_charger', name: 'Solar phone charger', category: 'Communication & Power', essential: false, quantity: '1 unit', description: 'Reliable power source in tropical climate', hawaiiSpecific: true, estimatedCost: 65 },
  { id: 'emergency_whistle', name: 'Emergency whistle', category: 'Safety & Protection', essential: false, quantity: '1 per person', description: 'Signal for help in remote areas', hawaiiSpecific: true, estimatedCost: 15 }
];

interface KitConfiguration {
  familySize: number;
  hasChildren: boolean;
  hasPets: boolean;
  hasElderly: boolean;
  hasSpecialNeeds: boolean;
  primaryRisk: 'volcano' | 'earthquake' | 'flood' | 'hurricane';
  island: 'kauai' | 'oahu' | 'molokai' | 'lanai' | 'maui' | 'hawaii';
}

export default function EmergencyKitGenerator() {
  const [config, setConfig] = useState<KitConfiguration>({
    familySize: 2,
    hasChildren: false,
    hasPets: false,
    hasElderly: false,
    hasSpecialNeeds: false,
    primaryRisk: 'volcano',
    island: 'oahu'
  });

  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const generateKit = () => {
    const essentialItems = EMERGENCY_ITEMS.filter(item => item.essential);
    const hawaiiSpecificItems = EMERGENCY_ITEMS.filter(item => item.hawaiiSpecific);
    
    // Island-specific recommendations
    const islandSpecificItems = EMERGENCY_ITEMS.filter(item => {
      switch (config.island) {
        case 'hawaii': // Big Island - highest volcanic risk
          return item.name.includes('ash') || item.name.includes('mask') || item.name.includes('goggle') || item.name.includes('tarp') || item.name.includes('respirator');
        case 'kauai': // Highest flood risk
          return item.name.includes('water') || item.name.includes('shelter') || item.name.includes('radio');
        case 'maui': // Moderate volcanic and wind risk
          return item.name.includes('tarp') || item.name.includes('rope') || item.name.includes('shelter');
        case 'oahu': // Urban density, tsunami risk
          return item.name.includes('radio') || item.name.includes('flashlight') || item.name.includes('documents');
        case 'molokai':
        case 'lanai': // Remote islands - self-sufficiency critical
          return item.name.includes('water') || item.name.includes('food') || item.name.includes('tool') || item.name.includes('rope');
        default:
          return true;
      }
    });

    // Risk-specific items
    const riskSpecificItems = EMERGENCY_ITEMS.filter(item => {
      if (config.primaryRisk === 'volcano') {
        return item.name.includes('ash') || item.name.includes('mask') || item.name.includes('goggle') || item.name.includes('tarp');
      } else if (config.primaryRisk === 'flood') {
        return item.name.includes('water') || item.name.includes('shelter') || item.name.includes('radio');
      } else if (config.primaryRisk === 'earthquake') {
        return item.name.includes('first aid') || item.name.includes('shelter') || item.name.includes('tool');
      }
      return true;
    });

    const recommendedItems = new Set([
      ...essentialItems.map(item => item.id),
      ...hawaiiSpecificItems.map(item => item.id),
      ...islandSpecificItems.map(item => item.id),
      ...riskSpecificItems.map(item => item.id)
    ]);

    setSelectedItems(recommendedItems);
  };

  const toggleItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const getFilteredItems = () => {
    if (showAll) return EMERGENCY_ITEMS;
    return EMERGENCY_ITEMS.filter(item => selectedItems.has(item.id));
  };

  const getTotalCost = () => {
    return EMERGENCY_ITEMS
      .filter(item => selectedItems.has(item.id))
      .reduce((total, item) => total + item.estimatedCost, 0);
  };

  const getItemsByCategory = () => {
    const items = getFilteredItems();
    const categories: Record<string, EmergencyItem[]> = {};
    
    items.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });
    
    return categories;
  };

  const exportKit = () => {
    const selectedItemsList = EMERGENCY_ITEMS.filter(item => selectedItems.has(item.id));
    const kitContent = {
      configuration: config,
      items: selectedItemsList,
      totalCost: getTotalCost(),
      generatedDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(kitContent, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hawaii-emergency-kit.json';
    link.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-6 h-6 text-primary" />
            <span>One-Click Emergency Preparedness Kit Generator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Family Size</label>
              <Select value={config.familySize.toString()} onValueChange={(value) => setConfig({...config, familySize: parseInt(value)})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8].map(size => (
                    <SelectItem key={size} value={size.toString()}>{size} people</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Primary Risk</label>
              <Select value={config.primaryRisk} onValueChange={(value: any) => setConfig({...config, primaryRisk: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volcano">Volcano/Lava</SelectItem>
                  <SelectItem value="earthquake">Earthquake</SelectItem>
                  <SelectItem value="flood">Flood/Tsunami</SelectItem>
                  <SelectItem value="hurricane">Hurricane</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Island</label>
              <Select value={config.island} onValueChange={(value: any) => setConfig({...config, island: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kauai">Kauai</SelectItem>
                  <SelectItem value="oahu">Oahu</SelectItem>
                  <SelectItem value="molokai">Molokai</SelectItem>
                  <SelectItem value="lanai">Lanai</SelectItem>
                  <SelectItem value="maui">Maui</SelectItem>
                  <SelectItem value="hawaii">Big Island (Hawaii)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Special Considerations */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Special Considerations</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: 'hasChildren', label: 'Children' },
                { key: 'hasPets', label: 'Pets' },
                { key: 'hasElderly', label: 'Elderly' },
                { key: 'hasSpecialNeeds', label: 'Special Needs' }
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    checked={config[key as keyof KitConfiguration] as boolean}
                    onCheckedChange={(checked) => setConfig({...config, [key]: checked})}
                  />
                  <label className="text-sm">{label}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex space-x-4">
            <Button onClick={generateKit} className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Generate Custom Kit</span>
            </Button>
            
            <Button variant="outline" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show Selected Only' : 'Show All Items'}
            </Button>
          </div>

          {/* Kit Summary */}
          {selectedItems.size > 0 && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      {selectedItems.size} items selected
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-green-800">
                      Total: ${getTotalCost().toLocaleString()}
                    </span>
                    <Button size="sm" onClick={exportKit} className="bg-green-600 hover:bg-green-700">
                      <Download className="w-4 h-4 mr-1" />
                      Export Kit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Items by Category */}
          <div className="space-y-4">
            {Object.entries(getItemsByCategory()).map(([category, items]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{category}</span>
                    <Badge variant="secondary">{items.length} items</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map(item => (
                      <div key={item.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          checked={selectedItems.has(item.id)}
                          onCheckedChange={() => toggleItem(item.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            {item.essential && (
                              <Badge variant="destructive" className="text-xs">Essential</Badge>
                            )}
                            {item.hawaiiSpecific && (
                              <Badge variant="default" className="text-xs bg-blue-500">Hawaii</Badge>
                            )}
                          </div>
                          <p className="text-xs text-neutral-600 mt-1">{item.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-medium">Qty: {item.quantity}</span>
                            <span className="text-xs font-medium">${item.estimatedCost}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Hawaii-Specific Alert */}
          <Alert className="border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Hawaii Emergency Tip:</strong> Due to Hawaii's isolation, supply deliveries may be delayed for weeks after major disasters. Stock extra supplies and consider solar-powered equipment due to frequent power outages from volcanic activity and storms.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}