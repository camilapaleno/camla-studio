import cafeBluePreview from "@/image/preview-cafeblue.png";
import junkPreview from "@/image/preview-junk.png";
import tomSketchPreview from "@/image/preview-tomsketch.png";
import beechjetPreview from "@/image/preview-beechjet3.png";
import marsyPreview from "@/image/preview-marsy1.png";

export const demos = [
  {
    name: "Tom Sketch",
    title: "Tom Sketch",
    short: "Interactive sketch application",
    long: "Interactive sketch application built with React.",
    tools: "React",
    preview: tomSketchPreview,
    embed: 'https://camilapaleno.github.io/tom-sketch/',
    pointer: null
  },
  {
    name: "Beechjet",
    title: "Beechjet",
    short: "Website for Los Angeles indie rock band",
    long: "Website for Los Angeles indie rock band",
    tools: "React",
    preview: beechjetPreview,
    embed: 'https://camilapaleno.github.io/beechjet4000/',
    pointer: {
      text: "click there!",
      side: 'left' as const,
      position: 30,
      dotColor: '#ff6b6b'
    }
  },
  {
    name: "Mariana",
    title: "Mariana",
    short: "Zine portfolio",
    long: "A portfolio made for artist Mariana with Next.js.",
    tools: "Next.js, Typscript",
    preview: marsyPreview,
    embed: 'https://camilapaleno.github.io/marsy.psd/',
    pointer: null
  },
  {
    name: "Cafe Blue",
    title: "Cafe Blue",
    short: "Website for a cafe in Junquillal, Costa Rica",
    long: "Cafe Blue is the cafe attached to the boutique villas \"Blue Window\". Cafe Blue and Blue Window are located minutes from the beach in Junquillal, Costa Rica.",
    tools: "React",
    preview: cafeBluePreview,
    embed: 'https://camilapaleno.github.io/cafe-blue',
    pointer: {
      text: "hover anywhere",
      side: 'right' as const,
      position: 45,
      dotColor: '#6bcf7f'
    }
  },
  {
    name: "Junk Journal",
    title: "Junk Journal",
    short: "Little scraps from all over the world.",
    long: "Little scraps from all over the world.",
    tools: "React",
    preview: junkPreview,
    embed: 'https://camilapaleno.github.io/junk-journal',
    pointer: {
      text: "drag these around",
      side: 'left' as const,
      position: 50,
      dotColor: '#f9a825'
    }
  },
];

export default demos;
