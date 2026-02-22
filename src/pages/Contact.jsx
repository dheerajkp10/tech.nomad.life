import { useState } from 'react';
import { Mail, MapPin, Clock, Linkedin, Instagram, Youtube, Send } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* ── Header ── */}
      <section className="py-14 px-6 text-center bg-white">
        <h1 className="text-5xl md:text-6xl font-black text-[#1C1A17] mb-3">Let's Connect</h1>
        <p className="text-[#6B6560] text-base max-w-md mx-auto">
          Have a question, want to collaborate, or just say hello? I'd love to hear from you.
        </p>
      </section>

      {/* ── Form + Info ── */}
      <section className="px-6 pb-20 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left — Contact info */}
          <div>
            <h2 className="text-xl font-bold text-[#1C1A17] mb-3">Get in Touch</h2>
            <p className="text-[#6B6560] text-sm leading-relaxed mb-8">
              Whether you're interested in my services, have questions about my journey, or want to discuss a collaboration opportunity, I'm here to help.
            </p>

            <div className="space-y-5 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#FEF3E2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="text-[#F97316]" />
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF] font-medium mb-0.5">Email</p>
                  <p className="text-sm text-[#1C1A17] font-medium">dheerajkp.email@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#FEF3E2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-[#F97316]" />
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF] font-medium mb-0.5">Location</p>
                  <p className="text-sm text-[#1C1A17] font-medium">United States</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#FEF3E2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock size={16} className="text-[#F97316]" />
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF] font-medium mb-0.5">Response Time</p>
                  <p className="text-sm text-[#1C1A17] font-medium">Within 24-48 hours</p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="text-sm font-semibold text-[#1C1A17] mb-3">Follow Me</p>
              <div className="flex items-center gap-3">
                {[
                  { icon: Linkedin, href: 'https://www.linkedin.com/in/dheeraj-kumar-paras/', label: 'LinkedIn' },
                  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
                  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 border border-[#E8E2D9] rounded-full flex items-center justify-center text-[#6B6560] hover:border-[#F97316] hover:text-[#F97316] transition-all"
                  >
                    <Icon size={15} />
                  </a>
                ))}
                {/* TikTok */}
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-9 h-9 border border-[#E8E2D9] rounded-full flex items-center justify-center text-[#6B6560] hover:border-[#F97316] hover:text-[#F97316] transition-all"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-[#F9F9F9] rounded-2xl p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E2D9] rounded-xl text-sm text-[#1C1A17] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E2D9] rounded-xl text-sm text-[#1C1A17] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] transition-colors"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">Subject</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="What's this about?"
                className="w-full px-4 py-2.5 bg-white border border-[#E8E2D9] rounded-xl text-sm text-[#1C1A17] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] transition-colors"
              />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Tell me more about how I can help..."
                className="w-full px-4 py-2.5 bg-white border border-[#E8E2D9] rounded-xl text-sm text-[#1C1A17] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] transition-colors resize-none"
              />
            </div>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-[#1C1A17] hover:bg-[#2D2B27] text-white font-semibold py-3.5 rounded-full transition-colors text-sm"
            >
              Send Message <Send size={15} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
