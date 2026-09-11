import React, { useState, useMemo } from 'react';
import { Product, CartItem } from './types';
import { PRODUCTS } from './data/products';
import { CanvasBackground3D } from './components/3d/CanvasBackground3D';
import { SpatialCardViewer3D } from './components/3d/SpatialCardViewer3D';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryFilter, CategoryKey } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { AccountModal } from './components/AccountModal';
import { FittingRoomModal } from './components/FittingRoomModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { HeyBroIntro } from './components/HeyBroIntro';
import { Sparkles, Rotate3d, Layers, Flame, Crown } from 'lucide-react';
import { audioEngine } from './utils/audio';

export default function App() {
  const [showHeyBroIntro, setShowHeyBroIntro] = useState<boolean>(false);
  const [products] = useState<Product[]>(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([
    // Pre-populate with one item for instant rich exploration
    {
      ...PRODUCTS[0],
      selectedSize: 'L',
      selectedColor: PRODUCTS[0].colors[0],
      quantity: 1,
    },
  ]);
  const [wishlist, setWishlist] = useState<Product[]>([PRODUCTS[1]]);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);
  const [isFittingRoomOpen, setIsFittingRoomOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isSpatial3DActive, setIsSpatial3DActive] = useState<boolean>(false);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryKey, number> = {
      all: products.length,
      printed: 0,
      casual: 0,
      solid: 0,
      check: 0,
      tropical: 0,
      linen: 0,
      oversized: 0,
    };
    products.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });
    return counts;
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    let list = products;
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, selectedCategory, searchQuery]);

  // Best sellers
  const bestSellers = useMemo(() => {
    return products.filter((p) => p.badgeType === 'best-seller' || p.rating >= 4.8);
  }, [products]);

  // Cart operations
  const handleAddToCart = (
    product: Product,
    size: string,
    color?: { name: string; hex: string },
    quantity: number = 1
  ) => {
    const chosenColor = color || product.colors[0];
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor.name === chosenColor.name
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          ...product,
          selectedSize: size,
          selectedColor: chosenColor,
          quantity,
        },
      ];
    });
  };

  const handleUpdateQuantity = (
    id: number,
    size: string,
    colorName: string,
    delta: number
  ) => {
    audioEngine.playClick();
    setCart((prev) => {
      return prev
        .map((item) => {
          if (
            item.id === id &&
            item.selectedSize === size &&
            item.selectedColor.name === colorName
          ) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (id: number, size: string, colorName: string) => {
    audioEngine.playClick();
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === id &&
            item.selectedSize === size &&
            item.selectedColor.name === colorName
          )
      )
    );
  };

  const handleBuyNow = (
    product: Product,
    size: string,
    color?: { name: string; hex: string },
    quantity: number = 1
  ) => {
    handleAddToCart(product, size, color, quantity);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    audioEngine.playSuccess();
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    audioEngine.playClick();
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const wishlistIds = useMemo(() => wishlist.map((p) => p.id), [wishlist]);
  const totalCartCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  return (
    <div className="relative min-h-screen bg-[#080808] text-white selection:bg-white selection:text-black font-['Outfit',sans-serif]">
      {/* 0. Hey Bro Letter Cinematic Intro First Page */}
      {showHeyBroIntro && (
        <HeyBroIntro onComplete={() => setShowHeyBroIntro(false)} />
      )}

      {/* 1. 3D WebGL Background Scene */}
      <CanvasBackground3D />

      {/* 2. Top Navigation Bar */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onToggleSpatial3D={() => setIsSpatial3DActive(!isSpatial3DActive)}
        isSpatial3DActive={isSpatial3DActive}
        onOpenFittingRoom={() => setIsFittingRoomOpen(true)}
        onReplayIntro={() => setShowHeyBroIntro(true)}
      />

      {/* 3. Main Content Container */}
      <main className="relative z-10 pt-16 sm:pt-20">
        {/* Main 3D Spatial Carousel prominently positioned immediately below the header */}
        <section id="offers-carousel" className="relative w-full">
          <SpatialCardViewer3D
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={(p, size) => handleAddToCart(p, size)}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
          />
        </section>

        {/* 4. Category Filter Strip */}
        <CategoryFilter
          activeCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          counts={categoryCounts}
        />

        {/* 5. Main Product Grid Section */}
        <section id="products" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono uppercase tracking-[0.25em]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>2026 RUNWAY CATALOGUE</span>
              </div>
              <h2 className="font-['Bebas_Neue'] text-4xl sm:text-6xl text-white tracking-wider mt-1">
                {selectedCategory === 'all'
                  ? "MEN'S SIGNATURE SHIRTS"
                  : `${selectedCategory.toUpperCase()} COLLECTION`}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-400">
                Showing {filteredProducts.length} Exclusive Designs
              </span>
              <button
                onClick={() => {
                  setIsSpatial3DActive(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  audioEngine.playLetterReveal(1.2);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 text-xs font-bold font-mono uppercase transition-all cursor-pointer"
              >
                <Rotate3d className="w-3.5 h-3.5" /> View in 3D Runway
              </button>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => setSelectedProduct(p)}
                onAddToCart={(p, size) => handleAddToCart(p, size)}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={wishlistIds.includes(product.id)}
              />
            ))}
          </div>
        </section>

        {/* 6. Best Sellers Showcase */}
        <section id="best-sellers" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-zinc-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 fill-current" /> CLIENT FAVORITES
              </span>
              <h2 className="font-['Bebas_Neue'] text-4xl sm:text-5xl text-white tracking-wider mt-1">
                BEST SELLERS SECTION
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard
                key={`bestseller-${product.id}`}
                product={product}
                onSelect={(p) => setSelectedProduct(p)}
                onAddToCart={(p, size) => handleAddToCart(p, size)}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={wishlistIds.includes(product.id)}
              />
            ))}
          </div>
        </section>

        {/* 8. Customer Reviews */}
        <ReviewsSection />
      </main>

      {/* 9. Footer */}
      <Footer />

      {/* MODALS & DRAWERS */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={wishlistIds.includes(selectedProduct.id)}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onContinueShopping={() => setIsCartOpen(false)}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlist}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(p, size) => handleAddToCart(p, size)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />

      <FittingRoomModal
        isOpen={isFittingRoomOpen}
        onClose={() => setIsFittingRoomOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onOrderComplete={() => setCart([])}
      />
    </div>
  );
}
