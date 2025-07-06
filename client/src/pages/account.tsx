import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { User, Shield, CreditCard, FileText, Settings, Bell, Lock } from "lucide-react";

export default function Account() {
  const { user, isAuthenticated } = useAuth();
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    claimsUpdates: true,
    policyReminders: true
  });

  const policies = [
    {
      id: "POL-ETH-2025-001",
      type: "ETHquake Insurance",
      status: "Active",
      premium: "$45/month",
      coverage: "$500,000",
      nextPayment: "2025-07-15",
      blockchain: true
    },
    {
      id: "POL-FEMA-2025-002", 
      type: "FEMA Flood Insurance",
      status: "Active",
      premium: "$65/month",
      coverage: "$250,000",
      nextPayment: "2025-07-10",
      blockchain: false
    }
  ];

  const recentActivity = [
    {
      date: "2025-06-25",
      action: "Premium Payment",
      description: "ETHquake insurance payment processed",
      amount: "$45.00"
    },
    {
      date: "2025-06-20",
      action: "Claim Filed",
      description: "Earthquake damage claim submitted",
      amount: "$12,500"
    },
    {
      date: "2025-06-15",
      action: "Policy Update",
      description: "Coverage amount increased",
      amount: "+$100,000"
    }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Account Access Required</h2>
            <p className="text-gray-600 mb-6">Please log in to view your account information and manage your policies.</p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = '/api/login'}>
              Log In to Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Account</h1>
          <p className="text-xl text-gray-600">Manage your Hawaii climate insurance policies and account settings</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={user?.profileImageUrl} />
                      <AvatarFallback>
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                      <Badge className="mt-1 bg-green-100 text-green-800">Verified</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Policy Summary */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Active Policies</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {policies.map((policy) => (
                      <div key={policy.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{policy.type}</h4>
                          <Badge className={policy.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {policy.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{policy.id}</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Coverage:</span>
                            <span className="font-medium">{policy.coverage}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Premium:</span>
                            <span className="font-medium">{policy.premium}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Next Payment:</span>
                            <span className="font-medium">{policy.nextPayment}</span>
                          </div>
                        </div>
                        {policy.blockchain && (
                          <Badge className="mt-2 bg-blue-100 text-blue-800 text-xs">
                            Blockchain Powered
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{activity.action}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-medium text-gray-900">{activity.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Policy Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {policies.map((policy) => (
                    <div key={policy.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{policy.type}</h3>
                          <p className="text-sm text-gray-600">{policy.id}</p>
                        </div>
                        <Badge className={policy.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {policy.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Coverage Amount</p>
                          <p className="font-medium">{policy.coverage}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Monthly Premium</p>
                          <p className="font-medium">{policy.premium}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Next Payment</p>
                          <p className="font-medium">{policy.nextPayment}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Technology</p>
                          <p className="font-medium">{policy.blockchain ? 'Blockchain' : 'Traditional'}</p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="outline" size="sm">Download Policy</Button>
                        <Button variant="outline" size="sm">File Claim</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Billing & Payments</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Payment Method</h4>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">•••• •••• •••• 4532</p>
                          <p className="text-sm text-gray-600">Expires 12/26</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-3 w-full">
                        Update Payment Method
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Billing Address</h4>
                    <div className="border rounded-lg p-4">
                      <p className="text-sm">123 Aloha Street</p>
                      <p className="text-sm">Honolulu, HI 96813</p>
                      <Button variant="outline" size="sm" className="mt-3 w-full">
                        Update Address
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Upcoming Payments</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">ETHquake Insurance</p>
                        <p className="text-sm text-gray-600">Due July 15, 2025</p>
                      </div>
                      <span className="font-medium">$45.00</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">FEMA Flood Insurance</p>
                        <p className="text-sm text-gray-600">Due July 10, 2025</p>
                      </div>
                      <span className="font-medium">$65.00</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Account Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <Input defaultValue={user?.firstName || ""} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <Input defaultValue={user?.lastName || ""} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input defaultValue={user?.email || ""} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <Input placeholder="(808) 555-0123" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
                    <Bell className="w-4 h-4" />
                    <span>Notification Preferences</span>
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" checked={notificationSettings.emailAlerts} onChange={(e) => setNotificationSettings({...notificationSettings, emailAlerts: e.target.checked})} className="rounded" />
                      <span className="text-sm">Email alerts for policy updates</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" checked={notificationSettings.smsAlerts} onChange={(e) => setNotificationSettings({...notificationSettings, smsAlerts: e.target.checked})} className="rounded" />
                      <span className="text-sm">SMS alerts for urgent notifications</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" checked={notificationSettings.claimsUpdates} onChange={(e) => setNotificationSettings({...notificationSettings, claimsUpdates: e.target.checked})} className="rounded" />
                      <span className="text-sm">Claims status updates</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" checked={notificationSettings.policyReminders} onChange={(e) => setNotificationSettings({...notificationSettings, policyReminders: e.target.checked})} className="rounded" />
                      <span className="text-sm">Policy renewal reminders</span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <div className="flex space-x-4">
                    <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
                    <Button variant="outline">Cancel</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}