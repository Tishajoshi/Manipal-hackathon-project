import React from 'react';
import homepageBg from "../assets/homepage[2].png";
import bot1 from "../assets/bot1.png";

export default function About({ withBackground = true, active = false }) {
  const simClip = "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)";
  const simRadius = 14;

  const cards = [
    {
      title: "Our Mission",
      desc:
        "We turn policy confusion into clarity. PolicyPro helps you understand eligibility, limits, and conditions instantly — no more scanning PDFs for that one clause.",
    },
    {
      title: "How It Works",
      desc:
        "Upload policy docs, ask a natural-language question, and get AI-backed answers grounded in your document. Relevant clauses are retrieved and summarized for you.",
    },
    {
      title: "Privacy & Security",
      desc:
        "Your queries and policy text are handled securely. History is stored only to improve your experience. You’re always in control of your data.",
    },
    {
      title: "Technology",
      desc:
        "OpenAI/Local embeddings + Pinecone for retrieval, FastAPI backend, and a modern React/Tailwind UI designed for speed and accessibility.",
    },
  ];

  return (
    <section id="about" className="relative min-h-screen text-white px-6 pt-20 pb-10">
      {withBackground && (
        <>
          <div
            className="absolute inset-0 -z-10 bg-cover bg-center"
            style={{ backgroundImage: `url(${homepageBg})`, filter: "blur(6px)" }}
          />
          <div className="absolute inset-0 -z-10 bg-black/50 backdrop-blur-sm" />
        </>
      )}

      <span className={`pointer-events-none absolute inset-0 -z-10 blur-3xl transition-opacity duration-500 ${active ? 'opacity-40' : 'opacity-0'} bg-gradient-to-r from-indigo-500/40 via-fuchsia-500/40 to-pink-500/40`} />

      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-pink-300 text-transparent bg-clip-text">About</span>
        </h2>

        {/* Intro blurb - full width on desktop, styled like CTA */}
        <div className="mt-6 w-full rounded-2xl p-[2px] bg-gradient-to-r from-indigo-500/40 via-fuchsia-500/40 to-pink-500/40">
          <div className="rounded-2xl bg-black/40 border border-white/10 p-5 sm:p-6 lg:p-8 backdrop-blur-sm w-full">
            <p className="text-gray-200 leading-relaxed">
              PolicyPro is an AI assistant for insurance policies. It extracts relevant clauses, answers your questions, and explains the reasoning — so you can make decisions with confidence.
            </p>
          </div>
        </div>

        {/* Card grid matching Feature style */}
        <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.title} className="group relative transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-[1.01]" style={{ clipPath: simClip, borderRadius: simRadius }}>
              <div className="p-[2px] bg-gradient-to-r from-white/10 to-white/10 group-hover:from-indigo-500 group-hover:via-fuchsia-500 group-hover:to-pink-500 transition-[background] duration-500 overflow-hidden" style={{ clipPath: simClip, borderRadius: simRadius }}>
                <div className="relative h-full w-full bg-white/5 border border-white/10 px-6 py-5 overflow-hidden" style={{ clipPath: simClip, borderRadius: simRadius }}>
                  {/* Hover background image with vignette */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ clipPath: simClip, borderRadius: simRadius }}>
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bot1})`, filter: "brightness(0.25) saturate(1.1)" }} />
                    <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 100%)" }} />
                  </div>
                  <div className="relative z-10">
                    <div className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-pink-300 text-transparent bg-clip-text">{c.title}</div>
                    <div className="mt-3 text-sm text-gray-300">{c.desc}</div>
                  </div>
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-20 blur-xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 transition-opacity duration-500" style={{ clipPath: simClip, borderRadius: simRadius }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-pink-300 text-transparent bg-clip-text">Team</h3>
          <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2">
            {/* Krishna card */}
            <div className="group relative transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-[1.01]" style={{ clipPath: simClip, borderRadius: simRadius }}>
              <div className="p-[2px] bg-gradient-to-r from-white/10 to-white/10 group-hover:from-indigo-500 group-hover:via-fuchsia-500 group-hover:to-pink-500 transition-[background] duration-500 overflow-hidden" style={{ clipPath: simClip, borderRadius: simRadius }}>
                <div className="relative h-full w-full bg-white/5 border border-white/10 px-6 py-5 overflow-hidden" style={{ clipPath: simClip, borderRadius: simRadius }}>
                  {/* Hover background */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ clipPath: simClip, borderRadius: simRadius }}>
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bot1})`, filter: "brightness(0.25) saturate(1.1)" }} />
                    <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 100%)" }} />
                  </div>
                  <div className="relative z-10">
                    <div className="text-xl md:text-2xl font-semibold text-white">Krishna</div>
                    <div className="mt-2 text-sm text-gray-300">Founder / Engineer</div>
                    <div className="mt-4 flex items-center gap-3">
                      <a href="https://github.com/KrushnaKakde" target="_blank" rel="noreferrer" className="group inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/10 border border-white/20 transition-all duration-300 hover:shadow-[0_0_18px_rgba(147,51,234,0.55)] hover:scale-110" aria-label="Krishna GitHub">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white/90"><path d="M12 .5a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.57v-2.2c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.24 1.83 1.24 1.07 1.82 2.8 1.29 3.49.99.11-.78.42-1.29.76-1.59-2.66-.3-5.47-1.33-5.47-5.9 0-1.3.47-2.37 1.24-3.21-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.4 11.4 0 016 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.25 2.87.12 3.17.77.84 1.23 1.91 1.23 3.2 0 4.59-2.81 5.6-5.49 5.9.43.37.81 1.1.81 2.22v3.29c0 .31.22.69.83.57A12 12 0 0012 .5z"/></svg>
                      </a>
                      <a href="https://www.linkedin.com/in/krushna-kakde-8b673b326/" target="_blank" rel="noreferrer" className="group inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/10 border border-white/20 transition-all duration-300 hover:shadow-[0_0_18px_rgba(59,130,246,0.55)] hover:scale-110" aria-label="Krishna LinkedIn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white/90"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 5 2.12 5 3.5zM.5 8h4V24h-4V8zm7 0h3.8v2.2h.05c.53-1 1.82-2.2 3.75-2.2 4.01 0 4.75 2.64 4.75 6.08V24h-4v-7.1c0-1.69-.03-3.87-2.36-3.87-2.36 0-2.72 1.84-2.72 3.75V24h-4V8z"/></svg>
                      </a>
                      <a href="https://www.instagram.com/kri8hx?igsh=YThwOGZwbnUyc2tv" target="_blank" rel="noreferrer" className="group inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/10 border border-white/20 transition-all duration-300 hover:shadow-[0_0_18px_rgba(236,72,153,0.55)] hover:scale-110" aria-label="Krishna Instagram">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white/90"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.9.26 2.4.43.6.23 1 .5 1.4.94.44.44.7.83.93 1.43.18.5.38 1.2.44 2.4.07 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.26 1.9-.44 2.4-.23.6-.5 1-.93 1.4-.44.44-.83.7-1.43.93-.5.18-1.2.38-2.4.44-1.3.07-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.9-.26-2.4-.44-.6-.23-1-.5-1.4-.93-.44-.44-.7-.83-.93-1.43-.18-.5-.38-1.2-.44-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.26-1.9.44-2.4.23-.6.5-1 .93-1.4.44-.44.83-.7 1.43-.93.5-.18 1.2-.38 2.4-.44C8.4 2.2 8.8 2.2 12 2.2m0-2.2C8.7 0 8.3 0 7 .07 5.7.13 4.8.34 4 .64 3.2.95 2.5 1.4 1.8 2.1 1.1 2.8.7 3.5.4 4.3c-.3.8-.5 1.7-.6 3C-.1 8.7 0 9.1 0 12s0 3.3.1 4.6c.1 1.3.3 2.2.6 3 .3.8.7 1.5 1.4 2.2.7.7 1.4 1.1 2.2 1.4.8.3 1.7.5 3 .6C8.7 24 9.1 24 12 24s3.3 0 4.6-.1c1.3-.1 2.2-.3 3-.6.8-.3 1.5-.7 2.2-1.4.7-.7 1.1-1.4 1.4-2.2.3-.8.5-1.7.6-3 .1-1.3.1-1.7.1-4.6s0-3.3-.1-4.6c-.1-1.3-.3-2.2-.6-3-.3-.8-.7-1.5-1.4-2.2-.7-.7-1.4-1.1-2.2-1.4-.8-.3-1.7-.5-3-.6C15.3 0 14.9 0 12 0z"/><path d="M12 5.8A6.2 6.2 0 105 12a6.2 6.2 0 007-6.2m0-2.2A8.4 8.4 0 113.6 12 8.4 8.4 0 0112 3.6z"/><circle cx="18.4" cy="5.6" r="1.2"/></svg>
                      </a>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-20 blur-xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 transition-opacity duration-500" style={{ clipPath: simClip, borderRadius: simRadius }} />
                </div>
              </div>
            </div>

            {/* Tisha card with placeholders */}
            <div className="group relative transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-[1.01]" style={{ clipPath: simClip, borderRadius: simRadius }}>
              <div className="p-[2px] bg-gradient-to-r from-white/10 to-white/10 group-hover:from-indigo-500 group-hover:via-fuchsia-500 group-hover:to-pink-500 transition-[background] duration-500 overflow-hidden" style={{ clipPath: simClip, borderRadius: simRadius }}>
                <div className="relative h-full w-full bg-white/5 border border-white/10 px-6 py-5 overflow-hidden" style={{ clipPath: simClip, borderRadius: simRadius }}>
                  {/* Hover background */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ clipPath: simClip, borderRadius: simRadius }}>
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bot1})`, filter: "brightness(0.25) saturate(1.1)" }} />
                    <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 100%)" }} />
                  </div>
                  <div className="relative z-10">
                    <div className="text-xl md:text-2xl font-semibold text-white">Tisha</div>
                    <div className="mt-2 text-sm text-gray-300">Co‑Founder / Designer</div>
                    <div className="mt-4 flex items-center gap-3">
                      <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/5 border border-white/10 text-white/60 cursor-not-allowed" aria-hidden>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 .5a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.57v-2.2c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.24 1.83 1.24 1.07 1.82 2.8 1.29 3.49.99.11-.78.42-1.29.76-1.59-2.66-.3-5.47-1.33-5.47-5.9 0-1.3.47-2.37 1.24-3.21-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.4 11.4 0 016 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.25 2.87.12 3.17.77.84 1.23 1.91 1.23 3.2 0 4.59-2.81 5.6-5.49 5.9.43.37.81 1.1.81 2.22v3.29c0 .31.22.69.83.57A12 12 0 0012 .5z"/></svg>
                      </span>
                      <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/5 border border-white/10 text-white/60 cursor-not-allowed" aria-hidden>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 5 2.12 5 3.5zM.5 8h4V24h-4V8zm7 0h3.8v2.2h.05c.53-1 1.82-2.2 3.75-2.2 4.01 0 4.75 2.64 4.75 6.08V24h-4v-7.1c0-1.69-.03-3.87-2.36-3.87-2.36 0-2.72 1.84-2.72 3.75V24h-4V8z"/></svg>
                      </span>
                      <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/5 border border-white/10 text-white/60 cursor-not-allowed" aria-hidden>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.9.26 2.4.43.6.23 1 .5 1.4.94.44.44.7.83.93 1.43.18.5.38 1.2.44 2.4.07 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.26 1.9-.44 2.4-.23.6-.5 1-.93 1.4-.44.44-.83.7-1.43.93-.5.18-1.2.38-2.4.44-1.3.07-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.9-.26-2.4-.44-.6-.23-1-.5-1.4-.93-.44-.44-.7-.83-.93-1.43-.18-.5-.38-1.2-.44-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.26-1.9.44-2.4.23-.6.5-1 .93-1.4.44-.44.83-.7 1.43-.93.5-.18 1.2-.38 2.4-.44C8.4 2.2 8.8 2.2 12 2.2m0-2.2C8.7 0 8.3 0 7 .07 5.7.13 4.8.34 4 .64 3.2.95 2.5 1.4 1.8 2.1 1.1 2.8.7 3.5.4 4.3c-.3.8-.5 1.7-.6 3C-.1 8.7 0 9.1 0 12s0 3.3.1 4.6c.1 1.3.3 2.2.6 3 .3.8.7 1.5 1.4 2.2.7.7 1.4 1.1 2.2 1.4.8.3 1.7.5 3 .6C8.7 24 9.1 24 12 24s3.3 0 4.6-.1c1.3-.1 2.2-.3 3-.6.8-.3 1.5-.7 2.2-1.4.7-.7 1.1-1.4 1.4-2.2.3-.8.5-1.7.6-3 .1-1.3.1-1.7.1-4.6s0-3.3-.1-4.6c-.1-1.3-.3-2.2-.6-3-.3-.8-.7-1.5-1.4-2.2-.7-.7-1.4-1.1-2.2-1.4-.8-.3-1.7-.5-3-.6C15.3 0 14.9 0 12 0z"/><path d="M12 5.8A6.2 6.2 0 105 12a6.2 6.2 0 007-6.2m0-2.2A8.4 8.4 0 113.6 12 8.4 8.4 0 0112 3.6z"/><circle cx="18.4" cy="5.6" r="1.2"/></svg>
                      </span>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-20 blur-xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 transition-opacity duration-500" style={{ clipPath: simClip, borderRadius: simRadius }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA - wider on desktop */}
        <div className="mt-12 w-full rounded-2xl p-[2px] bg-gradient-to-r from-indigo-500/40 via-fuchsia-500/40 to-pink-500/40">
          <div className="rounded-2xl bg-black/40 border border-white/10 p-6 text-center">
            <div className="text-white/90 font-semibold">Questions or feedback?</div>
            <div className="mt-1 text-white/70 text-sm">Reach out anytime — we’d love to hear from you.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

