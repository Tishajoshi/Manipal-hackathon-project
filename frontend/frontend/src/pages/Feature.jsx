import React from "react";
import homepageBg from "../assets/homepage[2].png";
import bot1 from "../assets/bot1.png";

export default function Feature({ withBackground = true, active = false }) {
  const features = [
    {
      title: "Instant Claim Eligibility Check",
      desc:
        "Uses Large Language Models (LLMs) to understand natural-language queries about your insurance. You simply type your question, and PolicyPro instantly analyzes your policy details to tell you if your claim is eligible — no more manual reading of fine print.",
    },
    {
      title: "AI-Powered Decision Explanations",
      desc:
        "Provides clear, step-by-step reasoning for every decision it gives — so you not only get an answer, but also understand why it’s correct, reducing uncertainty and mistrust.",
    },
    {
      title: "Multi-Policy Support",
      desc:
        "Specially designed to handle multiple insurance types (health, auto, life, travel, etc.) in a single platform. You can switch contexts easily without losing your chat history or data.",
    },
    {
      title: "Smart Policy Document Parsing",
      desc:
        "Uploads your insurance PDF, scans it, and extracts relevant terms using AI-driven text parsing. This makes it possible to answer complex ‘hidden clause’ questions instantly without you searching page-by-page.",
    },
    {
      title: "Mobile-Optimized, Responsive Interface",
      desc:
        "Crafted with modern, adaptive UI design so it works seamlessly on phones, tablets, and desktops — with smooth animations, interactive hover effects, and fast load speeds.",
    },
    {
      title: "Privacy-First AI Architecture",
      desc:
        "Your uploaded documents and queries are encrypted end-to-end. No data is stored without permission. AI processing is handled in a secure, isolated environment, ensuring your sensitive policy details remain private.",
    },
  ];

  // SIM card-like shape (top-right corner cut) with gentle rounding
  const simClip = "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)";
  const simRadius = 14; // little rounded border

  return (
    <section id="feature" className="relative min-h-[calc(100vh-4rem)] text-white px-6 py-20">
      {/* Optional shared background and overlay */}
      {withBackground && (
        <>
          <div
            className="absolute inset-0 -z-10 bg-cover bg-center"
            style={{ backgroundImage: `url(${homepageBg})`, filter: "blur(6px)" }}
          />
          <div className="absolute inset-0 -z-10 bg-black/50 backdrop-blur-sm" />
        </>
      )}

      {/* Active section glow */}
      <span className={`pointer-events-none absolute inset-0 -z-10 blur-3xl transition-opacity duration-500 ${active ? 'opacity-40' : 'opacity-0'} bg-gradient-to-r from-indigo-500/40 via-fuchsia-500/40 to-pink-500/40`} />

      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-pink-300 text-transparent bg-clip-text">
            Features
          </span>
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-[1.01]"
              style={{ clipPath: simClip, borderRadius: simRadius }}
            >
              {/* Gradient border wrapper */}
              <div
                className="p-[2px] bg-gradient-to-r from-white/10 to-white/10 group-hover:from-indigo-500 group-hover:via-fuchsia-500 group-hover:to-pink-500 transition-[background] duration-500 overflow-hidden"
                style={{ clipPath: simClip, borderRadius: simRadius }}
              >
                {/* Inner card */}
                <div
                  className="relative h-full w-full bg-white/5 border border-white/10 px-6 py-5 backdrop-blur-none group-hover:backdrop-blur-sm overflow-hidden"
                  style={{ clipPath: simClip, borderRadius: simRadius }}
                >
                  {/* Hover-only background image with dark filter and vignette */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ clipPath: simClip, borderRadius: simRadius }}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${bot1})`, filter: "brightness(0.25) saturate(1.1)" }}
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 100%)",
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="relative">
                      {/* Default gradient heading */}
                      <div className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-pink-300 text-transparent bg-clip-text transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                        {f.title}
                      </div>
                      {/* Hover bright white heading */}
                      <div className="pointer-events-none absolute top-0 left-0 w-full text-xl md:text-2xl font-semibold text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)] transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                        {f.title}
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                      {f.desc}
                    </div>
                  </div>
                </div>
              </div>
              {/* Glow on hover */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-20 blur-xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 transition-opacity duration-500" style={{ clipPath: simClip, borderRadius: simRadius }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
