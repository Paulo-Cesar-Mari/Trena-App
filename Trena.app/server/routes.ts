import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth } from "./auth";
import { seedDatabase } from "./seed-data";
import { User as SelectUser } from "@shared/schema";
import multer from "multer";
import path from "path";

// Set up storage for uploaded files
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Trena.app/server/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: multerStorage });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Autenticação
  setupAuth(app);

  // Rota para semear o banco de dados
  app.get("/api/seed", async (req, res) => {
    try {
      await seedDatabase();
      res.status(200).send("Banco de dados semeado com sucesso!");
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao semear o banco de dados.");
    }
  });

  // Produtos
  app.get(api.products.list.path, async (req, res) => {
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;
    const products = await storage.getProducts(search, category);
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
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
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  // Serviços
  app.get(api.services.list.path, async (req, res) => {
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;
    const services = await storage.getServices(search, category);
    res.json(services);
  });

  app.get(api.services.get.path, async (req, res) => {
    const service = await storage.getService(Number(req.params.id));
    if (!service) {
      return res.status(404).json({ message: "Serviço não encontrado" });
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
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  // User Profile
  app.get(api.users.getProfile.path, async (req, res) => {
    const profile = await storage.getUserProfile(Number(req.params.id));
    if (!profile) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.json(profile);
  });

  app.get(api.users.me.products.path, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    const user = req.user as SelectUser;
    const products = await storage.getProducts(undefined, undefined, user.id);
    res.json(products);
  });

  app.get(api.users.me.path, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    const user = req.user as SelectUser;
    const profile = await storage.getCurrentUserProfile(user.id);
    if (!profile) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.json(profile);
  });

  // Portfolio Upload
  app.post(
    "/api/users/:id/portfolio",
    upload.single("image"),
    async (req, res) => {
      if (!req.file) {
        return res.status(400).json({ message: "Nenhuma imagem enviada." });
      }

      const userId = Number(req.params.id);
      const imageUrl = `/uploads/${req.file.filename}`;
      const caption = req.body.caption || "";

      try {
        const portfolioItem = await storage.createPortfolioItem({
          userId,
          imageUrl,
          caption,
        });
        res.status(201).json(portfolioItem);
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ message: "Erro ao salvar o item do portfólio." });
      }
    }
  );

  return httpServer;
}