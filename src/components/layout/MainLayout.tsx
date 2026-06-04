import React from 'react';
import { Outlet } from 'react-router-dom';
import InteractiveBackground from '../common/InteractiveBackground';

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen relative w-full">
      <InteractiveBackground />
      <main className="flex-grow w-full z-10 relative">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;