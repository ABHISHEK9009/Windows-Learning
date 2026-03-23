import { Link } from 'react-router-dom';
import {
  IndianRupee, TrendingUp, Users, Calendar, Clock, Star,
  ArrowUpRight, ArrowDownRight, Video, Settings, Bell,
  ChevronRight, Wallet, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockMentorDashboard, mentors } from '@/data/mockData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const mentor = mentors[0]; // Mock: logged in as Priya Sharma
const dash = mockMentorDashboard;

const MentorDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />
      <main className="flex-1">
        <div className="container-main py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                {mentor.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {mentor.name.split(' ')[0]}</h1>
                <p className="text-sm text-muted-foreground">Here's your mentoring overview</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Bell className="h-4 w-4" /> Notifications
              </Button>
              <Link to="/mentor/settings">
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" /> Settings
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Earnings', value: `₹${dash.totalEarnings.toLocaleString('en-IN')}`, icon: IndianRupee, change: '+12.5%', positive: true },
              { label: 'This Month', value: `₹${dash.monthlyEarnings.toLocaleString('en-IN')}`, icon: TrendingUp, change: '+8.2%', positive: true },
              { label: 'Total Sessions', value: dash.totalSessions.toString(), icon: Video, change: '+23', positive: true },
              { label: 'Rating', value: mentor.rating.toString(), icon: Star, change: `${mentor.reviewCount} reviews`, positive: true },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className={`flex items-center gap-0.5 text-xs font-medium ${stat.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                        {stat.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {stat.change}
                      </span>
                    </div>
                    <div className="text-2xl font-bold tabular-nums">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Upcoming Sessions */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
                    <Link to="/mentor/sessions" className="text-sm text-primary hover:underline flex items-center gap-1">
                      View all <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dash.upcomingSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                          {session.learnerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{session.learnerName}</p>
                          <p className="text-xs text-muted-foreground">{session.topic}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{session.date}</p>
                        <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                          <Clock className="h-3 w-3" /> {session.time} · {session.duration}hr
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Sessions */}
              <Card className="mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Recent Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dash.recentSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">
                            {session.learnerName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{session.learnerName}</p>
                            <p className="text-xs text-muted-foreground">{session.topic}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-accent tabular-nums">+₹{session.earned?.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-muted-foreground">{session.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              {/* Earnings chart placeholder */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" /> Earnings Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dash.monthlyData.map((d) => (
                      <div key={d.month} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-8">{d.month}</span>
                        <div className="flex-1 h-6 bg-secondary rounded-md overflow-hidden">
                          <div
                            className="h-full bg-primary/80 rounded-md transition-all duration-500"
                            style={{ width: `${(d.earnings / 50000) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium tabular-nums w-14 text-right">₹{(d.earnings / 1000).toFixed(1)}k</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payout info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" /> Payout
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground">This week's earnings</p>
                    <p className="text-2xl font-bold tabular-nums">₹{dash.weeklyEarnings.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-accent/10 text-sm">
                    <p className="font-medium text-accent">Next payout: Friday</p>
                    <p className="text-xs text-muted-foreground mt-1">After 20% platform fee: ₹{(dash.weeklyEarnings * 0.8).toLocaleString('en-IN')}</p>
                  </div>
                  <Button variant="outline" className="w-full gap-2" size="sm">
                    <IndianRupee className="h-4 w-4" /> View Payout History
                  </Button>
                </CardContent>
              </Card>

              {/* Quick actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { label: 'Manage Availability', icon: Calendar },
                    { label: 'Edit Profile', icon: Users },
                    { label: 'View Reviews', icon: Star },
                  ].map(action => {
                    const Icon = action.icon;
                    return (
                      <button key={action.label} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-sm font-medium active:scale-[0.98]">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        {action.label}
                        <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentorDashboard;
