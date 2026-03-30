import { Calendar, Clock, Video, Star, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MentorLayout from '@/components/MentorLayout';
import { useState } from 'react';

const mockSessions = {
  upcoming: [
    { id: '1', learner: 'Priya Sharma', topic: 'React State Management', date: 'Mar 28, 2026', time: '5:00 PM', duration: '1 hour', price: 1500 },
    { id: '2', learner: 'Ankit Kumar', topic: 'Python Data Pipeline', date: 'Mar 30, 2026', time: '3:00 PM', duration: '2 hours', price: 5000 },
  ],
  past: [
    { id: '3', learner: 'Sneha R.', topic: 'Figma Advanced', date: 'Mar 20, 2026', time: '5:00 PM', duration: '1 hour', price: 2000, rating: 5 },
    { id: '4', learner: 'Rohan V.', topic: 'SEO Audit Walkthrough', date: 'Mar 15, 2026', time: '11:00 AM', duration: '1 hour', price: 1200, rating: 4 },
  ],
};

type Tab = 'upcoming' | 'past';

const MentorSessions = () => {
  const [tab, setTab] = useState<Tab>('upcoming');

  return (
    <MentorLayout>
      <div className="p-6 md:p-8 max-w-5xl">
        <h1 className="text-2xl font-bold mb-1">My Sessions</h1>
        <p className="text-muted-foreground mb-6">Manage your mentoring sessions</p>

        <div className="flex gap-1 mb-6 bg-secondary rounded-lg p-1 max-w-xs">
          {(['upcoming', 'past'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {mockSessions[tab].map((session: any) => (
            <Card key={session.id}>
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                  {session.learner.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{session.learner}</p>
                  <p className="text-sm text-muted-foreground">{session.topic}</p>
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{session.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{session.time} · {session.duration}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold">₹{session.price.toLocaleString()}</p>
                  {tab === 'upcoming' && (
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" className="gap-1"><Video className="h-3 w-3" /> Join</Button>
                      <Button size="sm" variant="outline"><RotateCcw className="h-3 w-3" /></Button>
                    </div>
                  )}
                  {tab === 'past' && session.rating && (
                    <div className="flex items-center gap-1 mt-2 text-sm text-warning">
                      <Star className="h-3 w-3 fill-current" /> {session.rating}/5
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MentorLayout>
  );
};

export default MentorSessions;
