import React from 'react';
import {
  LayoutDashboard,
  FileText,
  GitMerge,
  ArrowUpDown,
  MapPin,
  ShieldCheck,
  BarChart3,
  Play,
  ShieldAlert,
} from 'lucide-react';
import { PageId } from '../types';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage?: (page: PageId) => void;
  onNavigate?: (page: PageId) => void;
  onOpenSimulation: () => void;
  criticalCount: number;
  totalCrisesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  onNavigate,
  onOpenSimulation,
  criticalCount,
  totalCrisesCount = 4,
}) => {
  const handleNavigate = (page: PageId) => {
    if (onSelectPage) onSelectPage(page);
    else if (onNavigate) onNavigate(page);
  };

  const navItems: Array<{
    id: PageId;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    badgeColor?: string;
  }> = [
    {
      id: 'command-center',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <FileText className="w-4 h-4" />,
      badge: 'Live',
      badgeColor: 'bg-slate-100 text-slate-600',
    },
    {
      id: 'fusion',
      label: 'Fusion',
      icon: <GitMerge className="w-4 h-4" />,
    },
    {
      id: 'priority',
      label: 'Priority',
      icon: <ArrowUpDown className="w-4 h-4" />,
      badge: criticalCount > 0 ? `${criticalCount} Critical` : undefined,
      badgeColor: 'bg-red-50 text-red-700 border border-red-200',
    },
    {
      id: 'map',
      label: 'Map',
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      id: 'response',
      label: 'Response',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
    },
  ];

  return (
    <aside
      id="main-sidebar"
      className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0 h-screen sticky top-0 z-30 select-none text-slate-800"
    >
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center text-white">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 tracking-tight leading-tight">
                CrisisLens <span className="text-xs font-normal text-slate-500">AI</span>
              </div>
              <div className="text-[10px] text-slate-400">Emergency Fusion</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="px-3 py-3 flex-1 overflow-y-auto space-y-1">
        <div className="px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-slate-400">
          Navigation
        </div>

        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => handleNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white font-medium shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    isActive
                      ? 'bg-slate-800 text-slate-200'
                      : item.badgeColor || 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Live Simulation Action */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50 space-y-2">
        <button
          id="sidebar-run-simulation-btn"
          onClick={onOpenSimulation}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Run Live Simulation</span>
        </button>

        <div className="px-1 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Active Crises</span>
          <span className="font-semibold text-slate-700">{totalCrisesCount}</span>
        </div>
      </div>
    </aside>
  );
};
