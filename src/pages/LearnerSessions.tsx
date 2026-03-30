import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Video, Star, MessageSquare, Download, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LearnerLayout from '@/components/LearnerLayout';

const mockSessions = {
  upcoming: [
    { id: '1', mentorName: 'Dr. Sarah Chen', mentorAvatar: 'SC', topic: 'React Advanced Patterns', date: 'Mar 28, 2026', time: '5:00 PM', duration: '1 hour', price: 1500, mentorId: 'mentor-1' },
    { id: '2', mentorName: 'Rahul Mehta', mentorAvatar: 'RM', topic: 'Figma Prototyping Masterclass', date: 'Mar 30, 2026', time: '3:00 PM', duration: '2 hours', price: 4000, mentorId: 'mentor-2' },
  ],
  past: [
    { id: '3', mentorName: 'Dr. Sarah Chen', mentorAvatar: 'SC', topic: 'React Hooks Deep Dive', date: 'Mar 20, 2026', time: '5:00 PM', duration: '1 hour', price: 1500, rating: 5, mentorId: 'mentor-1' },
    { id: '4', mentorName: 'Vikram Singh', mentorAvatar: 'VS', topic: 'SEO Strategy Workshop', date: 'Mar 15, 2026', time: '11:00 AM', duration: '1 hour', price: 1200, rating: 4, mentorId: 'mentor-4' },
  ],
  cancelled: [
    { id: '5', mentorName: 'Neha Gupta', mentorAvatar: 'NG', topic: 'Product Roadmap Planning', date: 'Mar 10, 2026', time: '2:00 PM', duration: '1 hour', price: 1800, mentorId: 'mentor-5' },
  ],
};

type Tab = 'upcoming' | 'past' | 'cancelled';

const LearnerSessions = () => {
  const [tab, setTab] = useState<Tab>('upcoming');
  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'upcoming', label: 'Upcoming', count: mockSessions.upcoming.length },
    { key: 'past', label: 'Past', count: mockSessions.past.length },
    { key: 'cancelled', label: 'Cancelled', count: mockSessions.cancelled.length },
  ];

  return (
    <LearnerLayout>
      <div className="p-6 md:p-8 max-w-5xl">
        <h1 className="text-2xl font-bold mb-1">My Sessions</h1>
        <p className="text-muted-foreground mb-6">Manage your mentoring sessions</p>

        <div className="flex gap-1 mb-6 bg-secondary rounded-lg p-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${tab === t.key ? 'bg-card shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {mockSessions[tab].map((session: any) => (
            <Card key={session.id}>
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                    {session.mentorAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/mentor/${session.mentorId}`} className="font-semibold hover:text-primary">{session.mentorName}</Link>
                    <p className="text-sm text-muted-foreground">{session.topic}</p>
                    <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{session.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{session.time} · {session.duration}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold">₹{session.price.toLocaleString()}</p>
                    {tab === 'upcoming' && (
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" className="gap-1"><Video className="h-3 w-3" /> Join</Button>
                        <Button size="sm" variant="outline" className="gap-1"><RotateCcw className="h-3 w-3" /> Reschedule</Button>
                      </div>
                    )}
                    {tab === 'past' && (
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" className="gap-1"><Star className="h-3 w-3" /> Review</Button>
                        <Button size="sm" variant="outline" className="gap-1"><Download className="h-3 w-3" /> Notes</Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </LearnerLayout>
  );
};

export default LearnerSessions;
