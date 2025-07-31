
import React, { useState } from 'react';

type FormView = 'login' | 'register';

interface AuthFormProps {
  onAuthSuccess: (username: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [view, setView] = useState<FormView>('login');
  const [error, setError] = useState<string | null>(null);

  const switchView = (newView: FormView) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setError(null);
    setView(newView);
  };

  const handleFocus = () => {
    setError(null);
  };

  const handleSubmitLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const usersRaw = localStorage.getItem('silver_users');
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const user = users.find((u: any) => u.username === username && u.password === password);

    if (user) {
      localStorage.setItem('silver_authenticated_user', username);
      onAuthSuccess(username);
    } else {
      setError('Invalid username or password.');
    }
  };

  const handleSubmitRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = (formData.get('username') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();
    const password = formData.get('password') as string;

    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }

    const usersRaw = localStorage.getItem('silver_users');
    const users = usersRaw ? JSON.parse(usersRaw) : [];

    if (users.find((u: any) => u.username === username)) {
      setError('Username already exists.');
      return;
    }
    if (users.find((u: any) => u.email === email)) {
      setError('An account with this email already exists.');
      return;
    }

    users.push({ username, email, password });
    localStorage.setItem('silver_users', JSON.stringify(users));
    localStorage.setItem('silver_authenticated_user', username);
    onAuthSuccess(username);
  };

  const formBaseClasses = "absolute w-full transition-all duration-500 ease-in-out";
  const activeClasses = "opacity-100 transform-none pointer-events-auto";
  const inactiveClasses = "opacity-0 transform translate-y-5 pointer-events-none";

  return (
    <div className="relative w-[396px] max-w-[90%] bg-transparent rounded-2xl">
      {/* The actual form card content, which sits on top */}
      <div className="relative w-full bg-white/25 dark:bg-black/30 backdrop-blur-2xl border border-white/20 dark:border-primary-dark/20 rounded-2xl shadow-lg shadow-primary-light/10 dark:shadow-2xl dark:shadow-primary-dark/40 text-text-primary-light dark:text-text-primary-dark p-8 overflow-hidden min-h-[480px] h-auto flex flex-col justify-center">
        <div className="relative h-[360px]">
          {/* Login Form */}
          <div className={`${formBaseClasses} ${view === 'login' ? activeClasses : inactiveClasses}`}>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold [text-shadow:0_0_6px_rgba(8,102,255,0.4)] dark:[text-shadow:0_0_10px_rgba(79,172,254,0.6)]">Login</h1>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2">Please enter your credentials.</p>
            </div>
            <form onSubmit={handleSubmitLogin} noValidate>
              <div className="space-y-4">
                <input type="text" name="username" required placeholder="Username" onFocus={handleFocus} className="w-full p-3 rounded-lg border bg-transparent border-input-border-light dark:border-input-border-dark focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:outline-none transition-all" />
                <input type="password" name="password" required placeholder="Password" onFocus={handleFocus} className="w-full p-3 rounded-lg border bg-transparent border-input-border-light dark:border-input-border-dark focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:outline-none transition-all" />
              </div>
              {error && <p className="text-red-400 text-xs text-center pt-3">{error}</p>}
              <button type="submit" className="w-full mt-6 p-3 rounded-lg bg-primary-light text-white font-semibold hover:bg-blue-700 dark:bg-primary-dark dark:hover:bg-sky-500 transition-all transform hover:-translate-y-0.5">
                Login
              </button>
            </form>
            <p className="text-center mt-6 text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Not yet a user?{' '}
              <a href="#" onClick={switchView('register')} className="font-semibold text-primary-light dark:text-primary-dark hover:underline">
                Sign Up
              </a>
            </p>
          </div>

          {/* Register Form */}
          <div className={`${formBaseClasses} ${view === 'register' ? activeClasses : inactiveClasses}`}>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold [text-shadow:0_0_6px_rgba(8,102,255,0.4)] dark:[text-shadow:0_0_10px_rgba(79,172,254,0.6)]">Sign Up</h1>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2">Your journey is about to start.</p>
            </div>
            <form onSubmit={handleSubmitRegister} noValidate>
              <div className="space-y-4">
                <input type="text" name="username" required placeholder="Username" onFocus={handleFocus} className="w-full p-3 rounded-lg border bg-transparent border-input-border-light dark:border-input-border-dark focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:outline-none transition-all" />
                <input type="email" name="email" required placeholder="Email" onFocus={handleFocus} className="w-full p-3 rounded-lg border bg-transparent border-input-border-light dark:border-input-border-dark focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:outline-none transition-all" />
                <input type="password" name="password" required placeholder="Password" onFocus={handleFocus} className="w-full p-3 rounded-lg border bg-transparent border-input-border-light dark:border-input-border-dark focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:outline-none transition-all" />
              </div>
              {error && <p className="text-red-400 text-xs text-center pt-3">{error}</p>}
              <button type="submit" className="w-full mt-6 p-3 rounded-lg bg-primary-light text-white font-semibold hover:bg-blue-700 dark:bg-primary-dark dark:hover:bg-sky-500 transition-all transform hover:-translate-y-0.5">
                Join Us
              </button>
            </form>
            <p className="text-center mt-6 text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Already have an account?{' '}
              <a href="#" onClick={switchView('login')} className="font-semibold text-primary-light dark:text-primary-dark hover:underline">
                Login
              </a>
            </p>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 absolute bottom-4 left-0 right-0">
          &copy; {new Date().getFullYear()} SILVER
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
