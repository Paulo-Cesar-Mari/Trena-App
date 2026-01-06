import { db } from "./db";
import {
  products,
  services,
  users,
  portfolioItems,
  type InsertProduct,
  type InsertService,
  type InsertUser,
  type InsertPortfolioItem,
  type Product,
  type Service,
  type User,
  type PortfolioItem,
} from "@shared/schema";
import { eq, ilike, or } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserProfile(
    id: number
  ): Promise<
    { user: User; products: Product[]; portfolioItems: PortfolioItem[] } | undefined
  >;
  createUser(user: InsertUser): Promise<User>;

  // Products
  getProducts(search?: string, category?: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Services
  getServices(search?: string, category?: string): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;

  // Portfolio
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  getPortfolioItems(userId: number): Promise<PortfolioItem[]>;
}

export class DatabaseStorage implements IStorage {
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

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getProducts(search?: string, category?: string): Promise<Product[]> {
    let query = db.select().from(products);

    if (search) {
      const searchLower = `%${search.toLowerCase()}%`;
      query.where(
        or(
          ilike(products.title, searchLower),
          ilike(products.description, searchLower)
        )
      );
    }

    if (category) {
      query.where(eq(products.category, category));
    }

    return await query;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async getServices(search?: string, category?: string): Promise<Service[]> {
    let query = db.select().from(services);

    if (search) {
      const searchLower = `%${search.toLowerCase()}%`;
      query.where(
        or(
          ilike(services.name, searchLower),
          ilike(services.description, searchLower),
          ilike(services.serviceType, searchLower)
        )
      );
    }

    if (category) {
      query.where(eq(services.serviceType, category));
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
}

export const storage = new DatabaseStorage();