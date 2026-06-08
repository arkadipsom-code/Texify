import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; 

function LoginForm() {
  const { user, loading: authLoading, login, register } = useAuth(); 
  const [isLoginMode, setIsLoginMode] = useState(true); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // 1. AUTO-REDIRECT: If a valid manual or Google session is detected, send them to the dashboard
  useEffect(() => {
    if (!authLoading && user) {
      window.location.href = '/dashboard';
    }
  }, [user, authLoading]);

  // 2. CATCH OAUTH ROUTING ERRORS: Check if Google redirected back with an explicit authentication failure
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'oauth_failed') {
      setError('Access denied. Please ensure you select your official institutional G-Suite account.');
    }
  }, []);

  // Real-time inline verification for institutional G-Suite suffix
  useEffect(() => {
    if (!email) {
      setEmailError('');
      return;
    }
    
    const targetDomain = '@students.iiests.ac.in';
    if (!email.toLowerCase().endsWith(targetDomain)) {
      setEmailError(`Must be an official student ID ending with ${targetDomain}`);
    } else {
      setEmailError('');
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError) return; 

    setError('');
    setLoading(true);
    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || `Failed to ${isLoginMode ? 'sign in' : 'register'}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setError('');
    setGoogleLoading(true);
    // Fires an uninhibited hard page jump to pass window control over to PassportJS 
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`;
  };

  // While checking the HttpOnly token state inside AuthContext, present a clean dark loading overlay
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-medium text-sm tracking-wide">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-neutral-400 font-mono text-xs">Verifying authorization metrics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-8 max-w-md w-full shadow-2xl relative z-10 transition-all duration-300">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center border border-neutral-800 shadow-inner">
            <span className="text-xl font-bold">📄</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isLoginMode ? "Welcome to Texify" : "Join Texify"}
          </h1>
          <p className="text-xs text-neutral-500">
            {isLoginMode ? "Login to track your progress" : "Get started with your student account"}
          </p>
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-xs p-3 rounded-xl mb-4 flex items-center gap-2 animate-pulse">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-400">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourid@students.iiests.ac.in"
              required
              disabled={loading || googleLoading}
              className={`bg-neutral-900 border rounded-xl px-4 py-2.5 text-sm outline-none transition text-white ${
                emailError 
                  ? 'border-red-900 focus:border-red-500 bg-red-950/10' 
                  : 'border-neutral-800 focus:border-neutral-500'
              }`}
            />
            {emailError && (
              <span className="text-[10px] text-red-400 mt-0.5 ml-1 flex items-center gap-1">
                <span>•</span> {emailError}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5 relative">
            <label className="text-xs font-semibold text-neutral-400">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading || googleLoading}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-4 pr-10 py-2.5 text-sm outline-none focus:border-neutral-500 transition text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition text-xs focus:outline-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading || !!emailError}
            className="w-full bg-white text-black hover:bg-neutral-200 font-bold py-2.5 rounded-xl text-sm transition mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? (isLoginMode ? "Signing In..." : "Registering...") : (isLoginMode ? "Sign In" : "Sign Up")}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-900"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-neutral-950 px-2 text-neutral-600">Or continue with</span></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          className="w-full bg-neutral-900 border border-neutral-800 hover:bg-neutral-800/80 text-white font-medium py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2.5 disabled:opacity-50"
        >
          {googleLoading ? (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg class="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
</svg>
          )}
          Official Student G-Suite ID
        </button>

        <div className="text-center mt-6 flex flex-col gap-4">
          <p className='text-xs text-neutral-500'>
            {isLoginMode ? (
              <>
                New to Texify?{" "}
                <span
                  onClick={() => { setIsLoginMode(false); setError(""); }} 
                  className='text-white underline cursor-pointer hover:text-neutral-200 transition'
                >
                  Create an account
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => { setIsLoginMode(true); setError(""); }}
                  className='text-white underline cursor-pointer hover:text-neutral-200 transition'
                >
                  Sign In
                </span>
              </>
            )}
          </p>
          <div className="text-[10px] text-neutral-500 bg-neutral-900/30 py-2.5 px-3 rounded-xl border border-neutral-900/50 leading-relaxed">
            Please note: Registration is exclusively available for official IIEST Shibpur G-Suite IDs ending with <code className="bg-neutral-900 px-1 py-0.5 rounded text-neutral-400 font-mono">@students.iiests.ac.in</code>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthPage() {
  return <LoginForm />;
}