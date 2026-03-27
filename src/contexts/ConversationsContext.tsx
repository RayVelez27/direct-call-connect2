import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export interface ChatMessage {
  id: string;
  content: string;
  fromUser: boolean;
  timestamp: string;
}

export interface Conversation {
  creatorId: number;
  creatorName: string;
  creatorInitials: string;
  creatorImage?: string;
  creatorOnline: boolean;
  messages: ChatMessage[];
  lastMessageAt: string;
}

interface ConversationsContextValue {
  conversations: Conversation[];
  getConversation: (creatorId: number) => Conversation | undefined;
  startConversation: (creator: { id: number; name: string; initials: string; images?: string[]; online: boolean }) => void;
  addMessage: (creatorId: number, content: string, fromUser: boolean) => void;
  unreadCount: number;
  loading: boolean;
}

const ConversationsContext = createContext<ConversationsContextValue | null>(null);

const STORAGE_KEY = "plezyy_conversations";

export function ConversationsProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function load() {
      if (userId) {
        const { data, error } = await supabase
          .from("user_conversations_json")
          .select("conversations")
          .eq("user_id", userId)
          .maybeSingle();

        if (!error && data?.conversations) {
          setConversations(data.conversations);
        } else {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              setConversations(parsed);
              await supabase.from("user_conversations_json").upsert(
                { user_id: userId, conversations: parsed },
                { onConflict: "user_id" }
              );
              localStorage.removeItem(STORAGE_KEY);
            } catch { /* ignore */ }
          }
        }
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try { setConversations(JSON.parse(stored)); } catch { /* ignore */ }
        }
      }
      setLoading(false);
    }
    load();
  }, [userId]);

  const persist = useCallback(async (updated: Conversation[]) => {
    if (userId) {
      await supabase.from("user_conversations_json").upsert(
        { user_id: userId, conversations: updated },
        { onConflict: "user_id" }
      );
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  }, [userId]);

  const startConversation = useCallback((creator: { id: number; name: string; initials: string; images?: string[]; online: boolean }) => {
    setConversations((prev) => {
      if (prev.some((c) => c.creatorId === creator.id)) return prev;
      const updated: Conversation[] = [
        {
          creatorId: creator.id,
          creatorName: creator.name,
          creatorInitials: creator.initials,
          creatorImage: creator.images?.[0],
          creatorOnline: creator.online,
          messages: [],
          lastMessageAt: new Date().toISOString(),
        },
        ...prev,
      ];
      persist(updated);
      return updated;
    });
  }, [persist]);

  const getConversation = useCallback((creatorId: number) => {
    return conversations.find((c) => c.creatorId === creatorId);
  }, [conversations]);

  const addMessage = useCallback((creatorId: number, content: string, fromUser: boolean) => {
    setConversations((prev) => {
      const updated = prev.map((c) => {
        if (c.creatorId !== creatorId) return c;
        return {
          ...c,
          messages: [
            ...c.messages,
            {
              id: crypto.randomUUID(),
              content,
              fromUser,
              timestamp: new Date().toISOString(),
            },
          ],
          lastMessageAt: new Date().toISOString(),
        };
      });
      persist(updated);
      return updated;
    });
  }, [persist]);

  const unreadCount = conversations.reduce((acc, c) => {
    const lastMsg = c.messages[c.messages.length - 1];
    if (lastMsg && !lastMsg.fromUser) return acc + 1;
    return acc;
  }, 0);

  return (
    <ConversationsContext.Provider value={{ conversations, getConversation, startConversation, addMessage, unreadCount, loading }}>
      {children}
    </ConversationsContext.Provider>
  );
}

export function useConversations() {
  const ctx = useContext(ConversationsContext);
  if (!ctx) throw new Error("useConversations must be used within ConversationsProvider");
  return ctx;
}
