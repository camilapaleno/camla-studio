"use client"

import Image from "next/image";
import Link from "next/link";
import '@/app/globals.css';

interface CaseStudyCardProps {
  id: string;
  title: string;
  shortDescription: string;
  coverImage: any;
  tools?: string;
}

export default function CaseStudyCard({ id, title, shortDescription, coverImage, tools }: CaseStudyCardProps) {
  return (
    <Link
      href={`/case-studies/${id}`}
      className="case-study-glass-card"
    >
      <div className="card-image-container">
        <Image
          src={coverImage}
          alt={title}
          fill
          className="card-image"
          style={{ objectFit: 'cover' }}
        />
      </div>

      {tools && (
        <div className="card-tools-overlay">
          {tools.split(',').map((tool, index) => (
            <span key={index} className="card-tools">{tool.trim()}</span>
          ))}
        </div>
      )}

      <div className="card-info-overlay">
        <div className="card-glass-bg"></div>
        <div className="card-text-content">
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{shortDescription}</p>
          <p className="card-read-more">Read more</p>
        </div>
      </div>
    </Link>
  );
}
