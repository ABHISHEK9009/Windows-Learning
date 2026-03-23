import { Link } from 'react-router-dom';
import {
  BookOpen, Clock, Wallet, Star, Calendar, ChevronRight,
  Heart, TrendingUp, Video, Bell, Settings, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { mockLearnerDashboard, mentors } from '@/data/mockData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const dash = mockLearnerDashboard;
const favMentors = mentors.filter(m => dash.favoriteMentors.includes(m.id));

const LearnerDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />
      <main className="flex-1">
        <div className="container-main py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold">My Learning Dashboard</h1>
              <p className="text-sm text-muted-foreground">Track your progress and manage sessions</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Bell className="h-4 w-4" /> Notifications
              </Button>
              <Link to="/mentors">
                <Button size="sm" className="gap-2 active:scale-[0.97] transition-all">
                  <BookOpen className="h-4 w-4" /> Find Mentors
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Sessions', value: dash.totalSessions.toString(), icon: Video },
              { label: 'Hours Learned', value: `${dash.hoursLearned}h`, icon: Clock },
              { label: 'Wallet Balance', value: `₹${dash.walletBalance.toLocaleString('en-IN')}`, icon: Wallet },
              { label: 'Favorite Mentors', value: dash.favoriteMentors.length.toString(), icon: Heart },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardContent className="p-5">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-2xl font-bold tabular-nums">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Sessions */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
                    <span className="text-xs text-muted-foreground">{dash.upcomingSessions.length} scheduled</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dash.upcomingSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                          {session.mentorName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{session.mentorName}</p>
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
                  {dash.upcomingSessions.length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No upcoming sessions</p>
                      <Link to="/mentors">
                        <Button variant="link" size="sm" className="mt-2 gap-1">
                          Book a session <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Past Sessions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Past Sessions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dash.pastSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">
                          {session.mentorName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{session.mentorName}</p>
                          <p className="text-xs text-muted-foreground">{session.topic}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: session.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{session.date}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              {/* Skill Progress */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" /> Skill Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {dash.skillProgress.map((skill) => (
                    <div key={skill.skill}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{skill.skill}</span>
                        <span className="text-xs text-muted-foreground tabular-nums">{skill.progress}%</span>
                      </div>
                      <Progress value={skill.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Favorite Mentors */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" /> Favorite Mentors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {favMentors.map((mentor) => (
                    <Link
                      key={mentor.id}
                      to={`/mentor/${mentor.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors active:scale-[0.98]"
                    >
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{mentor.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{mentor.expertise[0]}</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium">{mentor.rating}</span>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Wallet */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" /> Wallet
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Available Balance</p>
                    <p className="text-2xl font-bold tabular-nums">₹{dash.walletBalance.toLocaleString('en-IN')}</p>
                  </div>
                  <Button className="w-full gap-2 active:scale-[0.97] transition-all" size="sm">
                    <Wallet className="h-4 w-4" /> Add Credits
                  </Button>
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

export default LearnerDashboard;
