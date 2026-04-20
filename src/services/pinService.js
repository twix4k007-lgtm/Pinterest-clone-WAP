// src/services/pinService.js

const MOCK_PINS = [
  { id: 1, title: 'Beautiful Nature', image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a5d?q=80&w=600&auto=format&fit=crop' },
  { id: 2, title: 'Minimalist Setup', image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=600&auto=format&fit=crop' },
  { id: 3, title: 'Healthy Recipe', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop' },
  { id: 4, title: 'Travel Destination', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=600&auto=format&fit=crop' },
  { id: 5, title: 'DIY Project', image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=600&auto=format&fit=crop' },
  { id: 6, title: 'Fashion Inspiration', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop' },
  { id: 7, title: 'Tech Gadgets', image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=600&auto=format&fit=crop' },
  { id: 8, title: 'Art & Design', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop' },
  { id: 9, title: 'Street Photography', image: 'https://images.unsplash.com/photo-1516862523118-a3724eb136d7?q=80&w=600&auto=format&fit=crop' },
  { id: 10, title: 'Vintage Cars', image: 'https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?q=80&w=600&auto=format&fit=crop' },
];

export const getPins = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate real-world sporadic API failures (10% chance)
      if (Math.random() < 0.1) {
        reject(new Error('Failed to fetch pins due to server timeout.'));
      } else {
        resolve(MOCK_PINS);
      }
    }, 1000); // 1-second mock network delay
  });
};

export const searchPins = async (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const results = MOCK_PINS.filter((pin) =>
        pin.title.toLowerCase().includes(lowerQuery)
      );
      resolve(results);
    }, 600);
  });
};
