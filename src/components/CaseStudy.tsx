import Image from "next/image";
import { CaseStudy as CaseStudyType } from "@/data/caseStudies";

interface CaseStudyProps {
  caseStudy: CaseStudyType;
}

// Simple function to parse markdown-like formatting
function parseContent(content: string) {
  // Split by double newlines to create paragraphs
  const sections = content.split('\n\n');

  return sections.map((section, idx) => {
    // Check for headings
    if (section.startsWith('## ')) {
      const text = section.replace('## ', '');
      return <h2 key={idx}>{text}</h2>;
    } else if (section.startsWith('### ')) {
      const text = section.replace('### ', '');
      return <h3 key={idx}>{text}</h3>;
    } else if (section.startsWith('• ')) {
      // Handle bullet points
      const items = section.split('\n').filter(line => line.trim());
      return (
        <ul key={idx}>
          {items.map((item, itemIdx) => (
            <li key={itemIdx}>{item.replace('• ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>
          ))}
        </ul>
      );
    } else {
      // Regular paragraph - handle bold text
      const formattedText = section.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={idx} dangerouslySetInnerHTML={{ __html: formattedText }} />;
    }
  });
}

export default function CaseStudy({ caseStudy }: CaseStudyProps) {
  return (
    <div className="case-study">
      {/* Header Section */}
      <header className="case-study-header">
        <h1>{caseStudy.title}</h1>

        {/* Optional metadata */}
        <div className="case-study-meta">
          {caseStudy.client && <p className="client">Client: {caseStudy.client}</p>}
          {caseStudy.year && <p className="year">Year: {caseStudy.year}</p>}
          {caseStudy.tools && <p className="tools">Tools: {caseStudy.tools}</p>}
        </div>
      </header>

      {/* Content Blocks - Full Width */}
      <div className="case-study-content">
        {caseStudy.contentBlocks.map((block, index) => {
          if (block.type === 'text') {
            return (
              <div key={index} className="content-block text-block">
                {parseContent(block.content)}
              </div>
            );
          } else if (block.type === 'image') {
            return (
              <div key={index} className="content-block image-block">
                <Image
                  src={block.content}
                  alt={block.alt || ''}
                  width={1920}
                  height={1080}
                  className="full-width-image"
                />
                {block.caption && <p className="image-caption">{block.caption}</p>}
              </div>
            );
          } else if (block.type === 'video') {
            return (
              <div key={index} className="content-block image-block">
                <video
                  src={block.content}
                  controls
                  className="full-width-image"
                  style={{ width: '100%', height: 'auto' }}
                >
                  Your browser does not support the video tag.
                </video>
                {block.caption && <p className="image-caption">{block.caption}</p>}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
