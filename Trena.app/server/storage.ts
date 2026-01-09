import { db, pool } from "./db";
import connectPgSimple from "connect-pg-simple";
import session from "express-session";
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
  favorites,
} from "@shared/schema";
import { eq, ilike, or, getTableColumns } from "drizzle-orm";

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
    sellerId?: number
  ): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // Services
  getServices(search?: string, category?: string): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;

  // Portfolio
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  getPortfolioItems(userId: number): Promise<PortfolioItem[]>;

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
    sellerId?: number
  ): Promise<Product[]> {
    let query = db.select().from(products);

    if (sellerId) {
      query.where(eq(products.sellerId, sellerId));
    }

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