import { Link } from 'wouter';
import { Linkedin, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#EDE8E0] border-t border-[#D8D0C4]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-[#F97316] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DKP</span>
              </div>
              <span className="font-semibold text-[#1C1A17] text-base">Dheeraj Kumar Paras</span>
            </div>
            <p className="text-sm text-[#6B6560] leading-relaxed mb-5">
              Engineer, mentor, and writer sharing insights on tech, career growth, and life experiences from India to the US.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/dheeraj-kumar-paras/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-[#D8D0C4] rounded-full flex items-center justify-center text-[#6B6560] hover:bg-[#F97316] hover:text-white transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={14} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-[#D8D0C4] rounded-full flex items-center justify-center text-[#6B6560] hover:bg-[#F97316] hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram size={14} />
              </a>
              {/* TikTok */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-[#D8D0C4] rounded-full flex items-center justify-center text-[#6B6560] hover:bg-[#F97316] hover:text-white transition-all"
                aria-label="TikTok"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-[#D8D0C4] rounded-full flex items-center justify-center text-[#6B6560] hover:bg-[#F97316] hover:text-white transition-all"
                aria-label="YouTube"
              >
                <Youtube size={14} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-[#1C1A17] text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <a className="text-sm text-[#6B6560] hover:text-[#1C1A17] transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog Topics */}
          <div>
            <h4 className="font-semibold text-[#1C1A17] text-sm mb-4">Blog Topics</h4>
            <ul className="space-y-2.5">
              {['Tech & Coding', 'System Design', 'Career Tips', 'Immigration', 'Travel Stories'].map((topic) => (
                <li key={topic}>
                  <Link href="/blog">
                    <a className="text-sm text-[#6B6560] hover:text-[#1C1A17] transition-colors">
                      {topic}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#D8D0C4] mt-10 pt-6 space-y-3">
          <p className="text-xs text-[#6B6560] text-center leading-relaxed">
            <span className="font-medium">Disclaimer:</span> All views, opinions, and statements expressed on this website are solely my own and do not represent, reflect, or are endorsed by my employer or any organization I am affiliated with. This website is a personal platform and all content is created independently in my personal capacity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#6B6560]">
            <span>© 2026 The Tech Nomad, by Dheeraj Kumar Paras. Made with ❤️</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#1C1A17] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#1C1A17] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
