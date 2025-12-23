import React, { useState, useEffect, useContext, createContext } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import { ShoppingBag, Menu, X, User as UserIcon, Heart, ChevronRight, Star, Minus, Plus, Trash2, ArrowRight, Check, Search, Filter, LogOut, Package, Eye, ShieldCheck, Truck, Sparkles, Layers, Scissors, Feather, Facebook, Twitter, Play } from 'lucide-react';
import { MOCK_PRODUCTS, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from './constants';
import { Product, CartItem, User, Order } from './types';

// --- Contexts ---

// Auth Context
interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Shop Context
interface ShopContextType {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product, size: number, color: string) => void;
  removeFromCart: (productId: string, size: number, color: string) => void;
  updateQuantity: (productId: string, size: number, color: string, delta: number) => void;
  toggleWishlist: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
}
const ShopContext = createContext<ShopContextType>({} as ShopContextType);

// --- Providers ---

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string) => {
    // Mock login logic
    if (email.includes('admin')) {
      setUser({ id: 'admin1', name: 'Admin User', email, isAdmin: true });
    } else {
      setUser({ id: 'user1', name: 'Valued Customer', email, isAdmin: false });
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const addToCart = (product: Product, size: number, color: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size && item.selectedColor === color);
      if (existing) {
        return prev.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, selectedSize: size, selectedColor: color, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string, size: number, color: string) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.selectedSize === size && item.selectedColor === color)));
  };

  const updateQuantity = (productId: string, size: number, color: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId && item.selectedSize === size && item.selectedColor === color) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <ShopContext.Provider value={{ cart, wishlist, addToCart, removeFromCart, updateQuantity, toggleWishlist, clearCart, cartTotal }}>
      {children}
    </ShopContext.Provider>
  );
};

// --- Components ---

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useContext(ShopContext);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isHome = location.pathname === '/';
  const headerClass = `fixed w-full z-50 transition-all duration-300 ${
    scrolled || !isHome ? 'bg-white/95 backdrop-blur-md shadow-sm py-5' : 'bg-transparent py-8'
  }`;
  const textColor = scrolled || !isHome ? 'text-stone-900' : 'text-stone-900 md:text-white';

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-6 md:px-12 lg:px-24 flex justify-between items-center">
        {/* Mobile Menu Button */}
        <button className={`md:hidden ${textColor}`} onClick={() => setMenuOpen(true)}>
          <Menu size={28} />
        </button>

        {/* Logo */}
        <Link to="/" className={`text-3xl md:text-4xl font-serif font-bold tracking-widest ${textColor}`}>
          AETERNA
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-10 items-center">
          <Link to="/shop" className={`uppercase text-sm tracking-[0.2em] hover:text-gold-400 transition-colors ${textColor}`}>Shop</Link>
          <Link to="/about" className={`uppercase text-sm tracking-[0.2em] hover:text-gold-400 transition-colors ${textColor}`}>Our Story</Link>
          <Link to="/contact" className={`uppercase text-sm tracking-[0.2em] hover:text-gold-400 transition-colors ${textColor}`}>Contact</Link>
        </nav>

        {/* Icons */}
        <div className={`flex items-center space-x-8 ${textColor}`}>
          {user ? (
            <div className="relative group cursor-pointer">
                <UserIcon size={24} className="hover:text-gold-400 transition-colors" />
                <div className="absolute right-0 mt-2 w-56 bg-white text-stone-900 shadow-xl rounded-sm py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-stone-100">
                  <div className="px-5 py-3 border-b border-stone-100 text-sm font-bold uppercase tracking-wide text-stone-400">
                    Hello, {user.name.split(' ')[0]}
                  </div>
                  {user.isAdmin && (
                    <Link to="/admin" className="block px-5 py-3 hover:bg-stone-50 text-base">Dashboard</Link>
                  )}
                  <button onClick={() => { logout(); navigate('/'); }} className="w-full text-left px-5 py-3 hover:bg-stone-50 text-base flex items-center">
                    <LogOut size={16} className="mr-3"/> Sign Out
                  </button>
                </div>
            </div>
          ) : (
             <Link to="/login" className="hover:text-gold-400 transition-colors">
               <UserIcon size={24} />
             </Link>
          )}

          <Link to="/cart" className="relative hover:text-gold-400 transition-colors">
            <ShoppingBag size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold-400 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cart.reduce((a, c) => a + c.quantity, 0)}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-stone-900 z-50 flex flex-col items-center justify-center space-y-10 text-white animate-fade-in">
          <button className="absolute top-8 right-8" onClick={() => setMenuOpen(false)}>
            <X size={36} />
          </button>
          <Link to="/" className="text-4xl font-serif font-bold tracking-widest mb-10">AETERNA</Link>
          <Link to="/shop" className="text-2xl uppercase tracking-widest hover:text-gold-400">Shop</Link>
          <Link to="/about" className="text-2xl uppercase tracking-widest hover:text-gold-400">Our Story</Link>
          <Link to="/contact" className="text-2xl uppercase tracking-widest hover:text-gold-400">Contact</Link>
          <Link to="/cart" className="text-2xl uppercase tracking-widest hover:text-gold-400">Cart ({cart.length})</Link>
          {user ? (
            <button onClick={logout} className="text-base uppercase tracking-widest text-stone-400 mt-10">Sign Out</button>
          ) : (
            <Link to="/login" className="text-2xl uppercase tracking-widest hover:text-gold-400">Login</Link>
          )}
        </div>
      )}
    </header>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-stone-900 text-stone-400 py-20">
    <div className="container mx-auto px-6 md:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-4 gap-16">
      <div>
        <h3 className="text-white font-serif text-3xl mb-8 tracking-wider">AETERNA</h3>
        <p className="text-base leading-relaxed mb-6">
          Defining modern luxury through exceptional craftsmanship and timeless design.
        </p>
      </div>
      <div>
        <h4 className="text-white uppercase tracking-widest text-sm font-bold mb-8">Collection</h4>
        <ul className="space-y-4 text-base">
          <li><Link to="/shop?category=Men" className="hover:text-gold-400 transition-colors">Men</Link></li>
          <li><Link to="/shop?category=Women" className="hover:text-gold-400 transition-colors">Women</Link></li>
          <li><Link to="/shop?category=Limited" className="hover:text-gold-400 transition-colors">Limited Editions</Link></li>
          <li><Link to="/shop" className="hover:text-gold-400 transition-colors">New Arrivals</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white uppercase tracking-widest text-sm font-bold mb-8">Support</h4>
        <ul className="space-y-4 text-base">
          <li><Link to="/contact" className="hover:text-gold-400 transition-colors">Contact Us</Link></li>
          <li><Link to="/shipping-returns" className="hover:text-gold-400 transition-colors">Shipping & Returns</Link></li>
          <li><Link to="/size-guide" className="hover:text-gold-400 transition-colors">Size Guide</Link></li>
          <li><Link to="/faq" className="hover:text-gold-400 transition-colors">FAQ</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white uppercase tracking-widest text-sm font-bold mb-8">Newsletter</h4>
        <p className="text-base mb-6">Subscribe for exclusive access.</p>
        <div className="flex border-b border-stone-700 pb-3">
          <input type="email" placeholder="Email Address" className="bg-transparent w-full outline-none text-white placeholder-stone-600 text-base" />
          <button className="text-white uppercase text-sm font-bold tracking-widest hover:text-gold-400">Join</button>
        </div>
      </div>
    </div>
    <div className="container mx-auto px-6 md:px-12 lg:px-24 mt-20 pt-10 border-t border-stone-800 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center">
      <p>&copy; {new Date().getFullYear()} AETERNA. All rights reserved.</p>
      <div className="flex space-x-8 mt-6 md:mt-0">
        <a href="#" className="hover:text-white transition-colors">Instagram</a>
        <a href="#" className="hover:text-white transition-colors">Facebook</a>
        <a href="#" className="hover:text-white transition-colors">Pinterest</a>
      </div>
    </div>
  </footer>
);

const QuickViewModal: React.FC<{ product: Product; onClose: () => void }> = ({ product, onClose }) => {
  const { addToCart } = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto relative z-10 grid grid-cols-1 md:grid-cols-2 shadow-2xl animate-fade-in">
        <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-3 bg-white/50 hover:bg-white rounded-full z-20 transition-colors"
        >
            <X size={24} />
        </button>

        {/* Image Side */}
        <div className="relative bg-stone-100 aspect-[3/4] md:aspect-auto md:h-full">
             <img src={product.images[0]} className="w-full h-full object-cover" alt={product.name} />
        </div>

        {/* Details Side */}
        <div className="p-10 md:p-16 flex flex-col h-full">
            <h2 className="text-4xl md:text-5xl font-serif mb-4">{product.name}</h2>
            <p className="text-2xl text-stone-500 mb-8">${product.price}</p>
            <p className="text-stone-600 mb-10 text-lg leading-relaxed">{product.description}</p>
            
            {/* Color Selection */}
            <div className="mb-8">
                <span className="text-sm uppercase font-bold tracking-widest text-stone-400 mb-4 block">Color</span>
                <div className="flex space-x-4">
                    {product.colors.map(color => (
                        <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`h-12 px-6 border text-base transition-all ${selectedColor === color ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 hover:border-stone-900'}`}
                        >
                            {color}
                        </button>
                    ))}
                </div>
            </div>

             {/* Size Selection */}
             <div className="mb-10">
               <span className="text-sm uppercase font-bold tracking-widest text-stone-400 mb-4 block">Size</span>
               <div className="grid grid-cols-5 gap-3">
                 {product.sizes.map(size => (
                   <button 
                     key={size} 
                     onClick={() => setSelectedSize(size)}
                     className={`py-3 border text-base transition-all ${selectedSize === size ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 hover:border-stone-900'}`}
                   >
                     {size}
                   </button>
                 ))}
               </div>
             </div>

             <div className="mt-auto">
                <button
                    onClick={() => {
                        if(selectedSize && selectedColor) {
                            addToCart(product, selectedSize, selectedColor);
                            onClose();
                        }
                    }}
                    disabled={!selectedSize || !selectedColor}
                    className="w-full bg-stone-900 text-white py-5 uppercase tracking-widest text-sm font-bold hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Add to Bag
                </button>
                <Link to={`/product/${product.id}`} className="block text-center mt-6 text-sm uppercase tracking-widest text-stone-500 hover:text-stone-900 underline">
                    View Full Details
                </Link>
             </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product; onQuickView?: (product: Product) => void }> = ({ product, onQuickView }) => {
  const { toggleWishlist, wishlist } = useContext(ShopContext);
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="group relative">
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-6 cursor-pointer">
        <Link to={`/product/${product.id}`}>
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          {product.images[1] && (
             <img src={product.images[1]} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
          )}
        </Link>
        {product.isNew && (
          <span className="absolute top-5 left-5 bg-white/90 backdrop-blur text-xs uppercase font-bold tracking-widest px-3 py-2">New In</span>
        )}
        {product.isBestSeller && (
          <span className="absolute top-5 left-5 bg-stone-900 text-white text-xs uppercase font-bold tracking-widest px-3 py-2">Best Seller</span>
        )}
        <button 
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
          className="absolute top-5 right-5 p-3 bg-white/50 backdrop-blur rounded-full hover:bg-white transition-colors opacity-0 group-hover:opacity-100 duration-300 z-20"
        >
          <Heart size={20} className={isWishlisted ? "fill-red-500 text-red-500" : "text-stone-900"} />
        </button>

        {onQuickView && (
          <div className="absolute inset-x-0 bottom-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              className="w-full bg-white/90 backdrop-blur-sm text-stone-900 py-4 text-sm font-bold uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-colors shadow-lg"
            >
              Quick View
            </button>
          </div>
        )}
      </div>
      <Link to={`/product/${product.id}`} className="block">
        <h3 className="font-serif text-xl md:text-2xl text-stone-900 mb-2 group-hover:text-gold-500 transition-colors">{product.name}</h3>
        <p className="text-base text-stone-500 mb-3">{product.category}</p>
        <span className="text-lg font-medium text-stone-900">${product.price}</span>
      </Link>
    </div>
  );
};

const LuxuryDetailCarousel: React.FC = () => {
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=2000&auto=format&fit=crop",
      title: "Precision Stitching",
      caption: "Every seam is a testament to the patience of our master cordwainers."
    },
    {
      image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=2000&auto=format&fit=crop",
      title: "Signature Soles",
      caption: "Crafted for durability and an unmistakable silhouette."
    },
     {
      image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNob2VzfGVufDB8MHwwfHx8MA%3D%3D",
      title: "Exquisite Patina",
      caption: "Hand-painted layers create depth and character unique to every pair."
    }
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[85vh] bg-stone-900 overflow-hidden">
      {slides.map((slide, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0'}`}
        >
           <img src={slide.image} alt={slide.title} className="w-full h-full object-cover opacity-70" />
           <div className="absolute inset-0 bg-black/20" /> {/* Overlay for text readability */}
           <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 md:px-12 lg:px-24">
              <span className="text-gold-400 uppercase tracking-[0.3em] text-base mb-6 animate-fade-in block">Luxury in Detail</span>
              <h2 className="text-6xl md:text-8xl font-serif mb-8">{slide.title}</h2>
              <p className="text-xl md:text-2xl text-stone-200 max-w-3xl font-light">{slide.caption}</p>
           </div>
        </div>
      ))}
      
      {/* Indicators */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center space-x-4 z-10">
        {slides.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 transition-all duration-300 ${idx === current ? 'w-16 bg-white' : 'w-8 bg-white/40 hover:bg-white/60'}`}
          />
        ))}
      </div>
    </section>
  );
};

// --- Pages ---

const Home: React.FC = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="relative h-screen w-full overflow-hidden bg-stone-900">
        <div className="absolute inset-0 bg-stone-900">
           <img 
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2200&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60 scale-105 animate-[zoomIn_20s_infinite_alternate]"
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6 md:px-12 lg:px-24">
          <h2 className="text-base md:text-lg uppercase tracking-[0.3em] mb-6 animate-fade-in opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>The Winter 2025 Collection</h2>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-medium mb-10 animate-slide-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            Walk on Air
          </h1>
          <Link to="/shop" className="group relative px-10 py-4 border border-white text-white hover:bg-white hover:text-stone-900 transition-all duration-500 uppercase tracking-widest text-base animate-fade-in opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            Discover
          </Link>
        </div>
      </section>

      {/* Press Strip */}
      <section className="py-12 md:py-16 border-b border-stone-100 bg-white overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block container mx-auto px-6 md:px-12 lg:px-24 overflow-hidden">
           <div className="flex flex-wrap justify-between items-center">
              <span className="font-serif text-3xl md:text-4xl text-stone-300 transition-all duration-500 hover:text-[#CC0000] hover:scale-110 cursor-default inline-block">VOGUE</span>
              <span className="font-serif text-3xl md:text-4xl text-stone-300 transition-all duration-500 hover:text-[#FF3300] hover:scale-110 cursor-default inline-block">GQ</span>
              <span className="font-serif text-3xl md:text-4xl text-stone-300 transition-all duration-500 hover:text-[#002855] hover:scale-110 cursor-default inline-block">Harper's BAZAAR</span>
              <span className="font-serif text-3xl md:text-4xl text-stone-300 transition-all duration-500 hover:text-[#E52B50] hover:scale-110 cursor-default inline-block">ELLE</span>
              <span className="font-serif text-3xl md:text-4xl text-stone-300 transition-all duration-500 hover:text-[#DAA520] hover:scale-110 cursor-default inline-block">Esquire</span>
           </div>
        </div>

        {/* Mobile View - Marquee Carousel */}
        <div className="md:hidden flex relative w-full overflow-hidden">
             <div className="flex animate-marquee whitespace-nowrap">
                 {/* Set 1 */}
                 <div className="flex items-center gap-12 px-6">
                    <span className="font-serif text-3xl text-stone-300">VOGUE</span>
                    <span className="font-serif text-3xl text-stone-300">GQ</span>
                    <span className="font-serif text-3xl text-stone-300">Harper's BAZAAR</span>
                    <span className="font-serif text-3xl text-stone-300">ELLE</span>
                    <span className="font-serif text-3xl text-stone-300">Esquire</span>
                 </div>
                 {/* Set 2 (Duplicate for loop) */}
                 <div className="flex items-center gap-12 px-6">
                    <span className="font-serif text-3xl text-stone-300">VOGUE</span>
                    <span className="font-serif text-3xl text-stone-300">GQ</span>
                    <span className="font-serif text-3xl text-stone-300">Harper's BAZAAR</span>
                    <span className="font-serif text-3xl text-stone-300">ELLE</span>
                    <span className="font-serif text-3xl text-stone-300">Esquire</span>
                 </div>
                 {/* Set 3 (Duplicate for safety on wider mobile screens) */}
                 <div className="flex items-center gap-12 px-6">
                    <span className="font-serif text-3xl text-stone-300">VOGUE</span>
                    <span className="font-serif text-3xl text-stone-300">GQ</span>
                    <span className="font-serif text-3xl text-stone-300">Harper's BAZAAR</span>
                    <span className="font-serif text-3xl text-stone-300">ELLE</span>
                    <span className="font-serif text-3xl text-stone-300">Esquire</span>
                 </div>
             </div>
        </div>
      </section>

      {/* Brand Statement */}
      <section className="py-24 bg-white text-center border-b border-stone-100">
        <div className="container mx-auto px-6 max-w-4xl">
            <span className="text-gold-400 text-3xl mb-6 block">❦</span>
            <p className="text-lg md:text-2xl text-stone-800 leading-loose font-serif italic">
            "AETERNA is more than a shoe. It is a philosophy. Designed in Milan, handcrafted in Florence, representing the pinnacle of Italian shoemaking."
            </p>
            {/* Signature mock */}
            <div className="mt-8 font-serif text-4xl text-stone-400 font-bold opacity-60 rotate-[-5deg]">Alessandro Rossi</div>
        </div>
      </section>

      {/* The Icons */}
      <section className="py-24 bg-stone-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
            <div className="flex justify-between items-end mb-12">
                <div>
                     <span className="text-gold-400 uppercase tracking-widest text-sm font-bold mb-2 block">Selection</span>
                     <h2 className="text-4xl font-serif">The Icons</h2>
                </div>
                <Link to="/shop" className="text-sm uppercase tracking-widest border-b border-stone-900 pb-1 hover:text-gold-500 hover:border-gold-500 transition-colors">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {MOCK_PRODUCTS.filter(p => p.isBestSeller).slice(0, 3).map(product => (
                     <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
                ))}
            </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <Link to="/shop?category=Women" className="group relative h-[700px] overflow-hidden cursor-pointer bg-stone-100">
              <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2000&auto=format&fit=crop" alt="Women" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-16 left-16 text-white">
                <h3 className="text-5xl font-serif mb-4">Women</h3>
                <span className="text-sm uppercase tracking-widest border-b border-transparent group-hover:border-white transition-all pb-2">Shop Collection</span>
              </div>
            </Link>
            <Link to="/shop?category=Men" className="group relative h-[700px] overflow-hidden cursor-pointer bg-stone-100">
              <img src="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=2000&auto=format&fit=crop" alt="Men" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-16 left-16 text-white">
                <h3 className="text-5xl font-serif mb-4">Men</h3>
                <span className="text-sm uppercase tracking-widest border-b border-transparent group-hover:border-white transition-all pb-2">Shop Collection</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Atelier Teaser */}
      <section className="relative h-[80vh] flex items-center bg-stone-900 overflow-hidden group">
        <div className="absolute inset-0">
             <img src="https://images.unsplash.com/photo-1621335829175-95f437384d7c?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover opacity-50 transition-transform duration-[20s] group-hover:scale-110" alt="Cobbler" />
        </div>
        <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10 text-white">
            <span className="text-gold-400 uppercase tracking-widest text-sm font-bold mb-6 block animate-fade-in">The Atelier</span>
            <h2 className="text-5xl md:text-7xl font-serif mb-8 max-w-2xl leading-tight">Where Time Stands Still</h2>
            <p className="text-xl text-stone-200 mb-10 max-w-xl leading-relaxed font-light">
                In our Florentine workshop, 40 master artisans dedicate their lives to the pursuit of perfection.
                Each pair takes 8 weeks to complete, passing through 120 distinct phases.
            </p>
            <Link to="/about" className="inline-block bg-white text-stone-900 px-10 py-4 uppercase tracking-widest text-sm font-bold hover:bg-gold-400 hover:text-white transition-colors duration-300">
                Discover The Process
            </Link>
        </div>
      </section>

      

      {/* Value Proposition */}
      <section className="py-24 bg-stone-50 border-t border-stone-200">
         <div className="container mx-auto px-6 md:px-12 lg:px-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
               <div className="flex flex-col items-center group">
                  <div className="w-20 h-20 rounded-full bg-stone-200 flex items-center justify-center mb-8 text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-colors duration-500">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="font-serif text-2xl mb-4">Master Craftsmanship</h3>
                  <p className="text-stone-500 text-lg leading-relaxed max-w-sm">Every pair is hand-finished by artisans in Tuscany, ensuring no two pairs are exactly alike.</p>
               </div>
               <div className="flex flex-col items-center group">
                  <div className="w-20 h-20 rounded-full bg-stone-200 flex items-center justify-center mb-8 text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-colors duration-500">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="font-serif text-2xl mb-4">Lifetime Warranty</h3>
                  <p className="text-stone-500 text-lg leading-relaxed max-w-sm">We stand by our quality. Complimentary repairs and conditioning for the life of your shoes.</p>
               </div>
               <div className="flex flex-col items-center group">
                  <div className="w-20 h-20 rounded-full bg-stone-200 flex items-center justify-center mb-8 text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-colors duration-500">
                    <Truck size={32} />
                  </div>
                  <h3 className="font-serif text-2xl mb-4">Global Priority Shipping</h3>
                  <p className="text-stone-500 text-lg leading-relaxed max-w-sm">Complimentary express shipping on all orders over $1000. Arrives in 2-3 business days.</p>
               </div>
            </div>
         </div>
      </section>

      {/* The Lookbook */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-16">
            <span className="text-gold-400 uppercase tracking-widest text-sm font-bold mb-4 block">Editorial</span>
            <h2 className="text-5xl font-serif text-stone-900">The Lookbook</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 h-[700px]">
            <div className="col-span-2 row-span-2 relative group overflow-hidden cursor-pointer bg-stone-100">
              <img src="https://images.unsplash.com/photo-1513094735237-8f2714d57c13?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2hvcHBpbmd8ZW58MHwxfDB8fHww" alt="Lookbook 1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="col-span-1 row-span-2 relative group overflow-hidden cursor-pointer bg-stone-100 hidden md:block">
               <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" alt="Lookbook 2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
             <div className="col-span-1 row-span-2 relative group overflow-hidden cursor-pointer bg-stone-100 hidden md:block">
               <img src="https://plus.unsplash.com/premium_photo-1664874602822-91dd10ae6a31?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDl8fHNob2VzfGVufDB8MXwwfHx8MA%3D%3D" alt="Lookbook 3" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>
        </div>
      </section>

      {/* The Journal */}
      <section className="py-32 bg-stone-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
            <div className="text-center mb-16">
                 <h2 className="text-4xl font-serif mb-4">The Journal</h2>
                 <p className="text-stone-500">Stories from the world of AETERNA</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <article className="group cursor-pointer">
                    <div className="overflow-hidden mb-6 aspect-[3/2]">
                        <img src="https://images.unsplash.com/photo-1470162656305-6f429ba817bf?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Tuscany" />
                    </div>
                    <span className="text-xs uppercase tracking-widest text-stone-500 mb-2 block">Travel • Oct 12</span>
                    <h3 className="text-2xl font-serif mb-3 group-hover:text-gold-500 transition-colors">A Weekend in Siena</h3>
                    <p className="text-stone-600 leading-relaxed text-sm">Discovering the hidden gems of Tuscany's most medieval city, where we source our inspiration for the Autumn collection.</p>
                </article>
                 <article className="group cursor-pointer">
                    <div className="overflow-hidden mb-6 aspect-[3/2]">
                        <img src="https://plus.unsplash.com/premium_photo-1723662148369-3dd7abaf0566?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cG9saXNoaW5nJTIwc2hvZXN8ZW58MHwwfDB8fHww" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Care" />
                    </div>
                    <span className="text-xs uppercase tracking-widest text-stone-500 mb-2 block">Care • Sep 28</span>
                    <h3 className="text-2xl font-serif mb-3 group-hover:text-gold-500 transition-colors">The Art of Polishing</h3>
                    <p className="text-stone-600 leading-relaxed text-sm">A masterclass in maintaining the mirror-shine of your AETERNA oxfords, featuring our head cordwainer, Marco.</p>
                </article>
                <article className="group cursor-pointer">
                    <div className="overflow-hidden mb-6 aspect-[3/2]">
                        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Style" />
                    </div>
                    <span className="text-xs uppercase tracking-widest text-stone-500 mb-2 block">Style • Aug 15</span>
                    <h3 className="text-2xl font-serif mb-3 group-hover:text-gold-500 transition-colors">Styling the Loafer</h3>
                    <p className="text-stone-600 leading-relaxed text-sm">From the boardroom to the riviera, explore the versatility of the Sovereign Loafer in our latest editorial.</p>
                </article>
            </div>
        </div>
      </section>

      {/* Luxury Detail Carousel */}
      <LuxuryDetailCarousel />

      {/* Quick View Modal integration */}
      {quickViewProduct && (
          <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </>
  );
};

const Shop: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category');
  const filteredProducts = category ? MOCK_PRODUCTS.filter(p => p.category === category) : MOCK_PRODUCTS;
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
      <div className="pt-32 pb-20 container mx-auto px-6 md:px-12 lg:px-24">
           <div className="flex justify-between items-end mb-12">
               <h1 className="text-4xl font-serif">{category || 'All Products'}</h1>
               <span className="text-stone-500">{filteredProducts.length} items</span>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
              ))}
           </div>

           {quickViewProduct && (
               <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
           )}
      </div>
  );
};

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const product = MOCK_PRODUCTS.find(p => p.id === id);
  const { addToCart } = useContext(ShopContext);
  const [size, setSize] = useState<number | null>(null);
  const [color, setColor] = useState<string | null>(null);

  if (!product) return <div className="pt-40 text-center">Product not found</div>;

  return (
    <div className="pt-32 pb-20 container mx-auto px-6 md:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-2 gap-16">
       <div><img src={product.images[0]} alt={product.name} className="w-full aspect-[3/4] object-cover bg-stone-100" /></div>
       <div>
         <h1 className="text-4xl font-serif mb-4">{product.name}</h1>
         <p className="text-xl text-stone-500 mb-8">${product.price}</p>
         <p className="mb-8 text-lg leading-relaxed text-stone-600">{product.description}</p>
         
         <div className="mb-6">
             <span className="block text-sm font-bold uppercase tracking-widest text-stone-400 mb-3">Color</span>
             <div className="flex gap-4">
                 {product.colors.map(c => (
                     <button key={c} onClick={() => setColor(c)} className={`px-6 py-3 border text-sm uppercase tracking-widest transition-all ${color === c ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 hover:border-stone-900'}`}>{c}</button>
                 ))}
             </div>
         </div>
         
         <div className="mb-10">
             <span className="block text-sm font-bold uppercase tracking-widest text-stone-400 mb-3">Size</span>
             <div className="flex flex-wrap gap-3">
                 {product.sizes.map(s => (
                     <button key={s} onClick={() => setSize(s)} className={`w-12 h-12 flex items-center justify-center border text-sm transition-all ${size === s ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 hover:border-stone-900'}`}>{s}</button>
                 ))}
             </div>
         </div>

         <button onClick={() => size && color && addToCart(product, size, color)} disabled={!size || !color} className="w-full bg-stone-900 text-white py-5 uppercase tracking-widest text-sm font-bold hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Add to Bag</button>
       </div>
    </div>
  );
};

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useContext(ShopContext);
  return (
    <div className="pt-32 pb-20 container mx-auto px-6 md:px-12 lg:px-24">
      <h1 className="text-4xl font-serif mb-10">Shopping Bag</h1>
      {cart.length === 0 ? <div className="text-center py-20"><p className="text-xl mb-6">Your bag is empty.</p><Link to="/shop" className="inline-block border-b border-stone-900 pb-1 uppercase tracking-widest text-sm font-bold hover:text-gold-500 hover:border-gold-500 transition-colors">Continue Shopping</Link></div> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="md:col-span-2 space-y-8">
             {cart.map(item => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-6 border-b border-stone-200 pb-8">
                   <img src={item.images[0]} className="w-32 h-40 object-cover bg-stone-100" alt={item.name} />
                   <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-serif text-xl">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)} className="text-stone-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </div>
                      <p className="text-stone-500 mb-2">${item.price}</p>
                      <p className="text-sm text-stone-500 mb-6">Size: {item.selectedSize} | Color: {item.selectedColor}</p>
                      <div className="flex items-center gap-4">
                        <button onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, -1)} className="p-1 hover:bg-stone-100 rounded"><Minus size={16}/></button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, 1)} className="p-1 hover:bg-stone-100 rounded"><Plus size={16}/></button>
                      </div>
                   </div>
                </div>
             ))}
           </div>
           <div className="bg-stone-50 p-8 h-fit">
              <h3 className="font-serif text-xl mb-6">Summary</h3>
              <div className="flex justify-between mb-4 text-stone-600"><span>Subtotal</span><span>${cartTotal}</span></div>
              <div className="flex justify-between mb-4 text-stone-600"><span>Shipping</span><span>{cartTotal > FREE_SHIPPING_THRESHOLD ? 'Free' : `$${SHIPPING_COST}`}</span></div>
              <div className="flex justify-between font-bold text-lg mt-6 pt-6 border-t border-stone-200"><span>Total</span><span>${cartTotal + (cartTotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST)}</span></div>
              <button className="w-full bg-stone-900 text-white py-4 mt-8 uppercase tracking-widest text-sm font-bold hover:bg-stone-800 transition-colors">Checkout</button>
           </div>
        </div>
      )}
    </div>
  );
};

const Login: React.FC = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    return (
        <div className="pt-40 pb-20 container mx-auto px-6 max-w-md">
            <h1 className="text-4xl font-serif mb-10 text-center">Login</h1>
            <div className="bg-stone-50 p-8">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="w-full p-4 border border-stone-200 mb-4 bg-white outline-none focus:border-stone-900" />
                <button onClick={() => { if(email) { login(email); navigate('/'); } }} className="w-full bg-stone-900 text-white py-4 uppercase tracking-widest text-sm font-bold hover:bg-stone-800 transition-colors">Sign In</button>
                <p className="text-center mt-6 text-stone-500 text-sm">Try 'admin@aeterna.com' for admin access.</p>
            </div>
        </div>
    );
};

const About: React.FC = () => {
  return (
    <>
      {/* Hero Section - Existing */}
      <section className="relative h-[80vh] w-full overflow-hidden bg-stone-900">
        <img 
          src="https://images.unsplash.com/photo-1551446339-1e5c6f164ec2?q=80&w=2000&auto=format&fit=crop" 
          alt="Atelier" 
          className="w-full h-full object-cover opacity-60 animate-[zoomIn_25s_infinite_alternate]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
          <span className="text-sm uppercase tracking-[0.3em] mb-6 animate-fade-in block text-gold-400">Est. 1982</span>
          <h1 className="text-6xl md:text-8xl font-serif mb-8 animate-slide-up">The Legacy</h1>
          <p className="max-w-xl text-lg md:text-xl text-stone-200 font-light leading-relaxed animate-fade-in">
            Defining the intersection of heritage and modernity.
          </p>
        </div>
      </section>

      {/* The Philosophy - Existing */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div>
               <h2 className="text-4xl md:text-5xl font-serif mb-8 text-stone-900">Silence is the <br/>ultimate luxury.</h2>
               <div className="w-20 h-0.5 bg-stone-900 mb-8"></div>
               <p className="text-lg text-stone-600 leading-loose mb-6">
                 AETERNA was founded on a singular premise: that true luxury does not need to shout. It is felt in the weight of the leather, seen in the precision of the stitch, and experienced in the silence of a perfect fit.
               </p>
               <p className="text-lg text-stone-600 leading-loose">
                 We reject the ephemeral nature of fashion trends. Instead, we study the archives of classic footwear, deconstructing them to their essence, and rebuilding them for the modern world.
               </p>
            </div>
            <div className="relative h-[600px] bg-stone-100 overflow-hidden">
               <img src="https://plus.unsplash.com/premium_photo-1664790560167-5160505f1596?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bHV4dXJ5JTIwc2hvZXN8ZW58MHwxfDB8fHww" alt="Philosophy" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* The Process (Parallax-like strip) - Existing */}
      <section className="relative py-40 bg-stone-900 text-white overflow-hidden">
         <div className="absolute inset-0 opacity-20">
            <img src="https://plus.unsplash.com/premium_photo-1744492017127-76bc36d7588f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2hvZXMlMjBtYWtpbmd8ZW58MHwwfDB8fHww" className="w-full h-full object-cover" alt="Process Background" />
         </div>
         <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10 text-center">
            <span className="text-gold-400 uppercase tracking-widest text-sm font-bold mb-6 block">The Atelier</span>
            <h2 className="text-5xl md:text-7xl font-serif mb-12">Artistry in Motion</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
               <div className="bg-white/5 backdrop-blur-sm p-8 border border-white/10 hover:border-white/30 transition-colors">
                  <span className="text-4xl font-serif text-gold-400 mb-4 block">01.</span>
                  <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Selection</h3>
                  <p className="text-stone-400 leading-relaxed">Our leather is sourced from a single family-owned tannery in Tuscany, selected for its flawless grain and ability to develop a unique patina.</p>
               </div>
               <div className="bg-white/5 backdrop-blur-sm p-8 border border-white/10 hover:border-white/30 transition-colors">
                  <span className="text-4xl font-serif text-gold-400 mb-4 block">02.</span>
                  <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Construction</h3>
                  <p className="text-stone-400 leading-relaxed">Utilizing the Goodyear welt technique, every pair undergoes over 200 distinct operations, ensuring water resistance and longevity.</p>
               </div>
               <div className="bg-white/5 backdrop-blur-sm p-8 border border-white/10 hover:border-white/30 transition-colors">
                  <span className="text-4xl font-serif text-gold-400 mb-4 block">03.</span>
                  <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Finishing</h3>
                  <p className="text-stone-400 leading-relaxed">Each shoe is hand-painted and polished for hours to achieve depth and character that machines simply cannot replicate.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Founder / Team - Existing */}
      <section className="py-32 bg-stone-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
           <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="w-full md:w-1/3 aspect-[3/4] bg-stone-200 overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop" alt="Founder" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="w-full md:w-2/3">
                 <h3 className="text-3xl font-serif mb-6">"We do not build for the season. We build for a lifetime."</h3>
                 <p className="text-lg text-stone-600 leading-relaxed mb-8">
                    In an age of acceleration, AETERNA stands as a bastion of slowness. We believe that time is the most essential ingredient in luxury. Time to source, time to craft, and time to enjoy.
                 </p>
                 <div>
                    <span className="font-bold uppercase tracking-widest text-sm block text-stone-900">Alessandro Rossi</span>
                    <span className="text-stone-500 text-sm">Founder & Creative Director</span>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* NEW: Sustainability Section */}
      <section className="py-32 bg-white">
         <div className="container mx-auto px-6 md:px-12 lg:px-24">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="order-2 lg:order-1 relative h-[700px] overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1759793499903-bfdba8350627?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGx1eHVyeSUyMHNob2VzfGVufDB8MXwwfHx8MA%3D%3D" alt="Sustainability" className="w-full h-full object-cover  transition-all duration-700" />
                    <div className="absolute inset-0 bg-stone-900/10"></div>
                </div>
                <div className="order-1 lg:order-2">
                    <span className="text-gold-400 uppercase tracking-widest text-sm font-bold mb-6 block">Our Commitment</span>
                    <h2 className="text-4xl md:text-5xl font-serif mb-8 text-stone-900">Conscious Luxury</h2>
                    <p className="text-lg text-stone-600 leading-loose mb-6">
                        We believe that true luxury must be sustainable. Our leather is a byproduct of the food industry, and we strictly utilize vegetable tanning processes that are free from harmful chromium.
                    </p>
                    <p className="text-lg text-stone-600 leading-loose mb-10">
                        Our packaging is crafted from 100% recycled post-consumer waste, and our workshops are powered by renewable solar energy.
                    </p>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <span className="text-3xl font-serif block mb-2">100%</span>
                            <span className="text-xs uppercase tracking-widest text-stone-500">Vegetable Tanned</span>
                        </div>
                        <div>
                            <span className="text-3xl font-serif block mb-2">0%</span>
                            <span className="text-xs uppercase tracking-widest text-stone-500">Plastic Packaging</span>
                        </div>
                    </div>
                </div>
             </div>
         </div>
      </section>

      {/* NEW: Timeline / Heritage */}
      <section className="py-32 bg-stone-900 text-white">
          <div className="container mx-auto px-6 md:px-12 lg:px-24">
             <div className="text-center mb-20">
                 <h2 className="text-4xl md:text-5xl font-serif mb-6">A Timeline of Excellence</h2>
                 <p className="text-stone-400 max-w-2xl mx-auto">From a small workshop in Florence to a global symbol of refinement.</p>
             </div>
             <div className="relative border-t border-stone-700 pt-16">
                 {/* Decorative line vertical maybe? No, let's do a horizontal grid */}
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                     <div className="relative">
                         <span className="text-6xl font-serif text-stone-800 absolute -top-10 left-0 -z-10">1982</span>
                         <h3 className="text-xl font-bold mb-4 text-gold-400">The Beginning</h3>
                         <p className="text-stone-400 text-sm leading-relaxed">Alessandro Rossi opens his first atelier in Florence, focusing on bespoke commissions for local nobility.</p>
                     </div>
                     <div className="relative">
                         <span className="text-6xl font-serif text-stone-800 absolute -top-10 left-0 -z-10">1995</span>
                         <h3 className="text-xl font-bold mb-4 text-gold-400">The Icon</h3>
                         <p className="text-stone-400 text-sm leading-relaxed">Launch of the 'Sovereign Loafer', which becomes an instant classic and defines the brand's aesthetic.</p>
                     </div>
                     <div className="relative">
                         <span className="text-6xl font-serif text-stone-800 absolute -top-10 left-0 -z-10">2010</span>
                         <h3 className="text-xl font-bold mb-4 text-gold-400">Global Reach</h3>
                         <p className="text-stone-400 text-sm leading-relaxed">Flagship boutiques open in New York and Tokyo, bringing Italian craftsmanship to the world stage.</p>
                     </div>
                     <div className="relative">
                         <span className="text-6xl font-serif text-stone-800 absolute -top-10 left-0 -z-10">2024</span>
                         <h3 className="text-xl font-bold mb-4 text-gold-400">Sustainable Future</h3>
                         <p className="text-stone-400 text-sm leading-relaxed">AETERNA commits to becoming carbon neutral, redefining what it means to be a modern luxury house.</p>
                     </div>
                 </div>
             </div>
          </div>
      </section>

      {/* NEW: Global Boutiques / Visit Us */}
       <section className="py-32 bg-white border-t border-stone-100">
          <div className="container mx-auto px-6 md:px-12 lg:px-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                  <div>
                      <span className="text-gold-400 uppercase tracking-widest text-sm font-bold mb-6 block">Visit Us</span>
                      <h2 className="text-4xl md:text-5xl font-serif mb-10">Global Sanctuaries</h2>
                      <p className="text-lg text-stone-600 leading-relaxed mb-10">
                          Experience the brand in person at one of our flagship boutiques. Each location is designed as a sanctuary of calm, offering private fittings and bespoke consultations.
                      </p>
                      <button className="bg-stone-900 text-white px-8 py-4 uppercase tracking-widest text-sm font-bold hover:bg-stone-800 transition-colors">Find a Boutique</button>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-6">
                           <div className="aspect-[4/5] bg-stone-100 relative group overflow-hidden">
                               <img src="https://images.unsplash.com/photo-1568252542512-988cd95a91cf?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Milan" />
                               <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                   <span className="text-white font-serif text-2xl">Milan</span>
                               </div>
                           </div>
                            <div className="aspect-[4/5] bg-stone-100 relative group overflow-hidden">
                               <img src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="New York" />
                               <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                   <span className="text-white font-serif text-2xl">New York</span>
                               </div>
                           </div>
                      </div>
                      <div className="space-y-6 mt-12">
                            <div className="aspect-[4/5] bg-stone-100 relative group overflow-hidden">
                               <img src="https://images.unsplash.com/photo-1524312895697-725d2e054f3b?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Paris" />
                               <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                   <span className="text-white font-serif text-2xl">Paris</span>
                               </div>
                           </div>
                            <div className="aspect-[4/5] bg-stone-100 relative group overflow-hidden">
                               <img src="https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Tokyo" />
                               <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                   <span className="text-white font-serif text-2xl">Tokyo</span>
                               </div>
                           </div>
                      </div>
                  </div>
              </div>
          </div>
       </section>
    </>
  )
};

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', subject: 'Order Inquiry', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to handle submit (e.g., alert for now)
    alert("Thank you for contacting AETERNA. Our concierge will respond shortly.");
  };

  return (
    <div className="pt-32 pb-20">
      {/* Header */}
      <div className="container mx-auto px-6 md:px-12 lg:px-24 mb-20 text-center">
         <span className="text-gold-400 uppercase tracking-widest text-sm font-bold mb-4 block">Concierge</span>
         <h1 className="text-5xl md:text-6xl font-serif text-stone-900">Get in Touch</h1>
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <div>
            <div className="mb-12">
              <h3 className="font-serif text-2xl mb-6">Client Services</h3>
              <p className="text-stone-600 mb-2">For assistance with orders, sizing, or styling advice.</p>
              <p className="text-stone-900 font-medium mb-1">+39 055 123 4567</p>
              <p className="text-stone-900 font-medium mb-4">concierge@aeterna.com</p>
              <p className="text-stone-500 text-sm">Monday — Friday: 9am — 6pm CET</p>
            </div>

            <div className="mb-12">
               <h3 className="font-serif text-2xl mb-6">Press & Wholesale</h3>
               <p className="text-stone-900 font-medium mb-1">press@aeterna.com</p>
               <p className="text-stone-900 font-medium">wholesale@aeterna.com</p>
            </div>

            <div className="mb-12">
               <h3 className="font-serif text-2xl mb-6">Atelier & Headquarters</h3>
               <p className="text-stone-600 leading-relaxed">
                 Via Santo Spirito, 14<br/>
                 50125 Firenze FI<br/>
                 Italy
               </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-stone-50 p-10 md:p-14">
             <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-transparent border-b border-stone-300 py-3 focus:border-stone-900 outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full bg-transparent border-b border-stone-300 py-3 focus:border-stone-900 outline-none transition-colors"
                    required
                  />
                </div>
                 <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Subject</label>
                  <select className="w-full bg-transparent border-b border-stone-300 py-3 focus:border-stone-900 outline-none transition-colors">
                     <option>Order Inquiry</option>
                     <option>Product Information</option>
                     <option>Appointments</option>
                     <option>Press & Media</option>
                     <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Message</label>
                  <textarea 
                    rows={5}
                    className="w-full bg-transparent border-b border-stone-300 py-3 focus:border-stone-900 outline-none transition-colors resize-none"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-stone-900 text-white py-4 uppercase tracking-widest text-sm font-bold hover:bg-stone-800 transition-colors mt-4">
                  Send Message
                </button>
             </form>
          </div>
        </div>
      </div>
      
      {/* Map or Image Strip */}
       <div className="w-full h-[400px] mt-20 overflow-hidden">
  <img
    src="https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=2000&auto=format&fit=crop"
    alt="Florence"
    className="
      w-full h-full object-cover
      grayscale opacity-80
      transition-all duration-700 ease-out
      hover:grayscale-0 hover:opacity-100 hover:scale-105
    "
  />
</div>

    </div>
  );
};

const ShippingReturns: React.FC = () => {
  return (
    <div className="pt-32 pb-20 container mx-auto px-6 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif mb-12 text-center">Shipping & Returns</h1>
        
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-6">Shipping Policy</h2>
          <p className="text-stone-600 mb-4 leading-relaxed">
            AETERNA is pleased to offer complimentary express shipping on all orders over ${FREE_SHIPPING_THRESHOLD}. For orders under this amount, a flat rate of ${SHIPPING_COST} applies.
          </p>
          <div className="space-y-4 mt-8">
             <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="font-bold uppercase text-xs tracking-widest">Domestic (US)</span>
                <span className="text-stone-600">2-3 Business Days</span>
             </div>
             <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="font-bold uppercase text-xs tracking-widest">Europe</span>
                <span className="text-stone-600">3-5 Business Days</span>
             </div>
             <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="font-bold uppercase text-xs tracking-widest">Rest of World</span>
                <span className="text-stone-600">5-7 Business Days</span>
             </div>
          </div>
          <p className="text-stone-500 text-sm mt-6">
            Please note that delivery times are estimates and may vary depending on customs processing for international orders. All duties and taxes are included in the final price at checkout for most major regions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif mb-6">Returns & Exchanges</h2>
          <p className="text-stone-600 mb-4 leading-relaxed">
            We accept returns of unworn, unwashed, and undamaged items within 30 days of delivery. The soles of footwear must be in perfect condition; we recommend trying them on a carpeted surface.
          </p>
          <ol className="list-decimal list-inside space-y-3 text-stone-600 mt-6 ml-4">
             <li>Visit our Returns Portal to initiate your return.</li>
             <li>Repackage the item in its original box and dust bag.</li>
             <li>Attach the prepaid shipping label provided via email.</li>
             <li>Drop off at your nearest courier location.</li>
          </ol>
          <p className="text-stone-600 mt-6 leading-relaxed">
            Refunds are processed within 5-7 business days of receipt at our atelier.
          </p>
        </section>
      </div>
    </div>
  );
};

const SizeGuide: React.FC = () => {
    // Simple mock table data
    const sizes = [
        { eu: 39, us: 6, uk: 5, cm: 24.5 },
        { eu: 40, us: 7, uk: 6, cm: 25.1 },
        { eu: 41, us: 8, uk: 7, cm: 25.4 },
        { eu: 42, us: 9, uk: 8, cm: 26 },
        { eu: 43, us: 10, uk: 9, cm: 27 },
        { eu: 44, us: 11, uk: 10, cm: 27.9 },
        { eu: 45, us: 12, uk: 11, cm: 28.6 },
    ];

  return (
    <div className="pt-32 pb-20 container mx-auto px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif mb-12 text-center">Size Guide</h1>
            <p className="text-center text-stone-600 mb-16 max-w-2xl mx-auto">
                AETERNA footwear fits true to size. If you are between sizes, we recommend taking the next size up. Our lasts are designed for a standard D width.
            </p>

            <div className="mb-20">
                <h3 className="text-xl font-serif mb-6 text-center">Men's Sizing</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-center border-collapse">
                        <thead>
                            <tr className="border-b border-stone-900">
                                <th className="py-4 uppercase text-xs tracking-widest font-bold">EU</th>
                                <th className="py-4 uppercase text-xs tracking-widest font-bold">US</th>
                                <th className="py-4 uppercase text-xs tracking-widest font-bold">UK</th>
                                <th className="py-4 uppercase text-xs tracking-widest font-bold">CM</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sizes.map((s) => (
                                <tr key={s.eu} className="border-b border-stone-200 hover:bg-stone-50 transition-colors">
                                    <td className="py-4 text-stone-600">{s.eu}</td>
                                    <td className="py-4 text-stone-600">{s.us}</td>
                                    <td className="py-4 text-stone-600">{s.uk}</td>
                                    <td className="py-4 text-stone-600">{s.cm}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-stone-50 p-10">
                <h3 className="text-xl font-serif mb-4">How to Measure</h3>
                <p className="text-stone-600 leading-relaxed mb-4">
                    Place your foot on a piece of paper and trace the outline. Measure the distance between the heel and the longest toe. Compare this measurement (in cm) with the chart above.
                </p>
                <p className="text-stone-500 text-sm">
                    Note: Measure your feet in the afternoon as they may swell slightly during the day.
                </p>
            </div>
        </div>
    </div>
  );
};

const FAQ: React.FC = () => {
    const faqs = [
        { q: "Where are AETERNA shoes made?", a: "All AETERNA footwear is handcrafted in our family-owned atelier in Tuscany, Italy." },
        { q: "Do you offer international shipping?", a: "Yes, we ship globally via DHL Express. Shipping is complimentary for orders over $1,000." },
        { q: "How should I care for my leather shoes?", a: "We recommend using a high-quality leather conditioner once a month and keeping them in the provided dust bags when not in use. Use shoe trees to maintain shape." },
        { q: "Can I change or cancel my order?", a: "Orders can be modified within 1 hour of placement. Please contact our Concierge immediately for assistance." },
        { q: "Do you offer repairs?", a: "Yes, we offer a lifetime repair service for soles and heels. Please contact Client Services to arrange a repair." },
    ];

  return (
    <div className="pt-32 pb-20 container mx-auto px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
             <h1 className="text-4xl md:text-5xl font-serif mb-16 text-center">Frequently Asked Questions</h1>
             <div className="space-y-8">
                 {faqs.map((item, index) => (
                     <div key={index} className="border-b border-stone-200 pb-8">
                         <h3 className="text-lg font-serif mb-3 text-stone-900">{item.q}</h3>
                         <p className="text-stone-600 leading-relaxed">{item.a}</p>
                     </div>
                 ))}
             </div>
             <div className="mt-16 text-center">
                 <p className="text-stone-600 mb-4">Still have questions?</p>
                 <Link to="/contact" className="inline-block border-b border-stone-900 pb-1 uppercase tracking-widest text-sm font-bold hover:text-gold-500 hover:border-gold-500 transition-colors">Contact Concierge</Link>
             </div>
        </div>
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <AuthProvider>
        <ShopProvider>
          <div className="min-h-screen flex flex-col font-sans text-stone-900 selection:bg-gold-200">
             <Navbar />
             <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/shipping-returns" element={<ShippingReturns />} />
                <Route path="/size-guide" element={<SizeGuide />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/admin" element={<div className="pt-40 text-center h-screen"><h1 className="text-4xl font-serif">Admin Dashboard</h1><p className="mt-4 text-stone-500">Restricted Access.</p></div>} />
             </Routes>
             <Footer />
          </div>
        </ShopProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;