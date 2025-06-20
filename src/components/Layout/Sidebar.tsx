
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Users, 
  Crown, 
  Briefcase, 
  Camera, 
  Code,
  LayoutDashboard,
  CheckSquare,
  Calendar,
  FolderOpen,
  BarChart3,
  UserPlus,
  ClipboardList,
  Megaphone,
  FileText,
  UserCheck,
  ImageIcon,
  GitBranch,
  LogOut
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['super_admin', 'hr_admin', 'social_media_admin', 'developer'],
  },
  // Super Admin only
  {
    title: 'User Management',
    href: '/users',
    icon: UserPlus,
    roles: ['super_admin'],
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: ['super_admin'],
  },
  // Tasks & Projects
  {
    title: 'Tasks',
    href: '/tasks',
    icon: CheckSquare,
    roles: ['super_admin', 'hr_admin', 'developer'],
  },
  {
    title: 'Kanban Board',
    href: '/kanban',
    icon: GitBranch,
    roles: ['super_admin', 'developer'],
  },
  // HR Features
  {
    title: 'Attendance',
    href: '/attendance',
    icon: UserCheck,
    roles: ['super_admin', 'hr_admin'],
  },
  {
    title: 'Performance Reviews',
    href: '/reviews',
    icon: ClipboardList,
    roles: ['super_admin', 'hr_admin'],
  },
  {
    title: 'Announcements',
    href: '/announcements',
    icon: Megaphone,
    roles: ['super_admin', 'hr_admin'],
  },
  // Social Media Features
  {
    title: 'Content Planning',
    href: '/content',
    icon: Camera,
    roles: ['super_admin', 'social_media_admin'],
  },
  {
    title: 'Content Calendar',
    href: '/calendar',
    icon: Calendar,
    roles: ['super_admin', 'social_media_admin'],
  },
  // Assets & Files
  {
    title: 'Assets',
    href: '/assets',
    icon: FolderOpen,
    roles: ['super_admin', 'hr_admin', 'social_media_admin', 'developer'],
  },
];

const roleConfig = {
  super_admin: {
    title: 'Super Admin',
    icon: Crown,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  hr_admin: {
    title: 'HR Admin',
    icon: Briefcase,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  social_media_admin: {
    title: 'Social Media Admin',
    icon: Camera,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  developer: {
    title: 'Developer',
    icon: Code,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
};

export function Sidebar() {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  console.log('Sidebar - Current profile:', profile);
  console.log('Sidebar - Current location:', location.pathname);

  if (!profile) {
    console.log('Sidebar - No profile found');
    return null;
  }

  const userRole = profile.role as keyof typeof roleConfig;
  const roleInfo = roleConfig[userRole];
  
  if (!roleInfo) {
    console.log('Sidebar - No role info found for role:', userRole);
    return null;
  }
  
  const RoleIcon = roleInfo.icon;

  const filteredNavigation = navigation.filter(item => {
    const hasAccess = item.roles.includes(profile.role);
    console.log(`Navigation item ${item.title}: user role ${profile.role}, required roles [${item.roles.join(', ')}], has access: ${hasAccess}`);
    return hasAccess;
  });

  console.log('Sidebar - Filtered navigation items:', filteredNavigation.length);

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <Users className="h-8 w-8 text-blue-600 mr-3" />
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Shoky Hub</h1>
          <p className="text-sm text-gray-500">Community Management</p>
        </div>
      </div>

      {/* User Role Badge */}
      <div className="px-6 py-4">
        <div className={cn("flex items-center p-3 rounded-lg", roleInfo.bgColor)}>
          <RoleIcon className={cn("h-5 w-5 mr-3", roleInfo.color)} />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{profile.full_name}</p>
            <p className={cn("text-xs", roleInfo.color)}>{roleInfo.title}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
              onClick={() => console.log('Navigating to:', item.href)}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="px-4 py-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => {
            console.log('Signing out...');
            signOut();
          }}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
