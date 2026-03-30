import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Shield, Palette, Lock, Trash2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('Priya Sharma');
  const [email, setEmail] = useState('priya@example.com');
  const [location, setLocation] = useState('Mumbai, India');
  const [bio, setBio] = useState('Passionate learner exploring web development and data science.');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [newsletter, setNewsletter] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-4" style={{ backgroundColor: 'hsl(var(--surface-warm))' }}>
        <div className="container max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Settings</h1>
          <p className="text-muted-foreground mb-6">Manage your account preferences</p>

          {/* Profile */}
          <Card className="mb-6">
            <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><User className="h-5 w-5" /> Profile</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">PS</div>
                <Button variant="outline" size="sm">Change Photo</Button>
              </div>
              <div><label className="block text-sm font-medium mb-1">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" /></div>
              <div><label className="block text-sm font-medium mb-1">Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" /></div>
              <div><label className="block text-sm font-medium mb-1">Location</label>
                <input value={location} onChange={e => setLocation(e.target.value)} className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" /></div>
              <div><label className="block text-sm font-medium mb-1">Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full p-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" /></div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="mb-6">
            <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><Bell className="h-5 w-5" /> Notifications</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Email Notifications', desc: 'Receive updates via email', value: emailNotifs, setter: setEmailNotifs },
                { label: 'SMS Notifications', desc: 'Receive updates via SMS', value: smsNotifs, setter: setSmsNotifs },
                { label: 'Session Reminders', desc: 'Get reminded before sessions', value: sessionReminders, setter: setSessionReminders },
                { label: 'Newsletter', desc: 'Weekly platform updates', value: newsletter, setter: setNewsletter },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                  <Switch checked={item.value} onCheckedChange={item.setter} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="mb-6">
            <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><Shield className="h-5 w-5" /> Privacy</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-medium">Profile Visibility</p><p className="text-xs text-muted-foreground">Allow others to view your profile</p></div>
                <Switch checked={profileVisible} onCheckedChange={setProfileVisible} />
              </div>
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-medium">Show Email</p><p className="text-xs text-muted-foreground">Display email on your profile</p></div>
                <Switch checked={showEmail} onCheckedChange={setShowEmail} />
              </div>
            </CardContent>
          </Card>

          {/* Theme */}
          <Card className="mb-6">
            <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><Palette className="h-5 w-5" /> Appearance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-medium">Dark Mode</p><p className="text-xs text-muted-foreground">Switch to dark theme</p></div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </CardContent>
          </Card>

          {/* Password & Account */}
          <Card className="mb-6">
            <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><Lock className="h-5 w-5" /> Security</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2"><Lock className="h-4 w-4" /> Change Password</Button>
              <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /> Delete Account</Button>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button className="gap-1"><Save className="h-4 w-4" /> Save Changes</Button>
            <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SettingsPage;
