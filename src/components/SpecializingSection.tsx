"use client"

import dynamic from 'next/dynamic';
import AnimatedHeader from './AnimatedHeader';

const ParticleFlower = dynamic(() => import('./ParticleFlower'), {
  ssr: false,
  loading: () => <div className="spec-card-canvas" />,
});

export default function SpecializingSection() {
  return (
    <section className="specializing-section">
      <AnimatedHeader as="h2" delay={0}>
        specializing in
      </AnimatedHeader>

      <div className="specializing-cards">
        {/* Interaction card */}
        <div className="spec-card">
          <span className="spec-card-label">interaction</span>
          <div className="spec-card-canvas">
            <ParticleFlower />
          </div>
        </div>

        {/* Motion card */}
        <div className="spec-card">
          <span className="spec-card-label">motion</span>
          <div className="spec-card-canvas spec-card-placeholder" />
        </div>
      </div>
    </section>
  );
}
