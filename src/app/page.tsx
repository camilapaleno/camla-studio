"use client"

import Image from "next/image";
import Link from 'next/link'
import '@/app/globals.css';
import squarespace from "@/image/squarespace_logo.png";
import nextjs from "@/image/nextjs_logo.png";
import react from "@/image/react_logo.png";
import shopify from "@/image/shopify_logo.png";
import adobe from "@/image/adobe_logo.png";
import lottie from "@/image/lottie_logo.png";
import blender from "@/image/blender_logo.png";
import arra from "@/image/arra.png";
import hi from "@/image/wavey.gif";
import boogie from "@/image/dancey.gif";
import examples from "@/image/examples.jpg";
import { motion } from "motion/react"
import { easeInOut } from "motion";
import HeroChat from "@/components/HeroChat";
import FeaturedCaseStudies from "@/components/FeaturedCaseStudies";
import FeaturedWebsites from "@/components/FeaturedWebsites";
import BrowserDemo from "@/components/BrowserDemo";
import { demos } from "@/data/demos";
import ParticleBackground from "@/components/ParticleBackground";
import AnimatedHeader from "@/components/AnimatedHeader";
import Footer from "@/components/Footer";
import dynamic from 'next/dynamic';

const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), {
  ssr: false,
  loading: () => null
});

const PixelSphere = dynamic(() => import('@/components/PixelSphere'), {
  ssr: false,
  loading: () => null
});

export default function Home() {

  return (
    <div className="home" style={{position: 'relative'}}>
      <ParticleBackground />
      <PixelSphere />

      <section className="hero" style={{ position: 'relative', pointerEvents: 'none' }}>

        <AnimatedHeader
          as="h3"
          style={{ pointerEvents: 'auto' }}
          delay={0}
        >
         My name is Camila <span className="emoji">I</span>
        </AnimatedHeader>

        <AnimatedHeader
          as="h1"
          style={{ pointerEvents: 'auto' }}
          delay={0.5}
        >
          I <span className="pixel">connect</span> your brand identity to your <span className="pixel">online presence</span><span className="emoji">z</span>
        </AnimatedHeader>

      </section>

      <FeaturedCaseStudies />
      <BrowserDemo projects={demos} />
      <FeaturedWebsites />


      {/* <Footer /> */}


    </div>
  );
}
