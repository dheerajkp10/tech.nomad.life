import { Link } from 'wouter';
import { Linkedin, Github, Twitter, Youtube, BookOpen, Globe } from 'lucide-react';

const footerLinks = [
  {
    heading: 'Navigation',
    links: [
      { label: 'Home', href: '/tech.nomad.life/' },
      { label: 'About', href: '/tech.nomad.life/about' },
      { label: 'Services', href: '/tech.nomad.life/services' },
      { label: 'Blog', href: '/tech.nomad.life/blog' },
    ],
  },
  {
    heading: 'Services',
    links: [
      { label: 'Mock Coding Interview', href: 'https://topmate.io/dheeraj_kumar7', external: true },
      { label: 'System Design Interview', href: 'https://topmate.io/dheeraj_kumar7', external: true },
      { label: 'Resume & Outreach', href: 'https://topmate.io/dheeraj_kumar7', external: true },
      { label: 'Career Planning', href: 'https://topmate.io/dheeraj_kumar7', external: true },
    ],
  },
  {
    heading: 'Connect',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dheeraj-kumar-paras/', external: true },
      { label: 'Book a Session', href: 'https://topmate.io/dheeraj_kumar7', external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="font-serif text-2xl font-bold text-foreground mb-3">DKP</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Software Development Manager at Amazon helping engineers master interviews, design systems, and navigate their tech careers—from wherever in the world.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://www.linkedin.com/in/dheeraj-kumar-paras/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-background/60 text-muted-foreground hover:text-foreground hover:bg-background transition"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://topmate.io/dheeraj_kumar7"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-background/60 text-muted-foreground hover:text-foreground hover:bg-background transition"
                aria-label="Topmate"
              >
                <BookOpen size={18} />
              </a>
              <a
                href="/tech.nomad.life/blog"
                className="p-2 rounded-lg bg-background/60 text-muted-foreground hover:text-foreground hover:bg-background transition"
                aria-label="Blog"
              >
                <Globe size={18} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href}>
                        <a className="text-sm text-muted-foreground hover:text-foreground transition">
                          {link.label}
                        </a>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Dheeraj Kumar Paras. All rights reserved.</span>
          <span>Engineering Leader at Amazon, Builder, Nomad</span>
        </div>
      </div>
    </footer>
  );
}
