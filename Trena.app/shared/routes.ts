import { z } from 'zod';
import { insertProductSchema, insertServiceSchema, products, services, users } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products',
      input: z.object({
        search: z.string().optional(),
        category: z.string().optional(),
        priceMin: z.coerce.number().optional(),
        priceMax: z.coerce.number().optional(),
        location: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:id',
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/products',
      input: insertProductSchema,
      responses: {
        201: z.custom<typeof products.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/products/:id',
      responses: {
        200: z.object({ success: z.boolean() }),
        404: errorSchemas.notFound,
      },
    },
  },
  services: {
    list: {
      method: 'GET' as const,
      path: '/api/services',
      input: z.object({
        search: z.string().optional(),
        category: z.string().optional(),
        ratingMin: z.coerce.number().optional(),
        hourlyRateMin: z.coerce.number().optional(),
        hourlyRateMax: z.coerce.number().optional(),
        location: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof services.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/services/:id',
      responses: {
        200: z.custom<typeof services.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/services',
      input: insertServiceSchema,
      responses: {
        201: z.custom<typeof services.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  users: {
    getProfile: {
      method: 'GET' as const,
      path: '/api/users/:id/profile',
      responses: {
        200: z.object({
          user: z.custom<typeof users.$inferSelect>(),
          products: z.array(z.custom<typeof products.$inferSelect>()),
        }),
        404: errorSchemas.notFound,
      },
    },
    me: {
      method: "GET" as const,
      path: "/api/me",
      responses: {
        200: z.object({
          user: z.custom<typeof users.$inferSelect>(),
          products: z.array(z.custom<typeof products.$inferSelect>()),
          favorites: z.array(z.custom<typeof products.$inferSelect>()),
        }),
      },
      products: {
        method: 'GET' as const,
        path: '/api/me/products',
        responses: {
          200: z.array(z.custom<typeof products.$inferSelect>()),
        },
      },
    },
    updateMe: {
      method: 'PATCH' as const,
      path: '/api/me',
      input: z.custom<Partial<Pick<typeof users.$inferSelect, "name" | "location" | "bio" | "avatar" | "phone">>>(),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
