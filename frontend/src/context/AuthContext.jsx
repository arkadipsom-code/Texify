import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        // 1. Check if a token came through the URL query string (from Google OAuth redirection)
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');

        if (tokenFromUrl) {
          localStorage.setItem('texify_token', tokenFromUrl);
          
          // Clean up the address bar so the token isn't visible in the URL string
          const newUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }

        // 2. Extract the working token from localStorage
        const token = localStorage.getItem('texify_token');

        // Set headers conditionally depending on whether a token profile exists
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_ROOT}/api/auth/me`, {
          method: 'GET',
          headers: headers,
          credentials: 'include' 
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user); 
        } else {
          // Clear broken tokens out if authentication fails
          localStorage.removeItem('texify_token');
          setUser(null); 
        }
      } catch (err) {
        localStorage.removeItem('texify_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (email, password) => {
    const response = await fetch(`${API_ROOT}/api/auth/login`, {
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
    
    // Save the returned token parameter locally 
    if (data.token) {
      localStorage.setItem('texify_token', data.token);
    }

    setUser(data.user);
    return data;
  };

  const register = async (email, password) => {
    const response = await fetch(`${API_ROOT}/api/auth/register`, {
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
    
    if (data.token) {
      localStorage.setItem('texify_token', data.token);
    }

    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('texify_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await fetch(`${API_ROOT}/api/auth/logout`, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
      });
    } catch (e) {
      console.error("Failed executing remote backend cookie cleanups:", e);
    } finally {
      // Always remove your storage profiles on logout state triggers
      localStorage.removeItem('texify_token');
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