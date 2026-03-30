import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, X, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MentorLayout from '@/components/MentorLayout';

const MentorProfileEdit = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('Dr. Sarah Chen');
  const [headline, setHeadline] = useState('Senior Full-Stack Developer');
  const [bio, setBio] = useState('Experienced developer with 8+ years building scalable web applications.');
  const [location, setLocation] = useState('Mumbai, India');
  const [languages, setLanguages] = useState('English, Hindi');
  const [skills] = useState(['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS']);
  const [hourlyRate, setHourlyRate] = useState(1500);
  const [experience] = useState([
    { company: 'Google', position: 'Senior Software Engineer', period: '2020 - Present' },
    { company: 'Microsoft', position: 'Software Engineer', period: '2016 - 2020' },
  ]);
  const [education] = useState([
    { institution: 'IIT Mumbai', degree: 'M.Tech Computer Science', year: '2016' },
  ]);

  return (
    <MentorLayout>
      <div className="p-6 md:p-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-1">Edit Profile</h1>
        <p className="text-muted-foreground mb-6">Update your public mentor profile</p>

        {/* Profile Picture */}
        <Card className="mb-6">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">SC</div>
            <div>
              <Button variant="outline" size="sm" className="gap-1"><Upload className="h-3 w-3" /> Upload Photo</Button>
              <p className="text-xs text-muted-foreground mt-1">JPG or PNG, max 2MB</p>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card className="mb-6">
          <CardHeader className="pb-3"><CardTitle className="text-lg">Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" /></div>
            <div><label className="block text-sm font-medium mb-1">Professional Headline</label>
              <input value={headline} onChange={e => setHeadline(e.target.value)} className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" /></div>
            <div><label className="block text-sm font-medium mb-1">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} className="w-full p-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Location</label>
                <input value={location} onChange={e => setLocation(e.target.value)} className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" /></div>
              <div><label className="block text-sm font-medium mb-1">Languages</label>
                <input value={languages} onChange={e => setLanguages(e.target.value)} className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" /></div>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Skills</CardTitle>
              <Button variant="outline" size="sm" className="gap-1"><Plus className="h-3 w-3" /> Add Skill</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <Badge key={s} variant="secondary" className="gap-1 pr-1">
                  {s} <button className="ml-1 hover:text-destructive"><X className="h-3 w-3" /></button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="mb-6">
          <CardHeader className="pb-3"><CardTitle className="text-lg">Pricing</CardTitle></CardHeader>
          <CardContent>
            <label className="block text-sm font-medium mb-1">Hourly Rate (₹)</label>
            <input type="number" value={hourlyRate} onChange={e => setHourlyRate(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <p className="text-xs text-muted-foreground mt-1">You receive 80% after platform fee</p>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Experience</CardTitle>
              <Button variant="outline" size="sm" className="gap-1"><Plus className="h-3 w-3" /> Add</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {experience.map((exp, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">{exp.position}</p>
                  <p className="text-xs text-muted-foreground">{exp.company} · {exp.period}</p>
                </div>
                <Button variant="ghost" size="sm"><X className="h-4 w-4" /></Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Education</CardTitle>
              <Button variant="outline" size="sm" className="gap-1"><Plus className="h-3 w-3" /> Add</Button>
            </div>
          </CardHeader>
          <CardContent>
            {education.map((edu, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">{edu.degree}</p>
                  <p className="text-xs text-muted-foreground">{edu.institution} · {edu.year}</p>
                </div>
                <Button variant="ghost" size="sm"><X className="h-4 w-4" /></Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Certifications</CardTitle>
              <Button variant="outline" size="sm" className="gap-1"><Upload className="h-3 w-3" /> Upload</Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No certificates uploaded yet</p>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button className="gap-1" onClick={() => navigate('/mentor/dashboard')}><Save className="h-4 w-4" /> Save Changes</Button>
          <Button variant="outline" onClick={() => navigate('/mentor/dashboard')}>Cancel</Button>
        </div>
      </div>
    </MentorLayout>
  );
};

export default MentorProfileEdit;
