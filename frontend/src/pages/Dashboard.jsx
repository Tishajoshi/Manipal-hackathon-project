import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import homepageBg from "../assets/homepage[2].png";
import Particles from "../components/Particles";

const DOC_OPTIONS = [
  { value: "d1.pdf", label: "Bajaj Allianz Policy" },
  { value: "d2.pdf", label: "HDFC ERGO Policy" },
  { value: "d3.pdf", label: "ICICI Lombard Policy" },
  { value: "d4.pdf", label: "Tata AIG Policy" },
  { value: "d5.pdf", label: "Reliance General Policy" },
];

export default function Dashboard({ withBackground = true, compact = false }) {
  const { user } = useUser();
  const [query, setQuery] = useState("");
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [messages, setMessages] = useState([]); // {role:'user'|'assistant', content:string}
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyLimit, setHistoryLimit] = useState(20);
  const [lastHistoryCount, setLastHistoryCount] = useState(0);
  const barRef = useRef(null);
  const chatRef = useRef(null);

  const togglePicker = () => setPickerOpen((o) => !o);

  const toggleDoc = (value) => {
    setSelectedDocs((prev) => {
      const exists = prev.includes(value);
      return (exists ? prev.filter((v) => v !== value) : [...prev, value]).slice(0, 5);
    });
  };

  const scrollChatToBottom = () => {
    requestAnimationFrame(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setPickerOpen(false);

    // Push user message
    setMessages((m) => [...m, { role: "user", content: trimmed }]);
    setQuery("");
    setLoading(true);
    scrollChatToBottom();

    // Build backend query context
    const docLabel = selectedDocs
      .map((v) => DOC_OPTIONS.find((o) => o.value === v)?.label || v)
      .join(", ");
    const fullQuery = selectedDocs.length
      ? `Documents: ${docLabel}\nQuestion: ${trimmed}`
      : trimmed;

    try {
      const res = await axios.post(
        "/run",
        {
          query: fullQuery,
          user_id: user?.id || null,
          user_email: user?.primaryEmailAddress?.emailAddress || null,
        },
        { timeout: 15000 }
      );
      const { decision, amount, justification } = res.data || {};
      const parts = [];
      if (decision) parts.push(`Decision: ${decision}`);
      if (amount) parts.push(`Amount: ${amount}`);
      if (justification) parts.push(`Justification: ${justification}`);
      const assistantText = parts.join("\n\n") || "No answer available.";
      setMessages((m) => [...m, { role: "assistant", content: assistantText }]);
      scrollChatToBottom();
    } catch (err) {
      const isTimeout = err?.code === "ECONNABORTED";
      const msg = isTimeout
        ? "The request timed out. Please try again."
        : "Sorry, something went wrong while fetching the answer.";
      setMessages((m) => [...m, { role: "assistant", content: msg }]);
      scrollChatToBottom();
    } finally {
      setLoading(false);
    }
  };

  // --- History loading into chat ---
  useEffect(() => {
    const loadInitialHistory = async () => {
      if (!user?.id) return;
      try {
        setLoadingHistory(true);
        const res = await axios.get(`/history/${encodeURIComponent(user.id)}`, {
          params: { limit: historyLimit },
          timeout: 15000,
        });
        const items = res.data?.items || [];
        const chronological = [...items].reverse();
        const historyMessages = [];
        chronological.forEach((it) => {
          historyMessages.push({ role: "user", content: it.query || "" });
          const parts = [];
          if (it.decision) parts.push(`Decision: ${it.decision}`);
          if (it.amount) parts.push(`Amount: ${it.amount}`);
          if (it.justification) parts.push(`Justification: ${it.justification}`);
          historyMessages.push({ role: "assistant", content: parts.join("\n\n") || "No answer available." });
        });
        setMessages(historyMessages);
        setLastHistoryCount(items.length);
        // After setting, scroll to bottom to see latest
        requestAnimationFrame(() => {
          if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
        });
      } catch (err) {
        // Ignore history load errors silently
      } finally {
        setLoadingHistory(false);
      }
    };
    loadInitialHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Infinite-like loading when scrolled to top: increase limit and refetch
  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    const onScrollTop = async () => {
      if (loading || loadingHistory) return;
      if (el.scrollTop <= 10 && user?.id) {
        try {
          setLoadingHistory(true);
          const nextLimit = historyLimit + 20;
          const res = await axios.get(`/history/${encodeURIComponent(user.id)}`, {
            params: { limit: nextLimit },
            timeout: 15000,
          });
          const items = res.data?.items || [];
          if (items.length > lastHistoryCount) {
            const chronological = [...items].reverse();
            const historyMessages = [];
            chronological.forEach((it) => {
              historyMessages.push({ role: "user", content: it.query || "" });
              const parts = [];
              if (it.decision) parts.push(`Decision: ${it.decision}`);
              if (it.amount) parts.push(`Amount: ${it.amount}`);
              if (it.justification) parts.push(`Justification: ${it.justification}`);
              historyMessages.push({ role: "assistant", content: parts.join("\n\n") || "No answer available." });
            });
            setMessages(historyMessages);
            setHistoryLimit(nextLimit);
            setLastHistoryCount(items.length);
            // Keep near top after loading more
            requestAnimationFrame(() => {
              if (chatRef.current) chatRef.current.scrollTop = 20;
            });
          }
        } catch (err) {
          // ignore
        } finally {
          setLoadingHistory(false);
        }
      }
    };
    el.addEventListener("scroll", onScrollTop);
    return () => el.removeEventListener("scroll", onScrollTop);
  }, [chatRef, user?.id, historyLimit, lastHistoryCount, loading, loadingHistory]);

  useEffect(() => {
    const onClickAway = (e) => {
      if (!barRef.current) return;
      if (!barRef.current.contains(e.target)) setPickerOpen(false);
    };
    document.addEventListener("mousedown", onClickAway);
    return () => document.removeEventListener("mousedown", onClickAway);
  }, []);

  const wrapperClasses = compact
    ? "relative w-full flex flex-col gap-4 justify-between px-4 py-14 min-h[60vh] md:min-h-[calc(100vh-4rem)]"
    : "relative min-h-[calc(100vh-4rem)] flex flex-col gap-4 justify-end px-4 pb-24";

  const chatBoxClasses = compact
    ? "flex-1 min-h-[36vh] md:min-h-[44vh] max-h-[calc(100vh-260px)]"
    : "flex-1 min-h-[50vh] lg:min-h-[60vh] max-h-[calc(100vh-260px)]";

  return (
    <section id="dashboard" className={`relative ${compact ? "" : "min-h-[calc(100vh-4rem)]"} ${withBackground ? "pt-16" : ""}`}>
      {withBackground && (
        <>
          <div
            className="absolute inset-0 -z-10 bg-cover bg-center"
            style={{ backgroundImage: `url(${homepageBg})`, filter: "blur(6px)" }}
          />
          <div className="absolute inset-0 -z-10 bg-black/50" />
          <Particles density={0.00012} speed={0.2} />
        </>
      )}

      <div className={wrapperClasses}>
        {/* Chat output area */}
        <div
          ref={chatRef}
          className={`${chatBoxClasses} w-full mx-auto max-w-3xl overflow-y-auto no-scrollbar rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm p-4 shadow-inner`}
        >
          {messages.length === 0 && (
            <div className="text-center text-white/60 text-sm">Your answers will appear here.</div>
          )}
          <div className="space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`${
                  m.role === "user" ? "self-end text-right" : "self-start text-left"
                }`}
              >
                <div
                  className={`inline-block max-w-full text-sm md:text-base whitespace-pre-wrap rounded-2xl px-4 py-3 border ${
                    m.role === "user"
                      ? "bg-white/10 border-white/20"
                      : "bg-gradient-to-r from-indigo-900/40 to-fuchsia-900/30 border-white/10"
                  } text-white/90`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-white/70 text-sm">Thinking…</div>}
          </div>
        </div>

        {/* Search Bar */}
        <div ref={barRef} className="w-[92vw] sm:w-[84vw] md:w-[76vw] lg:w-[880px] xl:w-[1080px] mx-auto mb-20 md:mb-28">
          {selectedDocs.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2 text-xs text-white/80">
              {selectedDocs.map((value) => {
                const opt = DOC_OPTIONS.find((o) => o.value === value);
                return (
                  <span key={value} className="rounded-full bg-white/10 px-2 py-1 border border-white/20">
                    {opt?.label || value}
                  </span>
                );
              })}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="relative flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl px-3 py-2 shadow-xl ring-1 ring-white/10"
          >
            <button
              type="button"
              onClick={() => setPickerOpen((o) => !o)}
              className="shrink-0 inline-flex items-center justify-center h-11 w-11 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Choose PDFs"
              title="Choose PDFs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828a4 4 0 10-5.656-5.656L5.757 10.76" />
              </svg>
            </button>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
              placeholder="Ask about your policy…"
              className="flex-1 min-w-0 bg-transparent text-white/95 placeholder-white/60 focus:outline-none text-base sm:text-lg py-3 px-2"
            />

            <button
              type="submit"
              className="shrink-0 inline-flex items-center gap-2 h-11 px-4 rounded-xl text-white bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.94 17.06a1 1 0 001.06.24l13-5a1 1 0 000-1.86l-13-5A1 1 0 002 6v3.28a1 1 0 00.76.97L11 12l-8.24 1.75A1 1 0 002 14v3a1 1 0 00.94 1.06z"/></svg>
              <span className="hidden sm:inline">Search</span>
            </button>

            {pickerOpen && (
              <div className="absolute left-0 top-[calc(100%+8px)] w-full sm:w-[420px] max-w-[92vw] rounded-2xl border border-white/20 bg-white/10 p-3 shadow-2xl">
                <div className="grid grid-cols-1 gap-2">
                  {DOC_OPTIONS.map((opt) => {
                    const active = selectedDocs.includes(opt.value);
                    return (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => toggleDoc(opt.value)}
                        className={`flex items-center justify-between rounded-xl px-3 py-2 border transition-colors ${
                          active ? "bg-white/20 border-white/40" : "bg-white/5 border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-sm text-white/95 truncate mr-3">{opt.label}</span>
                        <span className={`h-5 w-5 rounded-md border ${active ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 border-transparent" : "border-white/40"}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
