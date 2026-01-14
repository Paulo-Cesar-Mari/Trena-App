import { relations } from "drizzle-orm";
import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// --- 1. USUÁRIOS (A base de tudo) ---
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  
  // O papel define o tipo de cadastro: 'consumer' (cliente), 'professional' (prestador), 'store' (loja)
  role: text("role").default("consumer").notNull(), 
  
  location: text("location"),
  bio: text("bio"),
  avatar: text("avatar"),
  phone: text("phone"),
});

// --- 2. PRODUTOS (Para Lojistas) ---
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id"), // Link com o ID do usuário (Loja)
  
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  price: numeric("price").notNull(),
  image: text("image"),
  location: text("location").notNull(),
  storeName: text("store_name").notNull(),
  contactPhone: text("contact_phone"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// --- 3. SERVIÇOS (Para Prestadores) ---
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id"), // Link com o ID do usuário (Prestador)
  
  name: text("name").notNull(), // Nome do profissional
  serviceType: text("service_type").notNull(), // ex: Pedreiro, Pintor
  description: text("description").notNull(),
  rating: numeric("rating").default("5.0"), // Começa com 5 estrelas
  location: text("location").notNull(),
  image: text("image"), // Foto do serviço
  contactInfo: text("contact_info"),
  hourlyRate: numeric("hourly_rate"), // Preço por hora ou orçamento base
  
  createdAt: timestamp("created_at").defaultNow(),
});

// --- 4. NOVAS TABELAS: INTERAÇÕES (Para Clientes) ---

// Favoritos (Lista de desejos do cliente)
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id), // Quem curtiu
  productId: integer("product_id").references(() => products.id), // Se curtiu um produto
  serviceId: integer("service_id").references(() => services.id), // Se curtiu um prestador
});

// Avaliações (Notas e Comentários)
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  authorId: integer("author_id").notNull().references(() => users.id), // Cliente que escreveu
  targetId: integer("target_id").notNull(), // Loja ou Prestador que recebeu
  rating: integer("rating").notNull(), // 1 a 5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Mensagens / Orçamentos
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(), // Cliente perguntando
  receiverId: integer("receiver_id").notNull(), // Loja/Prestador respondendo
  content: text("content").notNull(), // "Quanto custa o frete?"
  createdAt: timestamp("created_at").defaultNow(),
  readAt: timestamp("read_at"),
});

// --- 5. PORTFÓLIO (Para Lojistas e Prestadores) ---
export const portfolioItems = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id), // Quem é o dono do portfóli
  imageUrl: text("image_url").notNull(), // Onde a imagem está (URL)
  caption: text("caption"), // Uma legenda para a foto
  createdAt: timestamp("created_at").defaultNow(),
});

// --- RELAÇÕES (Para queries mais fáceis) ---
export const usersRelations = relations(users, ({ many }) => ({
	reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
	author: one(users, {
		fields: [reviews.authorId],
		references: [users.id],
	}),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: 'sender',
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: 'receiver',
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
	user: one(users, {
		fields: [favorites.userId],
		references: [users.id],
	}),
	product: one(products, {
		fields: [favorites.productId],
		references: [products.id],
	}),
	service: one(services, {
		fields: [favorites.serviceId],
		references: [services.id],
	}),
}));

// --- SCHEMAS E TIPOS ---

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const registerUserSchema = insertUserSchema.pick({
  username: true,
  password: true,
  name: true,
  role: true,
  phone: true,
});
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertServiceSchema = createInsertSchema(services).omit({ id: true, rating: true, createdAt: true });
// Schemas para as novas tabelas
export const insertFavoriteSchema = createInsertSchema(favorites).omit({ id: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).omit({ id: true, createdAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
// --- TIPOS DE INSERÇÃO (Adicione isto no final do arquivo) ---
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;

// --- 6. SESSÕES DE USUÁRIO (Para Autenticação) ---
export const userSessions = pgTable("user_sessions", {
  sid: text("sid").primaryKey(),
  sess: text("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// --- 7. NOTIFICAÇÕES (Novidade!) ---
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id), // Pra quem é a notificação
  message: text("message").notNull(), // "Você tem uma nova mensagem de..."
  link: text("link").notNull(), // "/inbox/123"
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});