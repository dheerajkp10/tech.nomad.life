import { ArrowRight, Clock, CheckCircle, ExternalLink } from 'lucide-react';
import { services } from '../data/content';

export default function Services() {
  return (
    <div className="pt-20">
      {/* ── Hero ── */}
      <section className="py-20 px-6 bg-gradient-to-b from-yellow-50/60 to-background text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Services</p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-5">
            Specialized Coaching
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Specialized coaching tailored to your specific career stage. Let's work together to land your dream role or accelerate your technical growth.
          </p>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col p-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground text-lg leading-tight">{service.title}</h3>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold font-serif text-accent">{service.price}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={12} />
                    {service.duration}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-5">{service.description}</p>

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {service.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <CheckCircle size={15} className="text-accent shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={service.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-accent text-accent-foreground hover:bg-accent/90 px-5 py-3 rounded-xl font-semibold text-sm transition hover:-translate-y-0.5"
                >
                  Book Now <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Custom Package CTA ── */}
      <section className="py-16 px-6 bg-secondary/40">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
            Need something custom?
          </h2>
          <p className="text-muted-foreground mb-8">
            If you need a tailored coaching plan or have specific requirements, reach out. I can create a custom package based on your needs.
          </p>
          <a
            href="https://topmate.io/dheeraj_kumar7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-accent/90 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Get in Touch <ArrowRight size={15} />
          </a>
        </div>
      </section>

      {/* ── Why Choose Me ── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground">
              What makes sessions different
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: '10+ years at Amazon',
                desc: 'Real industry experience building systems at scale—not just theoretical knowledge.',
              },
              {
                title: '60+ engineers hired',
                desc: 'I know exactly what interviewers look for: technical depth, communication, and problem-solving.',
              },
              {
                title: 'Personalized feedback',
                desc: 'Every session is tailored to your background, goals, and the specific roles you\'re targeting.',
              },
              {
                title: 'Post-session support',
                desc: 'Detailed written feedback after every session so you can review and improve between sessions.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle size={16} className="text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
