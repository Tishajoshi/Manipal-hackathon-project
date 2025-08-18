import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, useUser, UserButton } from "@clerk/clerk-react";
import logojpg from "../assets/logo.jpg";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection(null);
      return;
    }
    const sectionIds = ["home", "feature", "dashboard", "about"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [location.pathname]);

  const desktopNavLinks = [
    { name: "Home", to: "/" },
    { name: "Feature", to: "/feature" },
    { name: "Dashboard", to: "/dashboard" },
    { name: "About", to: "/about" },
  ];

  const mobileItemsSignedOut = [
    { name: "Sign Up", to: "/signup", primary: true },
    { name: "Home", to: "/" },
    { name: "Feature", to: "/feature" },
    { name: "Dashboard", to: "/dashboard" },
    { name: "About", to: "/about" },
  ];

  const sectionByPath = { "/": "home", "/feature": "feature", "/dashboard": "dashboard", "/about": "about" };
  const isActive = (path) => {
    if (location.pathname === "/" && activeSection) {
      return sectionByPath[path] === activeSection;
    }
    return location.pathname === path;
  };

  const smoothScrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navOffset = 64;
    const y = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
    const startY = window.scrollY || window.pageYOffset;
    const diff = y - startY;
    let start = null;
    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = (ts) => {
      if (start === null) start = ts;
      const t = Math.min(1, (ts - start) / 900);
      const eased = easeInOutCubic(t);
      window.scrollTo(0, startY + diff * eased);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const onNavClick = (e, path) => {
    const id = sectionByPath[path];
    if (id) {
      e.preventDefault();
      setMenuOpen(false);
      if (location.pathname === "/") {
        smoothScrollToId(id);
      } else {
        navigate("/", { state: { scrollTo: id } });
      }
    } else {
      setMenuOpen(false);
    }
  };

  return (
    <nav
      className="shadow-md fixed top-0 inset-x-0 z-50"
      style={{
        background: "#10101a",
        fontFamily: "'Century Gothic', 'Futura', 'Arial', sans-serif",
        color: "#fff",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Brand */}
          <div className="flex items-center">
            <div className="w-10 h-10 rounded mr-3 flex items-center justify-center overflow-hidden bg-gray-800">
              <img src={logojpg} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span
              className="text-2xl font-bold tracking-tight"
              style={{
                color: "#fff",
                letterSpacing: "0.04em",
              }}
            >
              PolicyPro
            </span>
          </div>

          {/* Right: Desktop nav (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-4">
            {desktopNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                onClick={(e) => onNavClick(e, link.to)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? "bg-gray-800 text-white"
                    : "text-gray-200 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <SignedOut>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-indigo-800 hover:bg-indigo-700 text-white"
              >
                Sign Up
              </Link>
            </SignedOut>
            <SignedIn>
              <div className="ml-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>

          {/* Right: Hamburger button (mobile only) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen((open) => !open)}
              className="relative inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 ring-1 ring-white/10 shadow-lg backdrop-blur-md transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className={`h-5 w-5 transition-transform duration-300 ${menuOpen ? "rotate-90" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (right 30% with frosted glass, animated) */}
      {/* Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } bg-black/50`}
        onClick={() => setMenuOpen(false)}
      />
      {/* Drawer */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-[30vw] min-w-[260px] max-w-sm z-50 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } bg-slate-900/70 backdrop-blur-lg border-l border-white/10 text-gray-100 shadow-2xl`}
      >
        <div className="px-4 py-5 space-y-4">
          <SignedIn>
            <div className="flex items-center space-x-3">
              <UserButton appearance={{ elements: { userButtonAvatarBox: "w-10 h-10 border border-white/20" } }} afterSignOutUrl="/" />
              <div>
                <div className="text-sm font-semibold">
                  {user?.fullName || user?.primaryEmailAddress?.emailAddress || "User"}
                </div>
                {user?.primaryEmailAddress?.emailAddress && (
                  <div className="text-xs text-gray-300">
                    {user.primaryEmailAddress.emailAddress}
                  </div>
                )}
              </div>
            </div>
            <div className="h-px bg-white/10 my-2" />
            {desktopNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                onClick={(e) => onNavClick(e, link.to)}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? "bg-gray-800 text-white"
                    : "text-gray-200 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </SignedIn>

          <SignedOut>
            {mobileItemsSignedOut.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                onClick={(e) => onNavClick(e, item.to)}
                className={`${
                  item.primary
                    ? "bg-indigo-800 hover:bg-indigo-700 text-white"
                    : isActive(item.to)
                    ? "bg-gray-800 text-white"
                    : "text-gray-200 hover:bg-gray-700 hover:text-white"
                } block px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                {item.name}
              </Link>
            ))}
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
