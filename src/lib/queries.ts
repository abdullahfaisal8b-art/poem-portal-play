import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type News = Tables<"news">;
export type Spotlight = Tables<"spotlights">;
export type Event = Tables<"events">;
export type Corner = Tables<"corner">;
export type Submission = Tables<"submissions">;

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

export const cornerQuery = queryOptions({
  queryKey: ["corner"],
  queryFn: async (): Promise<Corner[]> => {
    const { data, error } = await supabase
      .from("corner")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const CLUB_NAME = "The Literary Society";
export const CLUB_TAGLINE = "The College Poetry Club";

/** The six main menu items, in order. Archive lives on its own bar. */
export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/campus", label: "Campus" },
  { to: "/spotlight", label: "Spotlights" },
  { to: "/creative", label: "Creative" },
  { to: "/interactive", label: "Interactive" },
  { to: "/events", label: "Events" },
] as const;

export const imageUrl = (path: string) => `/api/public/images/${path}`;
