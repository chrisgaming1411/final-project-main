import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Find a Place', href: '/find' },
    { name: 'About', href: '/about' },
    { name: 'Login / Register', href: '/login' },
  ];

  return (
    <header className="bg-gradient-primary text-white font-bold relative shadow-md z-30">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
          <img 
            src="https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/f6dd/665b/34697342d2b14a54054bcdeaff51c60e?Expires=1762732800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=CnCweB1ZAYzDFij45dFKizYvfbLnk5zuP~UE5S2O6y70y0UPCr2Vbw6mTziHytjTaDwT7pVo~yuN9nmy4UE4svQoPMKrt-RzSyjHA-VxYzTTpfpskBfYhJOFr4D2A2fIoHXHdU9gOLNp3OnAMYk4IDlvrVci03hmDYKrBg2g-jeoaeWfRa8IuaMFNyctnHvRte~1K4Bk1Pkz1~gvR-S9clcPr8~Q3n3FHZQC0xHkW0vrLJoWc6NLHhrrYL208ZE9LbAwyj3R0RqJ~MEH9kmW-29BRe7t0IRNPV93qLWb~FwgEVehI6w5zjKv82U~3Y-wDbpwSqPgxZwsINyksG02iw__" 
            alt="Homebase Finder Logo" 
            className="h-12 w-12"
          />
          <div>
            <div className="text-lg font-black text-brand-dark-navy">HOMEBASE</div>
            <div className="text-lg font-black text-brand-teal">FINDER</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href} 
              className={`text-lg transition-colors ${location.pathname === link.href ? 'text-brand-dark-navy' : 'text-white hover:text-brand-light-cyan'}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gradient-primary z-20">
          <nav className="flex flex-col items-center space-y-4 py-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href} 
                className={`text-lg transition-colors ${location.pathname === link.href ? 'text-brand-dark-navy' : 'text-white hover:text-brand-light-cyan'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
