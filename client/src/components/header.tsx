import { useState, useEffect } from "react";
import { Shield, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/language-selector";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getTranslation, getCurrentLanguage } from "@/lib/i18n";
import { Link } from "wouter";

export default function Header() {
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());

  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLanguage(getCurrentLanguage());
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);
  return (
    <header className="bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 shadow-lg border-b border-blue-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                {/* Shield */}
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">{getTranslation('header.title', currentLanguage)}</h1>
              <p className="text-xs text-blue-100">{getTranslation('header.subtitle', currentLanguage)}</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/coverage" className="text-blue-100 hover:text-white transition-colors">
              {getTranslation('header.coverage', currentLanguage)}
            </Link>
            <Link href="/claims" className="text-blue-100 hover:text-white transition-colors">
              {getTranslation('header.claims', currentLanguage)}
            </Link>
            <Link href="/risk-map" className="text-blue-100 hover:text-white transition-colors">
              Risk Map
            </Link>
            <Link href="/one-click-quote" className="text-blue-100 hover:text-white transition-colors">
              Quick Quote
            </Link>
            <Link href="/support" className="text-blue-100 hover:text-white transition-colors">
              {getTranslation('header.support', currentLanguage)}
            </Link>
            <Link href="/account">
              <Button className="bg-white/20 text-white hover:bg-white/30 backdrop-blur border-white/30">
                <User className="w-4 h-4 mr-2" />
                {getTranslation('header.account', currentLanguage)}
              </Button>
            </Link>
            <LanguageSelector compact={true} />
          </nav>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-6">
                <Link href="/coverage" className="text-neutral-600 hover:text-primary transition-colors">
                  {getTranslation('header.coverage', currentLanguage)}
                </Link>
                <Link href="/claims" className="text-neutral-600 hover:text-primary transition-colors">
                  {getTranslation('header.claims', currentLanguage)}
                </Link>
                <Link href="/risk-map" className="text-neutral-600 hover:text-primary transition-colors">
                  Risk Map
                </Link>
                <Link href="/support" className="text-neutral-600 hover:text-primary transition-colors">
                  {getTranslation('header.support', currentLanguage)}
                </Link>
                <Link href="/account">
                  <Button className="bg-primary text-white hover:bg-blue-700 justify-start">
                    <User className="w-4 h-4 mr-2" />
                    {getTranslation('header.account', currentLanguage)}
                  </Button>
                </Link>
                <LanguageSelector compact={true} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
