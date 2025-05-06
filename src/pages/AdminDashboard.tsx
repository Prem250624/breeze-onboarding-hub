
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard,
  Users,
  Settings,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  FileText
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ApplicationStatus } from "@/hooks/useApplication";

interface EmployeeData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: ApplicationStatus;
  lastActivity: string;
  documents: { uploaded: number; verified: number };
  user_id: string;
}

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real application data
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        
        // Get all applications with profile data
        const { data: applications, error: applicationsError } = await supabase
          .from('applications')
          .select(`
            id, 
            status, 
            has_agreed_to_terms, 
            updated_at, 
            user_id,
            profiles:profiles(first_name, last_name, email)
          `);

        if (applicationsError) throw applicationsError;

        // Get document counts for each user
        const allEmployees: EmployeeData[] = [];

        for (const app of applications || []) {
          // Get document counts
          const { data: documentsData } = await supabase
            .from('documents')
            .select('status')
            .eq('user_id', app.user_id);

          const profile = app.profiles as any;
          const documents = documentsData || [];
          
          const uploadedCount = documents.filter(d => d.status !== 'not_uploaded').length;
          const verifiedCount = documents.filter(d => d.status === 'verified').length;
          
          allEmployees.push({
            id: app.id,
            user_id: app.user_id,
            name: `${profile.first_name} ${profile.last_name}`,
            email: profile.email,
            role: "Applicant", // Default role
            status: app.status as ApplicationStatus,
            lastActivity: app.updated_at,
            documents: { uploaded: uploadedCount, verified: verifiedCount }
          });
        }

        setEmployees(allEmployees);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast({
          variant: "destructive",
          title: "Error fetching data",
          description: "Could not load application data. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchApplications();
    }
  }, [isAdmin, toast]);

  // Redirect if not logged in or not an admin
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!isAdmin) {
      navigate("/");
    }
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin) {
    return null;
  }

  const filteredEmployees = employees.filter((employee) => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
      case "under_review":
        return "text-yellow-500 bg-yellow-50";
      case "interview_scheduled":
        return "text-blue-500 bg-blue-50";
      case "selected":
        return "text-green-500 bg-green-50";
      case "rejected":
        return "text-red-500 bg-red-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
      case "under_review":
        return <Clock className="h-4 w-4" />;
      case "interview_scheduled":
        return <Calendar className="h-4 w-4" />;
      case "selected":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const updateEmployeeStatus = async (userId: string, status: ApplicationStatus) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // Update local state
      setEmployees(employees.map(employee => 
        employee.user_id === userId ? { ...employee, status } : employee
      ));

      toast({
        title: "Status updated",
        description: `Employee status has been updated to ${status.replace("_", " ")}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Could not update employee status. Please try again."
      });
    }
  };

  // Calculate statistics
  const stats = {
    total: employees.length,
    pending: employees.filter(e => e.status === "pending" || e.status === "under_review").length,
    interviews: employees.filter(e => e.status === "interview_scheduled").length,
    selected: employees.filter(e => e.status === "selected").length,
  };

  return (
    <div className="min-h-screen bg-onboarding-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-onboarding-gray-200 flex flex-col">
          <div className="p-4 border-b border-onboarding-gray-200">
            <h1 className="text-xl font-bold text-onboarding-dark-blue">Admin Dashboard</h1>
          </div>
          
          <nav className="flex-grow p-4">
            <ul className="space-y-1">
              {[
                { icon: <LayoutDashboard size={18} />, name: "Dashboard", active: true },
                { icon: <Users size={18} />, name: "Employees" },
                { icon: <FileText size={18} />, name: "Documents" },
                { icon: <Calendar size={18} />, name: "Schedule" },
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
              <div className="w-8 h-8 rounded-full bg-onboarding-dark-blue flex items-center justify-center text-white">
                A
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-onboarding-gray-600">HR Manager</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-grow overflow-auto">
          <header className="bg-white border-b border-onboarding-gray-200 sticky top-0 z-10">
            <div className="p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Employee Onboarding Management</h2>
              <Button variant="outline" onClick={() => {
                navigate("/");
                toast({
                  title: "Logged out",
                  description: "You have been logged out successfully",
                });
              }}>
                Logout
              </Button>
            </div>
          </header>

          <main className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-onboarding-gray-600">
                    Total Employees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-onboarding-gray-600">
                    Pending Review
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                  <div className="text-2xl font-bold">{stats.pending}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-onboarding-gray-600">
                    Interviews Scheduled
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                  <div className="text-2xl font-bold">{stats.interviews}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-onboarding-gray-600">
                    Selected
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <div className="text-2xl font-bold">{stats.selected}</div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="all" className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="interview">Interview</TabsTrigger>
                  <TabsTrigger value="selected">Selected</TabsTrigger>
                </TabsList>
                
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-onboarding-gray-600" />
                  <Input 
                    className="pl-10"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="p-8 text-center">Loading applications...</div>
                  ) : filteredEmployees.length === 0 ? (
                    <div className="p-8 text-center">No applications found</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-onboarding-gray-200">
                            <th className="text-left p-4 font-medium text-onboarding-gray-600">Employee</th>
                            <th className="text-left p-4 font-medium text-onboarding-gray-600">Role</th>
                            <th className="text-left p-4 font-medium text-onboarding-gray-600">Status</th>
                            <th className="text-left p-4 font-medium text-onboarding-gray-600">Documents</th>
                            <th className="text-left p-4 font-medium text-onboarding-gray-600">Last Activity</th>
                            <th className="text-right p-4 font-medium text-onboarding-gray-600">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredEmployees.map((employee) => (
                            <tr 
                              key={employee.id} 
                              className="border-b border-onboarding-gray-200 hover:bg-onboarding-gray-50"
                            >
                              <td className="p-4">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-onboarding-light-blue flex items-center justify-center text-onboarding-blue font-medium mr-3">
                                    {employee.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-medium">{employee.name}</p>
                                    <p className="text-xs text-onboarding-gray-600">{employee.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">{employee.role}</td>
                              <td className="p-4">
                                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                                  {getStatusIcon(employee.status)}
                                  <span className="ml-1">
                                    {employee.status.replace("_", " ").charAt(0).toUpperCase() + employee.status.replace("_", " ").slice(1)}
                                  </span>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="text-xs">
                                  <span className="font-medium">{employee.documents.verified}/{employee.documents.uploaded}</span> verified
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="text-xs text-onboarding-gray-600">
                                  {new Date(employee.lastActivity).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="p-4 text-right">
                                <div className="inline-flex items-center">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="mr-2"
                                    onClick={() => {
                                      toast({
                                        title: "View Details",
                                        description: `Viewing details for ${employee.name}`,
                                      });
                                    }}
                                  >
                                    View Details
                                  </Button>
                                  
                                  {employee.status !== "selected" && employee.status !== "rejected" && (
                                    <Button
                                      size="sm"
                                      variant="default"
                                      onClick={() => updateEmployeeStatus(employee.user_id, "selected")}
                                    >
                                      Approve
                                    </Button>
                                  )}
                                  
                                  {employee.status !== "rejected" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="ml-2"
                                      onClick={() => updateEmployeeStatus(employee.user_id, "rejected")}
                                    >
                                      Reject
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
