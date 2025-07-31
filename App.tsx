
import React, { useState, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import StarCanvas from './components/StarCanvas';
import AuthForm from './components/AuthForm';
import ThemeSwitcher from './components/ThemeSwitcher';
import SuccessPage from './components/SuccessPage';
import CompanyLogo from './components/CompanyLogo';
import IntroScreen from './components/IntroScreen';

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    const authenticatedUser = localStorage.getItem('silver_authenticated_user');
    if (authenticatedUser) {
      setUsername(authenticatedUser);
      setIsAuthenticated(true);
      setIsReconnecting(true);
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleAuthSuccess = (name: string) => {
    setUsername(name);
    setIsAuthenticated(true);
    setIsReconnecting(false); // This is a new auth, not a reconnect session
  };

  const handleRedirect = () => {
    localStorage.removeItem('silver_authenticated_user');
    setIsAuthenticated(false);
    setUsername(null);
    setIsReconnecting(false);
  };

  return (
    <main className={`font-['Poppins',_sans-serif] min-h-screen flex items-center justify-center overflow-hidden relative transition-colors duration-300 ease-in-out ${theme === 'dark' ? 'dark bg-black' : 'bg-white'}`}>
      <StarCanvas theme={theme} />
      
      {isLoading ? (
        <IntroScreen />
      ) : (
        <div className="contents animate-fade-in">
          <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
          <CompanyLogo />
          
          <div className="z-10 transition-opacity duration-700 ease-in-out">
            {isAuthenticated ? (
              <SuccessPage 
                username={username!} 
                onRedirect={handleRedirect} 
                isReconnecting={isReconnecting}
              />
            ) : (
              <AuthForm onAuthSuccess={handleAuthSuccess} />
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default App;
