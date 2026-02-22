import { Link } from 'wouter';
import { MapPin, Briefcase, Globe, Calendar } from 'lucide-react';

const experience = [
  {
    period: 'May 2025 - Present',
    title: 'Software Development Manager',
    company: 'Amazon Web Services',
    desc: "Leading a team of 8+ engineers on AWS Lambda's data plane, managing critical infrastructure that handles billions of serverless function invocations daily with 99.99% availability. Responsible for front-gate routing, concurrency management, and cross-functional collaboration on reliability and performance improvements.",
  },
  {
    period: 'Dec 2022 - May 2025',
    title: 'Team Lead & Senior Software Engineer',
    company: 'Amazon',
    desc: 'Led initiatives in LLM content moderation and interactive recommendation systems. Delivered high-impact improvements driving 6MM+ annual paid units for Books category. Managed complex projects, built cross-functional partnerships, and actively mentored junior and mid-level engineers.',
  },
  {
    period: 'Jan 2020 - Dec 2022',
    title: 'Software Development Engineer II',
    company: 'Amazon',
    desc: 'Led design and development of core strategy service for personalized recommendations. Integrated sponsored content into recommendation systems while maintaining relevancy. Also directed successful launch of Amazon Book Clubs with content moderation features.',
  },
];

export default function About() {
  return (
    <div className="pt-20">
      {/* ── Hero ── */}
      <section className="py-16 px-6 bg-[#FAF8F5]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* Profile card */}
          <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-5">
              <img
                src="/tech.nomad.life/assets/profile-about.jpg"
                alt="Dheeraj Kumar Paras"
                className="w-16 h-16 rounded-full object-cover object-top"
              />
              <div>
                <h2 className="font-bold text-[#1C1A17] text-lg">Dheeraj Kumar Paras</h2>
                <p className="text-[#6B6560] text-sm">Software Development Manager</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-[#6B6560]">
              {[
                { icon: Briefcase, label: 'Amazon Web Services' },
                { icon: MapPin, label: 'Bellevue, WA' },
                { icon: Globe, label: 'Originally from India' },
                { icon: Calendar, label: '10+ years experience' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={14} className="text-[#F97316]" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Heading + intro */}
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-[#1C1A17] leading-tight mb-5">
              Building Systems, Leading Teams, Living Fully
            </h1>
            <p className="text-[#6B6560] text-base leading-relaxed">
              I've spent over a decade building scalable, performant and highly available software. But my story is about so much more than code.
            </p>
          </div>
        </div>
      </section>

      {/* ── Career Journey ── */}
      <section className="py-16 px-6 bg-[#FAF8F5]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-[#1C1A17] mb-10">My Career Journey</h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#E8E2D9]" />

            <div className="space-y-10">
              {experience.map((job, i) => (
                <div key={i} className="relative pl-8">
                  {/* Dot */}
                  <div className="absolute left-0 top-1.5 w-3.5 h-3.5 bg-[#F97316] rounded-full border-2 border-white ring-2 ring-[#F97316]/20" />

                  <p className="text-[#F97316] text-xs font-semibold mb-1">{job.period}</p>
                  <h3 className="font-bold text-[#1C1A17] text-base mb-0.5">{job.title}</h3>
                  <p className="text-[#6B6560] text-sm mb-3">{job.company}</p>
                  <p className="text-[#6B6560] text-sm leading-relaxed">{job.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
