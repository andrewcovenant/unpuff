import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, CreditCard, Bell, Lock, Trash2, Mail, DollarSign, Users } from 'lucide-react';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData?: {
    currentHabit: string;
    dailyGoal: number;
    costPerUnit: number;
    friendEmails: string[];
    motivation: string;
  };
  onUpdateSettings?: (updates: any) => void;
}

export default function SettingsModal({ open, onOpenChange, userData, onUpdateSettings }: SettingsModalProps) {
  const [habitName, setHabitName] = useState(userData?.currentHabit || '');
  const [dailyGoal, setDailyGoal] = useState(userData?.dailyGoal || 10);
  const [costPerUnit, setCostPerUnit] = useState(userData?.costPerUnit || 1.0);
  const [email, setEmail] = useState('user@example.com');
  const [notifications, setNotifications] = useState(true);

  const handleSaveAccountSettings = () => {
    const updates = {
      currentHabit: habitName,
      dailyGoal,
      costPerUnit
    };
    onUpdateSettings?.(updates);
    console.log('Saving account settings:', updates);
  };

  const handleSaveNotifications = () => {
    console.log('Saving notification preferences:', { notifications });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading">Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account" data-testid="tab-account">
              <User className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="billing" data-testid="tab-billing">
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="habit">What you're tracking</Label>
                  <Input
                    id="habit"
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                    data-testid="input-habit-name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal">Daily Limit</Label>
                    <Input
                      id="goal"
                      type="number"
                      value={dailyGoal}
                      onChange={(e) => setDailyGoal(parseInt(e.target.value) || 10)}
                      data-testid="input-daily-goal"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost per Unit ($)</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      value={costPerUnit}
                      onChange={(e) => setCostPerUnit(parseFloat(e.target.value) || 1.0)}
                      data-testid="input-cost"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSaveAccountSettings}
                  className="w-full"
                  data-testid="button-save-account"
                >
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Receive daily reminders and progress updates
                    </p>
                  </div>
                  <Button
                    variant={notifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setNotifications(!notifications);
                      console.log('Toggled notifications:', !notifications);
                    }}
                    data-testid="button-toggle-notifications"
                  >
                    {notifications ? 'On' : 'Off'}
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Support Network ({userData?.friendEmails?.length || 0})
                  </Label>
                  {userData?.friendEmails && userData.friendEmails.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userData.friendEmails.map((email) => (
                        <Badge key={email} variant="outline" className="text-xs">
                          {email}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No friends added</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => console.log('Change password clicked')}
                  data-testid="button-change-password"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => console.log('Delete account clicked')}
                  data-testid="button-delete-account"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing */}
          <TabsContent value="billing" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Subscription Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">Free Plan</h3>
                      <Badge variant="outline">Current</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      All essential features included
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">$0</div>
                    <p className="text-xs text-muted-foreground">per month</p>
                  </div>
                </div>

                <Separator />

                <div className="p-4 rounded-lg border border-border hover-elevate">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">Premium Plan</h3>
                        <Badge className="bg-chart-1">Upgrade</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Advanced features and priority support
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">$9.99</div>
                      <p className="text-xs text-muted-foreground">per month</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    <li className="text-sm flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-chart-1" />
                      AI-powered insights and coaching
                    </li>
                    <li className="text-sm flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-chart-1" />
                      Unlimited support network members
                    </li>
                    <li className="text-sm flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-chart-1" />
                      Advanced progress analytics
                    </li>
                    <li className="text-sm flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-chart-1" />
                      Community group chat access
                    </li>
                  </ul>

                  <Button 
                    className="w-full"
                    onClick={() => console.log('Upgrade to premium clicked')}
                    data-testid="button-upgrade-premium"
                  >
                    Upgrade to Premium
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  No payment method on file
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => console.log('Add payment method clicked')}
                  data-testid="button-add-payment"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Billing Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="billing-email">Email for receipts and invoices</Label>
                  <Input
                    id="billing-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="input-billing-email"
                  />
                </div>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => console.log('Update billing email clicked')}
                  data-testid="button-update-billing-email"
                >
                  Update Email
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}