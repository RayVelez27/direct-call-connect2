import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  fromCurrentUser: boolean;
  messageType: "text" | "image" | "media";
  isRead: boolean;
  timestamp: string;
}

export interface Conversation {
  partnerId: string;
  partnerName: string;
  partnerInitials: string;
  partnerImage?: string;
  partnerOnline: boolean;
  messages: ChatMessage[];
  lastMessageAt: string;
  unreadCount: number;
}

interface ConversationsContextValue {
  conversations: Conversation[];
  getConversation: (partnerId: string) => Conversation | undefined;
  startConversation: (partner: {
    id: string;
    name: string;
    initials: string;
    image?: string;
    online: boolean;
  }) => void;
  sendMessage: (
    recipientId: string,
    content: string,
    messageType?: "text" | "image" | "media"
  ) => Promise<void>;
  markAsRead: (partnerId: string) => Promise<void>;
  unreadCount: number;
  loading: boolean;
}

const ConversationsContext = createContext<ConversationsContextValue | null>(null);

interface DbMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  message_type: "text" | "image" | "media";
  content: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

function dbMsgToChat(msg: DbMessage, currentUserId: string): ChatMessage {
  return {
    id: msg.id,
    content: msg.content,
    senderId: msg.sender_id,
    fromCurrentUser: msg.sender_id === currentUserId,
    messageType: msg.message_type,
    isRead: msg.is_read,
    timestamp: msg.created_at,
  };
}

function formatMessageTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export { formatMessageTime };

export function ConversationsProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Track auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load conversations and subscribe to realtime
  useEffect(() => {
    if (!userId) {
      setConversations([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadConversations() {
      // Fetch all messages involving this user
      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order("created_at", { ascending: true });

      if (error || !messages || cancelled) {
        if (!cancelled) setLoading(false);
        return;
      }

      // Group messages by partner
      const partnerMap = new Map<string, DbMessage[]>();
      for (const msg of messages as DbMessage[]) {
        const partnerId =
          msg.sender_id === userId ? msg.recipient_id : msg.sender_id;
        if (!partnerMap.has(partnerId)) partnerMap.set(partnerId, []);
        partnerMap.get(partnerId)!.push(msg);
      }

      // Fetch partner profiles
      const partnerIds = Array.from(partnerMap.keys());
      if (partnerIds.length === 0) {
        if (!cancelled) {
          setConversations([]);
          setLoading(false);
        }
        return;
      }

      const [{ data: profiles }, { data: creatorProfiles }] = await Promise.all(
        [
          supabase
            .from("profiles")
            .select("id, email, avatar_url")
            .in("id", partnerIds),
          supabase
            .from("creator_profiles")
            .select("user_id, display_name, cover_photo_url, is_online")
            .in("user_id", partnerIds),
        ]
      );

      const profileMap = new Map(
        (profiles ?? []).map((p: any) => [p.id, p])
      );
      const creatorMap = new Map(
        (creatorProfiles ?? []).map((cp: any) => [cp.user_id, cp])
      );

      // Build conversations
      const convos: Conversation[] = partnerIds.map((partnerId) => {
        const msgs = partnerMap.get(partnerId)!;
        const profile = profileMap.get(partnerId) as any;
        const creator = creatorMap.get(partnerId) as any;

        const name =
          creator?.display_name || profile?.email?.split("@")[0] || "User";
        const initials = name
          .split(" ")
          .map((w: string) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        return {
          partnerId,
          partnerName: name,
          partnerInitials: initials,
          partnerImage: creator?.cover_photo_url || profile?.avatar_url,
          partnerOnline: creator?.is_online ?? false,
          messages: msgs.map((m) => dbMsgToChat(m, userId!)),
          lastMessageAt: msgs[msgs.length - 1].created_at,
          unreadCount: msgs.filter(
            (m) => m.recipient_id === userId && !m.is_read
          ).length,
        };
      });

      convos.sort(
        (a, b) =>
          new Date(b.lastMessageAt).getTime() -
          new Date(a.lastMessageAt).getTime()
      );

      if (!cancelled) {
        setConversations(convos);
        setLoading(false);
      }
    }

    loadConversations();

    // Subscribe to realtime for new messages
    const channel = supabase
      .channel(`user-messages-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => {
          const newMsg = payload.new as DbMessage;
          handleRealtimeMessage(newMsg);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `sender_id=eq.${userId}`,
        },
        (payload) => {
          const newMsg = payload.new as DbMessage;
          handleRealtimeMessage(newMsg);
        }
      )
      .subscribe();

    channelRef.current = channel;

    function handleRealtimeMessage(msg: DbMessage) {
      const partnerId =
        msg.sender_id === userId ? msg.recipient_id : msg.sender_id;
      const chatMsg = dbMsgToChat(msg, userId!);

      setConversations((prev) => {
        // Check if message already exists (dedup optimistic + realtime)
        const existing = prev.find((c) => c.partnerId === partnerId);
        if (existing?.messages.some((m) => m.id === chatMsg.id)) return prev;

        if (existing) {
          const updated = prev.map((c) => {
            if (c.partnerId !== partnerId) return c;
            return {
              ...c,
              messages: [...c.messages, chatMsg],
              lastMessageAt: msg.created_at,
              unreadCount:
                msg.recipient_id === userId && !msg.is_read
                  ? c.unreadCount + 1
                  : c.unreadCount,
            };
          });
          return updated.sort(
            (a, b) =>
              new Date(b.lastMessageAt).getTime() -
              new Date(a.lastMessageAt).getTime()
          );
        }

        // New conversation from unknown partner — fetch their profile
        fetchPartnerAndAddConvo(partnerId, chatMsg, msg.created_at);
        return prev;
      });
    }

    async function fetchPartnerAndAddConvo(
      partnerId: string,
      chatMsg: ChatMessage,
      timestamp: string
    ) {
      const [{ data: profile }, { data: creator }] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, email, avatar_url")
          .eq("id", partnerId)
          .maybeSingle(),
        supabase
          .from("creator_profiles")
          .select("user_id, display_name, cover_photo_url, is_online")
          .eq("user_id", partnerId)
          .maybeSingle(),
      ]);

      const name =
        creator?.display_name || profile?.email?.split("@")[0] || "User";
      const initials = name
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      const newConvo: Conversation = {
        partnerId,
        partnerName: name,
        partnerInitials: initials,
        partnerImage: creator?.cover_photo_url || profile?.avatar_url,
        partnerOnline: creator?.is_online ?? false,
        messages: [chatMsg],
        lastMessageAt: timestamp,
        unreadCount: chatMsg.fromCurrentUser ? 0 : 1,
      };

      setConversations((prev) => {
        if (prev.some((c) => c.partnerId === partnerId)) return prev;
        return [newConvo, ...prev];
      });
    }

    return () => {
      cancelled = true;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId]);

  const sendMessage = useCallback(
    async (
      recipientId: string,
      content: string,
      messageType: "text" | "image" | "media" = "text"
    ) => {
      if (!userId) return;

      // Optimistic local update
      const optimisticId = crypto.randomUUID();
      const now = new Date().toISOString();
      const optimisticMsg: ChatMessage = {
        id: optimisticId,
        content,
        senderId: userId,
        fromCurrentUser: true,
        messageType,
        isRead: false,
        timestamp: now,
      };

      setConversations((prev) => {
        const existing = prev.find((c) => c.partnerId === recipientId);
        if (existing) {
          const updated = prev.map((c) => {
            if (c.partnerId !== recipientId) return c;
            return {
              ...c,
              messages: [...c.messages, optimisticMsg],
              lastMessageAt: now,
            };
          });
          return updated.sort(
            (a, b) =>
              new Date(b.lastMessageAt).getTime() -
              new Date(a.lastMessageAt).getTime()
          );
        }
        return prev;
      });

      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: userId,
          recipient_id: recipientId,
          message_type: messageType,
          content,
        })
        .select()
        .single();

      if (error) {
        console.error("Failed to send message:", error);
        // Remove optimistic message on failure
        setConversations((prev) =>
          prev.map((c) => {
            if (c.partnerId !== recipientId) return c;
            return {
              ...c,
              messages: c.messages.filter((m) => m.id !== optimisticId),
            };
          })
        );
        return;
      }

      // Replace optimistic message with real one
      if (data) {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.partnerId !== recipientId) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === optimisticId ? dbMsgToChat(data as DbMessage, userId) : m
              ),
            };
          })
        );
      }
    },
    [userId]
  );

  const markAsRead = useCallback(
    async (partnerId: string) => {
      if (!userId) return;

      // Optimistic local update
      setConversations((prev) =>
        prev.map((c) =>
          c.partnerId === partnerId
            ? {
                ...c,
                unreadCount: 0,
                messages: c.messages.map((m) => ({ ...m, isRead: true })),
              }
            : c
        )
      );

      await supabase
        .from("messages")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("sender_id", partnerId)
        .eq("recipient_id", userId)
        .eq("is_read", false);
    },
    [userId]
  );

  const startConversation = useCallback(
    (partner: {
      id: string;
      name: string;
      initials: string;
      image?: string;
      online: boolean;
    }) => {
      setConversations((prev) => {
        if (prev.some((c) => c.partnerId === partner.id)) return prev;
        return [
          {
            partnerId: partner.id,
            partnerName: partner.name,
            partnerInitials: partner.initials,
            partnerImage: partner.image,
            partnerOnline: partner.online,
            messages: [],
            lastMessageAt: new Date().toISOString(),
            unreadCount: 0,
          },
          ...prev,
        ];
      });
    },
    []
  );

  const getConversation = useCallback(
    (partnerId: string) => {
      return conversations.find((c) => c.partnerId === partnerId);
    },
    [conversations]
  );

  const unreadCount = conversations.reduce(
    (acc, c) => acc + c.unreadCount,
    0
  );

  return (
    <ConversationsContext.Provider
      value={{
        conversations,
        getConversation,
        startConversation,
        sendMessage,
        markAsRead,
        unreadCount,
        loading,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}

export function useConversations() {
  const ctx = useContext(ConversationsContext);
  if (!ctx)
    throw new Error(
      "useConversations must be used within ConversationsProvider"
    );
  return ctx;
}
