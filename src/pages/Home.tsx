
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import CircleProgressChart from "@/components/dashboard/CircleProgressChart";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();
  const { analyticsData, testHistory, reports } = useData();
  
  // Use effect for any initial data loading if needed
  useEffect(() => {
    // Could fetch data here if needed
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex">
        <Sidebar />
        
        <main className="flex-1 bg-gray-50 p-6">
          <div className="container mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome, {user?.username}</h1>
              <p className="text-gray-600">Here's an overview of your security posture</p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                  <CardDescription>Average security rating</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pt-2">
                  <CircleProgressChart
                    value={analyticsData.averageScore}
                    size={100}
                    strokeWidth={8}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Recent Tests</CardTitle>
                  <CardDescription>Total tests run</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-3xl font-bold">{analyticsData.totalTests}</div>
                  <p className="text-sm text-gray-500">
                    {testHistory.length > 0 
                      ? `Last test: ${testHistory[0].date}`
                      : 'No tests yet'}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
                  <CardDescription>Highest priority vulnerabilities</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-3xl font-bold text-red-600">{analyticsData.criticalIssues}</div>
                  <p className="text-sm text-gray-500">Require immediate attention</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Resolved Issues</CardTitle>
                  <CardDescription>Fixed vulnerabilities</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-3xl font-bold text-green-600">{analyticsData.resolvedIssues}</div>
                  <p className="text-sm text-gray-500">Successfully resolved</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-cyber-orange/10 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyber-orange">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold mb-2">Start a New Analysis</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Scan your application for security vulnerabilities
                    </p>
                    <Link to="/action" className="mt-auto">
                      <Button className="w-full">Start Scan</Button>
                    </Link>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-cyber-orange/10 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyber-orange">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold mb-2">View Reports</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Review detailed security posture reports
                    </p>
                    <Link to="/reports" className="mt-auto">
                      <Button variant="outline" className="w-full">
                        {reports.length} Report{reports.length !== 1 ? 's' : ''}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-cyber-orange/10 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyber-orange">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold mb-2">Account Settings</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Update your profile and preferences
                    </p>
                    <Link to="/account" className="mt-auto">
                      <Button variant="outline" className="w-full">View Account</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {testHistory.length > 0 ? (
                      testHistory.slice(0, 5).map((test) => (
                        <div key={test.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                          <div>
                            <p className="font-medium">{test.id}</p>
                            <p className="text-sm text-gray-500">{test.date} at {test.time}</p>
                          </div>
                          <div>
                            <span 
                              className={`px-2 py-1 text-xs rounded-full ${
                                test.status === 'completed' ? 'bg-green-100 text-green-800' :
                                test.status === 'failed' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {test.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        No recent activity. Start an analysis to see results here.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
