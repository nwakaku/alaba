import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Link from "@/shims/next-link";
import Image from "@/shims/image";

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
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left" data-aos="fade-right">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            One‑Stop Access to DeFi with AI
          </h1>
          <p className="mt-5 text-white/80 text-base md:text-lg">
            Alaba turns your goals into a personalized, cross‑chain yield portfolio.
            Chat, customize, and take action with clarity and confidence.
          </p>
          <div className="mt-8 flex items-center md:justify-start justify-center gap-3">
            <Link href="/chat" className="bg-[#5FECF9] text-black px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
              Launch App <ArrowRight size={16} />
            </Link>
            <a href="#features" className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors">
              Learn more
            </a>
          </div>
        </div>
        <div className="hidden md:block" data-aos="fade-left">
          <div className="relative h-72 rounded-3xl bg-gradient-to-tr from-purple-700/30 via-blue-500/20 to-cyan-400/20 border border-border overflow-hidden">
            <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 30% 20%, #ffffff33, transparent 40%), radial-gradient(circle at 70% 60%, #ffffff22, transparent 45%)" }} />
            <div className="absolute bottom-6 left-6 right-6 backdrop-blur-xl bg-foreground/5 rounded-xl border border-border p-4">
              <div className="text-sm opacity-80">AI Portfolio Preview</div>
              <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                {[{n:"AAVE",p:20},{n:"HBARX",p:30},{n:"FLOW",p:20},{n:"Stader",p:30}].map((x)=> (
                  <div key={x.n} className="bg-foreground/10 rounded-md p-2 text-center">
                    <div className="font-semibold">{x.n}</div>
                    <div className="opacity-70">{x.p}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 pb-14" data-aos="fade-up">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "chains supported", value: "10+" },
            { label: "integrations", value: "25+" },
            { label: "users", value: "18k+" },
            { label: "strategies tested", value: "115+" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-foreground/5 border border-border p-5 text-center">
              <div className="text-2xl font-extrabold">{s.value}</div>
              <div className="opacity-70 text-xs uppercase tracking-wide mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features / Products */}
      <section id="features" className="max-w-6xl mx-auto px-6 pb-16" data-aos="fade-up">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-center">Alaba Capabilities</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Intent Understanding",
              desc: "Explain your goals; Alaba translates them into portfolio actions and constraints.",
            },
            {
              title: "Smart Portfolio Builder",
              desc: "Auto‑construct diversified allocations across vetted protocols and chains.",
            },
            {
              title: "Explainable Insights",
              desc: "Clear rationale behind allocations with APY, TVL, risk and trade‑offs.",
            },
          ].map((card) => (
            <div key={card.title} className="p-6 rounded-2xl bg-foreground/[0.06] border border-border">
              <div className="text-lg font-semibold mb-2">{card.title}</div>
              <div className="opacity-70 text-sm">{card.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Chains row */}
      <section className="max-w-6xl mx-auto px-6 pb-16 text-center" data-aos="zoom-in">
        <div className="text-xl font-extrabold mb-4">Optimize Across Multiple Networks</div>
        <div className="flex flex-wrap gap-4 justify-center items-center opacity-90">
          {["296","295","747"].map((id) => (
            <div key={id} className="flex items-center gap-2 border border-border rounded-xl px-4 py-2 bg-foreground/5">
              <Image src={`/crypto-icons/chains/${id}.svg`} alt={`chain-${id}`} width={20} height={20} />
              <span className="text-sm">Chain {id}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Wallet + Portfolio teaser */}
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-6 pb-16">
        <div className="rounded-2xl bg-foreground/5 border border-border p-6" data-aos="fade-right">
          <div className="text-xl font-bold mb-2">Wallet‑Ready</div>
          <p className="opacity-70 text-sm mb-4">Connect your wallet to personalize strategies, view assets and act with one flow.</p>
          <Link href="/profile" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-semibold">
            View Profile
          </Link>
        </div>
        <div className="rounded-2xl bg-foreground/5 border border-border p-6" data-aos="fade-left">
          <div className="text-xl font-bold mb-2">Portfolio Preview</div>
          <p className="opacity-70 text-sm mb-4">Diversified allocations with adjustable percentages and risk visibility.</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[{n:"Bonzo Finance",v:30,c:"#4A64DC"},{n:"AAVE Lending",v:20,c:"#5FECF9"},{n:"Stable Kitty",v:20,c:"#9B8AFB"},{n:"Stader",v:30,c:"#3B82F6"}].map((x)=> (
              <div key={x.n} className="rounded-lg p-3 border border-border" style={{backgroundColor: `${x.c}22`}}>
                <div className="font-medium">{x.n}</div>
                <div className="opacity-70">{x.v}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Build section */}
      <section className="max-w-6xl mx-auto px-6 pb-16 text-center" data-aos="fade-up">
        <div className="text-2xl md:text-3xl font-extrabold mb-4">Build Your Web3 Strategy With Alaba</div>
        <p className="text-white/70 max-w-2xl mx-auto mb-6 text-sm md:text-base">
          From intent to execution, Alaba assists with research, allocation, and on‑chain readiness.
        </p>
        <Link href="/chat" className="inline-flex items-center gap-2 bg-[#5FECF9] text-black px-6 py-3 rounded-xl font-semibold">
          Start in Chat <ArrowRight size={16} />
        </Link>
      </section>

      {/* Partners - Carousel */}
      <section className="max-w-6xl mx-auto px-6 pb-16" data-aos="fade-up">
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
      <section className="max-w-6xl mx-auto px-6 pb-16" data-aos="fade-up">
        <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-400/10 border border-border">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="text-xl font-bold mb-2">Securing Compliance in DeFi</div>
              <p className="opacity-80 text-sm">Risk‑aware strategies and transparent explanations help you act responsibly in DeFi.</p>
            </div>
            <div className="flex md:justify-end">
              <Link href="/chat" className="inline-flex items-center gap-2 bg-white text-black px-5 py-3 rounded-xl font-semibold">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 pb-10">
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


