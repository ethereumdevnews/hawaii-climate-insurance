import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupSimpleAuth as setupAuth, isAuthenticated } from "./simpleAuth";
import { storage } from "./storage";
import { 
  quoteRequestSchema, 
  chatRequestSchema,
  insertCustomerSchema,
  type QuoteRequest,
  type ChatRequest
} from "@shared/schema";
import { 
  generateInsuranceQuote, 
  processInsuranceQuery, 
  analyzeInsuranceNeed,
  type InsuranceQuoteRequest 
} from "./services/openai";

import { uploadMiddleware, processDocument } from './services/document';
import { Request as ExpressRequest, Response } from 'express';

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  // Generate insurance quotes
  app.post("/api/quotes", async (req, res) => {
    try {
      const validatedData = quoteRequestSchema.parse(req.body);
      
      // Create or find customer
      let customer = await storage.getCustomerByEmail(validatedData.customerInfo.email);
      if (!customer) {
        customer = await storage.createCustomer(validatedData.customerInfo);
      }

      // Calculate age from date of birth
      const age = validatedData.customerInfo.dateOfBirth 
        ? new Date().getFullYear() - new Date(validatedData.customerInfo.dateOfBirth).getFullYear()
        : 30; // default age

      // Prepare quote request for OpenAI
      const quoteRequest: InsuranceQuoteRequest = {
        insuranceType: validatedData.insuranceType,
        customerInfo: {
          age,
          zipCode: validatedData.customerInfo.zipCode,
          homeType: validatedData.customerInfo.homeType || undefined,
          homeAge: validatedData.customerInfo.homeAge || undefined,
          foundationType: validatedData.customerInfo.foundationType || undefined,
          earthquakeRiskZone: validatedData.customerInfo.earthquakeRiskZone || undefined,
          distanceToFaultLine: validatedData.customerInfo.distanceToFaultLine || undefined
        },
        coverageAmount: validatedData.coverageAmount,
        propertyInfo: validatedData.propertyInfo
      };

      // Generate quote using OpenAI
      const aiQuote = await generateInsuranceQuote(quoteRequest);

      // Store quote in database
      const quote = await storage.createQuote({
        customerId: customer.id,
        insuranceType: validatedData.insuranceType,
        coverageAmount: validatedData.coverageAmount,
        monthlyPremium: Math.round(aiQuote.monthlyPremium * 100), // store in cents
        quoteData: {
          coverageBreakdown: aiQuote.coverageBreakdown,
          recommendations: aiQuote.recommendations,
          factors: aiQuote.factors,
          propertyInfo: validatedData.propertyInfo
        },
        isActive: true
      });

      // Log activity
      await storage.createActivity({
        customerId: customer.id,
        type: 'quote_generated',
        description: `${validatedData.insuranceType} insurance quote generated - $${aiQuote.monthlyPremium}/month`,
        metadata: { quoteId: quote.id, insuranceType: validatedData.insuranceType }
      });

      res.json({
        quote: {
          ...quote,
          monthlyPremium: aiQuote.monthlyPremium // return in dollars for frontend
        },
        customer,
        aiInsights: {
          recommendations: aiQuote.recommendations,
          factors: aiQuote.factors,
          coverageBreakdown: aiQuote.coverageBreakdown
        }
      });
    } catch (error) {
      console.error('Quote generation error:', error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : 'Failed to generate quote' 
      });
    }
  });

  // Chat with AI agent
  app.post("/api/chat", async (req, res) => {
    try {
      const validatedData = chatRequestSchema.parse(req.body);
      
      let context = null;
      if (validatedData.customerId) {
        const customer = await storage.getCustomer(validatedData.customerId);
        const recentQuotes = await storage.getQuotesByCustomer(validatedData.customerId);
        const policies = await storage.getPoliciesByCustomer(validatedData.customerId);
        
        context = {
          customer,
          recentQuotes: recentQuotes.slice(0, 3), // last 3 quotes
          policies
        };
      }

      // Process message with OpenAI
      const aiResponse = await processInsuranceQuery(validatedData.message, context);

      // Store chat message if customer is identified
      if (validatedData.customerId) {
        await storage.createChatMessage({
          customerId: validatedData.customerId,
          message: validatedData.message,
          response: aiResponse,
          messageType: validatedData.messageType
        });
      }

      res.json({
        message: validatedData.message,
        response: aiResponse,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Chat processing error:', error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : 'Failed to process chat message' 
      });
    }
  });

  // Get customer quotes
  app.get("/api/customers/:id/quotes", async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      const quotes = await storage.getQuotesByCustomer(customerId);
      
      // Convert premium from cents to dollars
      const quotesWithDollarAmounts = quotes.map((quote: any) => ({
        ...quote,
        monthlyPremium: quote.monthlyPremium / 100
      }));
      
      res.json(quotesWithDollarAmounts);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      res.status(500).json({ message: 'Failed to fetch quotes' });
    }
  });

  // Get customer activities
  app.get("/api/customers/:id/activities", async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      const activities = await storage.getActivities(customerId);
      res.json(activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      res.status(500).json({ message: 'Failed to fetch activities' });
    }
  });

  // Get customer chat history
  app.get("/api/customers/:id/chat", async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      const messages = await storage.getChatMessages(customerId);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      res.status(500).json({ message: 'Failed to fetch chat history' });
    }
  });

  // Calculate premium estimate (for calculator)
  app.post("/api/calculate-premium", async (req, res) => {
    try {
      const { insuranceType, coverageAmount, customerAge = 30, zipCode = "12345" } = req.body;
      
      const quoteRequest: InsuranceQuoteRequest = {
        insuranceType,
        customerInfo: {
          age: customerAge,
          zipCode
        },
        coverageAmount
      };

      const estimate = await generateInsuranceQuote(quoteRequest);
      
      res.json({
        monthlyPremium: estimate.monthlyPremium,
        coverageBreakdown: estimate.coverageBreakdown
      });
    } catch (error) {
      console.error('Premium calculation error:', error);
      res.status(400).json({ message: 'Failed to calculate premium' });
    }
  });

  // Create customer
  app.post("/api/customers", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      
      // Check if customer already exists
      const existingCustomer = await storage.getCustomerByEmail(validatedData.email);
      if (existingCustomer) {
        return res.json(existingCustomer);
      }
      
      const customer = await storage.createCustomer(validatedData);
      res.json(customer);
    } catch (error) {
      console.error('Customer creation error:', error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : 'Failed to create customer' 
      });
    }
  });

  // Document upload endpoints
  app.post('/api/documents/upload', uploadMiddleware, async (req: ExpressRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { customerId, documentType } = req.body;
      
      if (!customerId || !documentType) {
        return res.status(400).json({ message: 'Customer ID and document type are required' });
      }

      const result = await processDocument(Number(customerId), req.file, documentType);
      res.json(result);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Failed to upload document' });
    }
  });

  app.get('/api/customers/:id/documents', async (req: ExpressRequest, res: Response) => {
    try {
      const customerId = Number(req.params.id);
      const documents = await storage.getDocumentsByCustomer(customerId);
      res.json(documents);
    } catch (error) {
      console.error('Fetch documents error:', error);
      res.status(500).json({ message: 'Failed to fetch documents' });
    }
  });

  app.delete('/api/documents/:id', async (req: ExpressRequest, res: Response) => {
    try {
      const documentId = Number(req.params.id);
      const success = await storage.deleteDocument(documentId);
      
      if (success) {
        res.json({ message: 'Document deleted successfully' });
      } else {
        res.status(404).json({ message: 'Document not found' });
      }
    } catch (error) {
      console.error('Delete document error:', error);
      res.status(500).json({ message: 'Failed to delete document' });
    }
  });

  // One-click quote generation API
  app.post('/api/one-click-quote', async (req, res) => {
    try {
      const { zipCode, homeType, homeAge, locationRisks } = req.body;
      
      if (!zipCode || !homeType || !homeAge || !locationRisks) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Generate intelligent quote based on location-specific risks
      const quoteRequest: InsuranceQuoteRequest = {
        insuranceType: 'earthquake',
        customerInfo: {
          age: 35,
          zipCode,
          island: locationRisks.island,
          homeType,
          homeAge,
          foundationType: homeType === 'mobile' ? 'mobile' : 'concrete',
          earthquakeRiskZone: locationRisks.riskProfile.earthquake >= 60 ? 'high' : 'moderate',
          distanceToFaultLine: locationRisks.distanceToFaultLine
        },
        coverageAmount: 300000,
        propertyInfo: {
          homeType,
          homeAge,
          foundationType: homeType === 'mobile' ? 'mobile' : 'concrete',
          floodZone: locationRisks.floodZone,
          elevationFeet: locationRisks.elevationFeet,
          lavaZone: locationRisks.lavaZone,
          distanceToVolcano: locationRisks.lavaZone ? 10 : 50
        }
      };

      // Generate quotes for each recommended coverage type
      const recommendedCoverage = {
        earthquake: locationRisks.riskProfile.earthquake >= 60,
        volcano: (locationRisks.lavaZone === 1 || locationRisks.lavaZone === 2), // HPIA zones 1 & 2 require coverage
        flood: locationRisks.riskProfile.flood >= 60
      };

      const premiums: any = {};
      
      // Generate earthquake quote if recommended
      if (recommendedCoverage.earthquake) {
        const earthquakeQuote = await generateInsuranceQuote({
          ...quoteRequest,
          insuranceType: 'earthquake'
        });
        premiums.earthquake = earthquakeQuote.monthlyPremium;
      }

      // Generate volcano quote if recommended
      if (recommendedCoverage.volcano) {
        const volcanoQuote = await generateInsuranceQuote({
          ...quoteRequest,
          insuranceType: 'volcano'
        });
        premiums.volcano = volcanoQuote.monthlyPremium;
      }

      // Generate flood quote if recommended
      if (recommendedCoverage.flood) {
        const floodQuote = await generateInsuranceQuote({
          ...quoteRequest,
          insuranceType: 'flood'
        });
        premiums.flood = floodQuote.monthlyPremium;
      }

      // Calculate bundle pricing (10% discount for multiple coverages)
      const totalIndividual = (premiums.earthquake || 0) + (premiums.volcano || 0) + (premiums.flood || 0);
      const bundleDiscount = Object.keys(premiums).length > 1 ? 0.1 : 0;
      const totalMonthly = Math.round(totalIndividual * (1 - bundleDiscount));

      // Generate risk factors and recommendations
      const riskFactors = [];
      const recommendations = [];

      if (locationRisks.lavaZone === 1) {
        riskFactors.push(`Lava Zone 1 - Highest volcanic risk near active vents (USGS)`);
        recommendations.push("HPIA (Hawaii Property Insurance Association) coverage required - private insurers typically refuse coverage");
      } else if (locationRisks.lavaZone === 2) {
        riskFactors.push(`Lava Zone 2 - High volcanic risk near active volcano areas (USGS)`);
        recommendations.push("HPIA coverage required - limited private insurance availability due to lava flow risk");
      } else if (locationRisks.lavaZone && locationRisks.lavaZone >= 3 && locationRisks.lavaZone <= 9) {
        riskFactors.push(`Lava Zone ${locationRisks.lavaZone} - Lower volcanic risk (USGS 9-zone system)`);
        recommendations.push("Private volcano insurance available - lower premiums than HPIA zones");
      }

      if (locationRisks.distanceToFaultLine <= 15) {
        riskFactors.push(`${locationRisks.distanceToFaultLine} miles from fault line`);
        recommendations.push("ETHquake blockchain insurance recommended for earthquake protection");
      }

      if (locationRisks.floodZone && ['AE', 'VE', 'A'].includes(locationRisks.floodZone)) {
        riskFactors.push(`FEMA Flood Zone ${locationRisks.floodZone} - High flood risk`);
        recommendations.push("NFIP flood insurance required for mortgage compliance");
      }

      if (locationRisks.elevationFeet <= 100) {
        riskFactors.push(`Low elevation (${locationRisks.elevationFeet} ft) - Tsunami risk`);
        recommendations.push("Evacuation planning and emergency kit preparation essential");
      }

      if (locationRisks.riskProfile.overall >= 60) {
        recommendations.push("Multi-hazard insurance bundle recommended for comprehensive coverage");
      }

      const oneClickQuote = {
        location: locationRisks,
        recommendedCoverage,
        premiums,
        totalMonthly,
        riskFactors,
        recommendations
      };

      res.json(oneClickQuote);
    } catch (error) {
      console.error('Error generating one-click quote:', error);
      res.status(500).json({ message: 'Failed to generate quote' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
