export type Review = {
  id: string;
  source: 'reddit' | 'x';
  username: string;
  avatarUrl: string;
  content: string;
  date: string;
  likes: number;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  coverColor: string;
  coverImage?: string;
  excerpt: string;
  rating: number;
  readTimeMn: number;
  reviews: Review[];
  chapters: { title: string; content: string }[];
};

export const categories = [
  'Psychological',
  'Astronomy',
  'Sci-Fi',
  'Philosophy',
  'Mysticism'
];

export const books: Book[] = [
  {
    id: 'psy-1',
    title: 'Echoes of the Ego',
    author: 'S. Vance',
    category: 'Psychological',
    coverColor: 'bg-[#2A2A35]',
    rating: 4.8,
    readTimeMn: 120,
    excerpt: 'An exploration into the depths of the human mind and its hidden drivers.',
    reviews: [
      {
        id: 'r1',
        source: 'reddit',
        username: 'u/MindExplorer99',
        avatarUrl: 'https://i.pravatar.cc/100?img=11',
        content: 'This book completely changed my perspective on shadow work. Highly recommend to anyone digging into Jungian psychology.',
        date: '2d ago',
        likes: 142
      },
      {
        id: 'x1',
        source: 'x',
        username: '@psycho_reads',
        avatarUrl: 'https://i.pravatar.cc/100?img=12',
        content: '"Echoes of the Ego" is a masterpiece. Just finished chapter 2 & my mind is blown 🤯 #books #psychology',
        date: '5h ago',
        likes: 38
      }
    ],
    chapters: [
      { title: 'Chapter 1: The Mirror', content: 'We look into the mirror and see only what we want to see. The ego is a master illusionist, painting over our true intentions. Through deep contemplation, one can distinguish the facade from the true self.' },
      { title: 'Chapter 2: Shadows', content: 'Where light touches, shadows are cast. Our psychological shadows hold the key to our hidden potential. To walk in the light, one must first befriend the dark.' },
    ]
  },
  {
    id: 'ast-1',
    title: 'The Deep Universe',
    author: 'Arthur C.',
    category: 'Astronomy',
    coverColor: 'bg-[#18181b]',
    rating: 4.5,
    readTimeMn: 90,
    excerpt: 'A comprehensive guide to the cosmos and the stars beyond.',
    reviews: [
      {
        id: 'r2',
        source: 'reddit',
        username: 'u/StarGazer_00',
        avatarUrl: 'https://i.pravatar.cc/100?img=3',
        content: 'Arthur C. delivers again. The way he describes the expansion of the void makes you feel incredibly small, yet connected.',
        date: '1w ago',
        likes: 890
      }
    ],
    chapters: [
      { title: 'Chapter 1: The Void', content: 'In the vastness of space, the silence is deafening. Yet, in this silence, the universe speaks. The expansion is not just physical; it is a manifestation of potential.' },
    ]
  },
  {
    id: 'mys-1',
    title: 'Whispers of the Celestial',
    author: 'Elara Moon',
    category: 'Mysticism',
    coverColor: 'bg-[#1C1A24]',
    rating: 4.9,
    readTimeMn: 150,
    excerpt: 'Connecting with the ethereal forces of the universe.',
    reviews: [
      {
        id: 'x2',
        source: 'x',
        username: '@astro_elara_fan',
        avatarUrl: 'https://i.pravatar.cc/100?img=5',
        content: 'I pull quotes from "Whispers of the Celestial" every morning. Absolute magic. ✨🌙',
        date: '12h ago',
        likes: 412
      }
    ],
    chapters: [
      { title: 'Chapter 1: The Alignment', content: 'When the stars align, the veil between worlds thins. Listen closely. The cosmos does not shout; it murmurs secrets to those willing to attune their frequencies.' },
    ]
  }
];

export type Zodiac = {
  id: string;
  name: string;
  dateRange: string;
  element: string;
  daily: string;
  yearly: string;
  chineseAlignment: {
    sign: string;
    description: string;
  };
};

export const zodiacData: Zodiac[] = [
  {
    id: 'aries',
    name: 'Aries',
    dateRange: 'Mar 21 - Apr 19',
    element: 'Fire',
    daily: 'Your ruling planet Mars ignites a sudden burst of clarity today. A decision that seemed clouded will reveal its true path.',
    yearly: 'This year marks a pivotal transition in your personal sovereignty. You will lay the groundwork for a legacy that outlasts temporary passions.',
    chineseAlignment: {
      sign: 'Dragon',
      description: 'Your fiery ambition perfectly mirrors the Dragon’s auspicious power. Together, they signify an unstoppable force of creation and leadership.'
    }
  },
  {
    id: 'taurus',
    name: 'Taurus',
    dateRange: 'Apr 20 - May 20',
    element: 'Earth',
    daily: 'Seek grounding today. The cosmos are shifting rapidly, and your strength lies in steadfast stillness.',
    yearly: 'A year of material and spiritual consolidation. Investments made now—both in relationships and wealth—will compound beautifully.',
    chineseAlignment: {
      sign: 'Snake',
      description: 'Taurus stability blends with the Snake’s deep wisdom. You are urged to look beneath the surface of material gains to find enduring truth.'
    }
  },
  {
    id: 'gemini',
    name: 'Gemini',
    dateRange: 'May 21 - Jun 20',
    element: 'Air',
    daily: 'Duality is your gift, not a curse. Today, viewing a problem from two opposing perspectives will birth the ultimate solution.',
    yearly: 'Communication takes center stage. You will act as a bridge between disjointed realms, turning scattered ideas into profound narratives.',
    chineseAlignment: {
      sign: 'Horse',
      description: 'The swift intellect of Gemini aligns with the independent movement of the Horse, urging a journey of intellectual freedom.'
    }
  },
  {
    id: 'cancer',
    name: 'Cancer',
    dateRange: 'Jun 21 - Jul 22',
    element: 'Water',
    daily: 'The moon’s current phase pulls on your intuitive tides. Trust the feeling in your chest over the logic in your head today.',
    yearly: 'Emotional mastery is the theme. You will build a fortress not to keep others out, but to protect the sacred empathy within.',
    chineseAlignment: {
      sign: 'Goat',
      description: 'Your nurturing waters align with the gentle, artistic Goat. It is a harmonious pairing focused on domestic tranquility and creative peace.'
    }
  },
  {
    id: 'leo',
    name: 'Leo',
    dateRange: 'Jul 23 - Aug 22',
    element: 'Fire',
    daily: 'Radiate. The universe requires your specific frequency of warmth today. Do not shrink to make others comfortable.',
    yearly: 'A golden era of self-actualization. You are not just stepping into the spotlight; you are becoming the light source itself.',
    chineseAlignment: {
      sign: 'Monkey',
      description: 'Leo’s regal brilliance matches the Monkey’s dynamic brilliance. A time to rule, but with cleverness and joy.'
    }
  },
  {
    id: 'virgo',
    name: 'Virgo',
    dateRange: 'Aug 23 - Sep 22',
    element: 'Earth',
    daily: 'Perfection is an illusion, but refinement is a divine practice. Focus on improving one detail today, and let the rest breathe.',
    yearly: 'Service to others will transform into a service to the self. Your meticulous nature will untangle a long-standing cosmic knot.',
    chineseAlignment: {
      sign: 'Rooster',
      description: 'Precision meets punctuality. The Virgo-Rooster alignment yields a year of exact execution and undeniable results.'
    }
  },
  {
    id: 'libra',
    name: 'Libra',
    dateRange: 'Sep 23 - Oct 22',
    element: 'Air',
    daily: 'Balance isn’t static; it is a delicate dance. Adjust your weights today. Say "no" to something to balance a recent "yes".',
    yearly: 'Justice and aesthetics will merge. You will find that true beauty requires harmony, and harmony demands truth.',
    chineseAlignment: {
      sign: 'Dog',
      description: 'Your quest for fairness aligns with the Dog’s innate loyalty and justice, creating a powerful vanguard for truth.'
    }
  },
  {
    id: 'scorpio',
    name: 'Scorpio',
    dateRange: 'Oct 23 - Nov 21',
    element: 'Water',
    daily: 'Transformation is messy before it is beautiful. Do not run from the intensity of today’s interactions; there is power there.',
    yearly: 'A profound shedding of old skins. What you lose this year will be replaced by something infinitely more aligned with your soul core.',
    chineseAlignment: {
      sign: 'Pig',
      description: 'The deep emotional waters of Scorpio find comfort in the Pig’s genuine nature. A time for authentic, unmasked emotional abundance.'
    }
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius',
    dateRange: 'Nov 22 - Dec 21',
    element: 'Fire',
    daily: 'Your philosophical arrow is pointed at a new target. A conversation today will spark a massive paradigm shift.',
    yearly: 'The horizon expands. This year is not about the destination, but the wisdom gathered during the transit.',
    chineseAlignment: {
      sign: 'Rat',
      description: 'Sagittarian vision pairs with the Rat’s cunning resourcefulness. Big dreams are met with the sharp strategy needed to realize them.'
    }
  },
  {
    id: 'capricorn',
    name: 'Capricorn',
    dateRange: 'Dec 22 - Jan 19',
    element: 'Earth',
    daily: 'The mountain seems steep today, but your footing is secure. Look down to see how far you have already climbed.',
    yearly: 'A year of monumental architectural achievements in your life structure. You are building empires that will outlast you.',
    chineseAlignment: {
      sign: 'Ox',
      description: 'An unstoppable combination. The terrestrial focus of Capricorn multiplied by the Ox’s legendary endurance.'
    }
  },
  {
    id: 'aquarius',
    name: 'Aquarius',
    dateRange: 'Jan 20 - Feb 18',
    element: 'Air',
    daily: 'Your eccentric ideas are actually prophecies. Write down the abstract thought that crosses your mind this afternoon.',
    yearly: 'You are the vanguard. This year, you will dismantle an outdated system and replace it with a visionary network.',
    chineseAlignment: {
      sign: 'Tiger',
      description: 'Aquarian innovation meets the Tiger’s fierce independence. A revolutionary energy that breaks old chains.'
    }
  },
  {
    id: 'pisces',
    name: 'Pisces',
    dateRange: 'Feb 19 - Mar 20',
    element: 'Water',
    daily: 'The boundary between dream and waking life is thin today. Pay attention to synchronicities; they are breadcrumbs.',
    yearly: 'A culmination of spiritual empathy. You will dissolve boundaries that separate you from the universal consciousness.',
    chineseAlignment: {
      sign: 'Rabbit',
      description: 'The mystic waters of Pisces seamlessly blend with the Rabbit’s gentle intuition, yielding profound mystical peace.'
    }
  }
];
