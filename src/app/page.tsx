"use client"

import '@/app/globals.css';
import FeaturedWebsites from "@/components/FeaturedWebsites";
import BrowserDemo from "@/components/BrowserDemo";
import { demos } from "@/data/demos";
import ParticleBackground from "@/components/ParticleBackground";
import AnimatedHeader from "@/components/AnimatedHeader";
import ImageScroll from "@/components/ImageScroll";
import SpecializingSection from "@/components/SpecializingSection";
import HeroWordSelector from "@/components/HeroWordSelector";
import dynamic from 'next/dynamic';
import ParticleBackgroundAligned from '@/components/ParticleBackgroundAligned';
import HomeNav from '@/components/HomeNav';
import Link from 'next/link';

const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), {
  ssr: false,
  loading: () => null
});

const PixelSphere = dynamic(() => import('@/components/PixelSphere'), {
  ssr: false,
  loading: () => null
});

const ParticleBranch = dynamic(() => import('@/components/ParticleBranch'), {
  ssr: false,
  loading: () => null
});

export default function Home() {

  return (
    <div className="home" style={{position: 'relative'}}>
      <HomeNav />
      <ParticleBackgroundAligned align='bottom' backgroundColor='transparent'/>
      {/* <PixelSphere /> */}
      <div className="hero">
        <section className='hero-text'>

          <AnimatedHeader
            as="h1"
            style={{ pointerEvents: 'auto' }}
            delay={0.5}
          >
            Bring your <span className="pixel">website</span> idea <span className="pixel">to life</span><span className="emoji">z</span>
          </AnimatedHeader>

          <AnimatedHeader
            as="h4"
            style={{ pointerEvents: 'auto' }}
            delay={0}
          >
           We design and build creative & interactive websites, portfolios, and online stores that grow with your brand.
          </AnimatedHeader>

          <div className='cta-container'>
            <Link href="/portfolio/development" className='cta'>See Work</Link>
          </div>


        </section>
        <div className="hero-canvas">
          <ParticleBranch />
        </div>
      </div>
      {/* <ImageScroll /> */}
      {/* <HeroWordSelector /> */}
      {/* <SpecializingSection /> */}
      {/* <BrowserDemo projects={demos} /> */}
      {/* <FeaturedWebsites /> */}

    </div>
  );
}
