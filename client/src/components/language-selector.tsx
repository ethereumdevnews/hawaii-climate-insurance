import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { SUPPORTED_LANGUAGES, getCurrentLanguage, setCurrentLanguage } from "@/lib/i18n";

interface LanguageSelectorProps {
  onLanguageChange?: (language: string) => void;
  compact?: boolean;
}

export default function LanguageSelector({ onLanguageChange, compact = false }: LanguageSelectorProps) {
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());

  useEffect(() => {
    setCurrentLang(getCurrentLanguage());
  }, []);

  const handleLanguageChange = (language: string) => {
    console.log('Language changing to:', language);
    setCurrentLanguage(language);
    setCurrentLang(language);
    onLanguageChange?.(language);
    
    // Trigger custom event to update all components
    window.dispatchEvent(new CustomEvent('languageChanged'));
  };

  if (compact) {
    return (
      <Select value={currentLang} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-32">
          <Globe className="w-4 h-4 mr-2" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(SUPPORTED_LANGUAGES).map(([code, { name, flag }]) => (
            <SelectItem key={code} value={code}>
              <span className="flex items-center space-x-2">
                <span>{flag}</span>
                <span>{name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Globe className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Choose Language / Fihi Lea</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(SUPPORTED_LANGUAGES).map(([code, { name, flag }]) => (
            <Button
              key={code}
              variant={currentLang === code ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => handleLanguageChange(code)}
            >
              <span className="text-lg mr-2">{flag}</span>
              <span>{name}</span>
              {code === 'en' && <span className="ml-auto text-xs opacity-60">(Default)</span>}
            </Button>
          ))}
        </div>
        
        <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
          <strong>Note:</strong> Language changes apply instantly across the interface.
        </div>
      </CardContent>
    </Card>
  );
}