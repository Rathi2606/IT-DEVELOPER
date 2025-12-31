import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-white/95 backdrop-blur-md'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg font-bold">
              📋
            </div>
            <span className="text-xl font-bold text-gray-800">TaskLane</span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'Contact'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
              >
                {item}
              </a>
            ))}

            <Link
              to="/about"
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              About
            </Link>
          </nav>

          {/* CTA button */}
          <Button
            onClick={() => navigate(isSignedIn ? '/dashboard' : '/sign-up')}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
          >
            {isSignedIn ? 'Dashboard' : 'Get Started Free'}
          </Button>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
