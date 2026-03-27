import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export interface FavoriteCreator {
  id: number;
  name: string;
  initials: string;
  tagline: string;
  images?: string[];
  online: boolean;
  price: string;
  per: string;
  location: string;
}

interface FavoritesContextValue {
  favorites: FavoriteCreator[];
  isFavorite: (creatorId: number) => boolean;
  addFavorite: (creator: FavoriteCreator) => void;
  removeFavorite: (creatorId: number) => void;
  toggleFavorite: (creator: FavoriteCreator) => void;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const STORAGE_KEY = "plezyy_favorites";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteCreator[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Get current user
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load favorites from Supabase or localStorage
  useEffect(() => {
    async function load() {
      if (userId) {
        const { data, error } = await supabase
          .from("user_favorites_json")
          .select("favorites")
          .eq("user_id", userId)
          .maybeSingle();

        if (!error && data?.favorites) {
          setFavorites(data.favorites);
        } else {
          // Try loading from localStorage (pre-login state)
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              setFavorites(parsed);
              // Migrate localStorage to Supabase
              await supabase.from("user_favorites_json").upsert(
                { user_id: userId, favorites: parsed },
                { onConflict: "user_id" }
              );
              localStorage.removeItem(STORAGE_KEY);
            } catch { /* ignore parse errors */ }
          }
        }
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try { setFavorites(JSON.parse(stored)); } catch { /* ignore */ }
        }
      }
      setLoading(false);
    }
    load();
  }, [userId]);

  // Persist whenever favorites change
  const persist = useCallback(async (updated: FavoriteCreator[]) => {
    if (userId) {
      await supabase.from("user_favorites_json").upsert(
        { user_id: userId, favorites: updated },
        { onConflict: "user_id" }
      );
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  }, [userId]);

  const isFavorite = useCallback((creatorId: number) => {
    return favorites.some((f) => f.id === creatorId);
  }, [favorites]);

  const addFavorite = useCallback((creator: FavoriteCreator) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === creator.id)) return prev;
      const updated = [creator, ...prev];
      persist(updated);
      return updated;
    });
  }, [persist]);

  const removeFavorite = useCallback((creatorId: number) => {
    setFavorites((prev) => {
      const updated = prev.filter((f) => f.id !== creatorId);
      persist(updated);
      return updated;
    });
  }, [persist]);

  const toggleFavorite = useCallback((creator: FavoriteCreator) => {
    if (isFavorite(creator.id)) {
      removeFavorite(creator.id);
    } else {
      addFavorite(creator);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
