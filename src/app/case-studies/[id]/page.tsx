import CaseStudy from "@/components/CaseStudy";
import { caseStudies } from "@/data/caseStudies";
import '@/app/globals.css';

// Generate static paths for all case studies
export function generateStaticParams() {
  return caseStudies.map((study) => ({
    id: study.id,
  }));
}

interface CaseStudyPageProps {
  params: {
    id: string;
  };
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { id } = params;

  // Find the case study by id
  const caseStudy = caseStudies.find((study) => study.id === id);

  // Handle case study not found
  if (!caseStudy) {
    return (
      <div className="case-study-not-found">
        <h1>Case Study Not Found</h1>
        <p>The case study you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  return <CaseStudy caseStudy={caseStudy} />;
}
