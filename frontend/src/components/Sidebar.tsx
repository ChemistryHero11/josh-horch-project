import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import {
  LayoutDashboard,
  Bell,
  Newspaper,
  FileText,
  Settings,
  Activity,
  Shield,
  Radio,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Alerts', href: '/alerts', icon: Bell },
  { name: 'News Feed', href: '/news', icon: Newspaper },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Analytics', href: '/analytics', icon: Activity },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const publicNav = [
  { name: 'Public Portal', href: '/public', icon: Radio },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-72 flex-col border-r border-primary/10 bg-card/95 backdrop-blur-sm">
      {/* Logo Section */}
      <div className="flex h-20 items-center gap-3 border-b border-primary/10 px-6">
        <div className="relative">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center cyber-border-glow">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 animate-pulse border-2 border-card" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gradient">VZLA MONITOR</h1>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Intelligence System</p>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-3 border-b border-primary/10 bg-primary/5">
        <div className="flex items-center gap-2 text-xs">
          <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
          <span className="text-emerald-500 font-mono font-medium">SYSTEM ACTIVE</span>
          <span className="ml-auto text-muted-foreground font-mono">
            {new Date().toLocaleTimeString('en-US', { hour12: false })}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
          Operations
        </p>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary cyber-border-glow'
                  : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-primary" : "group-hover:text-primary"
              )} />
              <span>{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </Link>
          );
        })}
        
        <div className="my-4 border-t border-primary/10" />
        
        <p className="px-3 mb-2 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
          Public Access
        </p>
        {publicNav.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary cyber-border-glow'
                  : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-primary" : "group-hover:text-primary"
              )} />
              <span>{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-primary/10 p-4 bg-primary/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center cyber-border">
            <span className="text-xs font-bold text-primary">OP</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">Operator</p>
            <p className="text-[10px] text-muted-foreground font-mono">CLEARANCE: ALPHA</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
