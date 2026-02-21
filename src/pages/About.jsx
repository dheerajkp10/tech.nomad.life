import { ArrowRight, MapPin, Globe, Briefcase, Users } from 'lucide-react';
import { experience, whyMePoints } from '../data/content';

const whyIcons = [Briefcase, Users, Globe, Users, Globe, ArrowRight];

export default function About() {
  return (
    <div className="pt-20">
      {/* ── Hero ── */}
      <section className="py-20 px-6 bg-gradient-to-b from-yellow-50/60 to-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Content */}
            <div>
              <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">About Me</p>
              <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
                Engineering Leader at Amazon, Builder, Nomad
              </h1>
              <p className="text-muted-foreground leading-relaxed text-lg mb-5">
                I'm a Software Development Manager at Amazon leading a team of 8+ engineers on AWS Lambda. With 10+ years of experience, I understand what it takes to succeed at top tech companies.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                I've hired Over 60 engineers and mentored 12+. Beyond code, I'm passionate about sharing real stories—immigration challenges, travel adventures, and the human side of tech careers.
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

            {/* Image */}
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-full h-full bg-accent/10 rounded-3xl" />
              <img
                src="/tech.nomad.life/assets/profile-about.jpg"
                alt="Dheeraj Kumar Paras"
                className="relative rounded-3xl w-full object-cover shadow-xl max-h-[560px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── My Story ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-4">My Story</p>
          <h2 className="font-serif text-4xl font-bold text-foreground mb-8">
            I've spent over a decade building scalable, highly available software at Amazon. But my story is about so much more than code.
          </h2>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              I was born and raised in India, and moving to the US for my tech career was one of the most transformative decisions of my life. It wasn't just about better job opportunities—it was about challenging myself, understanding different cultures, and becoming a truly global engineer.
            </p>
            <p>
              Today, I mentor engineers through similar journeys. Immigration isn't just a logistical challenge—it's a personal transformation. And that transformation often makes you a better engineer and leader.
            </p>

            <div className="border-l-4 border-accent pl-6 py-2 my-8">
              <p className="italic text-foreground text-lg">
                I've learned to adapt quickly, listen deeply, and see problems through different lenses. These experiences have profoundly influenced how I think about problems, lead teams, and approach my career.
              </p>
            </div>

            <p>
              I believe that travel makes you a better engineer. It breaks down assumptions, builds empathy, and teaches you to think in systems—something invaluable when designing distributed systems at scale.
            </p>
          </div>
        </div>
      </section>

      {/* ── Why Work With Me ── */}
      <section className="py-20 px-6 bg-secondary/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Why Work With Me</p>
            <h2 className="font-serif text-4xl font-bold text-foreground">
              What I bring to every session
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyMePoints.map((point, i) => {
              const Icon = whyIcons[i] || Briefcase;
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

      {/* ── Experience Timeline ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-4">Experience</p>
          <h2 className="font-serif text-4xl font-bold text-foreground mb-12">Career Journey</h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-10">
              {experience.map((job, i) => (
                <div key={i} className="relative pl-12">
                  {/* Dot */}
                  <div className="absolute left-0 top-1 w-8 h-8 bg-accent/10 border-2 border-accent rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                  </div>

                  <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{job.title}</h3>
                        <p className="text-accent text-sm font-medium">{job.company}</p>
                      </div>
                      <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full shrink-0">
                        {job.period}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{job.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-6 bg-secondary/40">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
            Ready to accelerate your career?
          </h2>
          <p className="text-muted-foreground mb-8">
            Let's work together to land your dream role or accelerate your technical growth.
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
