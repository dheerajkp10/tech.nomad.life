import { useState } from 'react';
import { Search } from 'lucide-react';

const categories = ['All Posts', 'Tech', 'Career', 'Personal', 'Travel', 'Immigration'];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All Posts');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* ── Header ── */}
      <section className="py-14 px-6 text-center bg-white">
        <h1 className="text-5xl md:text-6xl font-black text-[#1C1A17] mb-3">The Blog</h1>
        <p className="text-[#6B6560] text-base">Tech insights, career advice, and personal stories from my journey</p>
      </section>

      {/* ── Search + Filter ── */}
      <section className="px-6 pb-10 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-4">
          {/* Search */}
          <div className="relative flex-shrink-0 w-full sm:w-64">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E8E2D9] rounded-full text-sm text-[#1C1A17] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] transition-colors"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-[#1C1A17] text-white'
                    : 'bg-white border border-[#E8E2D9] text-[#6B6560] hover:border-[#1C1A17] hover:text-[#1C1A17]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Empty state ── */}
      <section className="px-6 pb-20 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="font-semibold text-[#1C1A17] text-lg mb-2">No posts found</h3>
          <p className="text-[#6B6560] text-sm">Check back soon for new content!</p>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="bg-[#1C1A17] py-16 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-3">Never miss a post</h2>
          <p className="text-[#9CA3AF] text-sm mb-8">
            Subscribe to get notified when I publish new articles about tech, career, and life.
          </p>
          <div className="flex gap-3 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50 transition-colors"
            />
            <button className="bg-white text-[#1C1A17] font-semibold px-5 py-3 rounded-full text-sm hover:bg-white/90 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
