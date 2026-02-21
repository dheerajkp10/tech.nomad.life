import { useParams, Link } from 'wouter';
import { ArrowLeft, Clock, Calendar, ArrowRight } from 'lucide-react';
import { blogPosts } from '../data/content';

export default function BlogPost() {
  const params = useParams();
  const post = blogPosts.find((p) => p.id === params.slug);

  if (!post) {
    return (
      <div className="pt-32 px-6 text-center">
        <h1 className="font-serif text-4xl font-bold text-foreground mb-4">Post not found</h1>
        <Link href="/tech.nomad.life/blog">
          <a className="text-accent hover:underline">Back to Blog</a>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero image */}
      <div className="w-full h-72 md:h-96 overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-14">
        {/* Back link */}
        <Link href="/tech.nomad.life/blog">
          <a className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition">
            <ArrowLeft size={15} /> Back to Blog
          </a>
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <span className="bg-accent/10 text-accent text-xs font-medium px-2.5 py-0.5 rounded-full">
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar size={12} /> {post.date}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={12} /> {post.readTime}
          </span>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
          {post.title}
        </h1>

        <p className="text-xl text-muted-foreground leading-relaxed mb-10 border-l-4 border-accent pl-5 italic">
          {post.excerpt}
        </p>

        {/* Placeholder content */}
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-5">
          <p>
            This is a preview of the full post. The complete article explores the topic in depth with real-world examples, code snippets, and personal insights from my career at Amazon.
          </p>
          <p>
            For personalized coaching and guidance on topics like this, book a session with me directly.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-14 p-8 bg-secondary rounded-2xl border border-border text-center">
          <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
            Want personalized guidance?
          </h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Book a 1:1 session to get tailored advice for your specific situation.
          </p>
          <a
            href="https://topmate.io/dheeraj_kumar7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:bg-accent/90 transition"
          >
            Book a Session <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
