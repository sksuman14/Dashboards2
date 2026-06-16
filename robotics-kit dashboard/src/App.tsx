import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Details from './pages/Details';
import Deployments from './pages/Deployments';

function App() {
  return (
    <div className="relative flex flex-col min-h-screen bg-surface text-on-surface font-body overflow-x-hidden">
      {/* Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] ambient-glow-2 opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] ambient-glow-1 opacity-30"></div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10 shadow-lg px-6 sm:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="font-headline text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-primary/80 tracking-tighter hover:opacity-80 transition-opacity">
          Robotics Kits
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/deployments" className="text-sm font-label font-bold text-white/70 hover:text-primary uppercase tracking-widest transition-colors">
            Deployments
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Details />} />
        <Route path="/deployments" element={<Deployments />} />
      </Routes>
    </div>
  );
}

export default App;
