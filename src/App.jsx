import { Route, Switch } from 'wouter';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

// Base path for GitHub Pages deployment
const BASE = '/tech.nomad.life';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path={`${BASE}/`} component={Home} />
          <Route path={`${BASE}/about`} component={About} />
          <Route path={`${BASE}/services`} component={Services} />
          <Route path={`${BASE}/blog`} component={Blog} />
          <Route path={`${BASE}/blog/:slug`} component={BlogPost} />
          {/* Fallback */}
          <Route component={Home} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}
