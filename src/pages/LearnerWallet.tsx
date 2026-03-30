import { useState } from 'react';
import { Plus, CreditCard, Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LearnerLayout from '@/components/LearnerLayout';

const transactions = [
  { id: '1', type: 'credit', description: 'Added funds', amount: 2500, date: 'Mar 20, 2026' },
  { id: '2', type: 'debit', description: 'Session: React Hooks Deep Dive', amount: 1500, date: 'Mar 20, 2026' },
  { id: '3', type: 'debit', description: 'Session: SEO Strategy Workshop', amount: 1200, date: 'Mar 15, 2026' },
  { id: '4', type: 'credit', description: 'Added funds', amount: 5000, date: 'Mar 10, 2026' },
  { id: '5', type: 'debit', description: 'Session: Product Roadmap Planning', amount: 1800, date: 'Mar 10, 2026' },
];

const LearnerWallet = () => {
  const balance = 4250;

  return (
    <LearnerLayout>
      <div className="p-6 md:p-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-1">My Wallet</h1>
        <p className="text-muted-foreground mb-6">Manage your learning credits</p>

        {/* Balance Card */}
        <Card className="mb-8 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-6">
            <p className="text-sm opacity-80 mb-1">Available Balance</p>
            <p className="text-4xl font-bold mb-4">₹{balance.toLocaleString()}</p>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" className="gap-1"><Plus className="h-3 w-3" /> Add Funds</Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Payment Methods</CardTitle>
              <Button variant="outline" size="sm" className="gap-1"><Plus className="h-3 w-3" /> Add Card</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12/28</p>
              </div>
              <span className="text-xs bg-secondary px-2 py-0.5 rounded">Default</span>
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
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <span className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-accent' : 'text-foreground'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </LearnerLayout>
  );
};

export default LearnerWallet;
