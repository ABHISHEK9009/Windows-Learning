import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, DollarSign, MapPin, Calendar, Paperclip } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LearnerLayout from '@/components/LearnerLayout';

const skillOptions = ['Web Development', 'Data Science', 'UI/UX Design', 'Digital Marketing', 'Mobile Development', 'Cloud Computing', 'AI/ML', 'DevOps'];

const PostRequirement = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skill, setSkill] = useState('');
  const [budgetMin, setBudgetMin] = useState(500);
  const [budgetMax, setBudgetMax] = useState(2000);
  const [mode, setMode] = useState('online');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <LearnerLayout>
      <div className="p-6 md:p-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-1">Post a Learning Requirement</h1>
        <p className="text-muted-foreground mb-6">Describe what you need and let mentors come to you</p>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardContent className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Need help with React & Next.js project"
                  className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
                  placeholder="Describe what you want to learn, your current level, and specific topics..."
                  className="w-full p-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Skill / Category</label>
                <select value={skill} onChange={e => setSkill(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                  <option value="">Select a skill</option>
                  {skillOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Budget Range (₹/session)</label>
                <div className="flex items-center gap-3">
                  <input type="number" value={budgetMin} onChange={e => setBudgetMin(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                  <span className="text-muted-foreground">to</span>
                  <input type="number" value={budgetMax} onChange={e => setBudgetMax(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Preferred Mode</label>
                <div className="flex gap-3">
                  {['online', 'offline', 'both'].map(m => (
                    <button key={m} type="button" onClick={() => setMode(m)}
                      className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium capitalize transition-colors ${mode === m ? 'border-primary bg-primary/5 text-primary' : 'text-muted-foreground'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Deadline</label>
                <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Attachments (Optional)</label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <Paperclip className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Drag & drop files or click to upload</p>
                  <Button variant="outline" size="sm" className="mt-2" type="button">Choose Files</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit">Post Requirement</Button>
            <Button variant="outline" type="button" onClick={() => navigate('/mentors')}>Cancel</Button>
          </div>
        </form>
      </div>
    </LearnerLayout>
  );
};

export default PostRequirement;
