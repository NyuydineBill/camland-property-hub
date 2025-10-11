import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export type UserRole = 'user' | 'owner' | 'community' | 'broker' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  verified: boolean;
  avatar?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: { name: string; email: string; password: string; role: UserRole; phone?: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (session?.user) {
        console.log('Auth state changed:', event, 'User ID:', session.user.id);
        
        // Fetch user profile data with retry logic
        let retries = 3;
        let profile = null;
        
        while (retries > 0 && !profile) {
          try {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (data) {
              profile = data;
              break;
            } else if (error && retries === 1) {
              console.log('Profile not found, using metadata fallback');
              // Fallback to user metadata if profile doesn't exist
              profile = {
                id: session.user.id,
                full_name: session.user.user_metadata?.full_name || session.user.email || '',
                role: session.user.user_metadata?.role || 'user',
                phone: session.user.user_metadata?.phone || ''
              };
            }
          } catch (error) {
            console.log(`Profile fetch attempt ${4-retries} failed:`, error);
          }
          
          retries--;
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
          }
        }
        
        if (profile) {
          setUser({
            id: session.user.id,
            name: profile.full_name || session.user.email || '',
            email: session.user.email || '',
            role: profile.role as UserRole,
            verified: !!session.user.email_confirmed_at,
            phone: profile.phone
          });
        }
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('Attempting login with email:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('Login response:', { data, error });
    
    if (error) {
      console.error('Login error details:', error);
      throw new Error(error.message);
    }
  };

  const signup = async (userData: { name: string; email: string; password: string; role: UserRole; phone?: string }) => {
    const redirectUrl = `${window.location.origin}/`;
    
    console.log('Attempting signup with:', { 
      email: userData.email, 
      role: userData.role,
      name: userData.name,
      phone: userData.phone 
    });
    
    // Validate required fields
    if (!userData.name || !userData.email || !userData.password) {
      throw new Error('Name, email, and password are required');
    }
    
    // Validate role
    const validRoles = ['user', 'owner', 'community', 'broker', 'admin'];
    if (!validRoles.includes(userData.role)) {
      throw new Error('Invalid role selected');
    }
    
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: userData.name || 'User',
          role: userData.role || 'user',
          phone: userData.phone || ''
        }
      }
    });
    
    console.log('Signup response:', { data, error });
    
    if (error) {
      console.error('Signup error details:', error);
      
      // If it's a database error, try to handle it gracefully
      if (error.message.includes('unexpected_failure') || error.message.includes('Database error')) {
        // Try to create the user anyway and manually create the profile
        console.log('Attempting manual profile creation...');
        
        try {
          // Wait a moment for the user to be created in auth.users
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Try to manually create the profile if the user was created
          if (data?.user?.id) {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                full_name: userData.name,
                phone: userData.phone || '',
                role: userData.role
              });
            
            if (profileError) {
              console.log('Profile creation failed, but user account was created:', profileError);
            } else {
              console.log('Profile created manually after signup');
              return; // Success!
            }
          }
        } catch (manualError) {
          console.log('Manual profile creation failed:', manualError);
        }
        
        throw new Error('Account created but profile setup incomplete. Please contact support or try logging in.');
      } else if (error.message.includes('User already registered')) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      } else if (error.message.includes('Password should be at least')) {
        throw new Error('Password must be at least 6 characters long.');
      } else {
        throw new Error(error.message);
      }
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      signup,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};