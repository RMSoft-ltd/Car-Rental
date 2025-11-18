"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import {
  Users,
  Car,
  Calendar,
  DollarSign,
  TrendingUp,
  Download,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { baseUrl } from "@/lib/api";

// Type definitions
interface DashboardStats {
  totalUsers: number;
  totalCars: number;
  totalBookings: number;
  totalRevenue: number;
  activeBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  completedBookings: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
}

interface BookingStatusData {
  name: string;
  value: number;
}

interface Booking {
  id: string;
  totalAmount: number;
  pickUpDate: string;
  dropOffDate: string;
  bookingStatus: string;
  car?: {
    make: string;
    model: string;
  };
  user?: {
    fName: string;
    lName: string;
  };
}

interface Car {
  id: string;
  make: string;
  model: string;
  // Add more properties as needed, e.g., year: number; dailyRate: number;
}

interface User {
  id: string;
  fName: string;
  lName: string;
  // Add more properties as needed, e.g., email: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change?: number;
  description?: string;
}

// Initial mock data
const initialStats: DashboardStats = {
  totalUsers: 1247,
  totalCars: 89,
  totalBookings: 342,
  totalRevenue: 45890,
  activeBookings: 23,
  pendingBookings: 12,
  cancelledBookings: 8,
  completedBookings: 299
};

const revenueData: RevenueData[] = [
  { month: 'Jan', revenue: 4000, bookings: 24 },
  { month: 'Feb', revenue: 3000, bookings: 18 },
  { month: 'Mar', revenue: 5000, bookings: 30 },
  { month: 'Apr', revenue: 2780, bookings: 22 },
  { month: 'May', revenue: 3890, bookings: 28 },
  { month: 'Jun', revenue: 6390, bookings: 35 },
  { month: 'Jul', revenue: 7490, bookings: 42 },
];

const bookingStatusData: BookingStatusData[] = [
  { name: 'Completed', value: 299 },
  { name: 'Active', value: 23 },
  { name: 'Pending', value: 12 },
  { name: 'Cancelled', value: 8 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export default function DashboardContent() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<string>('month');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats>(initialStats);

  // Fetch data on mount
  useEffect(() => {
    fetchRecentBookings();
    fetchAllBookings();
    fetchCars();
    fetchUsers();
  }, []);

  const fetchRecentBookings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${baseUrl}/bookings?limit=5&skip=0`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recent bookings: ${response.statusText}`);
      }
      
      const data = await response.json();
      setRecentBookings(Array.isArray(data.rows) ? data.rows : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch recent bookings';
      console.error('Error fetching recent bookings:', err);
      setError(errorMessage);
      setRecentBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllBookings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${baseUrl}/bookings`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch all bookings: ${response.statusText}`);
      }
      
      const data = await response.json();
      setAllBookings(Array.isArray(data.rows) ? data.rows : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch all bookings';
      console.error('Error fetching all bookings:', err);
      setError(errorMessage);
      setAllBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCars = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${baseUrl}/cars`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch cars: ${response.statusText}`);
      }
      
      const data = await response.json();
      setCars(Array.isArray(data.rows) ? data.rows : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cars';
      console.error('Error fetching cars:', err);
      setError(errorMessage);
      setCars([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${baseUrl}/users`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      
      const data = await response.json();
      setUsers(Array.isArray(data.rows) ? data.rows : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      console.error('Error fetching users:', err);
      setError(errorMessage);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await Promise.all([
      fetchRecentBookings(),
      fetchAllBookings(),
      fetchCars(),
      fetchUsers()
    ]);
    // Add other data refresh calls here as needed
  };

  const StatCard = ({ title, value, icon: Icon, change, description }: StatCardProps) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <p className="text-xs text-muted-foreground">
            <span className={change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-600"}>
              {change > 0 ? "+" : ""}{change}%
            </span>{" "}
            from last month
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; className: string }> = {
      PENDING: { variant: "secondary", className: "bg-yellow-100 text-yellow-800" },
      CONFIRMED: { variant: "default", className: "bg-blue-100 text-blue-800" },
      ACTIVE: { variant: "default", className: "bg-green-100 text-green-800" },
      COMPLETED: { variant: "default", className: "bg-green-100 text-green-800" },
      CANCELLED: { variant: "destructive", className: "bg-red-100 text-red-800" },
      PROCESSING: { variant: "secondary", className: "bg-purple-100 text-purple-800" }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex-1 space-y-4 p-4 lg:p-8 pt-6 bg-gray-50 min-h-screen overflow-y-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData} 
            disabled={isLoading}
            aria-label="Refresh dashboard data"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" aria-label="Export data">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="cars">Cars</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats.totalRevenue)}
              icon={DollarSign}
              change={12.5}
            />
            <StatCard
              title="Total Bookings"
              value={stats.totalBookings.toLocaleString()}
              icon={Calendar}
              change={8.2}
            />
            <StatCard
              title="Total Cars"
              value={stats.totalCars}
              icon={Car}
              change={5.1}
            />
            <StatCard
              title="Total Users"
              value={stats.totalUsers.toLocaleString()}
              icon={Users}
              change={15.3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Revenue Chart */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <div className="flex items-center space-x-2">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="quarter">Last Quarter</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Revenue ($)"
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="bookings" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Bookings"
                      dot={{ fill: '#10b981', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Booking Status Chart */}
            <Card className="col-span-4 lg:col-span-3">
              <CardHeader>
                <CardTitle>Booking Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bookingStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {bookingStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {bookingStatusData.map((status, index) => (
                    <div key={status.name} className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span className="text-sm text-gray-700">{status.name}</span>
                      <span className="text-sm font-medium">{status.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest 5 bookings from your car rental service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-500">Loading bookings...</span>
                  </div>
                ) : recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <div 
                      key={booking.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Car className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {booking.car?.make || 'Unknown'} {booking.car?.model || 'Car'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            by {booking.user?.fName || 'Unknown'} {booking.user?.lName || 'User'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right mx-4 min-w-0">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(booking.totalAmount || 0)}
                        </p>
                        <p className="text-sm text-gray-500 whitespace-nowrap">
                          {formatDate(booking.pickUpDate)} - {formatDate(booking.dropOffDate)}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {getStatusBadge(booking.bookingStatus || 'PENDING')}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No recent bookings found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>Bookings Management</CardTitle>
                  <CardDescription>Manage all car rental bookings</CardDescription>
                </div>
                <Button onClick={() => router.push('/admin/bookings')}>
                  View All Bookings
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-500">Loading bookings...</span>
                </div>
              ) : allBookings.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Car</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.id}</TableCell>
                        <TableCell>{booking.car?.make || 'Unknown'} {booking.car?.model || 'Car'}</TableCell>
                        <TableCell>{booking.user?.fName || 'Unknown'} {booking.user?.lName || 'User'}</TableCell>
                        <TableCell>{formatCurrency(booking.totalAmount || 0)}</TableCell>
                        <TableCell>{formatDate(booking.pickUpDate)} - {formatDate(booking.dropOffDate)}</TableCell>
                        <TableCell>{getStatusBadge(booking.bookingStatus || 'PENDING')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No bookings found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cars Tab */}
        <TabsContent value="cars" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>Car Management</CardTitle>
                  <CardDescription>Manage your car fleet</CardDescription>
                </div>
                <Button onClick={() => router.push('/admin/cars')}>
                  Manage Cars
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-500">Loading cars...</span>
                </div>
              ) : cars.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Make</TableHead>
                      <TableHead>Model</TableHead>
                      {/* Add more headers if additional properties are available */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cars.map((car) => (
                      <TableRow key={car.id}>
                        <TableCell>{car.id}</TableCell>
                        <TableCell>{car.make}</TableCell>
                        <TableCell>{car.model}</TableCell>
                        {/* Add more cells if additional properties are available */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Car className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No cars found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage registered users</CardDescription>
                </div>
                <Button onClick={() => router.push('/admin/users')}>
                  Manage Users
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-500">Loading users...</span>
                </div>
              ) : users.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>First Name</TableHead>
                      <TableHead>Last Name</TableHead>
                      {/* Add more headers if additional properties are available */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.fName}</TableCell>
                        <TableCell>{user.lName}</TableCell>
                        {/* Add more cells if additional properties are available */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No users found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Booking Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68.2%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+4.5%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rental Duration</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2 days</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+0.3</span> days from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Popular Car Category</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">SUV</div>
                <p className="text-xs text-muted-foreground">
                  42% of total bookings
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Detailed performance metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="revenue" 
                    fill="#3b82f6" 
                    name="Revenue ($)"
                  />
                  <Bar 
                    dataKey="bookings" 
                    fill="#10b981" 
                    name="Bookings"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col hover:bg-blue-50 hover:border-blue-300 transition-colors" 
              onClick={() => router.push('/admin/bookings/new')}
            >
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">New Booking</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col hover:bg-blue-50 hover:border-blue-300 transition-colors" 
              onClick={() => router.push('/admin/cars/new')}
            >
              <Car className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Add Car</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col hover:bg-blue-50 hover:border-blue-300 transition-colors" 
              onClick={() => router.push('/admin/users')}
            >
              <Users className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Manage Users</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col hover:bg-blue-50 hover:border-blue-300 transition-colors" 
              onClick={() => router.push('/admin/reports')}
            >
              <Download className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Generate Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}