"use client"

import Image from "next/image";
import showcasepc2 from "@/image/showcase-pcmila-2.webm";
import showcasepc from "@/image/showcase-pcmila.webm";
import showcase3rd from "@/image/showcase-3rdplace.png";
import showcaseS8 from "@/image/showcase-s8.webm";

type MediaItem =
  | { type: "image"; src: any; alt: string }
  | { type: "video"; src: string; alt: string };

const images: MediaItem[] = [
  { type: "image", src: showcase3rd, alt: "Devon Donis" },
  { type: "video", src: showcasepc, alt: "Photography Website" },
  
  { type: "video", src: showcaseS8, alt: "Satin Eights Website" },
 
 { type: "video", src: showcasepc2, alt: "Photography Website" },
   
  
];

export default function ImageScroll() {
  const track = [...images, ...images];

  return (
    <section className="image-scroll-section">
      <div className="image-scroll-track">
        {track.map((item, i) => (
          <div key={i} className="image-scroll-item">
            {item.type === "video" ? (
              <video
                src={item.src}
                muted
                loop
                autoPlay
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Image
                src={item.src}
                alt={item.alt}
                fill
                style={{ objectFit: "cover" }}
                sizes="30vw"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
