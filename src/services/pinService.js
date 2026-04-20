// src/services/pinService.js

/**
 * ----------------------------------------------------------------------------
 * MOCK DATABASE
 * ----------------------------------------------------------------------------
 * Expanding our simulated data structure to accommodate a real-world testing
 * environment. Each pin now includes rich metadata such as authorship,
 * interaction metrics, timestamps, and categorization tags.
 */
const MOCK_PINS = [
  { id: 1, title: 'Beautiful Nature', image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a5d?q=80&w=600&auto=format&fit=crop', author: 'Jane Doe', likes: 245, comments: 12, tags: ['nature', 'landscape'] },
  { id: 2, title: 'Minimalist Work Setup', image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=600&auto=format&fit=crop', author: 'Tech Guru', likes: 890, comments: 55, tags: ['tech', 'workspace'] },
  { id: 3, title: 'Healthy Breakfast Bowl', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop', author: 'Chef Anna', likes: 432, comments: 8, tags: ['food', 'healthy'] },
  { id: 4, title: 'Tropical Travel Destination', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=600&auto=format&fit=crop', author: 'Wanderlust', likes: 1205, comments: 104, tags: ['travel', 'beach'] },
  { id: 5, title: 'DIY Wooden Shelf Project', image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=600&auto=format&fit=crop', author: 'Handyman Bob', likes: 340, comments: 23, tags: ['diy', 'woodworking'] },
  { id: 6, title: 'Autumn Fashion Inspiration', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop', author: 'Style Icon', likes: 567, comments: 34, tags: ['fashion', 'autumn'] },
  { id: 7, title: 'Latest Tech Gadgets Compilation', image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=600&auto=format&fit=crop', author: 'Gadget Freak', likes: 88, comments: 2, tags: ['tech', 'gadgets'] },
  { id: 8, title: 'Modern Art & Flowing Design', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop', author: 'Creative Mind', likes: 745, comments: 45, tags: ['art', 'design'] },
  { id: 9, title: 'Urban Street Photography', image: 'https://images.unsplash.com/photo-1516862523118-a3724eb136d7?q=80&w=600&auto=format&fit=crop', author: 'City Snapper', likes: 210, comments: 15, tags: ['photography', 'urban'] },
  { id: 10, title: 'Classic Vintage Cars Showcase', image: 'https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?q=80&w=600&auto=format&fit=crop', author: 'Motor Head', likes: 934, comments: 78, tags: ['cars', 'vintage'] },
  { id: 11, title: 'Mountain Hiking Trail', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop', author: 'Explorer', likes: 532, comments: 21, tags: ['travel', 'nature'] },
  { id: 12, title: 'Cozy Reading Nook Ideas', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop', author: 'Bookworm', likes: 820, comments: 64, tags: ['interior', 'books'] },
  { id: 13, title: 'Abstract Paint Textures', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop', author: 'Artist Life', likes: 310, comments: 9, tags: ['art', 'abstract'] },
  { id: 14, title: 'Modern Architecture', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop', author: 'Arch Digest', likes: 1450, comments: 120, tags: ['architecture', 'city'] },
  { id: 15, title: 'Gourmet Coffee Preparation', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600&auto=format&fit=crop', author: 'Barista Pete', likes: 678, comments: 41, tags: ['coffee', 'food'] },
  { id: 16, title: 'Scandinavian Living Room', image: 'https://images.unsplash.com/photo-1583847268964-b28ce8f31586?q=80&w=600&auto=format&fit=crop', author: 'Deco Chic', likes: 912, comments: 88, tags: ['interior', 'home'] },
  { id: 17, title: 'Macro Floral Photography', image: 'https://images.unsplash.com/photo-1490750967868-88cb44cb2722?q=80&w=600&auto=format&fit=crop', author: 'Flora Focus', likes: 234, comments: 11, tags: ['nature', 'flowers'] },
  { id: 18, title: 'Retro Arcade Machines', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop', author: 'Gamer Guy', likes: 589, comments: 37, tags: ['gaming', 'retro'] },
  { id: 19, title: 'Yoga and Meditation Pose', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop', author: 'Zen Master', likes: 456, comments: 29, tags: ['fitness', 'wellness'] },
  { id: 20, title: 'Night Sky Starscape', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop', author: 'Astro Nut', likes: 1240, comments: 105, tags: ['nature', 'space'] },
  { id: 21, title: 'Handmade Pottery Collection', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=600&auto=format&fit=crop', author: 'Clay Works', likes: 345, comments: 18, tags: ['art', 'crafts'] },
  { id: 22, title: 'Winter Wonderland Snowscape', image: 'https://images.unsplash.com/photo-1478265409131-1f65c88f965c?q=80&w=600&auto=format&fit=crop', author: 'Frosty', likes: 890, comments: 55, tags: ['travel', 'winter'] },
  { id: 23, title: 'Fresh Organic Produce', image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=600&auto=format&fit=crop', author: 'Farmer John', likes: 432, comments: 24, tags: ['food', 'organic'] },
  { id: 24, title: 'Aesthetic Desert Dunes', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=600&auto=format&fit=crop', author: 'Oasis', likes: 678, comments: 42, tags: ['nature', 'travel'] },
  { id: 25, title: 'Mechanical Keyboard Build', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600&auto=format&fit=crop', author: 'Keeb Weeb', likes: 1120, comments: 130, tags: ['tech', 'custom'] },
  { id: 26, title: 'Watercolor Painting Process', image: 'https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?q=80&w=600&auto=format&fit=crop', author: 'Painters Studio', likes: 543, comments: 31, tags: ['art', 'painting'] },
  { id: 27, title: 'Sunset Surf Session', image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=600&auto=format&fit=crop', author: 'Wave Rider', likes: 888, comments: 49, tags: ['sports', 'ocean'] },
  { id: 28, title: 'Industrial Loft Apartment', image: 'https://images.unsplash.com/photo-1502005097973-f54f51e06497?q=80&w=600&auto=format&fit=crop', author: 'Loft Living', likes: 965, comments: 72, tags: ['interior', 'design'] },
  { id: 29, title: 'Cute Golden Retriever Puppy', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600&auto=format&fit=crop', author: 'Doggo Fan', likes: 2300, comments: 450, tags: ['animals', 'pets'] },
  { id: 30, title: 'Analog Camera Collection', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop', author: 'Film Nerd', likes: 456, comments: 23, tags: ['photography', 'vintage'] }
];

/**
 * ----------------------------------------------------------------------------
 * UTILITIES
 * ----------------------------------------------------------------------------
 * Artificial delay generator to accurately mock network latency profiles
 * across different user connection scenarios.
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Ensures consistent pseudo-randomness for mock network failures.
 * Adds a small layer of unpredictability for UI state stress-testing.
 */
const mockNetworkFailure = (failureRate = 0.05) => {
  return Math.random() < failureRate;
};

/**
 * ----------------------------------------------------------------------------
 * API SERVICES
 * ----------------------------------------------------------------------------
 */

/**
 * getPins
 * Retrieves a paginated list of pins simulating database limit/offset.
 *
 * @param {number} page - Current page index (starts at 1)
 * @param {number} limit - Number of pins to return per page
 * @returns {Promise<Array>} Array of pin objects
 */
export const getPins = async (page = 1, limit = 20) => {
  // Simulate variable network conditions (800ms to 1500ms)
  const networkLatency = Math.floor(Math.random() * 700) + 800;
  await delay(networkLatency);

  if (mockNetworkFailure(0.08)) {
    throw new Error('503 Service Unavailable: Simulated backend timeout.');
  }

  // Calculate pagination bounds
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // Return sliced copy of the database
  return [...MOCK_PINS].slice(startIndex, endIndex);
};

/**
 * searchPins
 * Conducts a full-text simulated search against multiple fields
 * (title, tags, author) and supports simulated text relevancy.
 *
 * @param {string} query - The search term
 * @param {number} limit - Max results to return
 * @returns {Promise<Array>} Filtered array of pin objects
 */
export const searchPins = async (query = '', limit = 20) => {
  // Search requests are typically faster, simulate 400ms to 900ms
  const searchLatency = Math.floor(Math.random() * 500) + 400;
  await delay(searchLatency);

  if (mockNetworkFailure(0.05)) {
    throw new Error('500 Internal Server Error: Search index exhausted.');
  }

  if (!query || query.trim() === '') {
    return getPins(1, limit);
  }

  const normalizedQuery = query.toLowerCase().trim();

  const results = MOCK_PINS.filter((pin) => {
    const matchTitle = pin.title.toLowerCase().includes(normalizedQuery);
    const matchAuthor = pin.author.toLowerCase().includes(normalizedQuery);
    const matchTags = pin.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
    return matchTitle || matchAuthor || matchTags;
  });

  return results.slice(0, limit);
};

/**
 * getPinById
 * Simulates fetching detailed metadata for a single specific pin.
 *
 * @param {number|string} id - The unique identifier of the pin
 * @returns {Promise<Object>} Single pin object detailed payload
 */
export const getPinById = async (id) => {
  await delay(500);

  const pinId = Number(id);
  const pin = MOCK_PINS.find((p) => p.id === pinId);

  if (!pin) {
    throw new Error(`404 Not Found: Pin with ID ${pinId} does not exist.`);
  }

  return { ...pin, views: Math.floor(Math.random() * 5000) };
};
