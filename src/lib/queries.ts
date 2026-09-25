import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type News = Tables<"news">;
export type Spotlight = Tables<"spotlights">;
export type Event = Tables<"events">;

export const newsQuery = queryOptions({
  queryKey: ["news"],
  queryFn: async (): Promise<News[]> => {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const spotlightsQuery = queryOptions({
  queryKey: ["spotlights"],
  queryFn: async (): Promise<Spotlight[]> => {
    const { data, error } = await supabase
      .from("spotlights")
      .select("*")
      .order("featured_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const eventsQuery = queryOptions({
  queryKey: ["events"],
  queryFn: async (): Promise<Event[]> => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });
    if (error) throw error;
    return data;
  },
});

export const CLUB_NAME = "The Literary Society";
export const CLUB_TAGLINE = "The College Poetry Club";

export const imageUrl = (path: string) => `/api/public/images/${path}`;
