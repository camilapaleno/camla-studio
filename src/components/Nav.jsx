"use client"

import Link from 'next/link'
import '@/app/globals.css';
import cam from '@/image/CAM-logo2.png'
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';

function Nav() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="nav">
        <div className="top">
          <Link href={"/"}><span className='pixel'>camila</span> <span className="emoji">m</span></Link>
        </div>

        {/* Desktop Navigation */}
        <div className="links desktop-links">
          <ul>
            <li>
              <Link href="/case-studies">case studies</Link>
            </li>
            <li>
              <Link href="/portfolio/development">website showcase</Link>
            </li>
            <li>
              <Link href="mailto:hi@imcamila.dev">email me</Link>
            </li>
{/*             <li className="dropdown">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="dropdown-toggle"
              >
                links
                <svg
                  className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <a href="https://github.com/camilapaleno" target="_blank" rel="noreferrer">
                    github
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 227.71 225.85">
                      <polyline className="st0" points="14.24,15.08 214.41,15.08 214.41,210.39 "/>
                      <line className="st0" x1="14.24" y1="210.39" x2="214.41" y2="15.08"/>
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/in/camilapaleno/" target="_blank" rel="noreferrer">
                    linkedin
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 227.71 225.85">
                      <polyline className="st0" points="14.24,15.08 214.41,15.08 214.41,210.39 "/>
                      <line className="st0" x1="14.24" y1="210.39" x2="214.41" y2="15.08"/>
                    </svg>
                  </a>
                  <a href="mailto:hi@imcamila.dev">
                    email
                    <svg className="eml" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 227.71 225.85">
                      <polyline className="st0" points="14.24,15.08 214.41,15.08 214.41,210.39 "/>
                      <line className="st0" x1="14.24" y1="210.39" x2="214.41" y2="15.08"/>
                    </svg>
                  </a>
                </div>
              )}
            </li> */}
            <li>
              <button onClick={toggleTheme} className="theme-toggle">
                <span className='emoji'>
                  {mounted ? (theme === 'light' ? 'F' : 'G') : 'F'}
                </span>
              </button>
            </li>
          </ul>
        </div>

        {/* Mobile Navigation */}
        <div className="mobile-nav">
          <button onClick={toggleTheme} className="theme-toggle mobile-theme-toggle">
            <span className='emoji'>
              {mounted ? (theme === 'light' ? 'F' : 'G') : 'F'}
            </span>
          </button>
          <button
            className="hamburger-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={mobileMenuOpen ? 'open' : ''}></span>
            <span className={mobileMenuOpen ? 'open' : ''}></span>
            <span className={mobileMenuOpen ? 'open' : ''}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu-dropdown">
          <ul>
            <li>
              <Link href="/case-studies" onClick={() => setMobileMenuOpen(false)}>case studies</Link>
            </li>
            <li>
              <Link href="/portfolio/development" onClick={() => setMobileMenuOpen(false)}>website showcase</Link>
            </li>
            <li>
              <a href="mailto:hi@imcamila.dev">email me</a>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Nav;