import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/home";
import Landing from "@/pages/landing";
import Coverage from "@/pages/coverage";
import Claims from "@/pages/claims";
import Support from "@/pages/support";
import Account from "@/pages/account";
import RiskMap from "@/pages/risk-map";
import OneClickQuotePage from "@/pages/one-click-quote";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  
  return (
    <Switch>
      {/* Static landing pages - completely independent of auth */}
      <Route path="/landing">
        <Landing />
      </Route>
      <Route path="/demo-landing">
        <Landing />
      </Route>
      
      {/* Authenticated main app */}
      <Route path="/home">
        <Home />
      </Route>
      <Route path="/app">
        <Home />
      </Route>
      <Route path="/coverage">
        <Coverage />
      </Route>
      <Route path="/claims">
        <Claims />
      </Route>
      <Route path="/support">
        <Support />
      </Route>
      <Route path="/account">
        <Account />
      </Route>
      <Route path="/risk-map">
        <RiskMap />
      </Route>
      <Route path="/one-click-quote">
        <OneClickQuotePage />
      </Route>
      
      {/* Root path - conditional based on auth */}
      <Route path="/">
        {isLoading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-lg">Loading...</div>
          </div>
        ) : isAuthenticated ? (
          <Home />
        ) : (
          <Landing />
        )}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
