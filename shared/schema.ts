import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  dateOfBirth: text("date_of_birth"),
  zipCode: text("zip_code").notNull(),
  island: text("island"), // oahu, maui, hawaii, kauai, molokai, lanai
  homeType: text("home_type"), // single-family, condo, townhouse, etc.
  homeAge: integer("home_age"),
  foundationType: text("foundation_type"), // concrete, wood, etc.
  earthquakeRiskZone: text("earthquake_risk_zone"), // high, moderate, low
  distanceToFaultLine: integer("distance_to_fault_line"), // in miles
  createdAt: timestamp("created_at").defaultNow(),
});

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  insuranceType: text("insurance_type").notNull(), // 'earthquake', 'flood'
  coverageAmount: integer("coverage_amount").notNull(),
  monthlyPremium: integer("monthly_premium").notNull(), // in cents
  quoteData: jsonb("quote_data"), // store additional quote details
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const policies = pgTable("policies", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  quoteId: integer("quote_id").references(() => quotes.id),
  policyNumber: text("policy_number").notNull().unique(),
  insuranceType: text("insurance_type").notNull(),
  status: text("status").notNull().default("active"), // 'active', 'cancelled', 'expired'
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  monthlyPremium: integer("monthly_premium").notNull(),
  policyData: jsonb("policy_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  message: text("message").notNull(),
  response: text("response").notNull(),
  messageType: text("message_type").notNull(), // 'question', 'quote_request', 'claim'
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  type: text("type").notNull(), // 'quote_generated', 'policy_created', 'claim_filed'
  description: text("description").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  documentType: text("document_type").notNull(), // 'property_deed', 'damage_report', 'insurance_form', 'photo', 'other'
  status: text("status").default("pending").notNull(), // 'pending', 'processing', 'processed', 'failed'
  extractedText: text("extracted_text"),
  analysis: jsonb("analysis"), // AI analysis results
  tags: text("tags").array(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
});

// Insert schemas
export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true, createdAt: true });
export const insertQuoteSchema = createInsertSchema(quotes).omit({ id: true, createdAt: true });
export const insertPolicySchema = createInsertSchema(policies).omit({ id: true, createdAt: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, createdAt: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true, createdAt: true });
export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, uploadedAt: true });

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Types
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Policy = typeof policies.$inferSelect;
export type InsertPolicy = z.infer<typeof insertPolicySchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

// Validation schemas for API
export const quoteRequestSchema = z.object({
  customerInfo: insertCustomerSchema,
  insuranceType: z.enum(['earthquake', 'flood', 'volcano']),
  coverageAmount: z.number().min(50000).max(2000000),
  propertyInfo: z.object({
    homeType: z.enum(['single-family', 'condo', 'townhouse', 'apartment']),
    homeAge: z.number().min(0).max(200),
    foundationType: z.enum(['concrete-slab', 'raised-foundation', 'basement', 'pier-beam']),
    floodZone: z.string().optional(), // FEMA flood zone designation
    elevationFeet: z.number().optional(), // feet above sea level
    lavaZone: z.string().optional(), // Hawaii lava flow hazard zone
    distanceToVolcano: z.number().optional(), // miles to nearest active volcano
  }).optional(),
});

export const chatRequestSchema = z.object({
  message: z.string().min(1),
  customerId: z.union([z.number(), z.null()]).optional(),
  messageType: z.enum(['question', 'quote_request', 'claim']).default('question'),
});

export type QuoteRequest = z.infer<typeof quoteRequestSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
