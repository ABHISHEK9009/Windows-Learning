import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, TrendingUp, Wallet, Search, FileText, Settings, HelpCircle, LogOut } from 'lucide-react';

const sidebarItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'My Sessions', to: '/learner/sessions', icon: Calendar },
  { label: 'Progress Tracker', to: '/learner/progress', icon: TrendingUp },
  { label: 'My Wallet', to: '/learner/wallet', icon: Wallet },
  { label: 'Find Mentors', to: '/mentors', icon: Search },
  { label: 'Post Requirement', to: '/requirements/post', icon: FileText },
  { label: 'Settings', to: '/settings', icon: Settings },
  { label: 'Help & Support', to: '/help', icon: HelpCircle },
];

const LearnerLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r bg-card shrink-0">
        <div className="p-6 border-b">
          <Link to="/" className="text-lg font-bold">
            Windows<span className="text-accent">Learning</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map(item => {
            const active = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <Link to="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary">
            <LogOut className="h-4 w-4" /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden border-b bg-card px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold">Windows<span className="text-accent">Learning</span></Link>
          <div className="flex items-center gap-2">
            {sidebarItems.slice(0, 4).map(item => (
              <Link key={item.to} to={item.to}
                className={`p-2 rounded-lg ${location.pathname === item.to ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
                <item.icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default LearnerLayout;
