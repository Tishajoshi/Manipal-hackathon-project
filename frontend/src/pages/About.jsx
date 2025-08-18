import React from 'react';
import homepageBg from "../assets/homepage[2].png";

export default function About({ withBackground = true, active = false }) {
  return (
    <section id="about" className="relative min-h-screen text-white px-6 py-20">
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
          <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-pink-300 text-transparent bg-clip-text">About</span>
        </h2>
        <div className="mt-6 inline-block rounded-2xl p-[2px] bg-gradient-to-r from-white/10 to-white/10">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm max-w-4xl">
            <p className="text-gray-200 leading-relaxed">
              PolicyPro helps users turn complex insurance documents into clear, actionable answers. Use this section to share your mission, how the product works, and your contact details.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

