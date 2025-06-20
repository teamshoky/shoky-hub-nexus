
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Briefcase, 
  Camera, 
  Code,
  Users,
  CheckSquare,
  Calendar,
  TrendingUp,
  Clock,
  FileText,
  BarChart3
} from 'lucide-react';

const roleGreetings = {
  super_admin: {
    title: 'Super Admin Dashboard',
    description: 'Full system control and oversight',
    icon: Crown,
    color: 'text-yellow-600',
    features: [
      'Complete system management',
      'User role assignment',
      'Analytics and reporting',
      'Content approval workflow',
      'Task assignment and tracking'
    ]
  },
  hr_admin: {
    title: 'HR Admin Dashboard',
    description: 'People management and operations',
    icon: Briefcase,
    color: 'text-green-600',
    features: [
      'Employee management',
      'Attendance tracking',
      'Performance reviews',
      'Announcements',
      'Report generation'
    ]
  },
  social_media_admin: {
    title: 'Social Media Dashboard',
    description: 'Content creation and planning',
    icon: Camera,
    color: 'text-purple-600',
    features: [
      'Content calendar management',
      'Creative asset access',
      'Content approval workflow',
      'Media file management',
      'Campaign planning'
    ]
  },
  developer: {
    title: 'Developer Dashboard',
    description: 'Technical tasks and development',
    icon: Code,
    color: 'text-blue-600',
    features: [
      'Kanban task board',
      'Code repository access',
      'Technical documentation',
      'Project timeline tracking',
      'Task status updates'
    ]
  }
};

const quickStats = [
  {
    title: 'Active Tasks',
    value: '12',
    icon: CheckSquare,
    change: '+2 from last week',
    color: 'text-blue-600'
  },
  {
    title: 'Team Members',
    value: '8',
    icon: Users,
    change: '+1 new member',
    color: 'text-green-600'
  },
  {
    title: 'Pending Reviews',
    value: '4',
    icon: FileText,
    change: '2 due today',
    color: 'text-orange-600'
  },
  {
    title: 'Content Plans',
    value: '15',
    icon: Calendar,
    change: '3 scheduled this week',
    color: 'text-purple-600'
  }
];

export default function Dashboard() {
  const { profile } = useAuth();

  if (!profile) return null;

  const roleInfo = roleGreetings[profile.role as keyof typeof roleGreetings];
  const RoleIcon = roleInfo.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <RoleIcon className={`h-8 w-8 ${roleInfo.color}`} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{roleInfo.title}</h1>
              <p className="text-gray-600">{roleInfo.description}</p>
            </div>
          </div>
          <div className="mt-2">
            <Badge variant="secondary" className="mr-2">
              {profile.full_name}
            </Badge>
            <Badge variant="outline">
              {profile.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Welcome back!</p>
          <p className="text-lg font-semibold text-gray-900">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.change}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Role-specific features and recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Features Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <RoleIcon className={`h-5 w-5 ${roleInfo.color}`} />
              <span>Your Access & Features</span>
            </CardTitle>
            <CardDescription>
              Features available with your current role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {roleInfo.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${roleInfo.color.replace('text-', 'bg-')}`} />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-600" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Latest updates and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">Task completed</p>
                <p className="text-sm text-gray-500">Homepage redesign task marked as done</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">New team member</p>
                <p className="text-sm text-gray-500">Sarah Johnson joined as Developer</p>
                <p className="text-xs text-gray-400">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">Content approved</p>
                <p className="text-sm text-gray-500">Social media post for product launch</p>
                <p className="text-xs text-gray-400">2 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-gray-600" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>
            Common tasks for your role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profile.role === 'super_admin' && (
              <>
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <Users className="h-6 w-6 text-blue-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Manage Users</h3>
                  <p className="text-sm text-gray-500">Add or edit user roles</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <CheckSquare className="h-6 w-6 text-green-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Assign Tasks</h3>
                  <p className="text-sm text-gray-500">Create new assignments</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <BarChart3 className="h-6 w-6 text-purple-600 mb-2" />
                  <h3 className="font-medium text-gray-900">View Analytics</h3>
                  <p className="text-sm text-gray-500">System performance stats</p>
                </div>
              </>
            )}
            {profile.role === 'hr_admin' && (
              <>
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <Users className="h-6 w-6 text-blue-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Track Attendance</h3>
                  <p className="text-sm text-gray-500">Monitor team presence</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <FileText className="h-6 w-6 text-green-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Performance Review</h3>
                  <p className="text-sm text-gray-500">Evaluate team members</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <Calendar className="h-6 w-6 text-purple-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Send Announcement</h3>
                  <p className="text-sm text-gray-500">Communicate with team</p>
                </div>
              </>
            )}
            {profile.role === 'social_media_admin' && (
              <>
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Content Calendar</h3>
                  <p className="text-sm text-gray-500">Plan upcoming posts</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <Camera className="h-6 w-6 text-green-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Create Content</h3>
                  <p className="text-sm text-gray-500">New content plan</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <FileText className="h-6 w-6 text-purple-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Access Assets</h3>
                  <p className="text-sm text-gray-500">View design files</p>
                </div>
              </>
            )}
            {profile.role === 'developer' && (
              <>
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <CheckSquare className="h-6 w-6 text-blue-600 mb-2" />
                  <h3 className="font-medium text-gray-900">View Tasks</h3>
                  <p className="text-sm text-gray-500">Check assignments</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <Code className="h-6 w-6 text-green-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Kanban Board</h3>
                  <p className="text-sm text-gray-500">Update task status</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <FileText className="h-6 w-6 text-purple-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Documentation</h3>
                  <p className="text-sm text-gray-500">Technical resources</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
