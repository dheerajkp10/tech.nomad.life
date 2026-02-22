import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="text-[#1C1A17] font-bold text-[15px] tracking-tight hover:opacity-80 transition-opacity">
            The Tech Nomad
          </a>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                className={`text-sm transition-colors ${
                  location === link.href
                    ? 'text-[#1C1A17] font-medium'
                    : 'text-[#6B6560] hover:text-[#1C1A17]'
                }`}
              >
                {link.label}
              </a>
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-1 text-[#6B6560] hover:text-[#1C1A17] transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-t border-[#E8E2D9] px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                onClick={() => setMenuOpen(false)}
                className="text-sm text-[#6B6560] hover:text-[#1C1A17] transition-colors py-1"
              >
                {link.label}
              </a>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
