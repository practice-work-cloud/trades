import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useMarketContext } from "@/contexts/MarketContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Bell, Lock, LifeBuoy, User, LineChart, Edit3, Circle, Webhook, Key, Save } from "lucide-react";
import Notification from "@/components/Notification";

export default function Settings() {
  const { isConnected } = useMarketContext();
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  
  const handleSaveSettings = () => {
    setNotificationMessage("Settings updated successfully!");
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header isConnected={isConnected} />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Settings</h2>
          <p className="text-muted-foreground">Configure your application preferences</p>
        </div>
        
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="api">API Integration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage your application display and behavior preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Display</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Theme</Label>
                      <p className="text-sm text-muted-foreground">
                        Choose your preferred color scheme
                      </p>
                    </div>
                    <Select defaultValue="dark">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System Default</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Chart Default Style</Label>
                      <p className="text-sm text-muted-foreground">
                        Select preferred chart visualization
                      </p>
                    </div>
                    <Select defaultValue="candle">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select chart style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="line">Line</SelectItem>
                        <SelectItem value="candle">Candlestick</SelectItem>
                        <SelectItem value="area">Area</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Default Timeframe</Label>
                      <p className="text-sm text-muted-foreground">
                        Set default chart timeframe
                      </p>
                    </div>
                    <Select defaultValue="1d">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">1 Hour</SelectItem>
                        <SelectItem value="1d">1 Day</SelectItem>
                        <SelectItem value="1w">1 Week</SelectItem>
                        <SelectItem value="1m">1 Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Trading</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Default Order Size</Label>
                      <p className="text-sm text-muted-foreground">
                        Set default quantity for orders
                      </p>
                    </div>
                    <Input 
                      type="number" 
                      defaultValue="1" 
                      className="w-[180px]" 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Market Hours Only</Label>
                      <p className="text-sm text-muted-foreground">
                        Only execute trades during market hours
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Refresh Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically refresh market data
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input id="full-name" defaultValue="John Trader" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john.trader@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" defaultValue="+91 98765 43210" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="asia_kolkata">
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asia_kolkata">Asia/Kolkata (GMT+5:30)</SelectItem>
                          <SelectItem value="us_eastern">US Eastern (GMT-5)</SelectItem>
                          <SelectItem value="us_pacific">US Pacific (GMT-8)</SelectItem>
                          <SelectItem value="uk">London (GMT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" defaultValue="********" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="enable-2fa" />
                    <label
                      htmlFor="enable-2fa"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Enable Two-Factor Authentication
                    </label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how and when you receive updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Channels</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-md bg-primary/10">
                          <Bell className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">In-App Notifications</h4>
                          <p className="text-sm text-muted-foreground">
                            Receive alerts within the application
                          </p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-md bg-primary/10">
                          <Circle className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-muted-foreground">
                            Receive email alerts for important events
                          </p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-md bg-primary/10">
                          <Circle className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">SMS Notifications</h4>
                          <p className="text-sm text-muted-foreground">
                            Receive text messages for critical alerts
                          </p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mt-6">Notification Types</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notify-order-execution" defaultChecked />
                      <label
                        htmlFor="notify-order-execution"
                        className="text-sm font-medium leading-none"
                      >
                        Order Executions
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notify-price-alerts" defaultChecked />
                      <label
                        htmlFor="notify-price-alerts"
                        className="text-sm font-medium leading-none"
                      >
                        Price Alerts
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notify-market-open" defaultChecked />
                      <label
                        htmlFor="notify-market-open"
                        className="text-sm font-medium leading-none"
                      >
                        Market Open/Close
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notify-strategy-signals" defaultChecked />
                      <label
                        htmlFor="notify-strategy-signals"
                        className="text-sm font-medium leading-none"
                      >
                        Strategy Signals
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notify-account-updates" />
                      <label
                        htmlFor="notify-account-updates"
                        className="text-sm font-medium leading-none"
                      >
                        Account Updates
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Integration</CardTitle>
                <CardDescription>
                  Connect to Upstox API for live trading
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Upstox API Credentials</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <div className="flex">
                        <Input
                          id="api-key"
                          type="password"
                          defaultValue="•••••••••••••••••••••••••••••"
                          className="flex-1 font-mono"
                        />
                        <Button variant="ghost" size="icon" className="ml-2">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Your Upstox API key for authentication
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="api-secret">API Secret</Label>
                      <div className="flex">
                        <Input
                          id="api-secret"
                          type="password"
                          defaultValue="•••••••••••••••••••••••••••••"
                          className="flex-1 font-mono"
                        />
                        <Button variant="ghost" size="icon" className="ml-2">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Your Upstox API secret key
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="redirect-uri">Redirect URI</Label>
                      <Input
                        id="redirect-uri"
                        defaultValue="https://trading-dashboard.example.com/auth/callback"
                        className="font-mono"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        The callback URL registered with your Upstox developer account
                      </p>
                    </div>
                    
                    <div className="pt-2">
                      <Button variant="outline" className="mr-2">
                        <Key className="mr-2 h-4 w-4" />
                        Test Connection
                      </Button>
                      <Button variant="outline">
                        <Webhook className="mr-2 h-4 w-4" />
                        View API Log
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Trading API Settings</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Order Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Choose between real and simulated trading
                      </p>
                    </div>
                    <Select defaultValue="simulated">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simulated">Simulation</SelectItem>
                        <SelectItem value="paper">Paper Trading</SelectItem>
                        <SelectItem value="live">Live Trading</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>API Call Rate Limit</Label>
                      <p className="text-sm text-muted-foreground">
                        Maximum API requests per minute
                      </p>
                    </div>
                    <Input
                      type="number"
                      defaultValue="60"
                      className="w-[180px]"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Reconnect</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically reconnect to WebSocket on disconnect
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api-notes">Notes</Label>
                  <Textarea
                    id="api-notes"
                    placeholder="Add any notes about your API setup here..."
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
      
      <Notification 
        show={showNotification}
        message={notificationMessage}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
}