import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith('/listing/');

  return (
    <div className="min-h-screen flex flex-col bg-brand-white">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;
