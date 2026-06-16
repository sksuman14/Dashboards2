import React, { useState, useEffect, useRef } from 'react';
import { Droplets, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const scrollToElementWithOffset = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Handle smooth scroll on load or route changes with hash
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const id = location.hash.substring(1);
      const timer = setTimeout(() => {
        scrollToElementWithOffset(id);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash]);

  const handleNavLinkClick = (e, target, isPageLink = false) => {
    setMobileMenuOpen(false);
    if (isPageLink) {
      return;
    }

    e.preventDefault();
    const id = target.replace('/#', '');

    if (location.pathname === '/') {
      scrollToElementWithOffset(id);
      window.history.pushState(null, '', target);
    } else {
      navigate(target);
    }
  };

  return (
    <header className={`glass ${isScrolled ? 'scrolled' : ''}`} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease',
      padding: isScrolled ? '1rem 0' : '1.5rem 0',
      borderBottom: isScrolled ? '1px solid var(--border)' : 'none'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        <Link 
          to="/" 
          onClick={(e) => handleNavLinkClick(e, '/', true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', textDecoration: 'none', zIndex: 1001 }}
        >
          <Droplets size={28} />
          <span style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.025em' }}>AWD System</span>
        </Link>
        
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
          <a href="/#about" onClick={(e) => handleNavLinkClick(e, '/#about')} style={{ fontWeight: '500', transition: 'color 0.2s', textDecoration: 'none', color: 'var(--text-color)' }}>About</a>
          <a href="/#how-it-works" onClick={(e) => handleNavLinkClick(e, '/#how-it-works')} style={{ fontWeight: '500', transition: 'color 0.2s', textDecoration: 'none', color: 'var(--text-color)' }}>How it Works</a>
          <a href="/#hardware" onClick={(e) => handleNavLinkClick(e, '/#hardware')} style={{ fontWeight: '500', transition: 'color 0.2s', textDecoration: 'none', color: 'var(--text-color)' }}>Hardware</a>
          <a href="/#performance" onClick={(e) => handleNavLinkClick(e, '/#performance')} style={{ fontWeight: '500', transition: 'color 0.2s', textDecoration: 'none', color: 'var(--text-color)' }}>Performance</a>
          <a href="/#deployment" onClick={(e) => handleNavLinkClick(e, '/#deployment')} style={{ fontWeight: '500', transition: 'color 0.2s', textDecoration: 'none', color: 'var(--text-color)' }}>Deployment</a>
          <Link to="/sensors" onClick={(e) => handleNavLinkClick(e, '/sensors', true)} style={{ 
            fontWeight: '600', 
            transition: 'all 0.2s', 
            textDecoration: 'none', 
            color: 'white',
            backgroundColor: 'var(--primary)',
            padding: '0.5rem 1rem',
            borderRadius: '8px'
          }}>
            Sensors Data
          </Link>
        </nav>

        <button 
          ref={buttonRef}
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          style={{ 
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            padding: '8px',
            zIndex: 1001,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Compact Mobile Navigation Dropdown */}
        <div 
          ref={dropdownRef}
          className={`mobile-nav-dropdown ${mobileMenuOpen ? 'open' : ''}`}
          style={{
            position: 'absolute',
            top: '100%',
            right: '2rem',
            width: '240px',
            backgroundColor: 'var(--surface)',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            border: '1px solid var(--border)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem',
            gap: '0.5rem',
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease-in-out',
            opacity: mobileMenuOpen ? 1 : 0,
            transform: mobileMenuOpen ? 'scale(1) translateY(8px)' : 'scale(0.95) translateY(-8px)',
            pointerEvents: mobileMenuOpen ? 'all' : 'none',
          }}
        >
          <a 
            href="/#about" 
            onClick={(e) => handleNavLinkClick(e, '/#about')}
            style={{ 
              fontSize: '1rem', 
              fontWeight: '500', 
              color: 'var(--text-main)',
              padding: '0.6rem 0.85rem',
              borderRadius: '8px',
              transition: 'background-color 0.2s, color 0.2s',
              textDecoration: 'none',
              display: 'block'
            }}
            className="dropdown-link"
          >
            About
          </a>
          <a 
            href="/#how-it-works" 
            onClick={(e) => handleNavLinkClick(e, '/#how-it-works')}
            style={{ 
              fontSize: '1rem', 
              fontWeight: '500', 
              color: 'var(--text-main)',
              padding: '0.6rem 0.85rem',
              borderRadius: '8px',
              transition: 'background-color 0.2s, color 0.2s',
              textDecoration: 'none',
              display: 'block'
            }}
            className="dropdown-link"
          >
            How it Works
          </a>
          <a 
            href="/#hardware" 
            onClick={(e) => handleNavLinkClick(e, '/#hardware')}
            style={{ 
              fontSize: '1rem', 
              fontWeight: '500', 
              color: 'var(--text-main)',
              padding: '0.6rem 0.85rem',
              borderRadius: '8px',
              transition: 'background-color 0.2s, color 0.2s',
              textDecoration: 'none',
              display: 'block'
            }}
            className="dropdown-link"
          >
            Hardware
          </a>
          <a 
            href="/#performance" 
            onClick={(e) => handleNavLinkClick(e, '/#performance')}
            style={{ 
              fontSize: '1rem', 
              fontWeight: '500', 
              color: 'var(--text-main)',
              padding: '0.6rem 0.85rem',
              borderRadius: '8px',
              transition: 'background-color 0.2s, color 0.2s',
              textDecoration: 'none',
              display: 'block'
            }}
            className="dropdown-link"
          >
            Performance
          </a>
          <a 
            href="/#deployment" 
            onClick={(e) => handleNavLinkClick(e, '/#deployment')}
            style={{ 
              fontSize: '1rem', 
              fontWeight: '500', 
              color: 'var(--text-main)',
              padding: '0.6rem 0.85rem',
              borderRadius: '8px',
              transition: 'background-color 0.2s, color 0.2s',
              textDecoration: 'none',
              display: 'block'
            }}
            className="dropdown-link"
          >
            Deployment
          </a>
          <Link 
            to="/sensors" 
            onClick={(e) => handleNavLinkClick(e, '/sensors', true)}
            style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: 'white',
              backgroundColor: 'var(--primary)',
              padding: '0.7rem 0.85rem',
              borderRadius: '8px',
              textDecoration: 'none',
              textAlign: 'center',
              marginTop: '0.25rem',
              transition: 'all 0.2s',
              display: 'block'
            }}
            className="dropdown-button"
          >
            Sensors Data
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-nav-dropdown { display: none !important; }
        }
        nav a:not([href="/sensors"]):hover { color: var(--primary) !important; }
        nav a[href="/sensors"]:hover { opacity: 0.9; }
        .dropdown-link { color: var(--text-main) !important; }
        .dropdown-link:hover {
          background-color: var(--background) !important;
          color: var(--primary) !important;
        }
        .dropdown-button:hover { opacity: 0.9; }
      `}} />
    </header>
  );
};

export default Header;
