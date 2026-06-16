import { useState, useRef } from "react";
import bgJacoluxe from "@/image/background-jacoluxe.webm";
import bgSage from "@/image/background-sage.webm";
import bgS8 from "@/image/background-s8.webm";
import showcaseJacoluxe from "@/image/showcase-jacoluxe.webm";
import showcaseSageImg from "@/image/preview-sagesocial-hover.gif";
import showcaseS8Img from "@/image/showcase-s8.png";

const showcaseSage = showcaseSageImg.src ?? showcaseSageImg;
const showcaseS8 = showcaseS8Img.src ?? showcaseS8Img;

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "artists" | "studios" | "agencies" | "hospitality";

interface CategoryData {
  title: string;
  desc: string;
  bg: string;
  showcase: string;
  showcaseType: "video" | "image";
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES: Record<Category, CategoryData> = {
  artists: {
    title: "Artist Portfolio",
    desc: "Showcase your creative work with immersive galleries, custom layouts, and a site that feels as unique as your art.",
    bg: bgJacoluxe,
    showcase: showcaseJacoluxe,
    showcaseType: "video",
  },
  studios: {
    title: "Studio Presence",
    desc: "Highlight your team, process, and projects with a dynamic site built to attract the right collaborators and clients.",
    bg: bgS8,
    showcase: showcaseS8,
    showcaseType: "image",
  },
  agencies: {
    title: "Agency Identity",
    desc: "Convert visitors into leads with high-impact landing pages, case studies, and a brand-forward digital experience.",
    bg: bgSage,
    showcase: showcaseSage,
    showcaseType: "image",
  },
  hospitality: {
    title: "Hospitality Brand",
    desc: "Create an atmosphere online that mirrors the warmth and luxury of your space — from menus to reservations.",
    bg: bgJacoluxe,
    showcase: showcaseJacoluxe,
    showcaseType: "video",
  },
};

const CATEGORY_KEYS = Object.keys(CATEGORIES) as Category[];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HeroWordSelector() {
  const [active, setActive] = useState<Category>("artists");
  const videoRef = useRef<HTMLVideoElement>(null);

  const current = CATEGORIES[active];

  return (
    <>
      <section
        className="relative w-full h-screen flex items-center overflow-hidden mt-96"
        style={{ fontFamily: "var(--font-dm-mono), monospace", background: "#0d1f1a" }}
      >
        {/* Background videos — all rendered, active one fades in */}
        {CATEGORY_KEYS.map((key) => (
          <video
            key={key}
            src={CATEGORIES[key].bg}
            muted
            loop
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700"
            style={{ opacity: active === key ? 1 : 0 }}
          />
        ))}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 z-[1]" />

        {/* ── Main content ── */}
        <div className="relative z-10 flex w-full h-full items-center px-[6%] gap-[6%]">

          {/* Left: tagline + word list */}
          <div className="flex-none w-[45%] flex flex-col">
            <p
              className="text-white/85 leading-relaxed mb-8"
              style={{ fontSize: "clamp(13px, 1.4vw, 16px)" }}
            >
              Interactive, customizable<br />websites for
            </p>

            <div className="flex flex-col gap-8">
              {CATEGORY_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`
                    text-left text-white transition-all duration-500 cursor-pointer
                    w-fit leading-tight select-none bg-transparent border-0 p-0
                    ${active === key
                      ? "blur-none opacity-100 translate-x-1.5"
                      : "blur-[5px] opacity-40"}
                  `}
                  style={{
                    fontFamily: '"pf-pixelscript", sans-serif',
                    fontWeight: 100,
                    fontSize: "clamp(38px, 5.5vw, 70px)",
                    filter: active === key ? "blur(0px)" : "blur(4px)",
                  }}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          {/* Right: screen + caption */}
          <div className="flex-1 flex flex-col gap-6">

            {/* Screen container */}
            <div
              className="relative w-full overflow-hidden rounded-[18px]"
              style={{
                maxWidth: 680,
                aspectRatio: "16 / 10",
                boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
              }}
              onMouseEnter={() => { if (current.showcaseType === "video") videoRef.current?.play(); }}
              onMouseLeave={() => {
                if (current.showcaseType === "video" && videoRef.current) {
                  videoRef.current.pause();
                  videoRef.current.currentTime = 0;
                }
              }}
            >
              {current.showcaseType === "video" ? (
                <video
                  key={current.showcase}
                  ref={videoRef}
                  src={current.showcase}
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <img
                  key={current.showcase}
                  src={current.showcase}
                  alt={current.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </div>

            {/* Caption */}
            <div style={{ maxWidth: 680 }}>
              <h2
                className="text-white font-normal mb-1.5"
                style={{ fontSize: "clamp(15px, 1.6vw, 20px)", letterSpacing: "0.02em" }}
              >
                {current.title}
              </h2>
              <p
                className="text-white/55 leading-relaxed mb-4"
                style={{ fontSize: "clamp(11px, 1.1vw, 13px)", letterSpacing: "0.03em" }}
              >
                {current.desc}
              </p>
              <button
                className="inline-flex items-center gap-2 border border-white/30 rounded-full text-white cursor-pointer bg-white/[0.04] hover:bg-white/10 hover:border-white/50 transition-all"
                style={{ padding: "8px 18px", fontSize: 12, letterSpacing: "0.06em" }}
              >
                See Examples ↗
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
