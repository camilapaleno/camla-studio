"use client"

import React, { useState, useEffect } from "react";
import {development} from '@/data/development';
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Project from "@/components/Project";
import PortfolioCard from "@/components/PortfolioCard";
import { motion } from "motion/react"
import { easeInOut } from "motion";
import AnimatedHeader from "@/components/AnimatedHeader";


function Development() {
  const [filter, setFilter] = useState("my favorites!");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [projects, setProjects] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    // Combine both builders and development projects
    const allProjects = [...development];
    setProjects(allProjects);

    // Extract all unique tags
    const tags = new Set<string>();
    allProjects.forEach(project => {
      project.category.forEach((tag: string) => {
        if (tag !== "all") {
          tags.add(tag);
        }
      });
    });
    setAllTags(Array.from(tags).sort());
  }, []);

  useEffect(() => {
    setProjects([]);

    const allProjects = [...development];
    const filtered = allProjects.map(p => ({
      ...p,
      filtered: p.category.includes(filter)
    }));
    setProjects(filtered);
  }, [filter]);

  const [data, setData] = useState(null);
  const [visible, setVisible] = useState(false);

  const toggleItem = (item = null) => {
    setData(item);
    setVisible(item !== null);
  };

  return (
    <>

      <div className="portfolio">

        <section className="title">
          <br/><br/>
          <AnimatedHeader
          as="h2"
          style={{ pointerEvents: 'auto' }}
        >
          Creative online <span className="pixel">experiences</span> that align with your brand image and message
        </AnimatedHeader>
        </section>

        <div className="filter-container">
          <div className="filter-tags">
            <button
              className={`filter-tag ${filter === "all" ? 'selected' : ''}`}
              onClick={() => setFilter("all")}
            >
              all
              {filter === "all" && (
                <span className="clear-filter-inline" onClick={(e) => {
                  e.stopPropagation();
                  setFilter("all");
                }}>
                  ✕
                </span>
              )}
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                className={`filter-tag ${filter === tag ? 'selected' : ''}`}
                onClick={() => setFilter(tag)}
              >
                {tag}
                {filter === tag && (
                  <span className="clear-filter-inline" onClick={(e) => {
                    e.stopPropagation();
                    setFilter("all");
                  }}>
                    ✕
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="portfolio__container">
          <ul>
            {projects.map(item =>
              item.filtered === true ?
              <li key={item.name}>
                <PortfolioCard
                  project={item}
                  onClick={() => toggleItem(item)}
                />
              </li> : ""
            )}
          </ul>
        </div>

        {visible === true && data !== null && (
              <Project
              data={data}
              closeModal={() => toggleItem()} />
            )}

      </div>

    </>
  );
}

export default Development;