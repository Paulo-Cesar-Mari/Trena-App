import { QueryClient } from "@tanstack/react-query";
import { hc } from 'hono/client'
import type { AppType } from '../../../server/app'

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const client = hc<AppType>(import.meta.env.VITE_API_BASE_URL);

export const api = client.api;
