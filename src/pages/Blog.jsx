import { Link } from 'wouter';
import { ArrowRight, Clock } from 'lucide-react';
import { blogPosts } from '../data/content';

const categories = ['All', 'Career', 'Tech', 'Personal', 'Growth', 'Travel & Cultural Exploration'];

export default function Blog() {
  return (
    <div className="pt-20">
      {/* ── Hero ── */}
      <section className="py-20 px-6 bg-gradient-to-b from-yellow-50/60 to-background text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Blog</p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-5">
            Tech, Travel & Life
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From system design deep dives to immigration stories, travel adventures, and lessons learned leading teams at Amazon.
          </p>
        </div>
      </section>

      {/* ── Blog Grid ── */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
              >
                {/* Image */}
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="bg-accent/10 text-accent text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={11} /> {post.readTime}
                    </span>
                  </div>

                  <h2 className="font-semibold text-foreground mb-2 leading-snug text-base">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                    <Link href={`/tech.nomad.life/blog/${post.id}`}>
                      <a className="text-sm font-semibold text-accent hover:underline flex items-center gap-1">
                        Read More <ArrowRight size={13} />
                      </a>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter / CTA ── */}
      <section className="py-16 px-6 bg-secondary/40">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
            Want to work together?
          </h2>
          <p className="text-muted-foreground mb-8">
            If you've found my writing helpful, imagine what personalized coaching can do for your career.
          </p>
          <a
            href="https://topmate.io/dheeraj_kumar7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-accent/90 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Book a Session <ArrowRight size={15} />
          </a>
        </div>
      </section>
    </div>
  );
}
