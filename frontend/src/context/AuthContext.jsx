import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verification request to recover session state on refresh (critical for Google OAuth callbacks)
  useEffect(() => {
  const verifySession = async () => {
    try {
      
      const response = await fetch('http://localhost:5000/api/auth/me', {
        method: 'GET',
        credentials: 'include' 
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user); 
      } else {
        setUser(null); 
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  verifySession();
}, []);

  const login = async (email, password) => {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include', 
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Invalid credentials provided.");
    }
    
    const data = await response.json();
    setUser(data.user);
    return data;
  };

  const register = async (email, password) => {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include', 
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Registration failed.");
    }
    
    const data = await response.json();
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      console.error("Failed executing remote backend cookie cleanups:", e);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    console.warn("AuthContext executing outside an active AuthProvider tree.");
    return {
      user: null,
      loading: true,
      login: async () => {},
      logout: () => {},
    };
  }
  
  return context;
}