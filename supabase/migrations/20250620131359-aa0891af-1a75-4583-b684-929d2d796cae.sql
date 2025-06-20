
-- Create enum types for roles and task statuses
CREATE TYPE public.app_role AS ENUM ('super_admin', 'hr_admin', 'social_media_admin', 'developer');
CREATE TYPE public.task_status AS ENUM ('todo', 'in_progress', 'done', 'review', 'approved', 'rejected');
CREATE TYPE public.content_status AS ENUM ('draft', 'pending_approval', 'approved', 'rejected', 'published');
CREATE TYPE public.user_status AS ENUM ('active', 'inactive', 'pending');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'developer',
  status user_status NOT NULL DEFAULT 'active',
  avatar_url TEXT,
  phone TEXT,
  department TEXT,
  hire_date DATE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  assigned_by UUID REFERENCES public.profiles(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create tasks table for task management
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'todo',
  priority INTEGER DEFAULT 1,
  assigned_to UUID REFERENCES public.profiles(id),
  assigned_by UUID REFERENCES public.profiles(id),
  project_id UUID,
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  estimated_hours INTEGER,
  actual_hours INTEGER,
  tags TEXT[],
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create content_plans table for social media content planning
CREATE TABLE public.content_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT,
  platform TEXT,
  scheduled_date TIMESTAMPTZ,
  status content_status NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  approved_by UUID REFERENCES public.profiles(id),
  content_data JSONB DEFAULT '{}'::jsonb,
  media_urls TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create activity_logs table for tracking user activities
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create announcements table for HR announcements
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  target_roles app_role[],
  is_urgent BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create attendance table for HR attendance tracking
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  date DATE NOT NULL,
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  hours_worked DECIMAL(4,2),
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create performance_reviews table for HR reviews
CREATE TABLE public.performance_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  reviewer_id UUID REFERENCES public.profiles(id) NOT NULL,
  review_period_start DATE NOT NULL,
  review_period_end DATE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  goals TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create asset_folders table for file organization
CREATE TABLE public.asset_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  parent_id UUID REFERENCES public.asset_folders(id),
  access_roles app_role[],
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_folders ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = _user_id
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Super admins can do everything on profiles" ON public.profiles
  FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "HR admins can update profiles" ON public.profiles
  FOR UPDATE USING (public.has_role(auth.uid(), 'hr_admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for tasks
CREATE POLICY "Users can view assigned tasks" ON public.tasks
  FOR SELECT USING (
    auth.uid() = assigned_to OR 
    auth.uid() = assigned_by OR
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'hr_admin')
  );

CREATE POLICY "Admins can manage all tasks" ON public.tasks
  FOR ALL USING (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'hr_admin')
  );

CREATE POLICY "Users can update assigned tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = assigned_to);

-- RLS Policies for content_plans
CREATE POLICY "Social media admins can manage content" ON public.content_plans
  FOR ALL USING (
    public.has_role(auth.uid(), 'social_media_admin') OR
    public.has_role(auth.uid(), 'super_admin')
  );

CREATE POLICY "All users can view approved content" ON public.content_plans
  FOR SELECT USING (status = 'approved' OR auth.uid() = created_by);

-- RLS Policies for activity_logs
CREATE POLICY "Admins can view all activity logs" ON public.activity_logs
  FOR SELECT USING (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'hr_admin')
  );

CREATE POLICY "Users can view own activity logs" ON public.activity_logs
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for announcements
CREATE POLICY "All users can view announcements" ON public.announcements
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND (
      target_roles IS NULL OR 
      public.get_user_role(auth.uid()) = ANY(target_roles)
    )
  );

CREATE POLICY "HR and Super admins can manage announcements" ON public.announcements
  FOR ALL USING (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'hr_admin')
  );

-- RLS Policies for attendance
CREATE POLICY "HR can view all attendance" ON public.attendance
  FOR SELECT USING (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'hr_admin')
  );

CREATE POLICY "Users can view own attendance" ON public.attendance
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "HR can manage attendance" ON public.attendance
  FOR ALL USING (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'hr_admin')
  );

-- RLS Policies for performance_reviews
CREATE POLICY "Users can view own reviews" ON public.performance_reviews
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = reviewer_id);

CREATE POLICY "HR can manage all reviews" ON public.performance_reviews
  FOR ALL USING (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'hr_admin')
  );

-- Create trigger function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'developer'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update last_login_at
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  UPDATE public.profiles 
  SET last_login_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;

-- Create storage bucket for assets
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true);

-- Create RLS policies for storage
CREATE POLICY "Anyone can view assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'assets');

CREATE POLICY "Authenticated users can upload assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'assets' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own assets" ON storage.objects
  FOR UPDATE USING (bucket_id = 'assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can delete assets" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'assets' AND (
      auth.uid()::text = (storage.foldername(name))[1] OR
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('super_admin', 'hr_admin')
      )
    )
  );
