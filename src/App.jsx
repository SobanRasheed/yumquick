import { useState, useEffect, useRef } from 'react'

/* ─── Reveal-on-scroll hook ─── */
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          obs.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

/* ─── Reusable Reveal wrapper ─── */
function Reveal({ children, className = '', delay = 0 }) {
  const ref = useReveal()
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ─── CSS Phone Mockup ─── */
function PhoneMockup({ src, alt }) {
  return (
    <div className="relative w-full">
      {/* Outer shell — fixed px radius so corners are circular, not elliptical */}
      <div
        className="relative"
        style={{
          background: 'linear-gradient(160deg, #6B6B6D 0%, #2A2A2C 40%, #1C1C1E 100%)',
          boxShadow:
            '0 50px 100px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.4)',
          borderRadius: '44px',
          padding: '8px',
        }}
      >
        {/* Screen bezel */}
        <div
          className="relative overflow-hidden bg-black"
          style={{ aspectRatio: '9 / 19.5', borderRadius: '38px' }}
        >
          {/* App screenshot */}
          <img
            src={src}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          {/* Dynamic island */}
          <div
            className="absolute top-[2.5%] left-1/2 -translate-x-1/2 bg-black rounded-full z-10"
            style={{ width: '32%', height: '3.5%' }}
          />
          {/* Home indicator */}
          <div
            className="absolute bottom-[1.5%] left-1/2 -translate-x-1/2 bg-white/40 rounded-full z-10"
            style={{ width: '36%', height: '0.6%', minHeight: '3px' }}
          />
        </div>
      </div>
      {/* Power button */}
      <div
        className="absolute bg-[#3A3A3C] rounded-r"
        style={{ top: '28%', right: '-4px', width: '4px', height: '11%' }}
      />
      {/* Silent switch */}
      <div
        className="absolute bg-[#3A3A3C] rounded-l"
        style={{ top: '18%', left: '-4px', width: '4px', height: '5%' }}
      />
      {/* Volume up */}
      <div
        className="absolute bg-[#3A3A3C] rounded-l"
        style={{ top: '27%', left: '-4px', width: '4px', height: '9%' }}
      />
      {/* Volume down */}
      <div
        className="absolute bg-[#3A3A3C] rounded-l"
        style={{ top: '38%', left: '-4px', width: '4px', height: '9%' }}
      />
    </div>
  )
}

/* ─── Counter animation hook ─── */
function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1)
            setCount(Math.floor(progress * target))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])

  return { count, ref }
}

/* ════════════════════════════════════════════════════════
   ICONS (inline SVG so we don't need an icon library)
   ════════════════════════════════════════════════════════ */

const icons = {
  menu: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  ),
  close: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  lightning: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  mapPin: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  shield: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  star: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  arrowRight: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  apple: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  ),
  playStore: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 0 1 0 1.38l-2.302 2.302L15.4 13.195l2.298-2.298v-.001l.001-.001-.001-.001 1.389-1.387zM5.864 2.658L16.8 8.99l-2.302 2.302L5.864 2.658z" />
    </svg>
  ),
  heart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  clock: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  sparkle: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
    </svg>
  ),
  chevronDown: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
}

/* ════════════════════════════════════════════════════════
   NAVBAR
   ════════════════════════════════════════════════════════ */

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Menu', href: '#menu' },
    { label: 'Reviews', href: '#reviews' },
  ]

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-brand-orange/5 py-3'
        : 'bg-transparent py-5'
        }`}
    >
      <div className="container-x flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-1 group -mt-2" id="logo">
          {/* Brand icon — 1.png */}
          <div className="w-20 h-20 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <img
              src="/Yum Qucik/1.png"
              alt="YumQuick icon"
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>
          {/* Brand wordmark — 2.png */}
          <img
            src="/Yum Qucik/2.png"
            alt="YumQuick"
            className="h-14 w-auto object-contain mix-blend-multiply"
          />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted hover:text-brand-orange transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-brand-orange after:transition-all hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
          <a href="#download" className="btn-primary text-sm !px-6 !py-2.5">
            Download App
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          id="mobile-menu-toggle"
          className="md:hidden text-ink"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? icons.close : icons.menu}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="container-x pb-6 pt-4 flex flex-col gap-4 bg-white/90 backdrop-blur-xl rounded-b-3xl mt-2 shadow-card">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-ink hover:text-brand-orange transition-colors py-1"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#download"
            onClick={() => setOpen(false)}
            className="btn-primary text-sm w-full text-center"
          >
            Download App
          </a>
        </div>
      </div>
    </nav>
  )
}

/* ════════════════════════════════════════════════════════
   HERO
   ════════════════════════════════════════════════════════ */

function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Background decoration */}
      <div className="absolute inset-0 grain opacity-60" />
      <div className="absolute top-20 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-brand-orange/10 to-brand-amber/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-brand-amber/10 to-brand-orangeSoft/20 blur-3xl" />

      <div className="container-x relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left copy */}
          <div className="lg:col-span-7 xl:col-span-7">
            <div className="animate-fade-up">
              <span className="eyebrow">
                #1 Food Delivery App
              </span>
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-display font-extrabold leading-[1.1] text-ink animate-fade-up" style={{ animationDelay: '100ms' }}>
              Your favorite meals,{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-brand-orange">delivered fast</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-brand-amber/40 -skew-x-6 rounded" />
              </span>
            </h1>

            <p className="mt-6 text-lg text-muted leading-relaxed animate-fade-up max-w-lg" style={{ animationDelay: '200ms' }}>
              Live order tracking, thousands of restaurants, and a checkout
              that just works. Craving something? Yum Fast gets it to your door
              in minutes.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
              <a href="#download" className="btn-primary group">
                Order Now
                <span className="transition-transform group-hover:translate-x-1">{icons.arrowRight}</span>
              </a>
              <a href="#how-it-works" className="btn-ghost">
                How It Works
              </a>
            </div>

            {/* Social proof row */}
            <div className="mt-10 flex items-center gap-6 animate-fade-up" style={{ animationDelay: '400ms' }}>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-md"
                  >
                    <img
                      src={i <= 2 ? 'https://res.cloudinary.com/ui7ywkah/image/upload/v1784876414/yumfast/food/wmzbysvjkw6f1t83uffn.jpg' : 'https://res.cloudinary.com/ui7ywkah/image/upload/v1784876415/yumfast/food/lgptqt2kxnzumzjo6cmg.jpg'}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-brand-orange flex items-center justify-center text-white text-xs font-bold shadow-md">
                  1K+
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-brand-amber">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{icons.star}</span>
                  ))}
                </div>
                <p className="text-sm text-muted mt-0.5">
                  <span className="font-semibold text-ink">4.9</span> from 1,200+ reviews
                </p>
              </div>
            </div>
          </div>

          {/* Right phone mockup — fills the 5-col right panel */}
          <div className="relative flex justify-center lg:col-span-5 xl:col-span-5 items-center mt-8 lg:mt-0">
            <div className="relative animate-float w-full max-w-[220px] sm:max-w-[260px] lg:max-w-[300px]">
              <PhoneMockup
                src="https://res.cloudinary.com/ui7ywkah/image/upload/v1784876428/yumfast/screens/tbgckte0ojaz97ny3bbs.png"
                alt="Yum Fast app home screen"
              />
              {/* Floating food cards — hidden on mobile to prevent overflow */}
              <div className="hidden sm:flex absolute -left-16 top-14 bg-white rounded-2xl p-2.5 shadow-card animate-float-slow items-center gap-3 pr-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                  <img src="https://res.cloudinary.com/ui7ywkah/image/upload/v1784876418/yumfast/food/odgbgequqtptcgslnt6a.jpg" alt="Burger" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink leading-tight">Chicken Burger</p>
                  <p className="text-xs text-brand-orange font-bold">Rs. 899</p>
                </div>
              </div>
              <div className="hidden sm:flex absolute -right-16 bottom-28 bg-white rounded-2xl p-2.5 shadow-card animate-float-slow items-center gap-3 pr-4" style={{ animationDelay: '2s' }}>
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                  <img src="https://res.cloudinary.com/ui7ywkah/image/upload/v1784876421/yumfast/food/cybkfvetkqgk9pxgbb0w.jpg" alt="Pizza" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink leading-tight">Pepperoni Pizza</p>
                  <p className="text-xs text-brand-orange font-bold">Rs. 1,299</p>
                </div>
              </div>
              {/* Delivery time badge — hidden on mobile */}
              <div className="hidden sm:flex absolute -right-10 top-8 bg-brand-orange text-white rounded-full px-3 py-1.5 shadow-soft items-center gap-1.5 text-xs font-semibold animate-float-slow" style={{ animationDelay: '1s' }}>
                25 min
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════
   LOGO MARQUEE
   ════════════════════════════════════════════════════════ */

function LogoMarquee() {
  const partners = [
    'McDonald\'s', 'KFC', 'Subway', 'Pizza Hut', 'Domino\'s',
    'Starbucks', 'Burger King', 'Taco Bell', 'Wendy\'s', 'Chick-fil-A',
  ]
  const doubled = [...partners, ...partners]

  return (
    <section className="py-12 border-y border-ink/5 bg-white/50 overflow-hidden">
      <p className="text-center text-xs font-semibold text-muted uppercase tracking-widest mb-6">
        Trusted by 500+ restaurant partners
      </p>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-cream to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-cream to-transparent z-10" />
        <div className="flex animate-marquee">
          {doubled.map((name, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-8 flex items-center gap-2 text-ink/20 hover:text-brand-orange/50 transition-colors"
            >
              <span className="text-lg font-display font-bold whitespace-nowrap">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════
   FEATURES
   ════════════════════════════════════════════════════════ */

const features = [
  {
    icon: icons.lightning,
    title: 'Lightning Fast Delivery',
    description: 'Average delivery in 25 minutes. We optimize routes in real-time so your food arrives hot and fresh.',
    color: 'bg-brand-orange',
  },
  {
    icon: icons.mapPin,
    title: 'Live Order Tracking',
    description: 'Watch your rider move on the map in real-time. Know exactly when your food will arrive — no guessing.',
    color: 'bg-brand-amber',
  },
  {
    icon: icons.shield,
    title: 'Secure Payments',
    description: 'Apple Pay, Google Pay, cards, and cash. Every transaction encrypted with bank-level security.',
    color: 'bg-emerald-500',
  },
  {
    icon: icons.clock,
    title: 'Schedule Orders',
    description: 'Planning ahead? Schedule your order for later and it\'ll arrive exactly when you want it.',
    color: 'bg-violet-500',
  },
  {
    icon: icons.heart,
    title: 'Personalized For You',
    description: 'Smart recommendations based on your taste. The more you order, the better Yum Fast knows you.',
    color: 'bg-rose-500',
  },
  {
    icon: icons.sparkle,
    title: 'Exclusive Deals',
    description: 'Daily offers, loyalty rewards, and first-order discounts. Great food doesn\'t have to break the bank.',
    color: 'bg-sky-500',
  },
]

function Features() {
  return (
    <section id="features" className="py-20 lg:py-28 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-brand-orangeSoft/30 to-transparent blur-3xl opacity-50" />
      <div className="container-x relative z-10">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">Why Yum Fast</span>
          <h2 className="section-title mt-4">
            Everything you need, <br className="hidden sm:block" />
            nothing you don't
          </h2>
          <p className="mt-4 text-muted text-lg">
            We obsessed over every detail so you can just enjoy your food.
          </p>
        </Reveal>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="group relative bg-white rounded-3xl p-7 shadow-sm border border-ink/5 hover:shadow-card transition-all duration-500 hover:-translate-y-1 h-full">
                <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                  {f.icon}
                </div>
                <h3 className="mt-5 text-lg font-display font-bold text-ink">
                  {f.title}
                </h3>
                <p className="mt-2 text-muted text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════
   HOW IT WORKS
   ════════════════════════════════════════════════════════ */

const steps = [
  {
    num: '01',
    title: 'Browse & Choose',
    description: 'Explore thousands of restaurants and dishes near you. Filter by cuisine, rating, or delivery time.',
    screen: 'https://res.cloudinary.com/ui7ywkah/image/upload/v1784876428/yumfast/screens/tbgckte0ojaz97ny3bbs.png',
  },
  {
    num: '02',
    title: 'Add to Cart',
    description: 'Pick your favorites with a satisfying add-to-cart animation. Customize toppings, size, and extras.',
    screen: 'https://res.cloudinary.com/ui7ywkah/image/upload/v1784878373/yumfast/screens/c0n8f0fjyiymlfww3enr.png',
  },
  {
    num: '03',
    title: 'Pay Securely',
    description: 'Checkout in under 30 seconds. Save your address and payment method for next time.',
    screen: 'https://res.cloudinary.com/ui7ywkah/image/upload/v1784876430/yumfast/screens/etl05kswwof75bmsm4wc.png',
  },
  {
    num: '04',
    title: 'Track & Enjoy',
    description: 'Watch your rider on a live map. Rate your experience and earn loyalty points.',
    screen: 'https://res.cloudinary.com/ui7ywkah/image/upload/v1784876432/yumfast/screens/uagopawzpsphalnluwo7.png',
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-gradient-to-b from-white to-cream relative overflow-hidden">
      <div className="absolute -right-60 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-amber/10 blur-3xl" />
      <div className="container-x relative z-10">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">How It Works</span>
          <h2 className="section-title mt-4">
            From craving to doorstep <br className="hidden sm:block" />
            in four easy steps
          </h2>
        </Reveal>

        <div className="mt-16 space-y-20 lg:space-y-28">
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={100}>
              <div className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${i % 2 === 1 ? 'lg:direction-rtl' : ''}`}>
                {/* Text */}
                <div className={`${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <span className="text-6xl font-display font-extrabold text-brand-orange/10">
                    {s.num}
                  </span>
                  <h3 className="mt-2 text-2xl sm:text-3xl font-display font-bold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-4 text-muted leading-relaxed text-lg">
                    {s.description}
                  </p>
                  {/* Step progress dots */}
                  <div className="mt-6 flex gap-2">
                    {steps.map((_, j) => (
                      <div
                        key={j}
                        className={`h-1.5 rounded-full transition-all ${j === i ? 'w-8 bg-brand-orange' : 'w-3 bg-ink/10'
                          }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Phone */}
                <div className={`flex justify-center ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="relative w-full max-w-[240px] lg:max-w-[260px]">
                    <div className="absolute -inset-6 bg-gradient-to-br from-brand-orange/20 to-brand-amber/20 rounded-[3rem] blur-2xl" />
                    <div className="relative">
                      <PhoneMockup
                        src={s.screen}
                        alt={`Step ${s.num}: ${s.title}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════
   APP SHOWCASE (Big phone with features list)
   ════════════════════════════════════════════════════════ */

function AppShowcase() {
  return (
    <section className="py-20 lg:py-28 bg-ink text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(232,82,33,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(244,202,87,0.1),transparent_50%)]" />

      <div className="container-x relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Phone */}
          <Reveal className="flex justify-center">
            <div className="relative w-full max-w-[300px] lg:max-w-[340px] mx-auto">
              <div className="absolute -inset-8 bg-gradient-to-br from-brand-orange/30 to-brand-amber/20 rounded-full blur-3xl" />
              <div className="relative">
                <PhoneMockup
                  src="https://res.cloudinary.com/ui7ywkah/image/upload/v1784876432/yumfast/screens/jjb9xwuqeqjs613xcnt5.png"
                  alt="Yum Fast app review screen"
                />
              </div>
              {/* Floating review card */}
              <div className="absolute -right-14 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/10 max-w-[180px]">
                <div className="flex gap-1 text-brand-amber">
                  {[...Array(5)].map((_, i) => <span key={i}>{icons.star}</span>)}
                </div>
                <p className="text-xs text-white/80 mt-2 leading-relaxed">
                  "Best food app I've ever used. The tracking is incredible!"
                </p>
                <p className="text-xs text-white/50 mt-1 font-semibold">— Sarah K.</p>
              </div>
            </div>
          </Reveal>

          {/* Content */}
          <div>
            <Reveal>
              <span className="eyebrow !bg-white/10 !text-brand-amber">
                The App Experience
              </span>
              <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[2.75rem] font-display font-bold leading-tight">
                Born to make you{' '}
                <span className="text-brand-amber">hungry</span>
              </h2>
              <p className="mt-5 text-white/60 text-lg leading-relaxed">
                Every Flavor is crafted to
                make ordering food feel effortless and delightful.
              </p>
            </Reveal>

            <div className="mt-10 space-y-6">
              {[
                { title: '76 self-crafted flavours', desc: 'From the first splash to the final bite.' },
                { title: '8 delicious meals', desc: 'Fresh ingredients and bold spices in every bite.' },
                { title: 'Buttery smooth cheese', desc: 'Adding cheese to your order has never been easier' },
                { title: 'Never run out of your favorites', desc: 'Your favorite flavors are always just a tap away.' },
              ].map((item, i) => (
                <Reveal key={item.title} delay={i * 100}>
                  <div className="flex gap-4 items-start group">
                    <div className="w-8 h-8 rounded-lg bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-brand-orange transition-colors duration-300">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-brand-orange group-hover:text-white transition-colors">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="text-white/50 text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════
   MENU PREVIEW
   ════════════════════════════════════════════════════════ */

const menuItems = [
  { name: 'Chicken Burger', price: 'Rs. 899', rating: '4.8', time: '20 min', img: 'https://res.cloudinary.com/ui7ywkah/image/upload/v1784876418/yumfast/food/odgbgequqtptcgslnt6a.jpg', tag: 'Popular' },
  { name: 'Pepperoni Pizza', price: 'Rs. 1,299', rating: '4.9', time: '25 min', img: 'https://res.cloudinary.com/ui7ywkah/image/upload/v1784876421/yumfast/food/cybkfvetkqgk9pxgbb0w.jpg', tag: 'Best Seller' },
  { name: 'Chicken Curry', price: 'Rs. 1,099', rating: '4.7', time: '30 min', img: 'https://res.cloudinary.com/ui7ywkah/image/upload/v1784876419/yumfast/food/p9vghna4gsdmsykcaos8.jpg', tag: '' },
  { name: 'Spring Rolls', price: 'Rs. 699', rating: '4.6', time: '15 min', img: 'https://res.cloudinary.com/ui7ywkah/image/upload/v1784876422/yumfast/food/x9fq3v0sozehvnaeuson.jpg', tag: 'New' },
  { name: 'Fresh Sushi', price: 'Rs. 1,499', rating: '4.9', time: '25 min', img: 'https://res.cloudinary.com/ui7ywkah/image/upload/v1784876424/yumfast/food/j2k6fzf1isbyfvfyaehi.jpg', tag: 'Premium' },
  { name: 'Strawberry Shake', price: 'Rs. 599', rating: '4.8', time: '10 min', img: 'https://res.cloudinary.com/ui7ywkah/image/upload/v1784876423/yumfast/food/bd86hrmj6ojzy5vjdgqz.jpg', tag: '' },
  { name: 'Berry Cupcake', price: 'Rs. 499', rating: '4.7', time: '10 min', img: 'https://res.cloudinary.com/ui7ywkah/image/upload/v1784876416/yumfast/food/kmyy2czkpdhu7fg95dmm.jpg', tag: 'Sweet' },
  { name: 'Broccoli Lasagna', price: 'Rs. 1,199', rating: '4.5', time: '35 min', img: 'https://res.cloudinary.com/ui7ywkah/image/upload/v1784876417/yumfast/food/cbvw7dadd3jr8ihswnvq.jpg', tag: 'Healthy' },
]

function MenuPreview() {
  const [activeFilter, setActiveFilter] = useState('All')
  const filters = ['All', 'Popular', 'New', 'Healthy', 'Sweet']

  return (
    <section id="menu" className="py-20 lg:py-28 relative">
      <div className="container-x">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">Explore</span>
          <h2 className="section-title mt-4">
            Dishes that make you <br className="hidden sm:block" />
            stop scrolling
          </h2>
          <p className="mt-4 text-muted text-lg">
            From sizzling burgers to artisan sushi — there's something for every craving.
          </p>
        </Reveal>

        {/* Filters */}
        <Reveal className="mt-10 flex justify-center gap-3 flex-wrap" delay={100}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeFilter === f
                ? 'bg-brand-orange text-white shadow-soft'
                : 'bg-white text-muted hover:text-ink border border-ink/10 hover:border-brand-orange/30'
                }`}
            >
              {f}
            </button>
          ))}
        </Reveal>

        {/* Grid: 1 col mobile → 2 tablet → 3 laptop → 4 desktop */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems
            .filter((m) => activeFilter === 'All' || m.tag === activeFilter)
            .map((item, i) => (
              <Reveal key={item.name} delay={i * 60}>
                <div className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-ink/5 hover:shadow-card transition-all duration-500 hover:-translate-y-1">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {item.tag && (
                      <span className="absolute top-3 left-3 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        {item.tag}
                      </span>
                    )}
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-muted hover:text-brand-orange hover:bg-white transition-all shadow-sm">
                      {icons.heart}
                    </button>
                  </div>
                  <div className="p-5">
                    <h4 className="font-display font-bold text-ink">{item.name}</h4>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-brand-orange font-bold text-lg">{item.price}</span>
                      <div className="flex items-center gap-3 text-xs text-muted">
                        <span className="flex items-center gap-1 text-brand-amber font-semibold">
                          {icons.star} {item.rating}
                        </span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                    <button className="mt-4 w-full py-2.5 rounded-xl bg-brand-orangeSoft text-brand-orange text-sm font-semibold hover:bg-brand-orange hover:text-white transition-all duration-300">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════
   TESTIMONIALS
   ════════════════════════════════════════════════════════ */

const testimonials = [
  {
    name: 'Amina Hassan',
    role: 'Food Blogger',
    text: "Yum Fast has completely changed how I order food. The live tracking is addictive — I literally watch the rider the entire way. And the food always arrives hot!",
    rating: 5,
  },
  {
    name: 'Rajesh Kumar',
    role: 'Software Engineer',
    text: "As a developer, I appreciate how smooth this app is. No lag, no crashes, just buttery animations. And the add-to-cart animation? *Chef's kiss.*",
    rating: 5,
  },
  {
    name: 'Sarah Mitchell',
    role: 'Community Representative',
    text: "I love that Yum Fast shows you how much you're saving on each order. That little bit of savings adds up over time!",
    rating: 5,
  },
]

function Testimonials() {
  return (
    <section id="reviews" className="py-20 lg:py-28 bg-gradient-to-b from-cream to-white relative overflow-hidden">
      <div className="absolute inset-0 grain opacity-40" />
      <div className="container-x relative z-10">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="eyebrow"> Reviews</span>
          <h2 className="section-title mt-4">
            Loved by thousands <br className="hidden sm:block" />
            of hungry people
          </h2>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 120}>
              <div className="bg-white rounded-3xl p-7 shadow-sm border border-ink/5 hover:shadow-card transition-all duration-500 h-full flex flex-col">
                <div className="flex gap-1 text-brand-amber">
                  {[...Array(t.rating)].map((_, j) => (
                    <span key={j}>{icons.star}</span>
                  ))}
                </div>
                <p className="mt-4 text-muted leading-relaxed flex-grow text-sm">
                  "{t.text}"
                </p>
                <div className="mt-6 flex items-center gap-3 pt-5 border-t border-ink/5">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-orange to-brand-amber flex items-center justify-center text-white font-display font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════
   STATS
   ════════════════════════════════════════════════════════ */

function StatCard({ value, suffix, label }) {
  const { count, ref } = useCounter(parseInt(value))
  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl sm:text-5xl font-display font-extrabold text-brand-orange">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="mt-2 text-muted font-medium text-sm">{label}</p>
    </div>
  )
}

function Stats() {
  return (
    <section className="py-16 lg:py-20 border-y border-ink/5">
      <div className="container-x">
        <Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <StatCard value="500" suffix="+" label="Restaurant Partners" />
            <StatCard value="50" suffix="K+" label="Happy Customers" />
            <StatCard value="25" suffix=" min" label="Avg. Delivery Time" />
            <StatCard value="4" suffix=".9 ★" label="App Store Rating" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════
   DOWNLOAD CTA
   ════════════════════════════════════════════════════════ */

function DownloadCTA() {
  return (
    <section id="download" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="container-x relative z-10">
        <div className="relative bg-gradient-to-br from-brand-orange to-brand-orangeDark rounded-[2rem] lg:rounded-[3rem] p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-black/5 translate-y-1/2 -translate-x-1/3" />
          <div className="absolute inset-0 grain opacity-20" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white leading-tight">
                Ready to satisfy <br />your cravings?
              </h2>
              <p className="mt-5 text-white/80 text-lg leading-relaxed max-w-md">
                Download Yum Fast now and get <span className="font-bold text-brand-amber">50% off</span> your
                first order. Your favorite food is just a tap away.
              </p>

              {/* Store buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#"
                  id="download-ios"
                  className="flex items-center gap-3 bg-white text-ink rounded-2xl px-6 py-3.5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
                >
                  <span className="text-ink group-hover:text-brand-orange transition-colors">{icons.apple}</span>
                  <div>
                    <p className="text-[10px] text-muted leading-none">Download on the</p>
                    <p className="text-sm font-bold leading-tight mt-0.5">App Store</p>
                  </div>
                </a>
                <a
                  href="#"
                  id="download-android"
                  className="flex items-center gap-3 bg-white/10 backdrop-blur text-white rounded-2xl px-6 py-3.5 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5 group"
                >
                  <span>{icons.playStore}</span>
                  <div>
                    <p className="text-[10px] text-white/60 leading-none">Get it on</p>
                    <p className="text-sm font-bold leading-tight mt-0.5">Google Play</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="hidden lg:flex justify-center">
              <div className="relative -mb-28">
                <div className="absolute -inset-8 bg-white/10 rounded-full blur-3xl" />
                <div className="relative w-[260px] rounded-[2.2rem] overflow-hidden shadow-2xl border-[5px] border-white/20">
                  <img
                    src="https://res.cloudinary.com/ui7ywkah/image/upload/v1784876430/yumfast/screens/ok1r8em4hrh8bahgitdm.png"
                    alt="Yum Fast app"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════════════════════ */

function Footer() {
  return (
    <footer className="bg-ink text-white/60 pt-16 pb-8">
      <div className="container-x">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center">
                <span className="text-white font-display font-bold text-lg">Z</span>
              </div>
              <span className="font-display font-bold text-xl text-white">Yum Fast</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed max-w-xs">
              Your favorite meals, delivered fast. Live tracking, great restaurants,
              and a checkout that just works.
            </p>
            {/* Social links */}
            <div className="mt-6 flex gap-3">
              {['Twitter', 'Instagram', 'LinkedIn', 'YouTube'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:bg-brand-orange hover:text-white transition-all duration-300 text-xs font-bold"
                  aria-label={s}
                >
                  {s.charAt(0)}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: 'Product',
              links: ['Features', 'How It Works', 'Pricing', 'FAQ'],
            },
            {
              title: 'Company',
              links: ['About Us', 'Careers', 'Blog', 'Press Kit'],
            },
            {
              title: 'Support',
              links: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm hover:text-brand-orange transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            © {new Date().getFullYear()} Yum Fast. All rights reserved.
          </p>
          <p className="text-xs">
            Made with <span className="text-brand-orange">♥</span> for food lovers everywhere
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ════════════════════════════════════════════════════════
   APP ROOT
   ════════════════════════════════════════════════════════ */

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <LogoMarquee />
      <Features />
      <HowItWorks />
      <AppShowcase />
      <MenuPreview />
      <Testimonials />
      <Stats />
      <DownloadCTA />
      <Footer />
    </>
  )
}
