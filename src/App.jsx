import React, { useMemo, useState, useEffect } from "react";
import { ShoppingCart, Heart, Shirt, Search, Menu, X, ChevronRight, Upload, CheckCircle2, Star, Phone, MessageCircle, ShieldCheck, Truck, Sparkles, SlidersHorizontal, Filter, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Fashion With Heart — Single-file React Prototype
// Palette
const COLORS = {
  primary: "#EF5371",
  secondary: "#934F93",
  accent: "#DCC2B4",
  bg: "#FAFAFA",
  dark: "#111827",
};

// Demo catalog (retail + customizable)
const CATALOG = [
  {
    id: "sr-1001",
    title: "Silk Saree – Rose Blush",
    price: 69,
    category: "Women",
    type: "Boutique",
    customizable: false,
    rating: 4.7,
    img: "https://images.unsplash.com/photo-1610030469983-98cbe2c5b735?q=80&w=1600&auto=format&fit=crop",
    tags: ["saree", "party-wear"],
  },
  {
    id: "ts-2001",
    title: "Custom Team Jersey – Cricket",
    price: 24,
    category: "Sports",
    type: "Custom",
    customizable: true,
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1600&auto=format&fit=crop",
    tags: ["cricket", "jersey", "custom"],
  },
  {
    id: "pn-3001",
    title: "Mens Panjabi – Classic White",
    price: 39,
    category: "Men",
    type: "Boutique",
    customizable: false,
    rating: 4.6,
    img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf9?q=80&w=1600&auto=format&fit=crop",
    tags: ["panjabi", "eid"],
  },
  {
    id: "ts-2002",
    title: "Custom Polo Shirt",
    price: 19,
    category: "Custom",
    type: "Custom",
    customizable: true,
    rating: 4.5,
    img: "https://images.unsplash.com/photo-1618354691227-25bc04584b2d?q=80&w=1600&auto=format&fit=crop",
    tags: ["polo", "logo"],
  },
  {
    id: "dr-4001",
    title: "Party Dress – Midnight Blue",
    price: 79,
    category: "Women",
    type: "Boutique",
    customizable: false,
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
    tags: ["dress", "party"],
  },
  {
    id: "sc-5001",
    title: "Custom Soccer Jersey",
    price: 24,
    category: "Sports",
    type: "Custom",
    customizable: true,
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1486286701208-1d58e9338013?q=80&w=1600&auto=format&fit=crop",
    tags: ["soccer", "jersey", "custom"],
  },
];

const BULK_DEALS = [
  { id: "bd-100", label: "100 T‑Shirts", price: 389, note: "$3.89 each" },
  { id: "bd-20j", label: "20 Jerseys", price: 340, note: "$17 each" },
  { id: "bd-1000j", label: "1,000+ Jerseys", price: 5, note: "$5 each (unit)" },
];

const IMPACT_DATA = [
  { name: "Education", value: 40 },
  { name: "Health", value: 30 },
  { name: "Food", value: 20 },
  { name: "Emergency", value: 10 },
];

const PAGES = [
  { key: "home", label: "Home" },
  { key: "shop", label: "Shop" },
  { key: "custom", label: "Custom" },
  { key: "sports", label: "Sports" },
  { key: "offers", label: "Promotions" },
  { key: "bulk", label: "Bulk Orders" },
  { key: "charity", label: "Charity" },
  { key: "help", label: "Help Center" },
];

function classNames(...c) { return c.filter(Boolean).join(" "); }

export default function FashionWithHeartApp() {
  const [page, setPage] = useState("home");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState({ cat: "All", type: "All", customizable: "All" });
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]); // {id, qty, variant}
  const [activeProduct, setActiveProduct] = useState(null); // product id
  const [logoPreview, setLogoPreview] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty("--fwh-primary", COLORS.primary);
    document.documentElement.style.setProperty("--fwh-secondary", COLORS.secondary);
    document.documentElement.style.setProperty("--fwh-accent", COLORS.accent);
    document.documentElement.style.setProperty("--fwh-bg", COLORS.bg);
  }, []);

  const filteredCatalog = useMemo(() => {
    return CATALOG.filter(p => {
      const q = query.trim().toLowerCase();
      const matchesQuery = q ? (p.title.toLowerCase().includes(q) || p.tags?.some(t => t.includes(q))) : true;
      const catOk = filter.cat === "All" ? true : p.category === filter.cat;
      const typeOk = filter.type === "All" ? true : p.type === filter.type;
      const custOk = filter.customizable === "All" ? true : (filter.customizable === "Yes" ? p.customizable : !p.customizable);
      return matchesQuery && catOk && typeOk && custOk;
    });
  }, [query, filter]);

  const cartCount = cart.reduce((n, i) => n + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => {
    const prod = CATALOG.find(p => p.id === i.id);
    return sum + (prod ? prod.price * i.qty : 0);
  }, 0);

  function addToCart(id, qty = 1, variant = {}) {
    setCart(prev => {
      const found = prev.find(i => i.id === id && JSON.stringify(i.variant) === JSON.stringify(variant));
      if (found) {
        return prev.map(i => i === found ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { id, qty, variant }];
    });
    setCartOpen(true);
  }

  function removeFromCart(index) {
    setCart(prev => prev.filter((_, i) => i !== index));
  }

  function changeQty(index, qty) {
    setCart(prev => prev.map((i, ix) => ix === index ? { ...i, qty: Math.max(1, qty) } : i));
  }

  function resetCheckout() {
    setCheckoutStep(1);
    setOrderPlaced(false);
  }

  function NavLink({ k, children }) {
    return (
      <button onClick={() => { setPage(k); setActiveProduct(null); resetCheckout(); }}
        className={classNames(
          "px-3 py-2 rounded-xl text-sm font-medium transition", 
          page === k ? "bg-[#EF5371] text-white shadow" : "hover:bg-white/70"
        )}>
        {children}
      </button>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: COLORS.bg }}>
      <Header 
        onOpenCart={() => setCartOpen(true)}
        cartCount={cartCount}
        setPage={(k)=>{ setPage(k); setActiveProduct(null); resetCheckout(); }}
        query={query} setQuery={setQuery}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Nav */}
        <div className="flex flex-wrap items-center gap-2 py-3">
          {PAGES.map(p => <NavLink key={p.key} k={p.key}>{p.label}</NavLink>)}
          <div className="ml-auto hidden md:flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2"><Truck size={16}/><span>Fast U.S. delivery</span></div>
            <div className="flex items-center gap-2"><ShieldCheck size={16}/><span>Secure checkout</span></div>
            <div className="flex items-center gap-2"><Sparkles size={16}/><span>25% profits to charity</span></div>
          </div>
        </div>

        {/* Pages */}
        {page === "home" && <Home goto={(k)=>setPage(k)} />}
        {page === "shop" && (
          <Shop 
            catalog={filteredCatalog}
            addToCart={addToCart}
            setActiveProduct={setActiveProduct}
            filter={filter}
            setFilter={setFilter}
          />
        )}
        {page === "custom" && <Customizer addToCart={addToCart} logoPreview={logoPreview} setLogoPreview={setLogoPreview} />}
        {page === "sports" && <Sports catalog={CATALOG.filter(p=>p.category==="Sports")} addToCart={addToCart} setActiveProduct={setActiveProduct} />}
        {page === "offers" && <Offers addToCart={addToCart} />}
        {page === "bulk" && <BulkOrders />}
        {page === "charity" && <Charity />}
        {page === "help" && <HelpCenter />}
        {page === "product" && activeProduct && (
          <ProductDetail 
            product={CATALOG.find(p=>p.id===activeProduct)}
            onAdd={(qty, variant)=>addToCart(activeProduct, qty, variant)}
          />
        )}
        {page === "checkout" && (
          <Checkout 
            cart={cart} setCart={setCart}
            step={checkoutStep} setStep={setCheckoutStep}
            total={cartTotal}
            onSuccess={()=>{ setOrderPlaced(true); setCart([]);} }
          />
        )}

        {/* CTA band */}
        <div className="my-12 bg-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="text-lg md:text-xl font-semibold">Bulk & Promo: Save big on teams, events, and companies.</div>
          <button className="px-5 py-3 rounded-xl bg-[#EF5371] text-white font-semibold hover:opacity-90" onClick={()=>setPage("bulk")}>
            Get Instant Quote
          </button>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer 
        open={cartOpen} onClose={()=>setCartOpen(false)}
        cart={cart}
        changeQty={changeQty}
        removeItem={removeFromCart}
        total={cartTotal}
        gotoCheckout={()=>{ setCartOpen(false); setPage("checkout"); }}
      />

      <Footer />

      {/* Quick actions (WhatsApp/Phone) */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-3">
        <a href="#" className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] text-white shadow"><MessageCircle size={18}/> WhatsApp</a>
        <a href="tel:+1-800-555-1212" className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#EF5371] text-white shadow"><Phone size={18}/> Call 24/7</a>
      </div>
    </div>
  );
}

function Header({ onOpenCart, cartCount, setPage, query, setQuery }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/80 border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={()=>setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
          <div className="flex items-center gap-2 text-xl font-extrabold tracking-tight" onClick={()=>setPage("home")}>
            <Heart color={COLORS.primary}/>
            <span>Fashion <span className="text-[#EF5371]">With</span> Heart</span>
          </div>

          {/* Search */}
          <div className="relative ml-4 flex-1 hidden md:block">
            <Search className="absolute left-3 top-2.5" size={18}/>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products…" className="w-full pl-10 pr-4 py-2 rounded-2xl bg-black/5 outline-none focus:ring-2 focus:ring-[#EF5371]"/>
          </div>

          <button className="relative ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EF5371] text-white hover:opacity-90" onClick={onOpenCart}>
            <ShoppingCart size={18}/>
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && <span className="absolute -top-2 -right-2 text-xs bg-black text-white rounded-full px-1.5 py-0.5">{cartCount}</span>}
          </button>
        </div>

        {open && (
          <div className="mt-3 grid grid-cols-2 gap-2 md:hidden">
            {PAGES.map(p => (
              <button key={p.key} onClick={()=>{ setPage(p.key); setOpen(false); }} className="px-3 py-2 rounded-xl bg-black/5 text-left">{p.label}</button>
            ))}
            <button onClick={()=>{ setPage("checkout"); setOpen(false); }} className="px-3 py-2 rounded-xl bg-black/5 text-left">Checkout</button>
          </div>
        )}
      </div>
    </header>
  );
}

function Home({ goto }) {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#EF5371] to-[#934F93] text-white">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=2000&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition:'center'}}/>
        <div className="relative p-10 md:p-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm mb-4"><Sparkles size={16}/> 25% of profits donated</div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Fashion With Heart — Affordable, Ethical, Customizable</h1>
            <p className="mt-4 text-white/90">Retail & wholesale apparel with full customization. Fast U.S. delivery and free shipping on many orders.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={()=>goto("shop")} className="px-5 py-3 rounded-xl bg-white text-[#EF5371] font-semibold">Shop Now</button>
              <button onClick={()=>goto("custom")} className="px-5 py-3 rounded-xl bg-black/20 border border-white/30 font-semibold">Custom Orders</button>
              <button onClick={()=>goto("bulk")} className="px-5 py-3 rounded-xl bg-black/20 border border-white/30 font-semibold">Bulk Quote</button>
            </div>
          </div>
        </div>
      </div>

      {/* Core offerings */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { icon: <Shirt/>, title: "Custom Apparel", text: "Logos, names, colors — all supported."},
          { icon: <Sparkles/>, title: "Boutique Fashion", text: "Sarees, salwar kameez, dresses."},
          { icon: <ShieldCheck/>, title: "Sports Team Gear", text: "Cricket & soccer jerseys — retail/bulk."},
          { icon: <Truck/>, title: "Fast U.S. Delivery", text: "Free shipping on many orders."},
        ].map((c,i)=> (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm">
            <div className="text-[#EF5371]">{c.icon}</div>
            <div className="mt-3 font-semibold">{c.title}</div>
            <div className="text-sm text-black/70">{c.text}</div>
          </div>
        ))}
      </div>

      {/* Featured */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Featured Collections</h2>
          <button onClick={()=>goto("shop")} className="inline-flex items-center gap-1 text-[#EF5371]">View all <ChevronRight size={16}/></button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATALOG.slice(0,3).map(p => <ProductCard key={p.id} product={p} onClick={()=>goto("shop")} />)}
        </div>
      </section>

      {/* Promo banner */}
      <div className="bg-white rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="flex-1">
          <div className="text-2xl font-extrabold">Bulk Deals</div>
          <div className="text-black/70">100 T‑shirts for $389 • 20 jerseys for $340 • 1,000+ jerseys at $5 each</div>
        </div>
        <button onClick={()=>goto("offers")} className="px-5 py-3 rounded-xl bg-[#934F93] text-white font-semibold hover:opacity-95">See Promotions</button>
      </div>

      {/* Reviews */}
      <section>
        <h2 className="text-xl font-bold mb-3">What customers say</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {["Amazing quality & fast shipping!","Custom logos came out perfect.","Love the mission — will shop again."].map((t,i)=> (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-sm">
              <div className="flex gap-1 text-[#EF5371] mb-2">{Array.from({length:5}).map((_,ix)=> <Star key={ix} size={16} fill="#EF5371" color="#EF5371"/> )}</div>
              <p className="text-sm text-black/80">{t}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product, onAdd, onClick }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="aspect-[4/3] w-full bg-black/5" style={{backgroundImage:`url(${product.img})`, backgroundSize:'cover', backgroundPosition:'center'}}/>
      <div className="p-4">
        <div className="text-sm text-black/50">{product.type} · {product.category}</div>
        <div className="font-semibold">{product.title}</div>
        <div className="flex items-center justify-between mt-2">
          <div className="font-bold">${product.price}</div>
          {onAdd ? (
            <button className="px-3 py-1.5 rounded-lg bg-[#EF5371] text-white text-sm" onClick={onAdd}>Add</button>
          ) : (
            <button className="px-3 py-1.5 rounded-lg bg-black/5 text-sm" onClick={onClick}>View</button>
          )}
        </div>
      </div>
    </div>
  );
}

function Shop({ catalog, addToCart, setActiveProduct, filter, setFilter }) {
  return (
    <div className="grid lg:grid-cols-12 gap-6">
      {/* Filters */}
      <aside className="lg:col-span-3 bg-white p-5 rounded-2xl h-fit shadow-sm">
        <div className="flex items-center gap-2 font-semibold mb-3"><Filter size={18}/> Filters</div>
        <div className="space-y-4 text-sm">
          <div>
            <div className="text-black/60 mb-1">Category</div>
            <select className="w-full px-3 py-2 rounded-xl bg-black/5" value={filter.cat} onChange={e=>setFilter({...filter, cat:e.target.value})}>
              {['All','Men','Women','Sports','Custom'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <div className="text-black/60 mb-1">Type</div>
            <select className="w-full px-3 py-2 rounded-xl bg-black/5" value={filter.type} onChange={e=>setFilter({...filter, type:e.target.value})}>
              {['All','Boutique','Custom'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <div className="text-black/60 mb-1">Customizable</div>
            <select className="w-full px-3 py-2 rounded-xl bg-black/5" value={filter.customizable} onChange={e=>setFilter({...filter, customizable:e.target.value})}>
              {['All','Yes','No'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </aside>

      {/* Grid */}
      <section className="lg:col-span-9">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {catalog.map(p => (
            <div key={p.id}>
              <ProductCard 
                product={p}
                onAdd={()=>addToCart(p.id,1)}
                onClick={()=>setActiveProduct(p.id)}
              />
              <button className="mt-2 text-[#934F93] text-sm" onClick={()=>setActiveProduct(p.id)}>Open Product</button>
            </div>
          ))}
          {catalog.length===0 && (
            <div className="col-span-full text-center text-black/60">No products match your filters.</div>
          )}
        </div>
      </section>
    </div>
  );
}

function Sports({ catalog, addToCart, setActiveProduct }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Team Jerseys & Sportswear</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {catalog.map(p => (
          <div key={p.id}>
            <ProductCard product={p} onAdd={()=>addToCart(p.id)} />
            <button className="mt-2 text-[#934F93] text-sm" onClick={()=>setActiveProduct(p.id)}>Customize</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Offers({ addToCart }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Promotional Offers</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {BULK_DEALS.map((d,i)=> (
          <div key={d.id} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="text-sm text-black/60">Limited-time bulk pricing</div>
            <div className="text-2xl font-extrabold mt-1">{d.label}</div>
            <div className="text-3xl font-extrabold text-[#EF5371] mt-3">{d.price === 5 ? "$5 each" : `$${d.price}`}</div>
            <div className="text-sm text-black/60">{d.note}</div>
            <button className="mt-4 px-4 py-2 rounded-xl bg-[#EF5371] text-white" onClick={()=>addToCart('ts-2001', 20)}>Start Order</button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="flex-1">
          <div className="font-semibold">Wholesale accounts</div>
          <div className="text-black/70 text-sm">Unlock tiered discounts and dedicated support for teams, schools, and businesses.</div>
        </div>
        <button className="px-5 py-3 rounded-xl bg-[#934F93] text-white">Apply Now</button>
      </div>
    </div>
  );
}

function BulkOrders() {
  const [qty, setQty] = useState(100);
  const unit = qty >= 1000 ? 5 : qty >= 100 ? 3.89 : 17;
  const total = qty >= 1000 ? qty * 5 : qty >= 100 ? 389 : 340; // simplified tiers
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold mb-1">Instant Bulk Quote</h2>
        <p className="text-black/70 text-sm mb-4">Promotional pricing for large orders. Logos, names, numbers included.</p>
        <label className="text-sm">Quantity: <b>{qty}</b></label>
        <input type="range" min={20} max={2000} value={qty} onChange={e=>setQty(Number(e.target.value))} className="w-full"/>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-black/5 rounded-xl p-4">
            <div className="text-black/50 text-sm">Estimated total</div>
            <div className="text-2xl font-extrabold">${total.toFixed(0)}</div>
          </div>
          <div className="bg-black/5 rounded-xl p-4">
            <div className="text-black/50 text-sm">Estimated unit price</div>
            <div className="text-2xl font-extrabold">${unit.toFixed(2)}</div>
          </div>
        </div>
        <button className="mt-4 px-5 py-3 rounded-xl bg-[#EF5371] text-white">Request Formal Quote</button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="font-semibold mb-3">What’s included</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm text-black/80">
          <li>Full customization: logos, colors, names, placements</li>
          <li>Mockups for approval before production</li>
          <li>Fast U.S. delivery with tracking</li>
          <li>Dedicated account manager (phone/WhatsApp)</li>
        </ul>
        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          {BULK_DEALS.map(d => (
            <div key={d.id} className="bg-black/5 rounded-xl p-4 text-center">
              <div className="font-bold">{d.label}</div>
              <div className="text-[#EF5371] font-extrabold text-xl">{d.price === 5 ? "$5 ea" : `$${d.price}`}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Customizer({ addToCart, logoPreview, setLogoPreview }) {
  const [form, setForm] = useState({ product: "Custom Team Jersey", color: "Crimson", name: "", number: "", size: "M" });

  function onFile(e){
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold mb-1">Design Your Own</h2>
        <p className="text-black/70 text-sm mb-4">Upload your logo, choose colors, and personalize with names/numbers.</p>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Product</label>
            <select className="w-full px-3 py-2 rounded-xl bg-black/5" value={form.product} onChange={e=>setForm({...form, product:e.target.value})}>
              {["Custom Team Jersey","Custom Polo Shirt","Custom T‑Shirt","Custom Dress"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm">Primary Color</label>
            <select className="w-full px-3 py-2 rounded-xl bg-black/5" value={form.color} onChange={e=>setForm({...form, color:e.target.value})}>
              {["Crimson","Royal Blue","Emerald","Black","White"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm">Player Name (optional)</label>
            <input className="w-full px-3 py-2 rounded-xl bg-black/5" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="e.g., A. Rahman"/>
          </div>
          <div>
            <label className="text-sm">Number (optional)</label>
            <input className="w-full px-3 py-2 rounded-xl bg-black/5" value={form.number} onChange={e=>setForm({...form, number:e.target.value})} placeholder="e.g., 10"/>
          </div>
          <div>
            <label className="text-sm">Size</label>
            <select className="w-full px-3 py-2 rounded-xl bg-black/5" value={form.size} onChange={e=>setForm({...form, size:e.target.value})}>
              {["XS","S","M","L","XL","2XL"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm">Upload Logo</label>
            <label className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-black/5 cursor-pointer">
              <Upload size={16}/> Choose file
              <input type="file" accept="image/*" className="hidden" onChange={onFile} />
            </label>
          </div>
        </div>

        <button className="mt-4 px-5 py-3 rounded-xl bg-[#EF5371] text-white" onClick={()=>addToCart('ts-2001', 1, form)}>Add to Cart ($24)</button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="font-semibold mb-2">Live Preview</h3>
        <div className="aspect-[4/3] w-full rounded-xl overflow-hidden relative" style={{backgroundImage:'url(https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1600&auto=format&fit=crop)', backgroundSize:'cover', backgroundPosition:'center'}}>
          {logoPreview && (
            <img src={logoPreview} alt="logo" className="absolute right-6 bottom-6 w-24 h-24 object-contain drop-shadow-xl"/>
          )}
          {(!logoPreview) && (
            <div className="absolute right-6 bottom-6 text-xs bg-white/80 px-2 py-1 rounded-full">Your logo here</div>
          )}
        </div>
        <div className="mt-3 text-sm text-black/60">Preview is illustrative. Final design will be approved via mockups.</div>
      </div>
    </div>
  );
}

function ProductDetail({ product, onAdd }) {
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState({ size: "M", color: "Default" });
  if (!product) return null;
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="aspect-[4/3] w-full" style={{backgroundImage:`url(${product.img})`, backgroundSize:'cover', backgroundPosition:'center'}}/>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="text-sm text-black/50">{product.type} · {product.category}</div>
        <h1 className="text-2xl font-extrabold mt-1">{product.title}</h1>
        <div className="flex items-center gap-2 mt-1 text-[#EF5371]">{Array.from({length:5}).map((_,i)=>(<Star key={i} size={16} fill="#EF5371" color="#EF5371"/>))}<span className="text-black/60 text-sm">({product.rating})</span></div>
        <div className="text-3xl font-extrabold mt-3">${product.price}</div>
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          <div>
            <label className="text-sm">Size</label>
            <select className="w-full px-3 py-2 rounded-xl bg-black/5" value={variant.size} onChange={e=>setVariant({...variant, size:e.target.value})}>
              {["XS","S","M","L","XL","2XL"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm">Color</label>
            <select className="w-full px-3 py-2 rounded-xl bg-black/5" value={variant.color} onChange={e=>setVariant({...variant, color:e.target.value})}>
              {["Default","Black","White","Crimson","Royal Blue"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm">Quantity</label>
            <input type="number" min={1} value={qty} onChange={e=>setQty(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-black/5"/>
          </div>
        </div>
        <button className="mt-4 px-5 py-3 rounded-xl bg-[#EF5371] text-white" onClick={()=>onAdd(qty, variant)}>
          Add to Cart
        </button>
        <div className="mt-4 text-sm text-black/60">
          Free shipping on many orders · Fast U.S. delivery · 24/7 support
        </div>
      </div>
    </div>
  );
}

function Checkout({ cart, setCart, step, setStep, total, onSuccess }) {
  const [info, setInfo] = useState({ email: "", name: "", phone: "", address: "", city: "", state: "", zip: "" });
  const [payment, setPayment] = useState({ method: "card", card: "", exp: "", cvc: "" });

  useEffect(()=>{ window.scrollTo(0,0); }, [step]);

  if (cart.length === 0 && step !== 3) {
    return <div className="bg-white p-6 rounded-2xl text-center shadow-sm">Your cart is empty. Add items to proceed.</div>;
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-sm">
          <StepDot active={step>=1} /> <span>Customer</span>
          <ChevronRight size={16}/>
          <StepDot active={step>=2} /> <span>Payment</span>
          <ChevronRight size={16}/>
          <StepDot active={step>=3} /> <span>Review</span>
        </div>

        {step === 1 && (
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {key:'email',label:'Email'},
              {key:'name',label:'Full Name'},
              {key:'phone',label:'Phone'},
              {key:'address',label:'Address'},
              {key:'city',label:'City'},
              {key:'state',label:'State'},
              {key:'zip',label:'ZIP Code'},
            ].map(f => (
              <div key={f.key} className={f.key==='address'? 'sm:col-span-2' : ''}>
                <label className="text-sm">{f.label}</label>
                <input value={info[f.key]} onChange={e=>setInfo({...info, [f.key]: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-black/5"/>
              </div>
            ))}
            <button className="mt-2 px-5 py-3 rounded-xl bg-[#EF5371] text-white sm:col-span-2" onClick={()=>setStep(2)}>Continue to Payment</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div>
              <label className="inline-flex items-center gap-2"><input type="radio" checked={payment.method==='card'} onChange={()=>setPayment({...payment, method:'card'})}/> Credit/Debit Card</label>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="text-sm">Card Number</label>
                <input value={payment.card} onChange={e=>setPayment({...payment, card:e.target.value})} className="w-full px-3 py-2 rounded-xl bg-black/5" placeholder="4242 4242 4242 4242"/>
              </div>
              <div>
                <label className="text-sm">Expiry</label>
                <input value={payment.exp} onChange={e=>setPayment({...payment, exp:e.target.value})} className="w-full px-3 py-2 rounded-xl bg-black/5" placeholder="MM/YY"/>
              </div>
              <div>
                <label className="text-sm">CVC</label>
                <input value={payment.cvc} onChange={e=>setPayment({...payment, cvc:e.target.value})} className="w-full px-3 py-2 rounded-xl bg-black/5" placeholder="CVC"/>
              </div>
            </div>
            <button className="px-5 py-3 rounded-xl bg-[#934F93] text-white" onClick={()=>setStep(3)}>Review Order</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-700"><CheckCircle2/> Almost there! Confirm your order.</div>
            <button className="px-5 py-3 rounded-xl bg-[#EF5371] text-white" onClick={()=>onSuccess()}>Place Order</button>
            <div className="text-sm text-black/60">By placing an order you agree to our terms and refund policy.</div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm h-fit">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="space-y-3">
          {cart.map((i,ix)=>{
            const p = CATALOG.find(pp=>pp.id===i.id);
            return (
              <div key={ix} className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-black/5" style={{backgroundImage:`url(${p.img})`, backgroundSize:'cover', backgroundPosition:'center'}}/>
                <div className="flex-1 text-sm">
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-black/60">Qty {i.qty}{i.variant?.size?`, ${i.variant.size}`:''}{i.variant?.color?`, ${i.variant.color}`:''}</div>
                </div>
                <div className="font-semibold">${(p.price*i.qty).toFixed(2)}</div>
              </div>
            );
          })}
        </div>
        <div className="border-t mt-4 pt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
          <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>
        <div className="mt-4 text-xs text-black/60">Fast U.S. delivery. 24/7 support via phone & WhatsApp.</div>
      </div>
    </div>
  );
}

function Charity() {
  const chartColors = ["#EF5371", "#934F93", "#DCC2B4", "#111827"];
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold mb-2">Our Mission</h2>
        <p className="text-black/80">25% of profits are donated to global charitable initiatives focused on education, health, food security, and emergency relief. Your purchase directly fuels impact.</p>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {[
            {k:"$250k+", v:"donated to date"},
            {k:"50+", v:"communities served"},
            {k:"25%", v:"of profits donated"},
            {k:"24/7", v:"human support"},
          ].map((m,i)=> (
            <div key={i} className="bg-black/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-extrabold">{m.k}</div>
              <div className="text-black/60 text-sm">{m.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="font-semibold mb-2">How we allocate donations</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie dataKey="value" data={IMPACT_DATA} innerRadius={50} outerRadius={80}>
                {IMPACT_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function HelpCenter() {
  const faqs = [
    { q: "How do I order custom jerseys?", a: "Choose a custom product, upload your logo, add names/numbers, and place the order. We'll send a mockup for approval." },
    { q: "Do you offer free shipping?", a: "Yes, many orders qualify for free U.S. shipping with tracking." },
    { q: "Can I order in bulk?", a: "Absolutely. Use our Bulk Orders page for instant pricing and formal quotes." },
    { q: "What is your return policy?", a: "Custom items are final sale after approval. Boutique items can be returned within 14 days in original condition." },
  ];
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold mb-2">FAQs</h2>
        <div className="divide-y">
          {faqs.map((f,i)=> (
            <div key={i} className="py-3">
              <div className="font-semibold">{f.q}</div>
              <div className="text-sm text-black/70">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="font-semibold mb-2">Size Guide</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-black/60">
              <th className="py-2">Size</th><th>Chest (in)</th><th>Length (in)</th>
            </tr>
          </thead>
          <tbody>
            {[['XS','32-34','25'],['S','35-37','26'],['M','38-40','27'],['L','41-43','28'],['XL','44-46','29'],['2XL','47-49','30']].map((r,i)=> (
              <tr key={i} className="border-t">
                <td className="py-2 font-medium">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CartDrawer({ open, onClose, cart, changeQty, removeItem, total, gotoCheckout }) {
  return (
    <div className={classNames("fixed inset-0 z-40", open ? "pointer-events-auto" : "pointer-events-none")}> 
      {/* Backdrop */}
      <div className={classNames("absolute inset-0 bg-black/40 transition", open ? "opacity-100" : "opacity-0")} onClick={onClose}/>
      {/* Panel */}
      <div className={classNames("absolute right-0 top-0 h-full w-full sm:w-[28rem] bg-white shadow-xl transition-transform", open ? "translate-x-0" : "translate-x-full")}> 
        <div className="p-5 flex items-center justify-between border-b">
          <div className="font-semibold">Your Cart</div>
          <button onClick={onClose}><X/></button>
        </div>
        <div className="p-5 space-y-4 overflow-y-auto h-[calc(100%-9rem)]">
          {cart.length === 0 && <div className="text-black/60">Your cart is empty.</div>}
          {cart.map((i,ix)=>{
            const p = CATALOG.find(pp=>pp.id===i.id);
            return (
              <div key={ix} className="flex gap-3 items-center">
                <div className="w-16 h-16 rounded-lg bg-black/5" style={{backgroundImage:`url(${p.img})`, backgroundSize:'cover', backgroundPosition:'center'}}/>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{p.title}</div>
                  <div className="text-xs text-black/60">${p.price} · {i.variant?.size || '—'} {i.variant?.color?`· ${i.variant.color}`:''}</div>
                  <div className="mt-1 inline-flex items-center gap-2">
                    <input type="number" min={1} value={i.qty} onChange={e=>changeQty(ix, Number(e.target.value))} className="w-16 px-2 py-1 rounded-lg bg-black/5 text-sm"/>
                    <button className="text-sm text-red-600 inline-flex items-center gap-1" onClick={()=>removeItem(ix)}><Trash2 size={14}/> Remove</button>
                  </div>
                </div>
                <div className="font-semibold">${(p.price*i.qty).toFixed(2)}</div>
              </div>
            );
          })}
        </div>
        <div className="p-5 border-t">
          <div className="flex justify-between font-semibold"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <button disabled={cart.length===0} className="mt-3 w-full px-5 py-3 rounded-xl bg-[#EF5371] text-white disabled:opacity-50" onClick={gotoCheckout}>Checkout</button>
        </div>
      </div>
    </div>
  );
}

function StepDot({ active }) { return <span className={classNames("inline-block w-3 h-3 rounded-full", active?"bg-[#EF5371]":"bg-black/20")} /> }

function Footer() {
  return (
    <footer className="mt-16 border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-4 gap-6 text-sm">
        <div>
          <div className="font-extrabold text-lg">Fashion With Heart</div>
          <p className="text-black/70 mt-2">Affordable, high‑quality fashion with a mission. 25% of profits donated.</p>
        </div>
        <div>
          <div className="font-semibold mb-2">Shop</div>
          <ul className="space-y-1">
            <li><a href="#">All Products</a></li>
            <li><a href="#">Men</a></li>
            <li><a href="#">Women</a></li>
            <li><a href="#">Sports</a></li>
            <li><a href="#">Custom</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Support</div>
          <ul className="space-y-1">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Policies</a></li>
            <li><a href="#">How to Order</a></li>
            <li><a href="#">Size Guide</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Contact</div>
          <ul className="space-y-1">
            <li>Phone/WhatsApp: +1 (800) 555‑1212</li>
            <li>Email: support@fwithh.com</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-black/60 pb-8">© {new Date().getFullYear()} Fashion With Heart — All rights reserved.</div>
    </footer>
  );
}
