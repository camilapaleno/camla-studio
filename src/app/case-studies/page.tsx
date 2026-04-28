import { caseStudies } from "@/data/caseStudies";
import CaseStudyCard from "@/components/CaseStudyCard";
import '@/app/globals.css';
import AnimatedHeader from "@/components/AnimatedHeader";

export default function AllCaseStudiesPage() {
  return (
    <div className="all-case-studies-page">
      <header className="case-studies-page-header">
        <AnimatedHeader
          as="h2"
          style={{ pointerEvents: 'auto' }}
          ><span className="pixel">Case Studies</span>
        </AnimatedHeader>
        <AnimatedHeader
          as="h4"
          style={{ pointerEvents: 'auto' }}
          >A collection of client work showcasing web design, development, and brand experiences.
        </AnimatedHeader>
        
      </header>

      <div className="case-studies-grid-wrapper">
        <div className="case-studies-grid">
          {caseStudies.map((study) => (
            <CaseStudyCard
              key={study.id}
              id={study.id}
              title={study.title}
              shortDescription={study.shortDescription}
              coverImage={study.coverImage}
              tools={study.tools}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
