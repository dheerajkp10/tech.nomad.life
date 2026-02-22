import { Link } from 'wouter';
import { ArrowRight, Briefcase, MapPin, Users, Globe, TrendingUp, MessageSquare, Plane, BookOpen } from 'lucide-react';

const mentorPoints = [
  {
    icon: Briefcase,
    title: 'Real Industry Experience',
    desc: "10+ years of professional experience building systems at scale. I've faced the challenges you're facing.",
  },
  {
    icon: Users,
    title: 'Interview Expertise',
    desc: 'Hired Over 60 engineers across organizations. I know exactly what interviewers are looking for—technical depth, problem-solving, and communication.',
  },
  {
    icon: TrendingUp,
    title: 'System Design Mastery',
    desc: 'Built and scaled systems handling billions of invocations daily. I can break down complex architectural decisions into learnable concepts.',
  },
  {
    icon: MessageSquare,
    title: 'Mentoring at Scale',
    desc: 'Actively mentored 12+ engineers. I understand career stages and can provide personalized guidance for your specific situation.',
  },
  {
    icon: Globe,
    title: 'Global Perspective',
    desc: 'My immigration journey and travels have given me insight into diverse career paths and the unique challenges of building careers across cultures.',
  },
  {
    icon: MessageSquare,
    title: 'Honest, Direct Feedback',
    desc: "I'll tell you what you need to hear, not what you want to hear. Growth happens through honest conversations and actionable improvement.",
  },
];

const lifeTiles = [
  { icon: Plane, title: 'Travel', subtitle: 'Exploring cultures globally' },
  { icon: BookOpen, title: 'Tech Writing', subtitle: 'Deep dives and lessons' },
  { icon: Users, title: 'Mentorship', subtitle: 'Helping engineers grow' },
  { icon: TrendingUp, title: 'Growth', subtitle: 'Continuous learning' },
];

export default function Home() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-10 bg-[#FAF8F5]">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#FEF3E2] border border-[#FDDBA8] text-[#92400E] text-xs font-medium px-4 py-1.5 rounded-full mb-8">
          👨🏻‍💻 Engineering Leader at Amazon
        </div>

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-[#1C1A17] leading-none tracking-tight mb-5">
          Hello World!
        </h1>

        <p className="text-xl text-[#6B6560] mb-1">👋🏼 I'm Dheeraj</p>
        <p className="text-base font-medium text-[#1C1A17] mb-6">Human in the Loop</p>

        <p className="text-[#6B6560] text-base max-w-xl mx-auto leading-relaxed mb-10">
          10+ years building systems with the 'ities. I mentor budding and seasoned engineers. I help engineers master interviews, design systems at scale, and build careers—from wherever you are in the world. On the personal side, I enjoy traveling and exploring new places, people and discovering myself. Bonus: I learned some through my own immigration journey, and would love to share and help anyone in need!
        </p>

        <Link href="/about">
          <a className="inline-flex items-center gap-2 border-2 border-[#1C1A17] text-[#1C1A17] font-medium px-7 py-2.5 rounded-full hover:bg-[#1C1A17] hover:text-white transition-all text-sm">
            My Journey
          </a>
        </Link>
      </section>

      {/* ── About Me ── */}
      <section className="py-24 px-6 bg-[#FAF8F5]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image with border decoration */}
          <div className="relative">
            <div className="border-2 border-[#F97316]/40 rounded-2xl p-3">
              <img
                src="/tech.nomad.life/assets/profile-about.jpg"
                alt="Dheeraj Kumar Paras"
                className="w-full rounded-xl object-cover max-h-[500px]"
              />
            </div>
            {/* Floating India → USA card */}
            <div className="absolute bottom-6 right-0 translate-x-4 bg-white rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2 text-sm font-medium text-[#1C1A17]">
              🇮🇳 ✈️ 🇺🇸 India → USA
            </div>
          </div>

          {/* Content */}
          <div>
            {/* DKP badge + label */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#FEF3E2] border border-[#FDDBA8] rounded-full flex items-center justify-center">
                <span className="text-[#F97316] font-bold text-sm">DKP.</span>
              </div>
              <span className="text-xs font-semibold tracking-widest text-[#6B6560] uppercase">About Me</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-[#1C1A17] leading-tight mb-6">
              Engineering Leader,<br />Builder, Nomad
            </h2>

            <p className="text-[#6B6560] text-base leading-relaxed mb-4">
              I'm a Software Development Manager, currently leading a team of super-talented engineers. With 10+ years of overall experience, I deeply understand what it takes to succeed at top tech companies.
            </p>
            <p className="text-[#6B6560] text-base leading-relaxed mb-8">
              I'm a seasoned interviewer and have coached and mentored multiple entry and mid level engineers. Beyond code, I'm passionate about sharing real stories—immigration challenges, travel adventures, and the human side of tech careers.
            </p>

            {/* Tags grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: MapPin, label: 'Based in the US' },
                { icon: Briefcase, label: 'Tech Builder' },
                { icon: Users, label: 'Mentor & Coach' },
                { icon: TrendingUp, label: 'Engineering Leader' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-[#6B6560]">
                  <Icon size={15} className="text-[#F97316]" />
                  {label}
                </div>
              ))}
            </div>

            <Link href="/about">
              <a className="inline-flex items-center gap-2 border border-[#D8D0C4] text-[#1C1A17] text-sm font-medium px-5 py-2.5 rounded-full hover:border-[#1C1A17] transition-colors">
                Read My Full Story <ArrowRight size={14} />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* ── What Makes Me Effective ── */}
      <section className="py-24 px-6 bg-[#FAF8F5]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-[#1C1A17] text-center mb-14">
            What Makes Me Effective as a Mentor
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {mentorPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.title}
                  className="bg-white border border-[#E8E2D9] rounded-2xl p-6 hover:shadow-sm transition-shadow"
                >
                  <div className="w-10 h-10 bg-[#FEF3E2] rounded-xl flex items-center justify-center mb-4">
                    <Icon size={18} className="text-[#F97316]" />
                  </div>
                  <h3 className="font-bold text-[#1C1A17] text-base mb-2">{point.title}</h3>
                  <p className="text-[#6B6560] text-sm leading-relaxed">{point.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Life, Lessons, and Growth ── */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#FEF3E2] via-[#FAF8F5] to-[#FAF8F5]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left text */}
          <div>
            <span className="inline-block bg-[#FEF3E2] border border-[#FDDBA8] text-[#92400E] text-xs font-semibold px-3 py-1 rounded-full mb-5">
              Beyond Code
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#1C1A17] leading-tight mb-6">
              Life, Lessons, and Growth
            </h2>
            <p className="text-[#6B6560] text-base leading-relaxed mb-4">
              I'm not just about climbing the corporate ladder. I've navigated immigration from India to the US, explored 6+ countries across the European and American sub-continents, and learned that resilience and human connection matter as much as technical skills.
            </p>
            <p className="text-[#6B6560] text-base leading-relaxed mb-8">
              I write about these experiences—career pivots, cultural challenges, travel stories. Because the best engineers are well-rounded humans.
            </p>
            <Link href="/blog">
              <a className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA6C0A] text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm">
                Read My Articles <ArrowRight size={15} />
              </a>
            </Link>
          </div>

          {/* Right 2x2 grid */}
          <div className="grid grid-cols-2 gap-4">
            {lifeTiles.map(({ icon: Icon, title, subtitle }) => (
              <div
                key={title}
                className="bg-white border border-[#E8E2D9] rounded-2xl p-6 hover:shadow-sm transition-shadow"
              >
                <div className="w-10 h-10 bg-[#FEF3E2] rounded-xl flex items-center justify-center mb-4">
                  <Icon size={18} className="text-[#F97316]" />
                </div>
                <h3 className="font-bold text-[#1C1A17] text-base mb-1">{title}</h3>
                <p className="text-[#6B6560] text-sm">{subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
