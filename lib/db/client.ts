import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { PhotoEvent, PhotoFilters } from "@/lib/types";
import {
  mockEvents,
  mockGetConstruction,
  mockGetPhotoById,
  mockGetPhotos,
  mockTrackView,
} from "@/lib/db/mock";
import { getSupabaseClient } from "@/lib/db/supabase";

type PhotoCallback = (event: PhotoEvent) => void;

const wsUrl = "ws://127.0.0.1:14567";

export function isSupabaseReady() {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getRuntimeBanner() {
  if (env.NEXT_PUBLIC_MODE === "supabase" && !isSupabaseReady()) {
    return "Running in Mock mode: Supabase keys missing";
  }
  return null;
}

export async function getPhotos(filters?: PhotoFilters) {
  if (env.NEXT_PUBLIC_MODE === "supabase") {
    const supabase = getSupabaseClient();
    if (supabase) {
      let query = supabase.from("photos").select("*").order("createdAt", { ascending: false });
      if (filters?.tag) {
        query = query.contains("tags", [filters.tag]);
      }
      if (filters?.search) {
        query = query.ilike("title", `%${filters.search}%`);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        return data as ReturnType<typeof mockGetPhotos>;
      }
      logger.warn("Supabase photos query failed, falling back to mock", error?.message);
    }
  }

  return mockGetPhotos(filters);
}

export async function getPhotoById(id: string) {
  if (env.NEXT_PUBLIC_MODE === "supabase") {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.from("photos").select("*").eq("id", id).single();
      if (!error && data) {
        return data as ReturnType<typeof mockGetPhotoById>;
      }
      logger.warn("Supabase photo query failed, falling back to mock", error?.message);
    }
  }

  return mockGetPhotoById(id);
}

export async function getConstruction(id: string) {
  if (env.NEXT_PUBLIC_MODE === "supabase") {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("construction")
        .select("*")
        .eq("photoId", id)
        .single();
      if (!error && data) {
        return data as ReturnType<typeof mockGetConstruction>;
      }
      logger.warn(
        "Supabase construction query failed, falling back to mock",
        error?.message,
      );
    }
  }

  return mockGetConstruction(id);
}

export async function trackView(photoId: string) {
  return mockTrackView(photoId);
}

function subscribeWithSSE(callback: PhotoCallback) {
  const source = new EventSource("/api/events");
  source.onmessage = (event) => {
    try {
      callback(JSON.parse(event.data) as PhotoEvent);
    } catch (error) {
      logger.warn("Invalid SSE payload", error);
    }
  };
  source.onerror = () => {
    source.close();
  };
  return () => source.close();
}

export function subscribeToPhotos(callback: PhotoCallback) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  if (env.NEXT_PUBLIC_MODE === "supabase") {
    const supabase = getSupabaseClient();

    if (supabase) {
      const channel = supabase
        .channel("photo-events")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "photos" },
          (payload) => {
            const nextPayload = payload.new as Record<string, unknown> | null;
            callback({
              type: "updated",
              photoId: String(nextPayload?.id ?? "unknown"),
              createdAt: new Date().toISOString(),
              payload: (nextPayload ?? undefined) as Record<string, unknown> | undefined,
            });
          },
        )
        .subscribe();

      return () => {
        void supabase.removeChannel(channel);
      };
    }
  }

  try {
    const socket = new WebSocket(wsUrl);
    let opened = false;
    let sseCleanup: (() => void) | null = null;

    const startSSEFallback = () => {
      if (!sseCleanup) {
        logger.info("WebSocket unavailable, using SSE events");
        sseCleanup = subscribeWithSSE(callback);
      }
    };

    socket.addEventListener("open", () => {
      opened = true;
    });

    socket.addEventListener("message", (event) => {
      try {
        const parsed = JSON.parse(event.data) as PhotoEvent;
        callback(parsed);
      } catch (error) {
        logger.warn("Invalid websocket payload", error);
      }
    });

    socket.addEventListener("error", () => {
      if (!opened) {
        startSSEFallback();
      }
      socket.close();
    });

    socket.addEventListener("close", () => {
      if (!opened) {
        startSSEFallback();
      }
    });

    const fallbackTimeout = window.setTimeout(() => {
      if (!opened) {
        startSSEFallback();
        socket.close();
      }
    }, 1200);

    return () => {
      window.clearTimeout(fallbackTimeout);
      socket.close();
      sseCleanup?.();
    };
  } catch {
    logger.info("WebSocket setup failed, falling back to SSE");
    return subscribeWithSSE(callback);
  }
}

export function getMockEventSeed() {
  return mockEvents();
}
