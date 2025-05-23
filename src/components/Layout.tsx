
import React from 'react';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showNavigation = true }) => {
  return (
    <div className="min-h-screen bg-skate-bg">
      {showNavigation && <Navigation />}
      <main className={showNavigation ? "pt-16" : ""}>
        {children}
      </main>
    </div>
  );
};
