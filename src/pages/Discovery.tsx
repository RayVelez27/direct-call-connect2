import { useState, useRef, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useConversations } from "@/contexts/ConversationsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  Heart,
  BadgeCheck,
  Clock,
  Video,
  MessageCircle,
  Sparkles,
  TrendingUp,
  MapPin,
  SlidersHorizontal,
  X,
  Quote,
  Shield,
  Eye,
  RotateCcw,
  Star,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import categoriesData from "@/data/categories.json";

interface CategoryItem {
  name: string;
  count?: number;
}

interface CategoryGroup {
  title: string;
  items: CategoryItem[];
}

interface CategorySection {
  heading: string;
  groups: CategoryGroup[];
}

const categorySections: CategorySection[] = (categoriesData as CategorySection[]).filter(
  (s) => s.heading !== "Main"
);

interface Review {
  text: string;
  author: string;
  rating: number; // 1–5
}

interface Creator {
  id: number;
  userId?: string; // Supabase UUID — needed for real chat
  name: string;
  initials: string;
  tagline: string;
  bio: string;
  tags: string[];
  age: number;
  price: string;
  per: string;
  location: string;
  badge: string;
  online: boolean;
  successRate: string;
  earned: string;
  quote: string;
  quoteAuthor: string;
  reviews?: Review[];
  images?: string[];
}

const creators: Creator[] = [
  {
    id: 1,
    name: "Valentina S.",
    initials: "VS",
    tagline: "Latina Creator — Striptease & GFE Specialist",
    bio: "Colombian babe who loves making you feel good. I offer private 1-on-1 live video sessions tailored to exactly what you want — striptease, dirty talk, JOI, roleplay, or a fun naked hangout.",
    tags: ["Striptease", "GFE", "Dirty Talk", "Roleplay"],
    age: 26,
    price: "$55",
    per: "session",
    location: "Colombia",
    badge: "top_rated_plus",
    online: true,
    successRate: "99%",
    earned: "312 sessions",
    quote: "Absolutely incredible experience. She made me feel so comfortable and the whole session was exactly what I wanted.",
    quoteAuthor: "Mike R.",
    images: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 2,
    name: "Sophia L.",
    initials: "SL",
    tagline: "Cam Model & Custom Content Creator",
    bio: "Petite and playful — I specialize in interactive toy shows, custom video requests, and intimate one-on-one video calls. Tell me your fantasy and let's make it real.",
    tags: ["Toy Play", "Custom Content", "Video Calls", "Interactive"],
    age: 23,
    price: "$45",
    per: "session",
    location: "United States",
    badge: "top_rated",
    online: true,
    successRate: "98%",
    earned: "189 sessions",
    quote: "Sophia is so much fun. She's creative, engaging, and makes every session unique. Highly recommend the premium tier.",
    quoteAuthor: "David K.",
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 3,
    name: "Luna M.",
    initials: "LM",
    tagline: "Fetish & Kink Specialist — Domme Sessions",
    bio: "Your favorite bratty domme. I specialize in femdom, humiliation, foot worship, JOI, and everything in between. Beginners welcome — I'll guide you through it.",
    tags: ["Femdom", "JOI", "Foot Fetish", "Humiliation"],
    age: 29,
    price: "$75",
    per: "session",
    location: "United Kingdom",
    badge: "top_rated_plus",
    online: false,
    successRate: "100%",
    earned: "278 sessions",
    quote: "Luna knows exactly how to take control. The session was intense and perfectly paced. Already booked my next one.",
    quoteAuthor: "Tyler J.",
    images: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 4,
    name: "Aria N.",
    initials: "AN",
    tagline: "Girlfriend Experience & Date Companion",
    bio: "Sweet, flirty, and genuinely fun to be around. I offer the full girlfriend experience — video dates, casual chats, sexting, and more. Let's connect for real.",
    tags: ["GFE", "Video Date", "Sexting", "Companionship"],
    age: 22,
    price: "$35",
    per: "session",
    location: "Canada",
    badge: "rising",
    online: true,
    successRate: "97%",
    earned: "72 sessions",
    quote: "Aria is the real deal — warm, engaging, and makes you feel like the only person in the world. Best GFE on the platform.",
    quoteAuthor: "Jake P.",
    images: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 5,
    name: "Carmen B.",
    initials: "CB",
    tagline: "Cosplay & Roleplay Fantasy Creator",
    bio: "Anime babe IRL. I do cosplay shows, themed roleplay sessions, and custom content in your favorite characters. From schoolgirl to succubus — pick your fantasy.",
    tags: ["Cosplay", "Roleplay", "Anime", "Fantasy"],
    age: 25,
    price: "$60",
    per: "session",
    location: "Germany",
    badge: "top_rated",
    online: true,
    successRate: "99%",
    earned: "145 sessions",
    quote: "Carmen's cosplay sessions are insane. The effort she puts into costumes and character is next level. 11/10.",
    quoteAuthor: "Alex M.",
    images: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1496440737103-cd596325d314?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 6,
    name: "Mia K.",
    initials: "MK",
    tagline: "ASMR & Sensual Whisper Sessions",
    bio: "Let me whisper sweet nothings in your ear. I specialize in erotic ASMR, mouth sounds, and intimate whisper sessions that'll give you chills all over.",
    tags: ["ASMR", "Whisper", "Sensual", "Relaxation"],
    age: 24,
    price: "$40",
    per: "session",
    location: "South Korea",
    badge: "top_rated_plus",
    online: true,
    successRate: "99%",
    earned: "267 sessions",
    quote: "Mia's ASMR sessions are on another level. So relaxing and intimate. I book her every week now.",
    quoteAuthor: "Chris W.",
    images: [
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 7,
    name: "Jade T.",
    initials: "JT",
    tagline: "Thick & Curvy — Body Worship Queen",
    bio: "Big girl energy. I offer body worship sessions, oil shows, twerking performances, and custom videos celebrating every curve. Confidence is my superpower.",
    tags: ["Body Worship", "Twerk", "Oil Show", "Custom Video"],
    age: 27,
    price: "$50",
    per: "session",
    location: "United States",
    badge: "top_rated",
    online: false,
    successRate: "98%",
    earned: "156 sessions",
    quote: "Jade is absolutely stunning and so confident. Her oil shows are mesmerizing. 10/10 would book again.",
    quoteAuthor: "Brandon L.",
    images: [
      "https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1496440737103-cd596325d314?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 8,
    name: "Natasha R.",
    initials: "NR",
    tagline: "Russian Bombshell — Premium Live Shows",
    bio: "Blonde, bold, and irresistible. I host premium live cam shows with toy play, stripteases, and interactive requests. VIP members get exclusive content drops.",
    tags: ["Live Shows", "Toy Play", "Striptease", "VIP"],
    age: 28,
    price: "$80",
    per: "session",
    location: "Russia",
    badge: "top_rated_plus",
    online: true,
    successRate: "100%",
    earned: "445 sessions",
    quote: "Natasha is in a league of her own. Premium experience from start to finish. Worth every penny.",
    quoteAuthor: "James D.",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 9,
    name: "Priya D.",
    initials: "PD",
    tagline: "Exotic Dancer & Bollywood Themed Shows",
    bio: "Bringing the heat with Bollywood-inspired dance shows, belly dancing, and sensual performances. I blend culture with seduction in every session.",
    tags: ["Dance", "Bollywood", "Belly Dance", "Exotic"],
    age: 25,
    price: "$45",
    per: "session",
    location: "India",
    badge: "rising",
    online: true,
    successRate: "97%",
    earned: "84 sessions",
    quote: "Priya's dance performances are mesmerizing. So talented and gorgeous. A truly unique experience.",
    quoteAuthor: "Ryan S.",
    images: [
      "https://images.unsplash.com/photo-1514315384763-ba401779410f?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 10,
    name: "Zara H.",
    initials: "ZH",
    tagline: "JOI Expert & Dirty Talk Goddess",
    bio: "I'll tell you exactly what to do and how to do it. My JOI sessions are immersive, intense, and tailored to your pace. From gentle encouragement to full-on verbal domination.",
    tags: ["JOI", "Dirty Talk", "Verbal Dom", "Interactive"],
    age: 30,
    price: "$55",
    per: "session",
    location: "Australia",
    badge: "top_rated",
    online: false,
    successRate: "99%",
    earned: "289 sessions",
    quote: "Zara has the most incredible voice and knows exactly what to say. Her JOI sessions are unmatched.",
    quoteAuthor: "Nathan G.",
    images: [
      "https://images.unsplash.com/photo-1464863979621-258859e62245?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 11,
    name: "Chloe F.",
    initials: "CF",
    tagline: "Girl Next Door — Casual & Intimate",
    bio: "I'm the cute girl next door you always had a crush on. Casual hangouts, flirty chats, strip poker, and low-key fun. No pressure, just good vibes.",
    tags: ["GFE", "Casual", "Flirty Chat", "Strip Games"],
    age: 21,
    price: "$35",
    per: "session",
    location: "United States",
    badge: "rising",
    online: true,
    successRate: "96%",
    earned: "112 sessions",
    quote: "Chloe is so easy to talk to. Feels like hanging out with someone you've known forever. Super chill and fun.",
    quoteAuthor: "Matt H.",
    images: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 12,
    name: "Yuki A.",
    initials: "YA",
    tagline: "Anime Cosplay & Ahegao Specialist",
    bio: "Your 2D waifu brought to life. I specialize in anime cosplay shows, ahegao faces, schoolgirl roleplay, and kawaii content. Full costume, full commitment.",
    tags: ["Anime", "Ahegao", "Cosplay", "Kawaii"],
    age: 23,
    price: "$65",
    per: "session",
    location: "Japan",
    badge: "top_rated_plus",
    online: false,
    successRate: "100%",
    earned: "198 sessions",
    quote: "Yuki's cosplay game is elite. She completely transforms into the character. Mind-blowing dedication.",
    quoteAuthor: "Derek C.",
    images: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 13,
    name: "Isabella V.",
    initials: "IV",
    tagline: "Luxury GFE & Sugar Baby Experience",
    bio: "High-class, elegant, and sophisticated. I offer the ultimate luxury girlfriend experience — champagne chats, lingerie shows, and intimate connections for refined tastes.",
    tags: ["Luxury GFE", "Lingerie", "Elegant", "Sugar Baby"],
    age: 27,
    price: "$100",
    per: "session",
    location: "Italy",
    badge: "top_rated",
    online: true,
    successRate: "99%",
    earned: "201 sessions",
    quote: "Isabella is pure class. The most elegant and sophisticated creator on the platform. A true premium experience.",
    quoteAuthor: "William T.",
    images: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 14,
    name: "Destiny W.",
    initials: "DW",
    tagline: "Ebony Goddess — Oil & Tease Shows",
    bio: "Chocolate queen with curves that don't quit. I do slow tease shows, oily body rubs on cam, and interactive sessions where you control the vibe.",
    tags: ["Oil Show", "Tease", "Interactive", "Body Play"],
    age: 26,
    price: "$50",
    per: "session",
    location: "United States",
    badge: "top_rated",
    online: true,
    successRate: "98%",
    earned: "134 sessions",
    quote: "Destiny is absolutely gorgeous and her tease game is incredible. She builds the tension perfectly.",
    quoteAuthor: "Marcus B.",
    images: [
      "https://images.unsplash.com/photo-1523264653568-d1c129289364?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 15,
    name: "Elsa N.",
    initials: "EN",
    tagline: "Scandinavian Beauty — Fitness & Flex",
    bio: "Swedish fitness model who loves showing off. I combine workout routines with strip teases, yoga sessions in minimal clothing, and athletic content.",
    tags: ["Fitness", "Yoga", "Striptease", "Athletic"],
    age: 24,
    price: "$45",
    per: "session",
    location: "Sweden",
    badge: "rising",
    online: false,
    successRate: "97%",
    earned: "91 sessions",
    quote: "Elsa's fitness sessions are both motivating and incredibly sexy. She has an amazing physique and personality.",
    quoteAuthor: "Kevin R.",
    images: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1496440737103-cd596325d314?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 16,
    name: "Amber J.",
    initials: "AJ",
    tagline: "Tatted Alt Girl — Punk & Goth Vibes",
    bio: "Heavily tattooed, pierced, and unapologetically alternative. Goth girlfriend vibes, punk strip shows, and edgy custom content for those who like it dark.",
    tags: ["Alt/Goth", "Tattoos", "Punk", "Edgy Content"],
    age: 26,
    price: "$55",
    per: "session",
    location: "United Kingdom",
    badge: "top_rated",
    online: true,
    successRate: "99%",
    earned: "178 sessions",
    quote: "Amber is absolutely stunning. Her tattoos, her attitude, everything about her sessions is fire. Best alt creator out there.",
    quoteAuthor: "Zach T.",
    images: [
      "https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1464863979621-258859e62245?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 17,
    name: "Mei L.",
    initials: "ML",
    tagline: "Petite Asian — Innocent Looks, Wild Sessions",
    bio: "Don't let the cute face fool you. I go from innocent to wild in seconds. Petite body, big personality. Specializing in teasing, roleplay, and surprise reveals.",
    tags: ["Petite", "Roleplay", "Tease", "Surprise"],
    age: 22,
    price: "$50",
    per: "session",
    location: "Taiwan",
    badge: "top_rated_plus",
    online: true,
    successRate: "100%",
    earned: "334 sessions",
    quote: "Mei is full of surprises. Every session is different and exciting. She keeps you on the edge of your seat.",
    quoteAuthor: "Jason L.",
    images: [
      "https://images.unsplash.com/photo-1514315384763-ba401779410f?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 18,
    name: "Savannah P.",
    initials: "SP",
    tagline: "Southern Belle — Sweet Talk & Striptease",
    bio: "Country girl with a naughty side. Y'all aren't ready for my slow southern drawl combined with a steamy striptease. Cowgirl boots stay on.",
    tags: ["Southern", "Striptease", "Sweet Talk", "Cowgirl"],
    age: 24,
    price: "$40",
    per: "session",
    location: "United States",
    badge: "rising",
    online: false,
    successRate: "98%",
    earned: "103 sessions",
    quote: "Savannah's accent alone is worth the session. Add the striptease and it's game over. So charming and sexy.",
    quoteAuthor: "Travis K.",
    images: [
      "https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 19,
    name: "Freya O.",
    initials: "FO",
    tagline: "Redhead Bombshell — Fiery & Fearless",
    bio: "Natural redhead who brings the fire. I do everything from sensual slow burns to fast-paced toy shows. My sessions are as intense as my hair color.",
    tags: ["Redhead", "Toy Play", "Sensual", "Intense"],
    age: 27,
    price: "$60",
    per: "session",
    location: "Ireland",
    badge: "top_rated",
    online: true,
    successRate: "99%",
    earned: "215 sessions",
    quote: "Freya lives up to the redhead reputation. Fiery, passionate, and unforgettable. One of my all-time favorites.",
    quoteAuthor: "Connor M.",
    images: [
      "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 20,
    name: "Bianca M.",
    initials: "BM",
    tagline: "Brazilian Samba & Dance Shows",
    bio: "Carnival queen energy all year round. I do samba dance shows, booty shaking performances, and full Brazilian wax reveals. Come join the party.",
    tags: ["Samba", "Dance", "Brazilian", "Party"],
    age: 25,
    price: "$45",
    per: "session",
    location: "Brazil",
    badge: "top_rated",
    online: true,
    successRate: "98%",
    earned: "149 sessions",
    quote: "Bianca is a party in human form. Her energy is infectious and her dance moves are incredible. Loved every second.",
    quoteAuthor: "Carlos R.",
    images: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 21,
    name: "Layla K.",
    initials: "LK",
    tagline: "Middle Eastern Goddess — Belly Dance & Mystery",
    bio: "Mysterious, alluring, and captivating. I blend traditional belly dance with modern sensuality. Veil reveals, hip rolls, and private performances you won't forget.",
    tags: ["Belly Dance", "Veil Dance", "Mystery", "Sensual"],
    age: 28,
    price: "$70",
    per: "session",
    location: "Lebanon",
    badge: "top_rated_plus",
    online: false,
    successRate: "100%",
    earned: "256 sessions",
    quote: "Layla is mesmerizing. Her belly dance sessions are art and seduction combined. Absolute goddess.",
    quoteAuthor: "Andre W.",
    images: [
      "https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1464863979621-258859e62245?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 22,
    name: "Nikki C.",
    initials: "NC",
    tagline: "MILF Next Door — Experienced & Playful",
    bio: "Mature, confident, and I know exactly what I'm doing. I offer experienced companionship, roleplay as your neighbor's hot wife, and sessions for those who appreciate a real woman.",
    tags: ["MILF", "Experienced", "Roleplay", "Companionship"],
    age: 34,
    price: "$55",
    per: "session",
    location: "Canada",
    badge: "top_rated",
    online: true,
    successRate: "99%",
    earned: "231 sessions",
    quote: "Nikki is the real deal. Confident, gorgeous, and knows how to make you feel special. The best in her category.",
    quoteAuthor: "Steve R.",
    images: [
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 23,
    name: "Tatiana G.",
    initials: "TG",
    tagline: "Latex & Leather — Fetish Diva",
    bio: "Full latex outfits, leather corsets, and sky-high heels. I specialize in fetish fashion shows, boot worship, and SPH. Bow down or swipe left.",
    tags: ["Latex", "Leather", "Fetish", "Boot Worship"],
    age: 31,
    price: "$85",
    per: "session",
    location: "Czech Republic",
    badge: "top_rated_plus",
    online: false,
    successRate: "100%",
    earned: "189 sessions",
    quote: "Tatiana's latex looks are jaw-dropping. She's commanding, stylish, and knows exactly how to dominate a session.",
    quoteAuthor: "Erik V.",
    images: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1496440737103-cd596325d314?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 24,
    name: "Riley S.",
    initials: "RS",
    tagline: "College Cutie — Fun & Flirty Sessions",
    bio: "Bubbly 21-year-old who's here for a good time. Study break stripteases, dorm room shows, and casual flirty video calls. Young, fun, and always down.",
    tags: ["College", "Flirty", "Casual", "Fun"],
    age: 21,
    price: "$30",
    per: "session",
    location: "United States",
    badge: "rising",
    online: true,
    successRate: "96%",
    earned: "67 sessions",
    quote: "Riley is so much fun and full of energy. Her personality is amazing and she makes every session a blast.",
    quoteAuthor: "Chad B.",
    images: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1514315384763-ba401779410f?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 25,
    name: "Anastasia P.",
    initials: "AP",
    tagline: "Ukrainian Model — High Fashion Tease",
    bio: "Former model turned creator. I do luxury lingerie try-ons, slow-motion tease videos, and high-production private shows. Think Victoria's Secret meets your wildest dreams.",
    tags: ["Modeling", "Lingerie", "High Fashion", "Luxury"],
    age: 26,
    price: "$90",
    per: "session",
    location: "Ukraine",
    badge: "top_rated_plus",
    online: true,
    successRate: "100%",
    earned: "312 sessions",
    quote: "Anastasia is breathtaking. Her production quality is unreal and she looks like she stepped out of a magazine.",
    quoteAuthor: "Oliver H.",
    images: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 26,
    name: "Daniela R.",
    initials: "DR",
    tagline: "Fiery Latina — Reggaeton & Twerk Queen",
    bio: "I bring the heat with reggaeton dance sessions, twerk shows, and spicy one-on-one chats. My energy is contagious and my moves are unforgettable.",
    tags: ["Twerk", "Reggaeton", "Dance", "Latina"],
    age: 23,
    price: "$45",
    per: "session",
    location: "Colombia",
    badge: "top_rated",
    online: true,
    successRate: "98%",
    earned: "176 sessions",
    quote: "Daniela's energy is unmatched. Her dance sessions had me glued to the screen. Absolutely electric.",
    quoteAuthor: "Miguel A.",
    images: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 27,
    name: "Harper W.",
    initials: "HW",
    tagline: "Nerd Girlfriend — Gaming & Cosplay",
    bio: "Let's game together while I slowly strip. I combine gaming streams with interactive shows. Think Twitch meets your wildest fantasy.",
    tags: ["Gaming", "Cosplay", "Nerdy", "Interactive"],
    age: 22,
    price: "$35",
    per: "session",
    location: "United States",
    badge: "rising",
    online: true,
    successRate: "97%",
    earned: "89 sessions",
    quote: "Harper is the perfect combo of nerdy and naughty. Gaming with her is a whole new experience.",
    quoteAuthor: "Dylan F.",
    images: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 28,
    name: "Ava M.",
    initials: "AM",
    tagline: "Pilates Babe — Flexible & Fit",
    bio: "Former competitive gymnast turned creator. Watch me stretch, flex, and show off moves you didn't think were possible. Flexibility is my superpower.",
    tags: ["Pilates", "Flexible", "Fitness", "Athletic"],
    age: 25,
    price: "$50",
    per: "session",
    location: "Australia",
    badge: "top_rated",
    online: false,
    successRate: "99%",
    earned: "167 sessions",
    quote: "Ava's flexibility is insane. Her sessions are artistic and jaw-dropping. Never seen anything like it.",
    quoteAuthor: "Liam B.",
    images: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 29,
    name: "Sienna T.",
    initials: "ST",
    tagline: "Pool & Shower Shows — Wet & Wild",
    bio: "I take my shows to the pool, the shower, and the bathtub. Wet, steamy, and slippery content that'll leave you wanting more.",
    tags: ["Shower", "Pool", "Wet", "Steamy"],
    age: 26,
    price: "$55",
    per: "session",
    location: "Spain",
    badge: "top_rated",
    online: true,
    successRate: "98%",
    earned: "142 sessions",
    quote: "Sienna's shower shows are incredible. The production quality and her confidence are top-tier.",
    quoteAuthor: "Antonio P.",
    images: [
      "https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 30,
    name: "Nadia B.",
    initials: "NB",
    tagline: "Persian Princess — Elegant & Seductive",
    bio: "Exotic beauty with a taste for luxury. I offer slow, sensual performances with silk, gold accessories, and a mysterious allure that keeps you coming back.",
    tags: ["Elegant", "Sensual", "Exotic", "Luxury"],
    age: 27,
    price: "$75",
    per: "session",
    location: "United Arab Emirates",
    badge: "top_rated_plus",
    online: false,
    successRate: "100%",
    earned: "203 sessions",
    quote: "Nadia is pure elegance. Every session feels like a private luxury experience. She's in a class of her own.",
    quoteAuthor: "Omar K.",
    images: [
      "https://images.unsplash.com/photo-1464863979621-258859e62245?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 31,
    name: "Kayla J.",
    initials: "KJ",
    tagline: "Cheerleader Fantasy — Peppy & Playful",
    bio: "Former college cheerleader bringing the pep to your screen. High kicks, splits, and uniform stripteases that'll make you feel like homecoming king.",
    tags: ["Cheerleader", "Uniform", "Playful", "Dance"],
    age: 22,
    price: "$40",
    per: "session",
    location: "United States",
    badge: "rising",
    online: true,
    successRate: "96%",
    earned: "78 sessions",
    quote: "Kayla is adorable and so much fun. Her cheerleader routines are creative and the energy is amazing.",
    quoteAuthor: "Brett N.",
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1514315384763-ba401779410f?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 32,
    name: "Vivian L.",
    initials: "VL",
    tagline: "Burlesque Performer — Vintage Glamour",
    bio: "Old Hollywood meets modern seduction. I perform classic burlesque with feather fans, corsets, and slow reveals. Every session is a show worth watching.",
    tags: ["Burlesque", "Vintage", "Glamour", "Performance"],
    age: 29,
    price: "$65",
    per: "session",
    location: "France",
    badge: "top_rated",
    online: true,
    successRate: "99%",
    earned: "187 sessions",
    quote: "Vivian is a true artist. Her burlesque performances are breathtaking. Classy, sexy, and utterly captivating.",
    quoteAuthor: "Pierre D.",
    images: [
      "https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1496440737103-cd596325d314?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 33,
    name: "Thalia S.",
    initials: "TS",
    tagline: "Greek Goddess — Oiled & Athletic",
    bio: "Mediterranean beauty with an athletic build. My specialty is oiled-up muscle worship, wrestling fantasies, and goddess roleplay. Worship me or challenge me.",
    tags: ["Athletic", "Oil Show", "Wrestling", "Goddess"],
    age: 26,
    price: "$60",
    per: "session",
    location: "Greece",
    badge: "top_rated",
    online: false,
    successRate: "98%",
    earned: "134 sessions",
    quote: "Thalia is an absolute goddess. Strong, beautiful, and her oil shows are hypnotic. Incredible experience.",
    quoteAuthor: "Nikos P.",
    images: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 34,
    name: "Scarlett D.",
    initials: "SD",
    tagline: "Pin-Up Doll — Retro & Risqué",
    bio: "Living doll aesthetic with a retro twist. I do vintage pin-up shoots, lingerie try-ons, and themed sessions inspired by the golden age of glamour.",
    tags: ["Pin-Up", "Retro", "Lingerie", "Themed"],
    age: 25,
    price: "$50",
    per: "session",
    location: "United States",
    badge: "top_rated",
    online: true,
    successRate: "99%",
    earned: "156 sessions",
    quote: "Scarlett's pin-up aesthetic is stunning. She looks like she stepped out of a vintage magazine. Absolutely gorgeous.",
    quoteAuthor: "Frank M.",
    images: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 35,
    name: "Kimiko H.",
    initials: "KH",
    tagline: "J-Pop Idol — Cute & Kawaii Shows",
    bio: "Your personal idol experience. I do J-pop dance covers, kawaii outfit reveals, and interactive fan sessions. Complete with hearts, peace signs, and surprises.",
    tags: ["J-Pop", "Kawaii", "Dance", "Idol"],
    age: 21,
    price: "$40",
    per: "session",
    location: "Japan",
    badge: "rising",
    online: true,
    successRate: "97%",
    earned: "93 sessions",
    quote: "Kimiko is the cutest creator on the platform. Her idol performances are so fun and she's incredibly sweet.",
    quoteAuthor: "Takeshi R.",
    images: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 36,
    name: "Roxanne V.",
    initials: "RV",
    tagline: "Pole Dancer — Acrobatic & Sensual",
    bio: "Professional pole dancer bringing the club to your screen. Spins, inversions, and slow climbs that'll leave you mesmerized. Private shows available.",
    tags: ["Pole Dance", "Acrobatic", "Sensual", "Performance"],
    age: 27,
    price: "$70",
    per: "session",
    location: "Canada",
    badge: "top_rated_plus",
    online: true,
    successRate: "100%",
    earned: "234 sessions",
    quote: "Roxanne's pole skills are insane. Athletic, graceful, and incredibly sexy. She's a true professional.",
    quoteAuthor: "Daniel K.",
    images: [
      "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1464863979621-258859e62245?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 37,
    name: "Elena K.",
    initials: "EK",
    tagline: "Russian Ballerina — Grace & Flexibility",
    bio: "Trained ballerina with unreal flexibility. I blend classical dance with sensual performances. Tutus come off, but the grace stays on.",
    tags: ["Ballet", "Flexible", "Graceful", "Dance"],
    age: 24,
    price: "$55",
    per: "session",
    location: "Russia",
    badge: "top_rated",
    online: false,
    successRate: "99%",
    earned: "178 sessions",
    quote: "Elena moves like a dream. Her ballet-inspired sessions are unlike anything else. Pure art and beauty.",
    quoteAuthor: "Alexei M.",
    images: [
      "https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 38,
    name: "Willow R.",
    initials: "WR",
    tagline: "Hippie Goddess — Free Spirit Vibes",
    bio: "Peace, love, and good vibes only. I do outdoor sessions, body painting shows, and free-spirited performances. All natural, all real, all love.",
    tags: ["Hippie", "Outdoor", "Body Paint", "Natural"],
    age: 25,
    price: "$40",
    per: "session",
    location: "Netherlands",
    badge: "rising",
    online: true,
    successRate: "97%",
    earned: "88 sessions",
    quote: "Willow is so genuine and free. Her outdoor sessions feel like a breath of fresh air. Truly unique creator.",
    quoteAuthor: "Jasper V.",
    images: [
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1514315384763-ba401779410f?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 39,
    name: "Zoe P.",
    initials: "ZP",
    tagline: "Aussie Surfer Girl — Beach & Bikini",
    bio: "Sun-kissed beach babe from down under. Bikini try-ons, beach shoots, and laid-back Aussie vibes. I'll make you wish you were at Bondi with me.",
    tags: ["Beach", "Bikini", "Surfer", "Laid-back"],
    age: 23,
    price: "$45",
    per: "session",
    location: "Australia",
    badge: "top_rated",
    online: true,
    successRate: "98%",
    earned: "145 sessions",
    quote: "Zoe is the ultimate beach babe. Her bikini sessions are so fun and she has the most infectious laugh.",
    quoteAuthor: "Cooper W.",
    images: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1496440737103-cd596325d314?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 40,
    name: "Catalina F.",
    initials: "CF",
    tagline: "Spanish Temptress — Flamenco & Fire",
    bio: "Passionate flamenco dancer who turns up the heat. My shows blend traditional Spanish dance with modern seduction. Olé never sounded so good.",
    tags: ["Flamenco", "Dance", "Passionate", "Spanish"],
    age: 28,
    price: "$60",
    per: "session",
    location: "Spain",
    badge: "top_rated_plus",
    online: false,
    successRate: "100%",
    earned: "198 sessions",
    quote: "Catalina's flamenco sessions are mesmerizing. The passion, the intensity — it's an experience you won't forget.",
    quoteAuthor: "Javier L.",
    images: [
      "https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 41,
    name: "Ivy C.",
    initials: "IC",
    tagline: "Domme Lite — Playful Control",
    bio: "Not too hard, not too soft — just right. I do light domination, playful bossing, and teasing denial sessions. Perfect for curious beginners.",
    tags: ["Light Domme", "Tease", "Denial", "Playful"],
    age: 26,
    price: "$50",
    per: "session",
    location: "United Kingdom",
    badge: "top_rated",
    online: true,
    successRate: "99%",
    earned: "167 sessions",
    quote: "Ivy strikes the perfect balance. Not intimidating but definitely in control. Best intro to domme sessions.",
    quoteAuthor: "George H.",
    images: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 42,
    name: "Mila E.",
    initials: "ME",
    tagline: "Couple Shows — Real Chemistry",
    bio: "My partner and I put on unforgettable couple shows. Real chemistry, real passion. Watch us together or request custom scenarios.",
    tags: ["Couple", "Real Chemistry", "Interactive", "Custom"],
    age: 25,
    price: "$80",
    per: "session",
    location: "Czech Republic",
    badge: "top_rated_plus",
    online: true,
    successRate: "100%",
    earned: "289 sessions",
    quote: "Mila and her partner have incredible chemistry. Their shows feel genuine and passionate. Worth every token.",
    quoteAuthor: "Thomas A.",
    images: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 43,
    name: "Lucia G.",
    initials: "LG",
    tagline: "Tantric Specialist — Slow & Spiritual",
    bio: "I bring mindfulness to pleasure. My tantric sessions combine breathwork, eye contact, and slow sensual movement. It's not just a show — it's a journey.",
    tags: ["Tantric", "Spiritual", "Slow", "Mindful"],
    age: 30,
    price: "$70",
    per: "session",
    location: "Argentina",
    badge: "top_rated",
    online: false,
    successRate: "99%",
    earned: "156 sessions",
    quote: "Lucia's tantric sessions changed how I experience pleasure. Deep, intimate, and profoundly beautiful.",
    quoteAuthor: "Sebastian R.",
    images: [
      "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1464863979621-258859e62245?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 44,
    name: "Jasmine W.",
    initials: "JW",
    tagline: "Caribbean Queen — Island Vibes",
    bio: "Bringing island energy to every session. Dancehall moves, tropical bikinis, and a warm personality that'll make you feel like you're on vacation.",
    tags: ["Dancehall", "Tropical", "Island", "Bikini"],
    age: 24,
    price: "$45",
    per: "session",
    location: "Jamaica",
    badge: "rising",
    online: true,
    successRate: "97%",
    earned: "92 sessions",
    quote: "Jasmine's island vibes are exactly what I needed. Fun, warm, and her dancehall moves are incredible.",
    quoteAuthor: "Desmond R.",
    images: [
      "https://images.unsplash.com/photo-1523264653568-d1c129289364?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 45,
    name: "Nina V.",
    initials: "NV",
    tagline: "Art Model — Tasteful & Artistic",
    bio: "Former fine art model who brings gallery-quality aesthetics to every session. Artistic poses, creative lighting, and a body that was made to be admired.",
    tags: ["Artistic", "Modeling", "Tasteful", "Creative"],
    age: 28,
    price: "$65",
    per: "session",
    location: "Italy",
    badge: "top_rated",
    online: true,
    successRate: "99%",
    earned: "178 sessions",
    quote: "Nina's sessions feel like visiting an art gallery. She's stunning and her creative vision is unmatched.",
    quoteAuthor: "Lorenzo B.",
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 46,
    name: "Suki L.",
    initials: "SL",
    tagline: "K-Pop Stan — Dance Covers & Aegyo",
    bio: "K-pop obsessed cutie doing dance covers, aegyo challenges, and fan service content. I'll be your bias wrecker in the best way possible.",
    tags: ["K-Pop", "Dance Cover", "Aegyo", "Cute"],
    age: 21,
    price: "$35",
    per: "session",
    location: "South Korea",
    badge: "rising",
    online: true,
    successRate: "96%",
    earned: "67 sessions",
    quote: "Suki is the cutest person I've ever seen. Her K-pop covers are spot-on and she's hilarious. Stan worthy.",
    quoteAuthor: "Jin W.",
    images: [
      "https://images.unsplash.com/photo-1514315384763-ba401779410f?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 47,
    name: "Valentina C.",
    initials: "VC",
    tagline: "Italian Bombshell — Lingerie & Wine",
    bio: "Sipping wine in luxury lingerie while we chat about life, love, and everything in between. Sophisticated, sensual, and always in the mood.",
    tags: ["Lingerie", "Sophisticated", "Wine", "Chat"],
    age: 29,
    price: "$75",
    per: "session",
    location: "Italy",
    badge: "top_rated_plus",
    online: false,
    successRate: "100%",
    earned: "212 sessions",
    quote: "Valentina is the definition of class. Her lingerie collection is amazing and the conversation is even better.",
    quoteAuthor: "Marco F.",
    images: [
      "https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1496440737103-cd596325d314?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 48,
    name: "Phoenix R.",
    initials: "PR",
    tagline: "Fire Dancer — LED & Glow Shows",
    bio: "I perform with LED props, glow sticks, and fire fans in blacklight sessions. My shows are a visual spectacle you won't find anywhere else.",
    tags: ["LED", "Glow", "Fire Dance", "Visual"],
    age: 25,
    price: "$60",
    per: "session",
    location: "Thailand",
    badge: "top_rated",
    online: true,
    successRate: "99%",
    earned: "145 sessions",
    quote: "Phoenix's glow shows are insane. The visual effects combined with her dancing — it's like a private rave.",
    quoteAuthor: "Kai S.",
    images: [
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 49,
    name: "Alina M.",
    initials: "AM",
    tagline: "Romanian Beauty — Slow Tease Expert",
    bio: "I take my time and make every moment count. Slow, deliberate teasing that builds anticipation until you can't take it anymore. Patience is rewarded.",
    tags: ["Slow Tease", "Anticipation", "Sensual", "Build-up"],
    age: 26,
    price: "$50",
    per: "session",
    location: "Romania",
    badge: "top_rated",
    online: false,
    successRate: "98%",
    earned: "167 sessions",
    quote: "Alina is a master of anticipation. She knows exactly how to build tension. Every second is worth it.",
    quoteAuthor: "Andrei C.",
    images: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop&crop=face",
    ],
  },
  {
    id: 50,
    name: "Demi A.",
    initials: "DA",
    tagline: "South African Stunner — Afrobeats & Vibes",
    bio: "Bringing Afrobeats energy to every show. My dance sessions are high-energy, my personality is magnetic, and my body moves to its own rhythm.",
    tags: ["Afrobeats", "Dance", "High-Energy", "Vibes"],
    age: 24,
    price: "$45",
    per: "session",
    location: "South Africa",
    badge: "top_rated",
    online: true,
    successRate: "98%",
    earned: "134 sessions",
    quote: "Demi's Afrobeats sessions are pure joy. Her energy fills the screen and her moves are out of this world.",
    quoteAuthor: "Thabo M.",
    images: [
      "https://images.unsplash.com/photo-1523264653568-d1c129289364?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=800&h=1000&fit=crop&crop=face",
    ],
  },
];

const badgeConfig: Record<string, { label: string; color: string; icon: any }> = {
  top_rated_plus: { label: "Top Rated Plus", color: "text-primary", icon: BadgeCheck },
  top_rated: { label: "Top Rated", color: "text-primary", icon: Shield },
  rising: { label: "Rising Talent", color: "text-muted-foreground", icon: TrendingUp },
};

const serviceOfferings = ["Chat", "NSFW content", "Voice", "Video", "Custom content"];

const locationOptions = [
  "Any Location", "France", "United States", "United Kingdom", "Canada",
  "Germany", "Colombia", "Australia", "Spain", "Italy",
];

const ageRangeOptions = ["18-25", "26-35", "36-45", "46+"];

const languageOptions = ["English", "French", "Spanish", "German", "Italian", "Portuguese"];

export function DiscoveryContent() {
  const navigate = useNavigate();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { conversations, startConversation } = useConversations();
  const [searchQuery, setSearchQuery] = useState("");
  const [favPulse, setFavPulse] = useState(false);
  const [chatPulse, setChatPulse] = useState(false);
  const [activeChatCreator, setActiveChatCreator] = useState<Creator | null>(null);
  const [activeProfileCreator, setActiveProfileCreator] = useState<Creator | null>(null);
  const [activeService, setActiveService] = useState<{ creator: Creator; service: CreatorService } | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"filter" | "chat" | "favorite">("filter");
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set(serviceOfferings));
  const [selectedLocation, setSelectedLocation] = useState("France");
  const [selectedAgeRange, setSelectedAgeRange] = useState("18-25");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  // Auth gating
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [swipeCount, setSwipeCount] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const FREE_SWIPE_LIMIT = 5;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsSignedIn(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const requireAuth = useCallback((action?: () => void) => {
    if (isSignedIn) {
      action?.();
    } else {
      setShowAuthModal(true);
    }
  }, [isSignedIn]);

  // Track swipes for non-logged-in users
  const handleSwipeGate = useCallback(() => {
    if (isSignedIn) return false; // no gate
    const next = swipeCount + 1;
    setSwipeCount(next);
    if (next >= FREE_SWIPE_LIMIT) {
      setShowAuthModal(true);
      return true; // blocked
    }
    return false;
  }, [isSignedIn, swipeCount]);

  const handleCreatorLiked = useCallback((creator: Creator) => {
    addFavorite({
      id: creator.id,
      name: creator.name,
      initials: creator.initials,
      tagline: creator.tagline,
      images: creator.images,
      online: creator.online,
      price: creator.price,
      per: creator.per,
      location: creator.location,
    });
    setFavPulse(true);
    setTimeout(() => setFavPulse(false), 1000);
  }, [addFavorite]);

  const handleCreatorChat = useCallback((creator: Creator) => {
    if (!creator.userId) {
      // Mock creator without a real DB user — can't chat
      toast?.("Chat is only available with verified creators.");
      return;
    }
    startConversation({
      id: creator.userId,
      name: creator.name,
      initials: creator.initials,
      image: creator.images?.[0],
      online: creator.online,
    });
    setChatPulse(true);
    setTimeout(() => setChatPulse(false), 1000);
  }, [startConversation]);

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleService = (service: string) => {
    setSelectedServices((prev) => {
      const next = new Set(prev);
      if (next.has(service)) next.delete(service);
      else next.add(service);
      return next;
    });
  };


  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col" style={{ height: "calc(100vh - 64px)" }}>

      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          className="gap-2 w-full"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0 overflow-hidden">
        {/* Sidebar — light theme */}
        <aside className={`w-full lg:w-72 shrink-0 overflow-y-auto rounded-2xl p-4 ${showMobileFilters ? "block" : "hidden lg:block"}`}>
          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search creators..."
              className="pl-9 h-9 w-full rounded-lg text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border mb-5">
            {(["filter", "chat", "favorite"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  if ((tab === "chat" || tab === "favorite") && !isSignedIn) {
                    setShowAuthModal(true);
                    return;
                  }
                  setSidebarTab(tab);
                }}
                className={`relative flex-1 pb-2.5 text-sm font-bold capitalize transition-colors border-b-2 ${
                  sidebarTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                } ${tab === "favorite" && favPulse ? "animate-bounce" : ""} ${tab === "chat" && chatPulse ? "animate-bounce" : ""}`}
              >
                {tab === "filter" ? "Filter" : tab === "chat" ? "Chat" : "Favorite"}
                {tab === "chat" && conversations.length > 0 && (
                  <span className={`absolute -top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-blue-500 text-white text-[10px] font-bold px-1 ${chatPulse ? "scale-125" : "scale-100"} transition-transform duration-300`}>
                    {conversations.length}
                  </span>
                )}
                {tab === "favorite" && favorites.length > 0 && (
                  <span className={`absolute -top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold px-1 ${favPulse ? "scale-125" : "scale-100"} transition-transform duration-300`}>
                    {favorites.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Filter Tab */}
          {sidebarTab === "filter" && (
            <div className="space-y-7">
              <FilterSection title="Location">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="h-10 rounded-lg text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {locationOptions.map((loc) => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterSection>

              <FilterSection title="Service offering">
                <div className="space-y-3">
                  {serviceOfferings.map((service) => (
                    <label key={service} className="flex items-center gap-3 cursor-pointer group">
                      <Checkbox
                        className="border-border"
                        checked={selectedServices.has(service)}
                        onCheckedChange={() => toggleService(service)}
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{service}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Age range">
                <Select value={selectedAgeRange} onValueChange={setSelectedAgeRange}>
                  <SelectTrigger className="h-10 rounded-lg text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ageRangeOptions.map((range) => (
                      <SelectItem key={range} value={range}>{range}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterSection>

              <FilterSection title="Language">
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="h-10 rounded-lg text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((lang) => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterSection>

              <FilterSection title="Categories">
                <Accordion type="multiple" className="w-full">
                  {categorySections.map((section) => (
                    <AccordionItem key={section.heading} value={section.heading} className="border-border/50">
                      <AccordionTrigger className="py-2.5 text-sm font-semibold hover:no-underline">
                        {section.heading}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {section.groups.map((group, gi) => (
                            <div key={gi}>
                              {group.title && (
                                <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">
                                  {group.title}
                                </p>
                              )}
                              <div className="space-y-2">
                                {group.items.map((item) => (
                                  <label key={item.name} className="flex items-center gap-2.5 cursor-pointer group">
                                    <Checkbox
                                      className="border-border"
                                      checked={selectedCategories.has(item.name)}
                                      onCheckedChange={() => toggleCategory(item.name)}
                                    />
                                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-1">
                                      {item.name}
                                    </span>
                                    {item.count !== undefined && (
                                      <span className="text-xs text-muted-foreground/50">
                                        {item.count.toLocaleString()}
                                      </span>
                                    )}
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </FilterSection>
            </div>
          )}

          {/* Chat Tab */}
          {sidebarTab === "chat" && (
            conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageCircle className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm font-semibold text-muted-foreground">No conversations yet</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Start chatting with creators you like</p>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((convo, idx) => {
                  // Build a minimal Creator object for ChatView from conversation data
                  const chatCreator: Creator = creators.find((c) => c.userId === convo.partnerId) ?? {
                    id: 0,
                    userId: convo.partnerId,
                    name: convo.partnerName,
                    initials: convo.partnerInitials,
                    tagline: "", bio: "", tags: [], age: 0, price: "", per: "",
                    location: "", badge: "", online: convo.partnerOnline,
                    successRate: "", earned: "", quote: "", quoteAuthor: "",
                    images: convo.partnerImage ? [convo.partnerImage] : [],
                  };
                  return (
                    <div
                      key={convo.partnerId}
                      onClick={() => setActiveChatCreator(chatCreator)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/50 transition-all cursor-pointer animate-[favSlideIn_0.4s_ease-out_both] ${
                        activeChatCreator?.userId === convo.partnerId ? "bg-accent ring-1 ring-primary/30" : ""
                      }`}
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      <div className="relative shrink-0">
                        {convo.partnerImage ? (
                          <img
                            src={convo.partnerImage}
                            alt={convo.partnerName}
                            className="h-11 w-11 rounded-full object-cover ring-2 ring-blue-400/50"
                          />
                        ) : (
                          <div className="h-11 w-11 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-blue-400/50">
                            <span className="text-xs font-bold text-primary">{convo.partnerInitials}</span>
                          </div>
                        )}
                        {convo.partnerOnline && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{convo.partnerName}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {convo.messages.length > 0 ? convo.messages[convo.messages.length - 1].content : "Tap to open chat"}
                        </p>
                      </div>
                      {convo.unreadCount > 0 && (
                        <span className="shrink-0 h-5 min-w-[20px] px-1 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-semibold">
                          {convo.unreadCount}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* Favorite Tab */}
          {sidebarTab === "favorite" && (
            favorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Heart className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm font-semibold text-muted-foreground">No favorites yet</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Like creators to save them here</p>
              </div>
            ) : (
              <div className="space-y-2">
                {favorites.map((creator, idx) => (
                  <div
                    key={creator.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/50 transition-all cursor-pointer animate-[favSlideIn_0.4s_ease-out_both]"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <div className="relative shrink-0">
                      {creator.images?.[0] ? (
                        <img
                          src={creator.images[0]}
                          alt={creator.name}
                          className="h-11 w-11 rounded-full object-cover ring-2 ring-rose-400/50"
                        />
                      ) : (
                        <div className="h-11 w-11 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-rose-400/50">
                          <span className="text-xs font-bold text-primary">{creator.initials}</span>
                        </div>
                      )}
                      {creator.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{creator.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{creator.tagline}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(creator.id);
                      }}
                      className="shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-muted-foreground/50 hover:bg-rose-100 hover:text-rose-500 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </aside>

        {/* Main Content — dark theme */}
        <div className={`flex-1 min-h-0 min-w-0 bg-[#f0f0f0] rounded-2xl relative ${showMobileFilters ? "hidden lg:block" : ""}`}>
          {activeService ? (
            <ServicePostView
              creator={activeService.creator}
              service={activeService.service}
              onBack={() => setActiveService(null)}
              onChat={(creator) => { setActiveService(null); setActiveProfileCreator(null); handleCreatorChat(creator); setActiveChatCreator(creator); }}
            />
          ) : activeProfileCreator ? (
            <ProfileView
              creator={activeProfileCreator}
              onBack={() => setActiveProfileCreator(null)}
              onChat={(creator) => { setActiveProfileCreator(null); handleCreatorChat(creator); setActiveChatCreator(creator); }}
              onLike={handleCreatorLiked}
              onViewService={(service) => setActiveService({ creator: activeProfileCreator, service })}
            />
          ) : activeChatCreator ? (
            <ChatView creator={activeChatCreator} onBack={() => setActiveChatCreator(null)} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <SwipeView
                creators={creators}
                onLike={handleCreatorLiked}
                onChat={(c) => requireAuth(() => handleCreatorChat(c))}
                onViewProfile={setActiveProfileCreator}
                onSwipeAttempt={handleSwipeGate}
              />
            </div>
          )}
        </div>
      </div>

      {/* Auth gate modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAuthModal(false)}>
          <div
            className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mx-auto mb-4 h-14 w-14 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FF9A3C, #FF7AA2, #D85BFF, #8A5CFF)" }}>
              <Heart className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Join Plezyy</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Sign up for free to like creators, chat, save favorites, and unlock unlimited browsing.
            </p>
            <div className="mt-6 space-y-3">
              <Link
                to="/sign-up"
                className="block w-full py-2.5 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, #FF9A3C, #FF7AA2, #D85BFF, #8A5CFF)" }}
              >
                Sign Up Free
              </Link>
              <Link
                to="/sign-in"
                className="block w-full py-2.5 rounded-full border border-border text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                Already have an account? Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default function Discovery() {
  return (
    <div className="h-screen overflow-hidden bg-background">
      <Navbar />
      <DiscoveryContent />
    </div>
  );
}

/* ═══════════════════════════════
   SWIPE VIEW
   ═══════════════════════════════ */

interface SwipeDragState {
  x: number;
  y: number;
  isDragging: boolean;
  transitioning: boolean;
}

function SwipeView({ creators: initialCreators, onLike, onChat, onViewProfile, onSwipeAttempt }: { creators: Creator[]; onLike?: (creator: Creator) => void; onChat?: (creator: Creator) => void; onViewProfile?: (creator: Creator) => void; onSwipeAttempt?: () => boolean }) {
  const [cards, setCards] = useState<Creator[]>([...initialCreators].reverse());
  const [topDragX, setTopDragX] = useState(0);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const removeTop = useCallback(() => {
    setCards((prev) => prev.slice(0, -1));
    setTopDragX(0);
  }, []);

  const resetCards = () => {
    setCards([...initialCreators].reverse());
    setLastAction(null);
  };

  const forceSwipe = useCallback((dir: "left" | "right") => {
    if (onSwipeAttempt?.()) return; // blocked by auth gate
    setCards((prev) => {
      if (prev.length === 0) return prev;
      if (dir === "right") onLike?.(prev[prev.length - 1]);
      return prev;
    });
    setTopDragX(dir === "right" ? 300 : -300);
    setTimeout(() => {
      setLastAction(dir === "right" ? "Liked" : "Passed");
      removeTop();
    }, 50);
  }, [onLike, removeTop, onSwipeAttempt]);

  // Neutral skip — just moves to the next card without liking/passing
  const skipCard = useCallback(() => {
    if (cards.length === 0) return;
    if (onSwipeAttempt?.()) return; // blocked by auth gate
    setTopDragX(-300);
    setTimeout(() => {
      setLastAction(null);
      removeTop();
    }, 50);
  }, [cards.length, removeTop, onSwipeAttempt]);

  // Keyboard arrow support — arrows skip neutrally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (cards.length === 0) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        skipCard();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cards.length, skipCard]);

  return (
    <div className="flex flex-col items-center w-full max-w-[440px]">
      {/* Card stack with flanking arrows */}
      <div className="relative w-full flex items-center">
        {/* Left arrow — Skip */}
        {cards.length > 0 && (
          <button
            onClick={skipCard}
            className="hidden md:flex absolute -left-16 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 rounded-full border border-border bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-accent shadow-sm transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Previous creator"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        <div className="relative w-full" style={{ height: "min(616px, 77vh)" }}>
          {cards.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-black/5 p-5 mb-4">
                <Sparkles className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-bold text-foreground">You've seen everyone</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                No more creators to show. Reset to swipe through them again.
              </p>
              <Button onClick={resetCards} className="mt-4 gap-2">
                <RotateCcw className="h-4 w-4" />
                Start Over
              </Button>
            </div>
          ) : (
            cards.map((creator, i) => {
              const isTop = i === cards.length - 1;
              const isBehind = i === cards.length - 2;
              // Only render the top card and the one directly behind it
              if (!isTop && !isBehind) return null;
              return (
                <SwipeCard
                  key={creator.id}
                  creator={creator}
                  isTop={isTop}
                  behindTopAbsX={isBehind ? Math.abs(topDragX) : 0}
                  onRemove={() => {
                    if (onSwipeAttempt?.()) return;
                    removeTop();
                  }}
                  onDragX={isTop ? setTopDragX : undefined}
                  onSwipe={(dir) => {
                    if (onSwipeAttempt?.()) return;
                    setLastAction(dir === "right" ? "Liked" : "Passed");
                    if (dir === "right") onLike?.(creator);
                  }}
                  onForceSwipe={isTop ? forceSwipe : undefined}
                  onChat={() => onChat?.(creator)}
                  onViewProfile={() => onViewProfile?.(creator)}
                />
              );
            })
          )}
        </div>

        {/* Right arrow — Skip */}
        {cards.length > 0 && (
          <button
            onClick={skipCard}
            className="hidden md:flex absolute -right-16 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 rounded-full border border-border bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-accent shadow-sm transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Next creator"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

    </div>
  );
}

/* Puffy icon button (Uiverse-inspired) */
const puffyColors = {
  rose: {
    border: "border-rose-200 dark:border-rose-400/30",
    bg: "bg-[#f5e6e6] dark:bg-rose-950/40",
    hoverBg: "hover:bg-rose-100 dark:hover:bg-rose-900/40",
    text: "text-rose-500",
    shadow: "shadow-[inset_0_-2px_6px_rgba(244,63,94,0.25)]",
    label: "text-rose-400",
  },
  blue: {
    border: "border-blue-200 dark:border-blue-400/30",
    bg: "bg-[#e6eef5] dark:bg-blue-950/40",
    hoverBg: "hover:bg-blue-100 dark:hover:bg-blue-900/40",
    text: "text-blue-500",
    shadow: "shadow-[inset_0_-2px_6px_rgba(59,130,246,0.25)]",
    label: "text-blue-400",
  },
  violet: {
    border: "border-violet-200 dark:border-violet-400/30",
    bg: "bg-[#ede6f5] dark:bg-violet-950/40",
    hoverBg: "hover:bg-violet-100 dark:hover:bg-violet-900/40",
    text: "text-violet-500",
    shadow: "shadow-[inset_0_-2px_6px_rgba(139,92,246,0.25)]",
    label: "text-violet-400",
  },
  emerald: {
    border: "border-emerald-200 dark:border-emerald-400/30",
    bg: "bg-[#e6f5ee] dark:bg-emerald-950/40",
    hoverBg: "hover:bg-emerald-100 dark:hover:bg-emerald-900/40",
    text: "text-emerald-500",
    shadow: "shadow-[inset_0_-2px_6px_rgba(16,185,129,0.25)]",
    label: "text-emerald-400",
  },
};

function PuffyButton({
  icon,
  color,
  label,
  isHovered,
  onHover,
  onClick,
  linkTo,
}: {
  icon: React.ReactNode;
  color: keyof typeof puffyColors;
  label: string;
  isHovered: boolean;
  onHover: (h: boolean) => void;
  onClick: () => void;
  linkTo?: string;
}) {
  const c = puffyColors[color];

  const btn = (
    <div className="flex flex-col items-center gap-1.5">
      <button
        onClick={onClick}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        className={`flex items-center justify-center w-[60px] h-[60px] rounded-[22px] border-[6px] ${c.border} ${c.bg} ${c.hoverBg} ${c.shadow} ${c.text} transition-all duration-400 ${
          isHovered ? "scale-105" : ""
        }`}
        style={{
          animation: isHovered ? "puffyBounce 1.2s infinite" : "none",
        }}
      >
        {icon}
      </button>
      <span className={`text-[10px] font-bold uppercase tracking-wider ${c.label}`}>{label}</span>
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{btn}</Link>;
  }
  return btn;
}

function SwipeCard({
  creator,
  isTop,
  behindTopAbsX,
  onRemove,
  onDragX,
  onSwipe,
  onForceSwipe,
  onChat,
  onViewProfile,
}: {
  creator: Creator;
  isTop: boolean;
  behindTopAbsX: number;
  onRemove: () => void;
  onDragX?: (x: number) => void;
  onSwipe?: (dir: "left" | "right") => void;
  onForceSwipe?: (dir: "left" | "right") => void;
  onChat?: () => void;
  onViewProfile?: () => void;
}) {
  const [state, setState] = useState<SwipeDragState>({ x: 0, y: 0, isDragging: false, transitioning: false });
  const [imgIdx, setImgIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const images = creator.images ?? [];
  const hasGallery = images.length > 1;
  const currentImage = images[imgIdx] ?? null;

  useEffect(() => {
    if (onDragX) onDragX(state.x);
  }, [state.x, onDragX]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!isTop || state.transitioning) return;
    // Don't start drag if clicking an arrow button
    if ((e.target as HTMLElement).closest("[data-gallery-arrow]")) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    dragStart.current = { x: e.clientX, y: e.clientY };
    setState((s) => ({ ...s, isDragging: true, x: 0, y: 0 }));
  }, [isTop, state.transitioning]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragStart.current || !state.isDragging) return;
    e.preventDefault();
    setState((s) => ({
      ...s,
      x: e.clientX - dragStart.current!.x,
      y: e.clientY - dragStart.current!.y,
    }));
  }, [state.isDragging]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragStart.current) return;
    e.preventDefault();
    const x = e.clientX - dragStart.current.x;
    dragStart.current = null;

    if (Math.abs(x) > 120) {
      const dir: "left" | "right" = x > 0 ? "right" : "left";
      setState({ x: dir === "right" ? 600 : -600, y: state.y, isDragging: false, transitioning: true });
      onSwipe?.(dir);
      setTimeout(onRemove, 400);
    } else {
      setState({ x: 0, y: 0, isDragging: false, transitioning: false });
    }
  }, [onRemove, onSwipe, state.y]);

  const likeOpacity = isTop ? Math.max(0, Math.min(1, state.x / 150)) : 0;
  const nopeOpacity = isTop ? Math.max(0, Math.min(1, -state.x / 150)) : 0;
  // Behind card: tilted peek showing ~20% from the right side
  const behindRotate = 6; // degrees tilt
  const behindOffsetX = 40; // px shift right
  const behindOffsetY = 12; // px shift down
  const behindScale = 0.95;

  const cardStyle: React.CSSProperties = isTop
    ? {
        transform: `translate(${state.x}px, ${state.y}px) rotate(${-state.x / 25}deg)`,
        transition: state.isDragging ? "none" : "transform 0.4s cubic-bezier(.2,.8,.3,1)",
        cursor: state.isDragging ? "grabbing" : "grab",
        zIndex: 10,
      }
    : {
        transform: `scale(${behindScale}) translate(${behindOffsetX}px, ${behindOffsetY}px) rotate(${behindRotate}deg)`,
        transformOrigin: "center center",
        transition: "transform 0.3s ease-out",
        zIndex: 1,
      };

  return (
    <div
      className="absolute inset-0 touch-none select-none"
      style={cardStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Full-bleed image card */}
      <div className="h-full w-full rounded-2xl shadow-xl overflow-hidden relative">
        {/* Background: photo or gradient fallback */}
        {currentImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-[background-image] duration-300"
            style={{ backgroundImage: `url(${currentImage})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/70 to-primary/40">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[120px] font-extrabold text-white/10 leading-none">{creator.initials}</span>
            </div>
          </div>
        )}

        {/* Gallery arrows — visible on hover only */}
        {hasGallery && isTop && (
          <>
            <button
              data-gallery-arrow
              onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i - 1 + images.length) % images.length); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all duration-200 cursor-pointer"
              style={{ opacity: hovered ? 1 : 0, pointerEvents: hovered ? "auto" : "none", transition: "opacity 0.2s, background-color 0.2s" }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              data-gallery-arrow
              onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i + 1) % images.length); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all duration-200 cursor-pointer"
              style={{ opacity: hovered ? 1 : 0, pointerEvents: hovered ? "auto" : "none", transition: "opacity 0.2s, background-color 0.2s" }}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dot indicators — top of card */}
        {hasGallery && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {images.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === imgIdx ? "w-5 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

        {/* Like / Nope labels */}
        <div
          className="absolute top-10 left-6 px-5 py-2.5 rounded-lg border-[3px] border-green-400 rotate-[-15deg] z-20"
          style={{ opacity: likeOpacity, transition: state.isDragging ? "none" : "opacity 0.3s" }}
        >
          <span className="text-3xl font-extrabold text-green-400 uppercase drop-shadow-lg">Like</span>
        </div>
        <div
          className="absolute top-10 right-6 px-5 py-2.5 rounded-lg border-[3px] border-red-400 rotate-[15deg] z-20"
          style={{ opacity: nopeOpacity, transition: state.isDragging ? "none" : "opacity 0.3s" }}
        >
          <span className="text-3xl font-extrabold text-red-400 uppercase drop-shadow-lg">Nope</span>
        </div>

        {/* Online badge — top left */}
        {creator.online && (
          <div className="absolute top-4 left-4 bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 z-10">
            <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />
            Online
          </div>
        )}

        {/* Bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 via-black/50 to-transparent pt-24 pb-5 px-6">
          {/* Row 1: name, age, location */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-lg">{creator.name}</h3>
            <span className="text-white/90 text-xs font-bold">{creator.age}</span>
            <span className="text-white/40">·</span>
            <MapPin className="h-3 w-3 text-white/70" />
            <span className="text-white/70 text-xs font-medium">{creator.location}</span>
          </div>
          {/* Row 2: tagline */}
          <p className="text-white/90 text-sm font-semibold mt-1 drop-shadow">{creator.tagline}</p>
          {/* Row 3: inline action icons */}
          <div className="flex items-center gap-2.5 mt-3">
            <button
              data-gallery-arrow
              onClick={(e) => { e.stopPropagation(); onForceSwipe?.("right"); }}
              className="h-9 w-9 rounded-xl border-[3px] border-rose-300/40 bg-rose-500/20 backdrop-blur-sm flex items-center justify-center text-rose-300 hover:bg-rose-500/40 hover:border-rose-300/60 transition-all hover:scale-110 active:scale-95"
            >
              <Heart className="h-3.5 w-3.5" />
            </button>
            <button
              data-gallery-arrow
              onClick={(e) => { e.stopPropagation(); onChat?.(); }}
              className="h-9 w-9 rounded-xl border-[3px] border-blue-300/40 bg-blue-500/20 backdrop-blur-sm flex items-center justify-center text-blue-300 hover:bg-blue-500/40 hover:border-blue-300/60 transition-all hover:scale-110 active:scale-95"
            >
              <MessageCircle className="h-3.5 w-3.5" />
            </button>
            <button
              data-gallery-arrow
              onClick={(e) => { e.stopPropagation(); onViewProfile?.(); }}
              className="h-9 w-9 rounded-xl border-[3px] border-violet-300/40 bg-violet-500/20 backdrop-blur-sm flex items-center justify-center text-violet-300 hover:bg-violet-500/40 hover:border-violet-300/60 transition-all hover:scale-110 active:scale-95"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════
   CREATOR SERVICES (mock data)
   ═══════════════════════════════ */

interface CreatorService {
  name: string;
  description: string;
  startingPrice: string;
  duration?: string;
  popular?: boolean;
  image?: string;
}

const serviceTemplates: Record<string, CreatorService> = {
  "Striptease": { name: "do a slow, sensual striptease for you on camera", description: "A private strip show at your pace — teasing, undressing, and giving you a show you won't forget.", startingPrice: "$40", duration: "15 min" },
  "GFE": { name: "be your virtual girlfriend", description: "Sweet texts, flirty video calls, and the full GFE — like we're actually dating.", startingPrice: "$55", duration: "30 min", popular: true },
  "Dirty Talk": { name: "talk dirty to you on the phone", description: "Straight-up filthy conversation — moaning, teasing, and guiding you through it.", startingPrice: "$30", duration: "15 min" },
  "Roleplay": { name: "act out any fantasy you want", description: "Nurse, teacher, boss, stranger — you name the scenario and I'll play it out for you.", startingPrice: "$50", duration: "30 min" },
  "Toy Play": { name: "let you control my toy live", description: "You control my vibrator live through an app while we're on video together.", startingPrice: "$45", duration: "20 min", popular: true },
  "Custom Content": { name: "create custom photos & videos just for you", description: "Tell me exactly what you want — I'll make nude pics or explicit videos tailored to your fantasy.", startingPrice: "$35" },
  "Video Calls": { name: "do a private 1-on-1 video call with you", description: "HD video session — casual, flirty, or as explicit as you want it to be.", startingPrice: "$25", duration: "15 min", popular: true },
  "Interactive": { name: "follow your directions live on camera", description: "Live and interactive — I do exactly what you tell me in real time.", startingPrice: "$50", duration: "20 min" },
  "Femdom": { name: "dominate and control you", description: "I boss you around, give orders, humiliate, and take full control on video or chat.", startingPrice: "$65", duration: "30 min" },
  "JOI": { name: "give you jerk off instructions", description: "I tell you exactly how to stroke it, tease you, edge you, and make you finish on command.", startingPrice: "$35", duration: "15 min", popular: true },
  "Foot Fetish": { name: "worship my feet for you on camera", description: "Close-ups, toe play, worship vibes — pics, video, or live.", startingPrice: "$30", duration: "15 min" },
  "Humiliation": { name: "roast and humiliate you", description: "SPH, teasing, and whatever level of humiliation you're into — mean, playful, or brutal.", startingPrice: "$40", duration: "15 min" },
  "Companionship": { name: "just hang out and talk with you", description: "Casual video or voice chat — for when you're lonely and want real company.", startingPrice: "$20", duration: "30 min" },
  "Sexting": { name: "sext with you all night", description: "Hot back-and-forth texting with photos — at your pace, whenever you want.", startingPrice: "$25" },
  "Live Shows": { name: "perform a live cam show for you", description: "Watch me live — solo play, toys, outfits, whatever you're into.", startingPrice: "$45", duration: "20 min", popular: true },
  "Fetish": { name: "explore your kink with you", description: "Latex, leather, BDSM, or whatever your fetish is — let's get into it together.", startingPrice: "$55", duration: "30 min" },
  "Domination": { name: "give you a full domination session", description: "Complete control — orders, tasks, humiliation, and obedience training.", startingPrice: "$70", duration: "30 min" },
};

// Default services every creator offers
const defaultService: CreatorService = {
  name: "make your custom request happen",
  description: "Have something specific in mind? Tell me your idea and I'll bring it to life.",
  startingPrice: "$30",
};

function getCreatorServices(creator: Creator, basePrice: number): CreatorService[] {
  const services: CreatorService[] = [];

  // Map creator tags to service templates
  for (const tag of creator.tags) {
    const template = serviceTemplates[tag];
    if (template) {
      services.push({
        ...template,
        // Scale price based on creator's base price
        startingPrice: `$${Math.round(parseInt(template.startingPrice.replace("$", "")) * (basePrice / 40))}`,
      });
    }
  }

  // Always add a custom request service
  services.push({
    ...defaultService,
    startingPrice: `$${Math.round(basePrice * 0.75)}`,
  });

  return services;
}

/* ═══════════════════════════════
   PROFILE VIEW
   ═══════════════════════════════ */

function ProfileView({
  creator,
  onBack,
  onChat,
  onLike,
  onViewService,
}: {
  creator: Creator;
  onBack: () => void;
  onChat: (creator: Creator) => void;
  onLike: (creator: Creator) => void;
  onViewService: (service: CreatorService) => void;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const images = creator.images ?? [];
  const hasGallery = images.length > 1;

  const basePrice = parseInt(creator.price.replace("$", ""));
  const services = getCreatorServices(creator, basePrice);

  /* Shared sub-components to avoid duplication between mobile/desktop */
  const galleryBlock = (
    <div className="relative w-full aspect-[4/3] bg-gray-900 rounded-xl overflow-hidden group/gallery">
      {images[imgIdx] ? (
        <>
          {/* Blurred background fill */}
          <div
            className="absolute inset-0 bg-cover bg-center scale-110 blur-xl opacity-60"
            style={{ backgroundImage: `url(${images[imgIdx]})` }}
          />
          {/* Sharp image on top */}
          <img
            src={images[imgIdx]}
            alt={creator.name}
            className="relative w-full h-full object-contain z-[1]"
          />
          {/* Eye icon overlay on hover */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute inset-0 z-[2] flex items-center justify-center bg-black/0 group-hover/gallery:bg-black/20 transition-colors cursor-pointer"
          >
            <div className="h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover/gallery:opacity-100 transition-opacity scale-90 group-hover/gallery:scale-100">
              <Eye className="h-5 w-5" />
            </div>
          </button>
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
          <span className="text-6xl font-extrabold text-white/20">{creator.initials}</span>
        </div>
      )}
      {hasGallery && (
        <>
          <button
            onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-[3] h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setImgIdx((i) => (i + 1) % images.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-[3] h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[3] flex gap-1.5">
            {images.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === imgIdx ? "w-5 bg-white" : "w-1.5 bg-white/50"}`} />
            ))}
          </div>
        </>
      )}
      {creator.online && (
        <div className="absolute top-3 left-3 z-[3] bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />
          Online
        </div>
      )}
    </div>
  );

  /* Lightbox modal */
  const lightboxModal = lightboxOpen && images[imgIdx] ? (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
      onClick={() => setLightboxOpen(false)}
    >
      {/* Close button */}
      <button
        onClick={() => setLightboxOpen(false)}
        className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Image */}
      <img
        src={images[imgIdx]}
        alt={creator.name}
        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Gallery nav in lightbox */}
      {hasGallery && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i - 1 + images.length) % images.length); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i + 1) % images.length); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                className={`h-2 rounded-full transition-all ${i === imgIdx ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Image counter */}
      <div className="absolute top-4 left-4 text-white/60 text-sm font-medium">
        {imgIdx + 1} / {images.length}
      </div>
    </div>
  ) : null;

  const identityBlock = (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-extrabold text-foreground">{creator.name}</h2>
          <span className="text-sm text-muted-foreground">{creator.age}</span>
          <BadgeCheck className="h-4 w-4 text-blue-500" />
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{creator.tagline}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{creator.location}</span>
          <span className="text-muted-foreground/30">·</span>
          <Shield className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{creator.successRate} success</span>
          <span className="text-muted-foreground/30">·</span>
          <TrendingUp className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{creator.earned}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {creator.tags.map((tag) => (
          <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#4180FB]/10 text-[#4180FB]">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  const actionsBlock = (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onLike(creator)}
        className="h-10 w-10 rounded-full border-2 border-rose-200 bg-rose-50 flex items-center justify-center text-rose-500 hover:bg-rose-100 transition-colors shrink-0"
      >
        <Heart className="h-4 w-4" />
      </button>
      <button
        onClick={() => onChat(creator)}
        className="flex-1 h-10 rounded-full bg-[#4180FB] text-white text-sm font-semibold hover:bg-[#3268D4] transition-colors flex items-center justify-center gap-2"
      >
        <MessageCircle className="h-4 w-4" />
        Message {creator.name.split(" ")[0]}
      </button>
    </div>
  );

  const bioBlock = (
    <div>
      <h3 className="text-sm font-bold text-foreground mb-1.5">About</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{creator.bio}</p>
    </div>
  );

  // Build reviews list from existing quote + mock extras
  const allReviews: Review[] = [];
  if (creator.quote) {
    allReviews.push({ text: creator.quote, author: creator.quoteAuthor, rating: 5 });
  }
  // Add mock additional reviews
  const extraReviews: Review[] = [
    { text: "Amazing session, felt so natural and fun. Will definitely book again!", author: "Anonymous", rating: 5 },
    { text: "Great energy and really attentive. Exceeded my expectations.", author: "Sam T.", rating: 4 },
    { text: "Professional, creative, and so easy to talk to. Highly recommend.", author: "Jordan P.", rating: 5 },
    { text: "Good experience overall. Communication was solid and the session was enjoyable.", author: "Riley K.", rating: 4 },
  ];
  allReviews.push(...extraReviews);

  const [reviewIdx, setReviewIdx] = useState(0);
  const currentReview = allReviews[reviewIdx];

  const reviewBlock = allReviews.length > 0 ? (
    <div className="bg-[#4180FB] rounded-xl p-4">
      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= currentReview.rating ? "fill-white text-white" : "fill-white/20 text-white/20"}`}
          />
        ))}
        <span className="text-xs text-white/60 ml-2">{reviewIdx + 1} / {allReviews.length}</span>
      </div>
      {/* Quote text */}
      <p className="text-sm text-white/90 italic leading-relaxed">"{currentReview.text}"</p>
      <p className="text-xs font-semibold text-white mt-2">— {currentReview.author}</p>
      {/* Navigation arrows */}
      {allReviews.length > 1 && (
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => setReviewIdx((i) => (i - 1 + allReviews.length) % allReviews.length)}
            className="h-7 w-7 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <div className="flex gap-1">
            {allReviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setReviewIdx(i)}
                className={`h-1.5 rounded-full transition-all ${i === reviewIdx ? "w-4 bg-white" : "w-1.5 bg-white/30 hover:bg-white/50"}`}
              />
            ))}
          </div>
          <button
            onClick={() => setReviewIdx((i) => (i + 1) % allReviews.length)}
            className="h-7 w-7 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  ) : null;

  const servicesBlock = (
    <div>
      <h3 className="text-sm font-bold text-foreground mb-3">Services</h3>
      <div className="space-y-3">
        {services.map((service) => (
          <button
            key={service.name}
            onClick={() => onViewService(service)}
            className="block w-full text-left rounded-xl border border-gray-200 hover:border-[#4180FB]/50 hover:shadow-sm transition-all overflow-hidden group"
          >
            <div className="p-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-snug"><span className="text-[#4180FB]">I will</span> {service.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{service.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5 group-hover:text-[#4180FB] transition-colors" />
              </div>
              <div className="flex items-center gap-3 mt-2.5">
                <span className="text-sm font-extrabold text-foreground">From {service.startingPrice}</span>
                {service.duration && (
                  <>
                    <span className="text-muted-foreground/30">·</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {service.duration}
                    </span>
                  </>
                )}
                {service.popular && (
                  <>
                    <span className="text-muted-foreground/30">·</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4180FB] bg-[#4180FB]/10 px-1.5 py-0.5 rounded">Popular</span>
                  </>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="absolute inset-0 flex flex-col bg-white rounded-2xl overflow-hidden">
      {lightboxModal}
      {/* Header bar — sticky on desktop, scrolls away on mobile */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-black/10 shrink-0 hidden md:flex">
        <button
          onClick={onBack}
          className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-black/5 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="relative">
          {images[0] ? (
            <img src={images[0]} alt={creator.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-violet-400/50" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-violet-400/50">
              <span className="text-xs font-bold text-primary">{creator.initials}</span>
            </div>
          )}
          {creator.online && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground truncate">{creator.name}</p>
          <p className="text-xs text-muted-foreground truncate">{creator.online ? "Online now" : "Offline"}</p>
        </div>
      </div>

      {/* ── MOBILE: single-column scroll (header scrolls with content) ── */}
      <div className="flex-1 overflow-y-auto md:hidden">
        {/* Mobile back bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-black/10">
          <button
            onClick={onBack}
            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-black/5 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <p className="text-sm font-bold text-foreground">{creator.name}</p>
        </div>
        <div className="p-4 space-y-5">
          {galleryBlock}
          {identityBlock}
          {actionsBlock}
          {bioBlock}
          {servicesBlock}
          {reviewBlock}
        </div>
      </div>

      {/* ── DESKTOP: two-column layout ── */}
      <div className="flex-1 overflow-hidden hidden md:flex">
        {/* Left column — identity (no scroll) */}
        <div className="w-1/2 shrink-0 border-r border-black/5 p-5 space-y-5 flex flex-col">
          {galleryBlock}
          {identityBlock}
          {actionsBlock}
        </div>

        {/* Right column — scrollable bio, services, reviews */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {bioBlock}
          {servicesBlock}
          {reviewBlock}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════
   SERVICE POST VIEW (inline)
   ═══════════════════════════════ */

const serviceFaqs = [
  { question: "Is the session private and secure?", answer: "Absolutely. All sessions are end-to-end private. Only you and the creator are in the call. Plezyy never records or monitors sessions." },
  { question: "Can I request specific outfits or scenarios?", answer: "Yes! Send the creator a message before booking to discuss your preferences. Most creators are happy to accommodate requests." },
  { question: "What if I need to reschedule?", answer: "You can reschedule up to 2 hours before the session. After that, the booking is final." },
  { question: "How does payment work?", answer: "Payments are processed securely through Plezyy Pay (powered by Stripe). You'll be charged once you confirm your booking." },
];

function ServicePostView({
  creator,
  service,
  onBack,
  onChat,
}: {
  creator: Creator;
  service: CreatorService;
  onBack: () => void;
  onChat: (creator: Creator) => void;
}) {
  const [activeTier, setActiveTier] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const images = creator.images ?? [];

  // Generate tiers from service price
  const basePrice = parseInt(service.startingPrice.replace("$", ""));
  const tiers = [
    {
      label: "Basic",
      price: `$${basePrice}`,
      name: `Quick session`,
      duration: service.duration || "15 min",
      features: ["Video or voice call", "1 custom request", "Text chat included"],
    },
    {
      label: "Standard",
      price: `$${Math.round(basePrice * 1.8)}`,
      name: `Full session`,
      duration: service.duration ? `${parseInt(service.duration) * 2} min` : "30 min",
      features: ["HD video call", "3 custom requests", "Chat access", "Session recording"],
      popular: true,
    },
    {
      label: "Premium",
      price: `$${Math.round(basePrice * 3.5)}`,
      name: `VIP experience`,
      duration: service.duration ? `${parseInt(service.duration) * 4} min` : "60 min",
      features: ["HD video call", "Unlimited requests", "Priority chat", "Recording included", "Custom content"],
    },
  ];
  const tier = tiers[activeTier];

  return (
    <div className="absolute inset-0 flex flex-col bg-white rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-black/10 shrink-0">
        <button
          onClick={onBack}
          className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-black/5 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="relative">
          {images[0] ? (
            <img src={images[0]} alt={creator.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-[#4180FB]/50" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-[#4180FB]/10 flex items-center justify-center ring-2 ring-[#4180FB]/50">
              <span className="text-xs font-bold text-[#4180FB]">{creator.initials}</span>
            </div>
          )}
          {creator.online && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground truncate"><span className="text-[#4180FB]">I will</span> {service.name}</p>
          <p className="text-xs text-muted-foreground">by {creator.name}</p>
        </div>
      </div>

      {/* Scrollable content — two-column on desktop */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Left: service details */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 md:border-r md:border-black/5">
          {/* Service title + badges */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {service.popular && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#4180FB]/10 text-[#4180FB] px-2 py-0.5 rounded-full">Popular</span>
              )}
              {service.duration && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-muted-foreground px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {service.duration}
                </span>
              )}
            </div>
            <h2 className="text-xl font-extrabold text-foreground mb-2"><span className="text-[#4180FB]">I will</span> {service.name}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
          </div>

          {/* Creator mini card */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            {images[0] ? (
              <img src={images[0]} alt={creator.name} className="h-12 w-12 rounded-xl object-cover" />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-[#4180FB]/10 flex items-center justify-center">
                <span className="text-sm font-bold text-[#4180FB]">{creator.initials}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-foreground">{creator.name}</p>
                <BadgeCheck className="h-3.5 w-3.5 text-[#4180FB]" />
              </div>
              <p className="text-xs text-muted-foreground">{creator.tagline}</p>
            </div>
            {creator.online && (
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Online</span>
            )}
          </div>

          {/* What's included */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3">What's included</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {tier.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-4 w-4 rounded-full bg-[#4180FB]/10 flex items-center justify-center shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4180FB]" />
                  </span>
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3">FAQ</h3>
            <div className="space-y-2">
              {serviceFaqs.map((faq, i) => (
                <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-gray-50 transition-colors"
                  >
                    {faq.question}
                    <ChevronRight className={`h-4 w-4 text-muted-foreground/40 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-90" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-3 text-xs text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: pricing tiers */}
        <div className="md:w-[280px] lg:w-[320px] shrink-0 overflow-y-auto p-5 space-y-4 border-t md:border-t-0 border-black/5">
          {/* Tier tabs */}
          <div className="flex rounded-xl bg-gray-100 p-1">
            {tiers.map((t, i) => (
              <button
                key={t.label}
                onClick={() => setActiveTier(i)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTier === i
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Active tier card */}
          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            {tier.popular && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#4180FB] text-white px-2 py-0.5 rounded-full">Best Value</span>
            )}
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-foreground">{tier.price}</span>
                <span className="text-xs text-muted-foreground">/ session</span>
              </div>
              <p className="text-sm font-semibold text-foreground mt-0.5">{tier.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{tier.duration}</p>
            </div>
            <ul className="space-y-1.5">
              {tier.features.map((f) => (
                <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-[#4180FB]" />
                  {f}
                </li>
              ))}
            </ul>
            <button className="w-full h-10 rounded-full bg-[#4180FB] text-white text-sm font-semibold hover:bg-[#3268D4] transition-colors flex items-center justify-center gap-2">
              <Video className="h-4 w-4" />
              Book — {tier.price}
            </button>
            <button
              onClick={() => onChat(creator)}
              className="w-full h-10 rounded-full border border-gray-200 text-sm font-semibold text-foreground hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Message {creator.name.split(" ")[0]}
            </button>
          </div>

          {/* Trust badge */}
          <div className="flex items-start gap-2.5 p-3 bg-[#4180FB]/5 rounded-xl">
            <Shield className="h-4 w-4 text-[#4180FB] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-foreground">Secure & Private</p>
              <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">
                All sessions are encrypted. Payments via Plezyy Pay (Stripe).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════
   CHAT VIEW
   ═══════════════════════════════ */

function ChatView({ creator, onBack }: { creator: Creator; onBack: () => void }) {
  const { getConversation, sendMessage, markAsRead } = useConversations();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const partnerId = creator.userId ?? "";
  const conversation = getConversation(partnerId);
  const messages = conversation?.messages ?? [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (partnerId) markAsRead(partnerId);
  }, [partnerId, messages.length, markAsRead]);

  const handleSend = async () => {
    if (!input.trim() || !partnerId) return;
    await sendMessage(partnerId, input.trim());
    setInput("");
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-black/10 shrink-0 bg-white rounded-t-2xl">
        <button
          onClick={onBack}
          className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-black/5 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="relative">
          {creator.images?.[0] ? (
            <img src={creator.images[0]} alt={creator.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-400/50" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-blue-400/50">
              <span className="text-xs font-bold text-primary">{creator.initials}</span>
            </div>
          )}
          {creator.online && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground truncate">{creator.name}</p>
          <p className="text-xs text-muted-foreground">{creator.online ? "Online now" : "Offline"}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">Send a message to start chatting with {creator.name.split(" ")[0]}</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.fromCurrentUser ? "justify-end" : "justify-start"} animate-[favSlideIn_0.3s_ease-out_both]`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.fromCurrentUser
                    ? "bg-blue-500 text-white rounded-br-md"
                    : "bg-white text-foreground rounded-bl-md shadow-sm"
                }`}
              >
                <p>{msg.content}</p>
                <p className={`text-[10px] mt-1 ${msg.fromCurrentUser ? "text-blue-200/60" : "text-muted-foreground/50"}`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 py-3 border-t border-black/10 bg-white rounded-b-2xl">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={`Message ${creator.name.split(" ")[0]}...`}
            className="flex-1 h-10 px-4 rounded-full bg-[#f0f0f0] text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors disabled:opacity-30 disabled:hover:bg-blue-500 shrink-0"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════
   SHARED
   ═══════════════════════════════ */

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-sm font-bold text-foreground mb-3">{title}</h3>
      {children}
    </section>
  );
}
