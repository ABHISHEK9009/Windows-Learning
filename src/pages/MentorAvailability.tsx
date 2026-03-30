import { useState } from 'react';
import { Clock, CalendarDays, Globe, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import MentorLayout from '@/components/MentorLayout';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MentorAvailability = () => {
  const [acceptingSessions, setAcceptingSessions] = useState(true);
  const [schedule, setSchedule] = useState<Record<string, { active: boolean; start: string; end: string }>>({
    Monday: { active: true, start: '09:00', end: '18:00' },
    Tuesday: { active: true, start: '09:00', end: '18:00' },
    Wednesday: { active: true, start: '09:00', end: '18:00' },
    Thursday: { active: true, start: '09:00', end: '18:00' },
    Friday: { active: true, start: '09:00', end: '18:00' },
    Saturday: { active: true, start: '10:00', end: '14:00' },
    Sunday: { active: false, start: '09:00', end: '18:00' },
  });

  const [timeoffs] = useState([
    { id: '1', date: 'Apr 14, 2026', reason: 'Holiday' },
    { id: '2', date: 'Apr 21-22, 2026', reason: 'Personal' },
  ]);

  const toggleDay = (day: string) => {
    setSchedule(prev => ({ ...prev, [day]: { ...prev[day], active: !prev[day].active } }));
  };

  return (
    <MentorLayout>
      <div className="p-6 md:p-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-1">Availability</h1>
        <p className="text-muted-foreground mb-6">Manage your schedule and time off</p>

        {/* Status Toggle */}
        <Card className="mb-6">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="font-medium">Accepting New Sessions</p>
              <p className="text-sm text-muted-foreground">Toggle off to pause new bookings</p>
            </div>
            <Switch checked={acceptingSessions} onCheckedChange={setAcceptingSessions} />
          </CardContent>
        </Card>

        {/* Weekly Schedule */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2"><CalendarDays className="h-5 w-5" /> Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {days.map(day => (
                <div key={day} className="flex items-center gap-4 py-2">
                  <div className="w-28">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={schedule[day].active} onChange={() => toggleDay(day)} className="rounded border-border" />
                      <span className={`text-sm font-medium ${schedule[day].active ? '' : 'text-muted-foreground'}`}>{day}</span>
                    </label>
                  </div>
                  {schedule[day].active ? (
                    <div className="flex items-center gap-2 text-sm">
                      <input type="time" value={schedule[day].start}
                        onChange={e => setSchedule(prev => ({ ...prev, [day]: { ...prev[day], start: e.target.value } }))}
                        className="h-9 px-3 rounded-lg border bg-background text-sm" />
                      <span className="text-muted-foreground">to</span>
                      <input type="time" value={schedule[day].end}
                        onChange={e => setSchedule(prev => ({ ...prev, [day]: { ...prev[day], end: e.target.value } }))}
                        className="h-9 px-3 rounded-lg border bg-background text-sm" />
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Unavailable</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Timezone */}
        <Card className="mb-6">
          <CardContent className="p-5 flex items-center gap-3">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Time Zone</p>
              <p className="text-xs text-muted-foreground">Asia/Kolkata (IST, UTC+5:30)</p>
            </div>
            <Button variant="outline" size="sm">Change</Button>
          </CardContent>
        </Card>

        {/* Time Off */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2"><Clock className="h-5 w-5" /> Time Off</CardTitle>
              <Button variant="outline" size="sm" className="gap-1"><Plus className="h-3 w-3" /> Add Time Off</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {timeoffs.map(to => (
                <div key={to.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="text-sm font-medium">{to.date}</p>
                    <p className="text-xs text-muted-foreground">{to.reason}</p>
                  </div>
                  <Button variant="ghost" size="sm"><X className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex gap-3">
          <Button>Save Changes</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    </MentorLayout>
  );
};

export default MentorAvailability;
