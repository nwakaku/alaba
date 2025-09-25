import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "@/shims/next-link";
import Image from "@/shims/image";

// CountUp Animation Component
const CountUpAnimation = ({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`countup-${end}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [end, isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    setIsAnimating(true);
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span 
      id={`countup-${end}`} 
      className={`text-2xl font-extrabold transition-all duration-300 ${
        isAnimating ? 'text-accent scale-110' : 'text-accent'
      }`}
    >
      {count}{suffix}
    </span>
  );
};

export default function Landing() {
  useEffect(() => {
    // @ts-ignore
    if (typeof window !== "undefined" && (window as any).AOS) {
      // @ts-ignore
      (window as any).AOS.init({ duration: 800, once: true, offset: 80 });
    }
  }, []);

  return (
    <div className="min-h-[calc(100vh-101px)] bg-background text-foreground">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-16 sm:pt-20 pb-8 sm:pb-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
        <div className="text-center md:text-left" data-aos="fade-right">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
            One‑Stop Access to DeFi with AI
          </h1>
          <p className="mt-4 sm:mt-5 text-foreground/80 text-sm sm:text-base md:text-lg">
            Alaba turns your goals into a personalized, cross‑chain yield portfolio.
            Chat, customize, and take action with clarity and confidence.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center md:justify-start justify-center gap-3">
            <Link href="/chat" className="bg-accent text-accent-foreground px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-accent/90 transition-colors text-sm sm:text-base">
              Launch App <ArrowRight size={16} />
            </Link>
            <a href="#features" className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-border hover:bg-muted transition-colors text-sm sm:text-base">
              Learn more
            </a>
          </div>
        </div>
        <div className="hidden md:block" data-aos="fade-left">
          <div className="relative h-72 rounded-3xl bg-gradient-to-tr from-accent/20 via-accent/10 to-accent/5 border border-border overflow-hidden">
            <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 30% 20%, var(--accent)33, transparent 40%), radial-gradient(circle at 70% 60%, var(--accent)22, transparent 45%)" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Image 
                src="/crypto-icons/ETH.png" 
                alt="DeFi Portfolio" 
                width={120} 
                height={120} 
                className="opacity-60"
              />
            </div>
            <div className="absolute bottom-6 left-6 right-6 backdrop-blur-xl bg-card/80 rounded-xl border border-border p-4">
              <div className="text-sm text-foreground/80">AI Portfolio Preview</div>
              <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                {[{n:"AAVE",p:20},{n:"HBARX",p:30},{n:"FLOW",p:20},{n:"Stader",p:30}].map((x)=> (
                  <div key={x.n} className="bg-muted rounded-md p-2 text-center">
                    <div className="font-semibold text-foreground">{x.n}</div>
                    <div className="text-muted-foreground">{x.p}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-10 sm:pb-14" data-aos="fade-up">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "chains supported", value: 10, suffix: "+" },
            { label: "integrations", value: 25, suffix: "+" },
            { label: "users", value: 18, suffix: "k+" },
            { label: "strategies tested", value: 115, suffix: "+" },
          ].map((s) => (
            <div key={s.label} className="group rounded-2xl bg-card/50 border border-border p-4 sm:p-5 text-center hover:bg-card/70 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/10">
              <div className="relative">
                <div className="text-xl sm:text-2xl font-extrabold text-accent group-hover:text-accent/90">
                  <CountUpAnimation end={s.value} suffix={s.suffix} duration={2500} />
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent/60 rounded-full animate-pulse"></div>
              </div>
              <div className="text-muted-foreground text-xs uppercase tracking-wide mt-1 group-hover:text-foreground/70 transition-colors">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features / Products */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-8 pb-12 sm:pb-16" data-aos="fade-up">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-4 sm:mb-6 text-center">Alaba Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              title: "Intent Understanding",
              desc: "Explain your goals; Alaba translates them into portfolio actions and constraints.",
              icon: "/crypto-icons/UNISWAP.png"
            },
            {
              title: "Smart Portfolio Builder",
              desc: "Auto‑construct diversified allocations across vetted protocols and chains.",
              icon: "/crypto-icons/USDC.png"
            },
            {
              title: "Explainable Insights",
              desc: "Clear rationale behind allocations with APY, TVL, risk and trade‑offs.",
              icon: "/crypto-icons/ARB.png"
            },
          ].map((card) => (
            <div key={card.title} className="p-4 sm:p-6 rounded-2xl bg-card/50 border border-border hover:bg-card/70 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <Image src={card.icon} alt={card.title} width={32} height={32} className="w-8 h-8" />
                <div className="text-base sm:text-lg font-semibold">{card.title}</div>
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">{card.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Chains row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-12 sm:pb-16 text-center" data-aos="zoom-in">
        <div className="text-lg sm:text-xl font-extrabold mb-4">Optimize Across Multiple Networks</div>
        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center items-center opacity-90">
          {["296","295","747"].map((id) => (
            <div key={id} className="flex items-center gap-2 border border-border rounded-xl px-4 py-2 bg-foreground/5">
              <Image src={`/crypto-icons/chains/${id}.svg`} alt={`chain-${id}`} width={20} height={20} />
              <span className="text-sm">Chain {id}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Wallet + Portfolio teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pb-12 sm:pb-16">
        <div className="rounded-2xl bg-card/50 border border-border p-4 sm:p-6 hover:bg-card/70 transition-colors" data-aos="fade-right">
          <div className="flex items-center gap-3 mb-3">
            <Image src="/crypto-icons/chains/296.svg" alt="Wallet" width={32} height={32} className="w-8 h-8" />
            <div className="text-lg sm:text-xl font-bold">Wallet‑Ready</div>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm mb-4">Connect your wallet to personalize strategies, view assets and act with one flow.</p>
          <Link href="/profile" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors">
            View Profile
          </Link>
        </div>
        <div className="rounded-2xl bg-card/50 border border-border p-4 sm:p-6 hover:bg-card/70 transition-colors" data-aos="fade-left">
          <div className="flex items-center gap-3 mb-3">
            <Image src="/crypto-icons/USDT.png" alt="Portfolio" width={32} height={32} className="w-8 h-8" />
            <div className="text-lg sm:text-xl font-bold">Portfolio Preview</div>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm mb-4">Diversified allocations with adjustable percentages and risk visibility.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
            {[{n:"Bonzo Finance",v:30,c:"var(--accent)"},{n:"AAVE Lending",v:20,c:"var(--chart-2)"},{n:"Stable Kitty",v:20,c:"var(--chart-3)"},{n:"Stader",v:30,c:"var(--chart-4)"}].map((x)=> (
              <div key={x.n} className="rounded-lg p-2 sm:p-3 border border-border bg-muted/50" style={{borderLeftColor: x.c, borderLeftWidth: '3px'}}>
                <div className="font-medium text-foreground">{x.n}</div>
                <div className="text-muted-foreground">{x.v}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Build section */}
      <section className="max-w-7xl mx-auto px-8 pb-16 text-center" data-aos="fade-up">
        <div className="text-2xl md:text-3xl font-extrabold mb-4">Build Your Web3 Strategy With Alaba</div>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6 text-sm md:text-base">
          From intent to execution, Alaba assists with research, allocation, and on‑chain readiness.
        </p>
        <div className="flex items-center justify-center gap-4 mb-6">
          <Image src="/crypto-icons/MATIC.png" alt="Polygon" width={40} height={40} className="w-10 h-10 opacity-60" />
          <Image src="/crypto-icons/BASE.png" alt="Base" width={40} height={40} className="w-10 h-10 opacity-60" />
          <Image src="/crypto-icons/ARB.png" alt="Arbitrum" width={40} height={40} className="w-10 h-10 opacity-60" />
        </div>
        <Link href="/chat" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-xl font-semibold hover:bg-accent/90 transition-colors">
          Start in Chat <ArrowRight size={16} />
        </Link>
      </section>

      {/* Partners - Carousel */}
      <section className="max-w-7xl mx-auto px-8 pb-16" data-aos="fade-up">
        <div className="text-xl font-extrabold mb-6 text-center">Partners & Stakeholders</div>
        <div className="relative overflow-hidden">
          <div className="flex items-center gap-6 animate-[scroll_20s_linear_infinite] will-change-transform">
            {new Array(2).fill(0).flatMap((_,i)=>[
              "Aave","Hedera","Flow","Base","Polygon","WalletConnect","Coinbase","MetaMask","Uniswap","Chainlink"
            ].map((p,idx)=>(
              <div key={`${i}-${idx}`} className="h-12 w-40 rounded-xl border border-border bg-foreground/5 flex items-center justify-center opacity-80 text-sm shrink-0">
                {p}
              </div>
            )))}
          </div>
        </div>
        <style>{`@keyframes scroll {from{transform: translateX(0)} to{transform: translateX(-50%)} }`}</style>
      </section>

      {/* Compliance banner */}
      <section className="max-w-7xl mx-auto px-8 pb-16" data-aos="fade-up">
        <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 border border-border">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Image src="/crypto-icons/chains/11155111.svg" alt="Security" width={32} height={32} className="w-8 h-8" />
                <div className="text-xl font-bold">Securing Compliance in DeFi</div>
              </div>
              <p className="text-muted-foreground text-sm">Risk‑aware strategies and transparent explanations help you act responsibly in DeFi.</p>
            </div>
            <div className="flex md:justify-end">
              <Link href="/chat" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-3 rounded-xl font-semibold hover:bg-accent/90 transition-colors">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-8 pb-10">
        <div className="grid md:grid-cols-4 gap-6 text-sm opacity-70">
          <div>
            <div className="font-semibold mb-2">Protocols</div>
            <ul className="space-y-1">
              <li>Yield</li>
              <li>Staking</li>
              <li>Bridging</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Support</div>
            <ul className="space-y-1">
              <li>Docs</li>
              <li>Contact</li>
              <li>Status</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Developers</div>
            <ul className="space-y-1">
              <li>API</li>
              <li>Guides</li>
              <li>Changelog</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Subscribe</div>
            <div className="text-xs">Get the latest news and updates.</div>
          </div>
        </div>
        <div className="mt-6 text-xs opacity-50">© {new Date().getFullYear()} Alaba. All rights reserved.</div>
      </footer>
    </div>
  );
}


