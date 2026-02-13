export interface ServiceItem {
  id: number;
  name: string;
  description: string;
}

export interface ServiceCategory {
  heading: string;
  emoji: string;
  services: ServiceItem[];
}

const serviceCategories: ServiceCategory[] = [
  {
    heading: "Custom",
    emoji: "✨",
    services: [
      { id: 1, name: "My Own Crazy Idea", description: "Make up whatever wild service you want to offer — go nuts, be as creative as you like." },
    ],
  },
  {
    heading: "Date & Talking Dirty",
    emoji: "💋",
    services: [
      { id: 2, name: "Quick Video Call Convo", description: "A short, casual video call to chat and vibe." },
      { id: 3, name: "Virtual Date", description: "Video call for a fun date where we get to know each other — chat, laugh together." },
      { id: 4, name: "Naked Virtual Date", description: "I'm nude or strip during while you get to know me." },
      { id: 5, name: "Dinner Date on Camera", description: "We \"eat\" together naked/lingerie while chatting and flirting." },
      { id: 6, name: "Phone Sex", description: "Straight-up dirty talk on the phone — moaning, telling you what I'm doing, guiding you, whatever goes." },
      { id: 7, name: "Late Night Dirty Talk", description: "Voice or video chat whenever you're horny and can't sleep — filthy convo only." },
      { id: 8, name: "Voice Moans & Sex Sounds", description: "I record myself moaning, giving head, fucking, or whatever sounds turn you on and send the audio." },
    ],
  },
  {
    heading: "Girlfriend Vibes & Chill Company",
    emoji: "💕",
    services: [
      { id: 9, name: "Virtual Girlfriend (GFE)", description: "I act like your girlfriend — sweet texts, good morning messages, flirty chats, cuddly video calls." },
      { id: 10, name: "Just Hang Out & Talk", description: "Casual chats, voice or video, to keep you company when you're feeling lonely." },
      { id: 11, name: "Get to Know Me Call", description: "Regular phone or video call where we just talk, laugh, flirt, ask anything." },
      { id: 12, name: "Fall Asleep With Me", description: "I stay on voice/video while you fall asleep — soft talking, breathing, just chilling together." },
      { id: 13, name: "Companionship for Older Guys", description: "Gentle, sweet company for seniors — real conversation." },
    ],
  },
  {
    heading: "Live Video Stuff (Getting Naked & Naughty)",
    emoji: "🔥",
    services: [
      { id: 14, name: "Live Video Sex", description: "We get on video and fuck around live — me playing with myself, toys, you name it." },
      { id: 15, name: "Naked Video Date", description: "We hang out on video while I'm completely naked — you watch, we chat, whatever." },
      { id: 16, name: "Live Masturbation Show", description: "You watch me touch myself live, I can follow your instructions or just go for it." },
      { id: 17, name: "Jerk Off Instructions (JOI)", description: "I tell you exactly how to stroke it, tease you, edge you, make you cum on command." },
      { id: 18, name: "Help You Finish", description: "I guide you live or in recording until you cum — directions customized for men or women." },
      { id: 19, name: "Naked Cooking or Drinks", description: "I cook dinner or make cocktails, smoothies on video… while naked or in sexy lingerie." },
      { id: 20, name: "Naked Dinner Date", description: "We eat dinner together on video — I'm butt naked the whole time." },
      { id: 21, name: "Lingerie or Outfit Try-On", description: "I try on lingerie, clothes, or whatever you send me — live undressing and showing off." },
      { id: 22, name: "Live Striptease or Pole Dance", description: "I strip for you slow and sexy, or pole dance naked/lingerie on camera." },
      { id: 23, name: "Naked Yoga / Workout", description: "I do yoga, stretches, or a workout completely nude while you watch live or recorded." },
      { id: 24, name: "Shower Time", description: "You watch me take a real shower — soapy, wet, naked." },
    ],
  },
  {
    heading: "Fetish & Kinky Stuff",
    emoji: "⛓️",
    services: [
      { id: 25, name: "Findom / Paypig", description: "You send tributes while I control your wallet and tease/humiliate you." },
      { id: 26, name: "Small Dick Humiliation", description: "I roast and tease you about your size — mean, playful, whatever level you want." },
      { id: 27, name: "FemDom / Domme Session", description: "I boss you around, give orders, humiliate, control you on video/chat." },
      { id: 28, name: "Foot Fetish", description: "Pics, videos, or live — feet close-ups, toe sucking talk, worship vibes." },
      { id: 29, name: "Piss Play", description: "Videos or live of me peeing — whatever angle or style you're into." },
      { id: 30, name: "Anal Stuff", description: "Anything anal — toys, fingers, whatever you want to see." },
      { id: 31, name: "Spanking / Bondage", description: "Me getting spanked, tied up, or doing it to myself for you." },
    ],
  },
  {
    heading: "Roleplay & Dress-Up",
    emoji: "🎭",
    services: [
      { id: 32, name: "Cosplay / Costume Play", description: "I dress up as nurse, schoolgirl, superhero — whatever — and play it out." },
      { id: 33, name: "Fantasy Roleplay", description: "We act out any fantasy you want — chat, voice, or video." },
      { id: 34, name: "Holiday Sexy Costumes", description: "I dress up naughty for Halloween, Christmas, etc. — pics, video, or live." },
    ],
  },
  {
    heading: "Custom Content",
    emoji: "🎬",
    services: [
      { id: 35, name: "Custom Pictures & Videos (Non-Sexual)", description: "Tell me what you want — I'll create custom non-sexual photos and videos." },
      { id: 36, name: "Custom Nudes / Dirty Videos", description: "You tell me what you want, I make nude pics or explicit videos just for you." },
      { id: 37, name: "AI Porn", description: "Deepfake/AI videos or pics made to look like anyone doing whatever." },
      { id: 38, name: "Hand-Drawn Dirty Art", description: "I draw custom XXX sketches or digital art of your fantasy." },
      { id: 39, name: "Erotic Stories", description: "I write filthy custom stories about anything you want or whatever kink." },
      { id: 40, name: "Watch Together", description: "We share screen and watch porn or movies — commenting, teasing, getting off." },
      { id: 41, name: "Sexy Shoutout Video", description: "Quick custom video for your birthday, motivation, or just to call you a good boy/girl." },
    ],
  },
  {
    heading: "Extra Naughty Extras",
    emoji: "🌶️",
    services: [
      { id: 42, name: "Worn Panties / Underwear", description: "I wear the panties you pick (or my fave), then mail them to you used." },
      { id: 43, name: "Toy Control", description: "You control my vibrator live through an app while we're on video." },
      { id: 44, name: "Long-Distance Boyfriend/Girlfriend", description: "Ongoing texts, calls, video — like we're actually dating but virtual." },
    ],
  },
];

export default serviceCategories;
