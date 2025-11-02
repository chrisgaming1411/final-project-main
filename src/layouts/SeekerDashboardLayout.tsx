import React from 'react';
import { Outlet } from 'react-router-dom';
import SeekerDashboardSidebar from '../components/SeekerDashboardSidebar';

const SeekerDashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-light-cyan font-inter flex">
      <SeekerDashboardSidebar />
      <main className="flex-1 p-6 sm:p-8 md:p-12 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default SeekerDashboardLayout;
