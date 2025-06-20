
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function UpgradeToSuperAdmin() {
  const { user, profile } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);

  if (!user || !profile || profile.role === 'super_admin') {
    return null;
  }

  const upgradeToSuperAdmin = async () => {
    setIsUpgrading(true);
    
    try {
      console.log('Upgrading user to super admin:', user.id);
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'super_admin' })
        .eq('id', user.id);

      if (error) {
        console.error('Error upgrading to super admin:', error);
        toast({
          title: 'Upgrade Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        console.log('Successfully upgraded to super admin');
        toast({
          title: 'Role Updated!',
          description: 'You are now a Super Admin. Please refresh the page.',
        });
        
        // Refresh the page to reload the profile
        window.location.reload();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Upgrade Failed',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
    
    setIsUpgrading(false);
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Crown className="h-5 w-5 text-yellow-600" />
          <span>Upgrade to Super Admin</span>
        </CardTitle>
        <CardDescription>
          Click the button below to upgrade your account to Super Admin and access all features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={upgradeToSuperAdmin} 
          disabled={isUpgrading}
          className="w-full"
        >
          {isUpgrading ? 'Upgrading...' : 'Upgrade to Super Admin'}
        </Button>
      </CardContent>
    </Card>
  );
}
