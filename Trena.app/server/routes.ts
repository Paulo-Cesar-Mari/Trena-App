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
    const {
      search,
      category,
      priceMin,
      priceMax,
      location
    } = api.products.list.input.parse(req.query) ?? {};

    const products = await storage.getProducts(
      search,
      category,
      undefined,
      priceMin,
      priceMax,
      location
    );
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

  app.delete(api.products.delete.path, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    const user = req.user as SelectUser;
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }
    if (product.sellerId !== user.id) {
      return res.status(403).json({ message: "Não autorizado" });
    }
    await storage.deleteProduct(Number(req.params.id));
    res.json({ success: true });
  });

  // Serviços
  app.get(api.services.list.path, async (req, res) => {
    const {
      search,
      category,
      ratingMin,
      hourlyRateMin,
      hourlyRateMax,
      location,
    } = api.services.list.input.parse(req.query) ?? {};

    const services = await storage.getServices(
      search,
      category,
      ratingMin,
      hourlyRateMin,
      hourlyRateMax,
      location
    );
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

  app.patch(api.users.updateMe.path, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Não autenticado" });
    }
    const user = req.user as SelectUser;

    try {
        const input = api.users.updateMe.input.parse(req.body);
        const updatedUser = await storage.updateUser(user.id, input);
        res.json(updatedUser);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({
                message: err.errors[0].message,
                field: err.errors[0].path.join('.'),
            });
        }
        console.error("Erro ao atualizar o usuário:", err);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
  });

  app.get(api.users.products.path, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    const user = req.user as SelectUser;
    const products = await storage.getProducts(undefined, undefined, user.id);
    res.json(products);
  });

  // MESSAGES
  app.get(api.messages.getConversations.path, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    const user = req.user as SelectUser;
    const conversations = await storage.getConversations(user.id);
    res.json(conversations);
  });

  app.get(api.messages.getMessages.path, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    const user = req.user as SelectUser;
    const otherUserId = Number(req.params.id);
    const messages = await storage.getMessagesBetweenUsers(user.id, otherUserId);
    res.json(messages);
  });

  app.post(api.messages.sendMessage.path, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    const user = req.user as SelectUser;
    const otherUserId = Number(req.params.id);
    const { content } = api.messages.sendMessage.input.parse(req.body);

    const message = await storage.createMessage({
      senderId: user.id,
      receiverId: otherUserId,
      content,
    });

    // Criar notificação para o destinatário
    const sender = await storage.getUser(user.id);
    if (sender) {
        await storage.createNotification(
            otherUserId,
            `Você recebeu uma nova mensagem de ${sender.name}.`,
            `/inbox/${user.id}`
        );
    }

    res.status(201).json(message);
  });

  // Notifications
    app.get(api.notifications.list.path, async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: "Não autenticado" });
        }
        const user = req.user as SelectUser;
        const notifications = await storage.getNotifications(user.id);
        res.json(notifications);
    });

    app.post(api.notifications.markAsRead.path, async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: "Não autenticado" });
        }
        const user = req.user as SelectUser;
        const { notificationIds } = api.notifications.markAsRead.input.parse(req.body);
        await storage.markNotificationsAsRead(user.id, notificationIds);
        res.json({ success: true });
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

  // Reviews
  app.post(api.reviews.create.path, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    const user = req.user as SelectUser;

    try {
      const input = api.reviews.create.input.parse({
        ...req.body,
        authorId: user.id,
      });
      const review = await storage.createReview(input);
      res.status(201).json(review);
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

  app.get(api.reviews.list.path, async (req, res) => {
    const reviews = await storage.getReviewsByTarget(
      Number(req.params.targetId)
    );
    res.json(reviews);
  });

  // Favorites
  app.get(api.favorites.list.path, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    const user = req.user as SelectUser;
    const favorites = await storage.getFavorites(user.id);
    res.json(favorites);
  });

  app.post(api.favorites.add.path, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    const user = req.user as SelectUser;
    const { productId, serviceId } = api.favorites.add.input.parse(req.body);
    await storage.addFavorite(user.id, productId ?? null, serviceId ?? null);
    res.json({ success: true });
  });

  app.delete(api.favorites.remove.path, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    const user = req.user as SelectUser;
    const { productId, serviceId } = api.favorites.remove.input.parse(req.body);
    await storage.removeFavorite(user.id, productId ?? null, serviceId ?? null);
    res.json({ success: true });
  });

  return httpServer;
}
