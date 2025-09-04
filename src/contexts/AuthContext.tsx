import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'user' | 'owner' | 'community' | 'broker';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  verified: boolean;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: { name: string; email: string; password: string; role: UserRole }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration - Replace with Supabase integration
const mockUsers: Record<string, User & { password: string }> = {
  'user@example.com': {
    id: '1',
    name: 'John User',
    email: 'user@example.com',
    password: 'password',
    role: 'user',
    verified: true
  },
  'owner@example.com': {
    id: '2',
    name: 'Jane Owner',
    email: 'owner@example.com',
    password: 'password',
    role: 'owner',
    verified: true
  },
  'community@example.com': {
    id: '3',
    name: 'Chief Community',
    email: 'community@example.com',
    password: 'password',
    role: 'community',
    verified: true
  },
  'broker@example.com': {
    id: '4',
    name: 'Agent Broker',
    email: 'broker@example.com',
    password: 'password',
    role: 'broker',
    verified: true
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session - Replace with Supabase session check
    const storedUser = localStorage.getItem('camland_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Mock login - Replace with Supabase authentication
    const mockUser = mockUsers[email];
    if (mockUser && mockUser.password === password) {
      const { password: _, ...userWithoutPassword } = mockUser;
      setUser(userWithoutPassword);
      localStorage.setItem('camland_user', JSON.stringify(userWithoutPassword));
    } else {
      throw new Error('Invalid credentials');
    }
    setIsLoading(false);
  };

  const signup = async (userData: { name: string; email: string; password: string; role: UserRole }) => {
    setIsLoading(true);
    // Mock signup - Replace with Supabase user creation
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      verified: false
    };
    setUser(newUser);
    localStorage.setItem('camland_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('camland_user');
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