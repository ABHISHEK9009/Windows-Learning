import { Link } from 'react-router-dom';
import { TrendingUp, BookOpen, Award, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import LearnerLayout from '@/components/LearnerLayout';

const skills = [
  { name: 'Web Development', progress: 80, hours: 24, modules: '8/10' },
  { name: 'Data Science', progress: 45, hours: 12, modules: '5/12' },
  { name: 'UI/UX Design', progress: 60, hours: 18, modules: '6/10' },
  { name: 'Digital Marketing', progress: 25, hours: 6, modules: '3/12' },
];

const paths = [
  { name: 'Frontend Developer Path', skills: 8, completed: 5, level: 'Intermediate' },
  { name: 'Data Analyst Path', skills: 10, completed: 3, level: 'Beginner' },
];

const LearnerProgress = () => {
  const overallProgress = Math.round(skills.reduce((sum, s) => sum + s.progress, 0) / skills.length);

  return (
    <LearnerLayout>
      <div className="p-6 md:p-8 max-w-5xl">
        <h1 className="text-2xl font-bold mb-1">Progress Tracker</h1>
        <p className="text-muted-foreground mb-6">Track your learning journey</p>

        {/* Overall */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Overall Progress</h3>
                <p className="text-sm text-muted-foreground">Yearly learning goal</p>
              </div>
              <div className="text-3xl font-bold text-primary">{overallProgress}%</div>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </CardContent>
        </Card>

        {/* Skills */}
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5" /> Skills Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {skills.map(skill => (
            <Card key={skill.name} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{skill.name}</h4>
                  <span className="text-sm font-semibold text-primary">{skill.progress}%</span>
                </div>
                <Progress value={skill.progress} className="h-2 mb-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{skill.hours} hours learned</span>
                  <span>{skill.modules} modules</span>
                </div>
                <Link to={`/mentors?skill=${skill.name.toLowerCase()}`}>
                  <Button variant="ghost" size="sm" className="mt-3 gap-1 text-xs">Continue Learning <ChevronRight className="h-3 w-3" /></Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Learning Paths */}
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Learning Paths</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {paths.map(path => (
            <Card key={path.name}>
              <CardContent className="p-5">
                <h4 className="font-medium mb-1">{path.name}</h4>
                <p className="text-xs text-muted-foreground mb-3">{path.level} · {path.completed}/{path.skills} skills</p>
                <Progress value={(path.completed / path.skills) * 100} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Certificates */}
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Award className="h-5 w-5" /> Certificates</h2>
        <Card>
          <CardContent className="p-8 text-center">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Complete a learning path to earn your first certificate!</p>
          </CardContent>
        </Card>
      </div>
    </LearnerLayout>
  );
};

export default LearnerProgress;
