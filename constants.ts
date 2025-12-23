import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'The Sovereign Loafer',
    price: 495,
    description: 'Hand-stitched Italian leather loafer with a bespoke patina finish. Designed for the modern gentleman who values timeless elegance.',
    category: 'Men',
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616406432452-07bc5938759d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bG9hZmVyfGVufDB8MHwwfHx8MA%3D%3D',
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    colors: ['Black', 'Cognac'],
    isBestSeller: true,
  },
  {
    id: '2',
    name: 'Ethereal Stiletto',
    price: 650,
    description: 'A masterpiece of balance and form. The Ethereal Stiletto features a 100mm heel and our signature red lacquer sole.',
    category: 'Women',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000&auto=format&fit=crop',
    ],
    sizes: [36, 37, 38, 39, 40],
    colors: ['Black', 'Nude', 'Red'],
    isNew: true,
  },
  {
    id: '3',
    name: 'Vanguard Boot',
    price: 580,
    description: 'Rugged durability meets urban sophistication. Crafted from full-grain calfskin with a Goodyear welt construction.',
    category: 'Men',
    images: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym9vdHxlbnwwfDF8MHx8fDA%3D',
    ],
    sizes: [40, 41, 42, 43, 44],
    colors: ['Dark Brown', 'Black'],
  },
  {
    id: '4',
    name: 'Celestial Pump',
    price: 720,
    description: 'Adorned with Swarovski crystals, the Celestial Pump is the epitome of evening glamour.',
    category: 'Women',
    images: [
      'https://images.unsplash.com/photo-1584126321238-9599c6388dfe?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1578263175419-3f9f8633ea5a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D',
    ],
    sizes: [36, 37, 38, 39],
    colors: ['Silver', 'Gold'],
    isBestSeller: true,
  },
  {
    id: '5',
    name: 'Monarch Oxford',
    price: 525,
    description: 'The definitive dress shoe. Sleek, minimal, and impeccably constructed for the boardroom and beyond.',
    category: 'Men',
    images: [
      'https://images.unsplash.com/photo-1764269717472-21cc51823c9c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGx1eHVyeSUyMHNob2VzfGVufDB8MXwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1534653299134-96a171b61581?q=80&w=1000&auto=format&fit=crop',
    ],
    sizes: [41, 42, 43, 44, 45, 46],
    colors: ['Black'],
  },
  {
    id: '6',
    name: 'Obsidian Sneaker',
    price: 450,
    description: 'Luxury streetwear redefined. Italian leather uppers with a lightweight, architectural sole.',
    category: 'Limited',
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop',
    ],
    sizes: [39, 40, 41, 42, 43, 44],
    colors: ['Matte Black', 'White'],
    isNew: true,
  }
];

export const SHIPPING_COST = 25;
export const FREE_SHIPPING_THRESHOLD = 1000;
