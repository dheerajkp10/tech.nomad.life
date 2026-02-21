import { Link } from 'wouter';
import { ArrowRight, CheckCircle, Globe, Users, Award, Zap, MapPin, Calendar, Clock, ExternalLink } from 'lucide-react';
import { services, blogPosts, whyMePoints } from '../data/content';

const whyIcons = [Award, Users, Zap, Users, Globe, CheckCircle];

export default function Home() {
  const featuredServices = services.slice(0, 3);
  const featuredPosts = blogPosts.slice(0, 3);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-50/60 via-white/40 to-white/80 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-black/8 text-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <MapPin size={14} className="text-accent" />
            🌍 Engineering Leader at Amazon
          </div>

          {/* Heading */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
            DKP — The{' '}
            <span className="text-accent">Tech Nomad</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
            10+ years building systems. Mentor budding and seasoned engineers. Travel whenever I can.
          </p>

          <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            I help engineers master interviews, design systems at scale, and build careers—from wherever you are in the world. 10+ years of experience building infrastructure at Amazon.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://topmate.io/dheeraj_kumar7"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Book a Session
              <ArrowRight size={16} />
            </a>
            <Link href="/tech.nomad.life/services">
              <a className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-black/10 text-foreground hover:bg-white/80 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5">
                Explore Services
              </a>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-14">
            {[
              { value: '10+', label: 'Years Experience' },
              { value: '60+', label: 'Engineers Hired' },
              { value: '12+', label: 'Engineers Mentored' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold font-serif text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
          <div className="w-px h-8 bg-foreground/30" />
          <div className="text-xs text-muted-foreground">Scroll</div>
        </div>
      </section>

      {/* ── Services Preview ── */}
      <section className="py-20 px-6 bg-secondary/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">What I Offer</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Specialized Coaching
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Specialized coaching tailored to your specific career stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {featuredServices.map((service) => (
              <div
                key={service.id}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-foreground text-lg leading-tight">{service.title}</h3>
                  <span className="bg-accent/10 text-accent text-sm font-bold px-3 py-1 rounded-full ml-2 shrink-0">
                    {service.price}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-5 flex-1">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock size={13} />
                    {service.duration}
                  </span>
                  <a
                    href={service.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-accent hover:underline flex items-center gap-1"
                  >
                    Book Now <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/tech.nomad.life/services">
              <a className="inline-flex items-center gap-2 border border-border bg-background hover:bg-secondary px-6 py-3 rounded-xl text-sm font-semibold transition">
                View All Services <ArrowRight size={15} />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* ── About Preview ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Image */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full bg-accent/10 rounded-3xl" />
              <img
                src="/tech.nomad.life/assets/profile-about.jpg"
                alt="Dheeraj Kumar Paras"
                className="relative rounded-3xl w-full object-cover shadow-xl max-h-[520px]"
              />
            </div>

            {/* Content */}
            <div>
              <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">About Me</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-5">
                Engineering Leader at Amazon, Builder, Nomad
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                I'm a Software Development Manager at Amazon leading a team of 8+ engineers on AWS Lambda. With 10+ years of experience, I understand what it takes to succeed at top tech companies.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                I've hired Over 60 engineers and mentored 12+. Beyond code, I'm passionate about sharing real stories—immigration challenges, travel adventures, and the human side of tech careers.
              </p>
              <Link href="/tech.nomad.life/about">
                <a className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:bg-accent/90 transition hover:-translate-y-0.5">
                  Learn More About Me <ArrowRight size={15} />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Me ── */}
      <section className="py-20 px-6 bg-secondary/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Why Work With Me</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Professional guidance tailored to help you land top roles and grow as an engineer.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyMePoints.map((point, i) => {
              const Icon = whyIcons[i] || CheckCircle;
              return (
                <div key={point.title} className="bg-card rounded-2xl p-6 border border-border">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{point.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{point.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-5">
            Let's work together to land your dream role or accelerate your technical growth.
          </h2>
          <p className="text-muted-foreground mb-8">
            If you need a tailored coaching plan or have specific requirements, reach out. I can create a custom package based on your needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://topmate.io/dheeraj_kumar7"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-accent text-accent-foreground px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-accent/90 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Book a Session <ArrowRight size={15} />
            </a>
            <Link href="/tech.nomad.life/services">
              <a className="flex items-center gap-2 border border-border bg-background hover:bg-secondary px-7 py-3.5 rounded-xl font-semibold text-sm transition hover:-translate-y-0.5">
                View All Services
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Blog Preview ── */}
      <section className="py-20 px-6 bg-secondary/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Blog</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              From system design deep dives to immigration stories, travel adventures, and lessons learned leading teams at Amazon.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {featuredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-accent/10 text-accent text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 leading-snug">{post.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                    <Link href={`/tech.nomad.life/blog/${post.id}`}>
                      <a className="text-sm font-semibold text-accent hover:underline flex items-center gap-1">
                        Read <ArrowRight size={13} />
                      </a>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center">
            <Link href="/tech.nomad.life/blog">
              <a className="inline-flex items-center gap-2 border border-border bg-background hover:bg-secondary px-6 py-3 rounded-xl text-sm font-semibold transition">
                View All Posts <ArrowRight size={15} />
              </a>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
