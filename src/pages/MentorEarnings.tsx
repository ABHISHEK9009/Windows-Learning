import { DollarSign, TrendingUp, Download, ArrowUpRight, ArrowDownLeft, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MentorLayout from '@/components/MentorLayout';

const transactions = [
  { id: '1', type: 'credit', description: 'Session: React Advanced Patterns', amount: 1200, date: 'Mar 25, 2026', note: '₹1,500 - 20% fee' },
  { id: '2', type: 'credit', description: 'Session: React Hooks Deep Dive', amount: 1200, date: 'Mar 20, 2026', note: '₹1,500 - 20% fee' },
  { id: '3', type: 'withdrawal', description: 'Weekly Payout', amount: 10000, date: 'Mar 21, 2026', note: 'Bank transfer' },
  { id: '4', type: 'credit', description: 'Session: Python Data Pipeline', amount: 2000, date: 'Mar 18, 2026', note: '₹2,500 - 20% fee' },
];

const MentorEarnings = () => {
  return (
    <MentorLayout>
      <div className="p-6 md:p-8 max-w-5xl">
        <h1 className="text-2xl font-bold mb-1">Earnings</h1>
        <p className="text-muted-foreground mb-6">Track your income and payouts</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold mt-1">₹1,84,000</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold mt-1 text-accent">₹24,500</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-5">
              <p className="text-sm opacity-80">Available to Withdraw</p>
              <p className="text-2xl font-bold mt-1">₹18,000</p>
              <Button variant="secondary" size="sm" className="mt-2">Withdraw</Button>
            </CardContent>
          </Card>
        </div>

        {/* Payout Settings */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Payout Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">HDFC Bank •••• 8765</p>
                <p className="text-xs text-muted-foreground">Weekly payouts every Friday</p>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Transaction History</CardTitle>
              <Button variant="outline" size="sm" className="gap-1"><Download className="h-3 w-3" /> Export</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map(tx => (
                <div key={tx.id} className="flex items-center gap-3 py-3 border-b last:border-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-accent/10 text-accent' : 'bg-destructive/10 text-destructive'}`}>
                    {tx.type === 'credit' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{tx.date} · {tx.note}</p>
                  </div>
                  <span className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-accent' : 'text-destructive'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MentorLayout>
  );
};

export default MentorEarnings;
