import { db, pool } from "./db";
import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import {
  products,
  services,
  users,
  portfolioItems,
  reviews,
  favorites,
  messages,
  type InsertProduct,
  type InsertService,
  type InsertUser,
  type InsertPortfolioItem,
  type InsertReview,
  type InsertMessage,
  type Product,
  type Service,
  type User,
  type PortfolioItem,
  type Review,
  type Message,
} from "@shared/schema";
import { eq, ilike, or, getTableColumns, and, gte, lte, desc, asc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserProfile(
    id: number
  ): Promise<
    { user: User; products: Product[]; portfolioItems: PortfolioItem[] } | undefined
  >;
  getCurrentUserProfile(
    id: number
  ): Promise<
    | { user: User; products: Product[]; favorites: Product[] }
    | undefined
  >;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<Pick<User, "name" | "location" | "bio" | "avatar" | "phone">>): Promise<User>;

  // Products
  getProducts(
    search?: string,
    category?: string,
    sellerId?: number,
    priceMin?: number,
    priceMax?: number,
    location?: string,
  ): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // Services
  getServices(
    search?: string,
    category?: string,
    ratingMin?: number,
    hourlyRateMin?: number,
    hourlyRateMax?: number,
    location?: string,
  ): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;

  // Portfolio
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  getPortfolioItems(userId: number): Promise<PortfolioItem[]>;

  // Reviews
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByTarget(targetId: number): Promise<
    (Review & {
      author: {
        id: number;
        name: string;
        avatar: string | null;
      };
    })[]
  >;

  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]>;

  // Session
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    const PgSession = connectPgSimple(session);
    this.sessionStore = new PgSession({
      pool: pool,
      tableName: "user_sessions",
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async getUserProfile(
    id: number
  ): Promise<
    { user: User; products: Product[]; portfolioItems: PortfolioItem[] } | undefined
  > {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) {
      return undefined;
    }

    const userProducts = await db
      .select()
      .from(products)
      .where(eq(products.sellerId, id));

    const userPortfolioItems = await this.getPortfolioItems(id);

    return {
      user,
      products: userProducts,
      portfolioItems: userPortfolioItems,
    };
  }

  async getCurrentUserProfile(
    id: number
  ): Promise<
    | { user: User; products: Product[]; favorites: Product[] }
    | undefined
  > {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) {
      return undefined;
    }

    const userProducts = await db
      .select()
      .from(products)
      .where(eq(products.sellerId, id));

    const userFavorites = await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, id))
      .leftJoin(products, eq(favorites.productId, products.id));

    return {
      user,
      products: userProducts,
      favorites: userFavorites.map(f => f.products).filter(p => p !== null) as Product[],
    };
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, data: Partial<Pick<User, "name" | "location" | "bio" | "avatar" | "phone">>): Promise<User> {
    const [updatedUser] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return updatedUser;
  }

  async getProducts(
    search?: string,
    category?: string,
    sellerId?: number,
    priceMin?: number,
    priceMax?: number,
    location?: string,
  ): Promise<Product[]> {
    let conditions = [];

    if (sellerId) {
      conditions.push(eq(products.sellerId, sellerId));
    }

    if (search) {
      const searchLower = `%${search.toLowerCase()}%`;
      conditions.push(
        or(
          ilike(products.title, searchLower),
          ilike(products.description, searchLower)
        )!
      );
    }

    if (category) {
      conditions.push(eq(products.category, category));
    }

    if (priceMin) {
      conditions.push(gte(products.price, priceMin.toString()));
    }

    if (priceMax) {
      conditions.push(lte(products.price, priceMax.toString()));
    }

    if (location) {
      conditions.push(ilike(products.location, `%${location}%`));
    }

    let query = db.select().from(products);

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    return await query;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [productData] = await db
      .select({
        ...getTableColumns(products),
        contactPhone: users.phone,
      })
      .from(products)
      .leftJoin(users, eq(products.sellerId, users.id))
      .where(eq(products.id, id));

    return productData as Product | undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async getServices(
    search?: string,
    category?: string,
    ratingMin?: number,
    hourlyRateMin?: number,
    hourlyRateMax?: number,
    location?: string,
  ): Promise<Service[]> {
    let conditions = [];

    if (search) {
      const searchLower = `%${search.toLowerCase()}%`;
      conditions.push(
        or(
          ilike(services.name, searchLower),
          ilike(services.description, searchLower),
          ilike(services.serviceType, searchLower)
        )!
      );
    }

    if (category) {
      conditions.push(eq(services.serviceType, category));
    }

    if (ratingMin) {
      conditions.push(gte(services.rating, ratingMin.toString()));
    }

    if (hourlyRateMin) {
      conditions.push(gte(services.hourlyRate, hourlyRateMin.toString()));
    }

    if (hourlyRateMax) {
      conditions.push(lte(services.hourlyRate, hourlyRateMax.toString()));
    }

    if (location) {
      conditions.push(ilike(services.location, `%${location}%`));
    }

    let query = db.select().from(services);

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    return await query;
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, id));
    return service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  // Portfolio
  async createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem> {
    const [newPortfolioItem] = await db
      .insert(portfolioItems)
      .values(item)
      .returning();
    return newPortfolioItem;
  }

  async getPortfolioItems(userId: number): Promise<PortfolioItem[]> {
    return await db
      .select()
      .from(portfolioItems)
      .where(eq(portfolioItems.userId, userId));
  }

  // Reviews
  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async getReviewsByTarget(targetId: number) {
    // Usando db.query para trazer o autor junto (relational query)
    return db.query.reviews.findMany({
      where: eq(reviews.serviceId, targetId), // Nota: assumindo serviceId baseada no schema anterior
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      },
      orderBy: [desc(reviews.createdAt)],
    });
  }

  // Messages
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    const messageList = await db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, user1Id), eq(messages.receiverId, user2Id)),
          and(eq(messages.senderId, user2Id), eq(messages.receiverId, user1Id))
        )!
      )
      .orderBy(asc(messages.createdAt)); // ou sentAt, dependendo do schema

    return messageList;
  }
}

export const storage = new DatabaseStorage();