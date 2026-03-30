import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, XCircle, MessageSquare, Video } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MentorLayout from '@/components/MentorLayout';

const mockProposals = {
  pending: [
    { id: '1', title: 'React & Next.js project help', bid: 1500, submitted: 'Mar 22, 2026', status: 'Awaiting response' },
    { id: '2', title: 'Python Data Science mentorship', bid: 2500, submitted: 'Mar 24, 2026', status: 'Awaiting response' },
  ],
  accepted: [
    { id: '3', title: 'Full-Stack Development Coaching', bid: 2000, submitted: 'Mar 15, 2026', learner: 'Arun P.', sessionDate: 'Apr 1, 2026' },
  ],
  rejected: [
    { id: '4', title: 'Mobile App Design Review', bid: 1800, submitted: 'Mar 10, 2026', reason: 'Learner chose another mentor' },
  ],
};

type Tab = 'pending' | 'accepted' | 'rejected';

const MentorProposals = () => {
  const [tab, setTab] = useState<Tab>('pending');
  const tabs: { key: Tab; label: string; count: number; icon: any }[] = [
    { key: 'pending', label: 'Pending', count: mockProposals.pending.length, icon: Clock },
    { key: 'accepted', label: 'Accepted', count: mockProposals.accepted.length, icon: CheckCircle },
    { key: 'rejected', label: 'Rejected', count: mockProposals.rejected.length, icon: XCircle },
  ];

  return (
    <MentorLayout>
      <div className="p-6 md:p-8 max-w-5xl">
        <h1 className="text-2xl font-bold mb-1">My Proposals</h1>
        <p className="text-muted-foreground mb-6">Track your proposal submissions</p>

        <div className="flex gap-1 mb-6 bg-secondary rounded-lg p-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${tab === t.key ? 'bg-card shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {tab === 'pending' && mockProposals.pending.map(p => (
            <Card key={p.id}>
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">Bid: ₹{p.bid.toLocaleString()} · Submitted: {p.submitted}</p>
                  <Badge variant="secondary" className="mt-2 text-xs">{p.status}</Badge>
                </div>
                <Button variant="destructive" size="sm">Withdraw</Button>
              </CardContent>
            </Card>
          ))}
          {tab === 'accepted' && mockProposals.accepted.map(p => (
            <Card key={p.id}>
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">Learner: {(p as any).learner} · Session: {(p as any).sessionDate}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1"><MessageSquare className="h-3 w-3" /> Message</Button>
                  <Button size="sm" className="gap-1"><Video className="h-3 w-3" /> Start Session</Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {tab === 'rejected' && mockProposals.rejected.map(p => (
            <Card key={p.id}>
              <CardContent className="p-5">
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-muted-foreground mt-1">Bid: ₹{p.bid.toLocaleString()} · {(p as any).reason}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MentorLayout>
  );
};

export default MentorProposals;
