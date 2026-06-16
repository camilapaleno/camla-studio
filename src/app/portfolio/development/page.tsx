"use client"

import React, { useState } from "react";
import { development } from '@/data/development';
import Project from "@/components/Project";
import AnimatedHeader from "@/components/AnimatedHeader";
import ssBlur from "@/app/assets/screencap/ss-template-blur.jpg";
import ssBright from "@/app/assets/screencap/ss-template-bright.jpg";
import ssCd from "@/app/assets/screencap/ss-template-cd.jpg";
import ssHorizon from "@/app/assets/screencap/ss-template-horizon.jpg";
import ssPerspective from "@/app/assets/screencap/ss-template-perspective.jpg";
import ssPhoto from "@/app/assets/screencap/ss-template-photo.jpg";
import vidBlur from "@/app/assets/video/portfolio-vid-blur.webm";
import vidBright from "@/app/assets/video/portfolio-vid-bright.webm";
import vidCd from "@/app/assets/video/portfolio-vid-cds.webm";
import vidHorizon from "@/app/assets/video/portfolio-vid-horizon.webm";
import vidPerspective from "@/app/assets/video/perspective-vid-horizon.webm";
import vidPhoto from "@/app/assets/video/portfolio-vid-photo.webm";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DevelopmentProject = (typeof development)[number] & { [key: string]: any };

const SECTIONS = ["studios", "custom", "hospitality"] as const;

const SS_TEMPLATES = [
  { name: "Blur",        image: ssBlur,        video: vidBlur },
  { name: "Bright",      image: ssBright,      video: vidBright },
  { name: "CD",          image: ssCd,          video: vidCd },
  { name: "Horizon",     image: ssHorizon,     video: vidHorizon },
  { name: "Perspective", image: ssPerspective, video: vidPerspective },
  { name: "Photo",       image: ssPhoto,       video: vidPhoto },
];

const PREVIEW_COUNT = 3;

function DevGridCard({ project, onClick, isFirst }: { project: DevelopmentProject; onClick: () => void; isFirst?: boolean }) {
  const primaryTool = project.tools.split(',')[0].trim();

  return (
    <button className={`dev-grid-card${isFirst ? ' dev-grid-card--first' : ''}`} onClick={onClick}>
      <div className="dev-grid-card-image">
        <div className="dev-grid-image-wrapper">
          <img src={project.preview.src} alt={project.title} className="dev-grid-preview" />
          {project.overlayVideo ? (
            <video src={project.overlayVideo} className="dev-grid-overlay" autoPlay loop muted playsInline />
          ) : (
            <img src={project.overlay.src} alt={project.title} className="dev-grid-overlay" />
          )}
        </div>
      </div>
      <div className="dev-grid-card-info">
        <span className="dev-grid-card-title">{project.title}</span>
        <span className="dev-grid-card-meta">{primaryTool}</span>
      </div>
    </button>
  );
}

function SSTemplateCard({ name, image, video, isPlaying, onPlay }: {
  name: string;
  image: { src: string };
  video: string;
  isPlaying: boolean;
  onPlay: () => void;
}) {
  const [prefetch, setPrefetch] = useState(false);

  return (
    <button
      className="dev-grid-card"
      onClick={onPlay}
      onMouseEnter={() => setPrefetch(true)}
      onTouchStart={() => setPrefetch(true)}
    >
      <div className="dev-grid-card-image">
        <div className="dev-grid-image-wrapper">
          {isPlaying ? (
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              className="dev-grid-preview"
              style={{ background: '#000' }}
            />
          ) : (
            <>
              <img src={image.src} alt={name} className="dev-grid-preview" />
              <div className="ss-play-btn" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              {prefetch && (
                <video src={video} preload="auto" style={{ display: 'none' }} />
              )}
            </>
          )}
        </div>
      </div>
      <div className="dev-grid-card-info">
        <span className="dev-grid-card-title">{name}</span>
        <span className="dev-grid-card-meta">Squarespace</span>
      </div>
    </button>
  );
}

function Development() {
  const [data, setData] = useState<DevelopmentProject | null>(null);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  const toggleItem = (item: DevelopmentProject | null = null) => {
    setData(item);
    setVisible(item !== null);
  };

  return (
    <>
      <div className="portfolio">
        <section className="title">
          <br /><br />
          <AnimatedHeader as="h3" style={{ pointerEvents: 'auto' }}>
            Made with <span className="pixel">camila</span>
          </AnimatedHeader>
        </section>

        <div className="dev-section">
          <p className="dev-section-label">/squarespace templates</p>
          <div className="dev-grid-container">
            {SS_TEMPLATES.map((t) => (
              <SSTemplateCard
                key={t.name}
                name={t.name}
                image={t.image}
                video={t.video}
                isPlaying={activeTemplate === t.name}
                onPlay={() => setActiveTemplate(prev => prev === t.name ? null : t.name)}
              />
            ))}
          </div>
        </div>

        <div className="dev-sections">
          {SECTIONS.map(section => {
            const projects = development.filter(p => p.category.includes(section));
            if (projects.length === 0) return null;
            const isExpanded = expanded[section];
            const shown = isExpanded ? projects : projects.slice(0, PREVIEW_COUNT);
            const hasMore = projects.length > PREVIEW_COUNT;
            return (
              <div key={section} className="dev-section">
                <p className="dev-section-label">/{section}</p>
                <div className="dev-grid-container">
                  {shown.map((item, index) => (
                    <DevGridCard
                      key={item.name}
                      project={item}
                      onClick={() => toggleItem(item)}
                      isFirst={index === 0}
                    />
                  ))}
                </div>
                {hasMore && !isExpanded && (
                  <button
                    className="dev-section-more"
                    onClick={() => setExpanded(prev => ({ ...prev, [section]: true }))}
                  >
                    see more ({projects.length - PREVIEW_COUNT})
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {visible && data !== null && (
          <Project data={data} closeModal={() => toggleItem()} />
        )}

      </div>
    </>
  );
}

export default Development;
