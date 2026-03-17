import React, { createContext, useContext, useMemo, useState } from 'react';
import { sampleUser } from '../data/sampleData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(sampleUser);
  const [loading, setLoading] = useState(false);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    signIn: async (email) => {
      setLoading(true);
      try {
        const role = email?.toLowerCase().includes('viewer') ? 'viewer' : email?.toLowerCase().includes('staff') ? 'staff' : email?.toLowerCase().includes('manager') ? 'manager' : 'admin';
        setUser({
          uid: 'local-user',
          name: email?.split('@')[0] || 'Asaad Admin',
          email: email || 'admin@clothingos.com',
          role
        });
      } finally {
        setLoading(false);
      }
    },
    signOutUser: async () => setUser(null),
    setRole: (role) => setUser((prev) => ({ ...prev, role }))
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
