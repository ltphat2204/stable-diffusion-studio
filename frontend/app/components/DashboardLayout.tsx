import React from "react";

interface DashboardLayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ sidebar, main }) => {
  return (
    <div className="h-screen flex bg-gray-900 text-gray-200">
      {/* Sidebar */}
      <aside className="w-96 bg-gray-800 flex flex-col items-center py-8 px-4 border-r border-gray-700 overflow-y-auto max-h-screen">
        {sidebar}
      </aside>
      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen min-h-0 overflow-y-auto pl-8 pr-8 pb-8">
        {main}
      </main>
    </div>
  );
}; 