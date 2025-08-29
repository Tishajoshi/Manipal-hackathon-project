import React, { useState, useEffect, Suspense } from "react";
import homepageBg from "../assets/homepage[2].png";
import Particles from "../components/Particles";
import Feature from "./Feature";
import Dashboard from "./Dashboard";
import About from "./About";
import { useLocation } from "react-router-dom";
import bot2 from "../assets/bot2.png";

export default function Home() {
  const location = useLocation();
  const [active, setActive] = React.useState("home");

  const smoothScrollTo = (targetY, duration = 900) => {
    const startY = window.scrollY || window.pageYOffset;
    const diff = targetY - startY;
    let start = null;
    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = (ts) => {
      if (start === null) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      const eased = easeInOutCubic(t);
      window.scrollTo(0, startY + diff * eased);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navOffset = 64; // fixed navbar height
    const y = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
    smoothScrollTo(y);
  };

  const scrollToFeature = () => scrollToId("feature");

  // On navigation: scroll to requested section if provided via state; otherwise always reset to top
  React.useEffect(() => {
    const st = location.state?.scrollTo;
    if (st) {
      setTimeout(() => scrollToId(st), 0);
    } else {
      setTimeout(() => window.scrollTo(0, 0), 0);
    }
  }, [location.key]);

  React.useEffect(() => {
    const ids = ["home", "feature", "dashboard", "about"]; 
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.6 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden pt-16">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${homepageBg})`, filter: "blur(6px)" }}
      />
      <div className="absolute inset-0 -z-10 bg-black/50 backdrop-blur-sm" />
      <Particles density={0.00012} speed={0.2} />

      {/* Active glow for home */}
      <span className={`pointer-events-none absolute inset-0 -z-10 blur-3xl transition-opacity duration-500 ${active === 'home' ? 'opacity-40' : 'opacity-0'} bg-gradient-to-r from-indigo-500/40 via-fuchsia-500/40 to-pink-500/40`} />

      <section id="home" className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-5xl mx-auto text-center">
          <h1 className="font-extrabold tracking-tight text-white leading-tight text-[clamp(2rem,4.5vw,4rem)]">
            From Confusion to Clarity with
            <span className="ml-3 bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-pink-300 text-transparent bg-clip-text drop-shadow">
              PolicyPro
            </span>
          </h1>
          <p className="mt-3 text-gray-200 text-sm sm:text-base md:text-lg">
            Instantly turn policy confusion into clear answers. Just type your insurance question — PolicyPro handles the rest.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="inline-block mx-auto bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 p-[2px] rounded-2xl group">
              <div className="relative rounded-2xl overflow-hidden bg-black/40 w-[92vw] sm:w-[85vw] md:w-[75vw] lg:w-[56rem] aspect-[16/9] max-h-[42vh] md:max-h-[45vh]">
                <img src={homepageBg} alt="Policy illustration" className="w-full h-full object-cover" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bot2})`, filter: "brightness(0.25) saturate(1.1)" }} />
                  <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 100%)" }} />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-col items-center">
            <div className="relative group inline-flex">
              <button
                onClick={scrollToFeature}
                className="relative z-10 px-10 py-3 rounded-full text-white text-lg md:text-xl font-extrabold tracking-wide bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 drop-shadow-[0_0_10px_rgba(0,0,0,0.7)]"
                style={{ fontFamily: "'Century Gothic', 'Futura', 'Arial', sans-serif" }}
              >
                Get Start
              </button>
              <span className="pointer-events-none absolute -inset-3 rounded-full bg-gradient-to-r from-indigo-500/30 via-fuchsia-500/30 to-pink-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </div>
      </section>

      <Feature withBackground={false} active={active === 'feature'} />
      <section id="dashboard" className="relative z-10">
        <Dashboard withBackground={false} compact={true} />
      </section>

      {/* Shift About lower */}
      <div className="mt-24 md:mt-32">
        <About withBackground={false} active={active === 'about'} />
      </div>
    </div>
  );
}
