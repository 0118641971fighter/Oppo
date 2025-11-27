import { useState, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';
import LoginForm from '@/components/LoginForm';
import ViolationsDashboard from '@/components/ViolationsDashboard';

export default function Home() {
  const [screen, setScreen] = useState<'splash' | 'login' | 'dashboard'>('splash');

  useEffect(() => {
    const loggedIn = localStorage.getItem('oppo-logged-in');
    if (loggedIn === 'true') {
      setScreen('dashboard');
    }
  }, []);

  const handleSplashComplete = () => {
    setScreen('login');
  };

  const handleLoginSuccess = () => {
    localStorage.setItem('oppo-logged-in', 'true');
    setScreen('dashboard');
  };

  if (screen === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (screen === 'login') {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return <ViolationsDashboard />;
}
