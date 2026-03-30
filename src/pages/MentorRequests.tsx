import { Link } from 'react-router-dom';
import { Inbox, Clock, DollarSign, MapPin, ChevronRight, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MentorLayout from '@/components/MentorLayout';

const mockRequests = [
  { id: '1', title: 'Need help with React & Next.js project', budget: '₹1,500 - ₹2,000', mode: 'Online', deadline: 'Mar 30, 2026', skills: ['React', 'Next.js', 'TypeScript'], description: 'Looking for a mentor who can help me build a full-stack app with authentication and database integration.', learnerName: 'Priya M.' },
  { id: '2', title: 'Python Data Science mentorship', budget: '₹2,000 - ₹3,000', mode: 'Online', deadline: 'Apr 5, 2026', skills: ['Python', 'Data Science', 'Pandas'], description: 'Need guidance on data analysis project for my thesis. Have basic Python knowledge.', learnerName: 'Ankit K.' },
  { id: '3', title: 'UI/UX Design Portfolio Review', budget: '₹1,000 - ₹1,500', mode: 'Online', deadline: 'Apr 2, 2026', skills: ['UI/UX', 'Figma', 'Portfolio'], description: 'Want an experienced designer to review my portfolio and provide feedback before job applications.', learnerName: 'Sneha R.' },
  { id: '4', title: 'Digital Marketing Strategy for Startup', budget: '₹2,500 - ₹3,000', mode: 'Online', deadline: 'Apr 10, 2026', skills: ['SEO', 'Social Media', 'Content Strategy'], description: 'We are a pre-launch startup and need help creating a go-to-market digital strategy.', learnerName: 'Rohan V.' },
];

const MentorRequests = () => {
  return (
    <MentorLayout>
      <div className="p-6 md:p-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Learner Requests</h1>
            <p className="text-muted-foreground">Browse and apply to learning requests</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1"><Filter className="h-3 w-3" /> Filters</Button>
        </div>

        <div className="space-y-4">
          {mockRequests.map(req => (
            <Card key={req.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <Link to={`/mentor/requests/${req.id}`} className="font-semibold hover:text-primary">{req.title}</Link>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{req.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {req.skills.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{req.budget}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{req.mode}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Deadline: {req.deadline}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link to={`/mentor/requests/${req.id}`}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                    <Button size="sm">Submit Proposal</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MentorLayout>
  );
};

export default MentorRequests;
