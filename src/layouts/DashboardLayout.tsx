import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-light-cyan font-inter flex">
      <DashboardSidebar />
      <main className="flex-1 p-6 sm:p-8 md:p-12 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
