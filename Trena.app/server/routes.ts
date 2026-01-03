import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Products
  app.get(api.products.list.path, async (req, res) => {
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;
    const products = await storage.getProducts(search, category);
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json(product);
  });

  app.post(api.products.create.path, async (req, res) => {
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Services
  app.get(api.services.list.path, async (req, res) => {
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;
    const services = await storage.getServices(search, category);
    res.json(services);
  });

  app.get(api.services.get.path, async (req, res) => {
    const service = await storage.getService(Number(req.params.id));
    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }
    res.json(service);
  });

  app.post(api.services.create.path, async (req, res) => {
    try {
      const input = api.services.create.input.parse(req.body);
      const service = await storage.createService(input);
      res.status(201).json(service);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    // Seed Products
    await storage.createProduct({
      title: "Cimento Votoran 50kg",
      description: "Cimento de alta qualidade para todas as obras.",
      category: "Cimento",
      price: "35.90",
      location: "São Paulo, SP",
      storeName: "Depósito do Zé",
      image: "https://placehold.co/600x400?text=Cimento+Votoran",
    });
    await storage.createProduct({
      title: "Tinta Suvinil Fosco Completo",
      description: "Tinta acrílica fosca, cor Branco Neve, 18L.",
      category: "Tinta",
      price: "349.90",
      location: "Rio de Janeiro, RJ",
      storeName: "Casa da Cor",
      image: "https://placehold.co/600x400?text=Tinta+Suvinil",
    });
    await storage.createProduct({
      title: "Kit Ferramentas Básicas",
      description: "Martelo, chaves de fenda, alicate e trena.",
      category: "Ferramentas",
      price: "89.90",
      location: "Belo Horizonte, MG",
      storeName: "Ferramentas & Cia",
      image: "https://placehold.co/600x400?text=Kit+Ferramentas",
    });
    
    // Seed Services
    await storage.createService({
      name: "João Silva",
      serviceType: "Pedreiro",
      description: "Pedreiro com 20 anos de experiência em alvenaria e acabamento.",
      location: "São Paulo, SP",
      contactInfo: "(11) 99999-9999",
      rating: "4.9",
      image: "https://placehold.co/400x400?text=Pedreiro",
    });
    await storage.createService({
      name: "Eletricista Rápido",
      serviceType: "Eletricista",
      description: "Instalações elétricas residenciais e comerciais. Atendimento 24h.",
      location: "Curitiba, PR",
      contactInfo: "(41) 88888-8888",
      rating: "5.0",
      image: "https://placehold.co/400x400?text=Eletricista",
    });
  }
}
