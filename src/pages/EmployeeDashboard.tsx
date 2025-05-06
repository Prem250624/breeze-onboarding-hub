import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  ClipboardList, 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  User, 
  Settings,
  Bell
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useApplication } from "@/hooks/useApplication";
import { useProfile } from "@/hooks/useProfile";
import { useDocuments } from "@/hooks/useDocuments";
import { supabase } from "@/integrations/supabase/client";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { application } = useApplication();
  const { profile } = useProfile();
  const { documents } = useDocuments();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [completionProgress, setCompletionProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  // Calculate document completion for progress
  useEffect(() => {
    if (documents) {
      const totalDocuments = documents.length;
      const completedDocuments = documents.filter(doc => 
        doc.status === "verified" || doc.status === "uploaded"
      ).length;
      
      const progress = totalDocuments > 0 
        ? Math.round((completedDocuments / totalDocuments) * 100) 
        : 0;
      
      setCompletionProgress(progress);
      setLoading(false);
    }
  }, [documents]);

  // Redirect if not logged in or not selected
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (application && application.status !== "selected") {
      navigate("/application-progress");
    } else if (application && application.status === "selected") {
      setLoading(false);
    }
  }, [user, application, navigate]);

  if (!user || loading || !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Loading your dashboard...</h2>
          <p className="text-onboarding-gray-600">Please wait while we prepare your information.</p>
        </div>
      </div>
    );
  }

  // Mock data for the dashboard (this would come from the backend in a real app)
  const tasks = [
    { id: 1, title: "Complete employee handbook review", status: "completed", dueDate: "2025-05-10" },
    { id: 2, title: "Set up company email", status: "completed", dueDate: "2025-05-07" },
    { id: 3, title: "Complete benefits enrollment", status: "in_progress", dueDate: "2025-05-20" },
    { id: 4, title: "Schedule orientation session", status: "pending", dueDate: "2025-05-15" },
    { id: 5, title: "Complete IT security training", status: "pending", dueDate: "2025-05-25" },
  ];

  const upcomingEvents = [
    { id: 1, title: "Team introduction meeting", date: "2025-05-12", time: "10:00 AM" },
    { id: 2, title: "IT equipment setup", date: "2025-05-14", time: "2:00 PM" },
    { id: 3, title: "Orientation session", date: "2025-05-15", time: "9:00 AM" },
  ];

  const announcements = [
    { id: 1, title: "Welcome to the team!", content: "We're thrilled to have you join our company.", date: "2025-05-04" },
    { id: 2, title: "May company meeting", content: "Our monthly company meeting will be held on May 20th.", date: "2025-05-03" },
  ];

  return (
    <div className="min-h-screen bg-onboarding-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-onboarding-gray-200 flex flex-col">
          <div className="p-4 border-b border-onboarding-gray-200">
            <h1 className="text-xl font-bold text-onboarding-dark-blue">Breeze Onboarding</h1>
          </div>
          
          <nav className="flex-grow p-4">
            <ul className="space-y-1">
              {[
                { icon: <LayoutDashboard size={18} />, name: "Dashboard", active: true },
                { icon: <ClipboardList size={18} />, name: "Tasks" },
                { icon: <Calendar size={18} />, name: "Schedule" },
                { icon: <User size={18} />, name: "Profile" },
                { icon: <Bell size={18} />, name: "Notifications" },
                { icon: <Settings size={18} />, name: "Settings" },
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className={`flex items-center px-4 py-2 text-sm rounded-md ${
                      item.active
                        ? "bg-onboarding-blue text-white"
                        : "text-onboarding-gray-600 hover:bg-onboarding-gray-100"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-onboarding-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-onboarding-blue flex items-center justify-center text-white">
                {profile.first_name?.charAt(0) || "U"}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {profile.first_name} {profile.last_name}
                </p>
                <p className="text-xs text-onboarding-gray-600">Employee</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-grow overflow-auto">
          <header className="bg-white border-b border-onboarding-gray-200 sticky top-0 z-10">
            <div className="p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Employee Dashboard</h2>
              <Button variant="outline" onClick={async () => {
                try {
                  await supabase.auth.signOut();
                  navigate("/");
                  toast({
                    title: "Logged out",
                    description: "You have been logged out successfully",
                  });
                } catch (error) {
                  console.error("Error signing out:", error);
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to log out. Please try again.",
                  });
                }
              }}>
                Logout
              </Button>
            </div>
          </header>

          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">
                Welcome, {profile.first_name}!
              </h1>
              <p className="text-onboarding-gray-600">
                Here's your onboarding progress and upcoming tasks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-onboarding-gray-600">
                    Onboarding Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{completionProgress}% Complete</div>
                  <Progress value={completionProgress} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-onboarding-gray-600">
                    Start Date
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-onboarding-blue" />
                  <div className="text-2xl font-bold">May 15, 2025</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-onboarding-gray-600">
                    Pending Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-onboarding-blue" />
                  <div className="text-2xl font-bold">
                    {tasks.filter(task => task.status !== "completed").length} Tasks
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="tasks" className="mb-6">
              <TabsList>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="announcements">Announcements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tasks">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Onboarding Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tasks.map(task => (
                        <div 
                          key={task.id} 
                          className="flex items-center justify-between p-3 bg-white border rounded-md"
                        >
                          <div className="flex items-center">
                            {task.status === "completed" ? (
                              <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                            ) : task.status === "in_progress" ? (
                              <Clock className="h-5 w-5 mr-3 text-yellow-500" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 mr-3 text-onboarding-gray-400" />
                            )}
                            <div>
                              <p className={`font-medium ${task.status === "completed" ? "line-through text-onboarding-gray-400" : ""}`}>
                                {task.title}
                              </p>
                              <p className="text-xs text-onboarding-gray-600">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {task.status !== "completed" && (
                            <Button 
                              size="sm"
                              variant={task.status === "in_progress" ? "default" : "outline"}
                              onClick={() => {
                                toast({
                                  title: "Task updated",
                                  description: `"${task.title}" marked as ${task.status === "in_progress" ? "completed" : "in progress"}`,
                                });
                              }}
                            >
                              {task.status === "in_progress" ? "Complete" : "Start"}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="schedule">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingEvents.map(event => (
                        <div 
                          key={event.id} 
                          className="flex items-start p-3 bg-white border rounded-md"
                        >
                          <div className="flex-shrink-0 w-12 h-12 bg-onboarding-light-blue rounded-md flex flex-col items-center justify-center mr-4">
                            <span className="text-xs font-semibold text-onboarding-blue">
                              {new Date(event.date).toLocaleDateString(undefined, { month: "short" })}
                            </span>
                            <span className="text-lg font-bold text-onboarding-blue">
                              {new Date(event.date).getDate()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-xs text-onboarding-gray-600">
                              {event.time} - {new Date(event.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="announcements">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Announcements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {announcements.map(announcement => (
                        <div 
                          key={announcement.id} 
                          className="p-3 bg-white border rounded-md"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{announcement.title}</p>
                            <p className="text-xs text-onboarding-gray-600">
                              {new Date(announcement.date).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-sm text-onboarding-gray-600">
                            {announcement.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="bg-white p-4 rounded-lg border border-onboarding-gray-200">
              <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
              <p className="text-onboarding-gray-600 mb-3">
                If you have any questions about your onboarding process, please contact HR.
              </p>
              <Button variant="outline">Contact HR</Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
