import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // 'consumer', 'professional', 'store'
  location: text("location"),
  bio: text("bio"),
  avatar: text("avatar"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  price: numeric("price").notNull(),
  image: text("image"),
  location: text("location").notNull(),
  storeName: text("store_name").notNull(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id"),
  name: text("name").notNull(), // Professional's name
  serviceType: text("service_type").notNull(),
  description: text("description").notNull(),
  rating: numeric("rating").default("4.8"),
  location: text("location").notNull(),
  image: text("image"),
  contactInfo: text("contact_info"),
  hourlyRate: numeric("hourly_rate"),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertServiceSchema = createInsertSchema(services).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
