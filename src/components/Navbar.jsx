import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/tech.nomad.life/', label: 'Home' },
  { href: '/tech.nomad.life/about', label: 'About' },
  { href: '/tech.nomad.life/services', label: 'Services' },
  { href: '/tech.nomad.life/blog', label: 'Blog' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-lg border-b border-black/10 shadow-sm'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/tech.nomad.life/">
          <a className="flex items-center gap-2 group">
            <span className="text-xl font-bold font-serif text-foreground">
              DKP
            </span>
            <span className="text-sm text-muted-foreground font-medium hidden sm:inline">
              — The Tech Nomad
            </span>
          </a>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                className={`relative text-sm font-medium transition-colors group ${
                  location === link.href.replace('/tech.nomad.life', '') ||
                  (link.href === '/tech.nomad.life/' && location === '/')
                    ? 'text-foreground'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-200 w-0 group-hover:w-full" />
              </a>
            </Link>
          ))}
          <a
            href="https://topmate.io/dheeraj_kumar7"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-accent-foreground hover:bg-accent/90 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            Book a Session
          </a>
        </nav>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-black/5 transition"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-black/10 px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-foreground/70 hover:text-foreground py-2"
              >
                {link.label}
              </a>
            </Link>
          ))}
          <a
            href="https://topmate.io/dheeraj_kumar7"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="bg-accent text-accent-foreground text-center px-4 py-2.5 rounded-lg text-sm font-semibold mt-2"
          >
            Book a Session
          </a>
        </div>
      )}
    </header>
  );
}
