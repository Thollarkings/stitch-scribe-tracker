import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Convex custom email/password auth using sessions stored in Convex
// @ts-ignore
import { useMutation, useQuery, useAction } from 'convex/react';
// @ts-ignore
import { api } from '../../convex/_generated/api';

interface AuthUser { id: string; email: string; name?: string }

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('convex_token'));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Queries/Mutations
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const me = useQuery(api.auth.me, token ? { token } : 'skip');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const login = useAction(api.auth_actions.login);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const register = useAction(api.auth_actions.register);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const logout = useAction(api.auth_actions.logout);

  useEffect(() => {
    if (token === null) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    if (me === undefined) {
      // query not issued yet
      setIsLoading(true);
      return;
    }
    // me resolved (either user or null)
    setUser(me ?? null);
    setIsLoading(false);
  }, [token, me]);

  const signIn = async (email: string, password: string) => {
    try {
      const res = await login({ email, password });
      localStorage.setItem('convex_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } catch (err: any) {
      console.error('Login failed', err);
      throw new Error(err?.message || 'Failed to sign in. Please check your credentials.');
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const res = await register({ email, password, name });
      localStorage.setItem('convex_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } catch (err: any) {
      console.error('Registration failed', err);
      throw new Error(err?.message || 'Failed to sign up. Please try again.');
    }
  };

  const signOut = async () => {
    const t = localStorage.getItem('convex_token');
    if (t) await logout({ token: t });
    localStorage.removeItem('convex_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
