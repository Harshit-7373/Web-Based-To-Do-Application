import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoginForm from './components/Auth/LoginForm';
import Dashboard from './components/Dashboard/Dashboard';

function AppContent() {
  const { state } = useApp();
  const [isLogin, setIsLogin] = useState(true);

  if (state.isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <LoginForm 
      isLogin={isLogin} 
      onToggleMode={() => setIsLogin(!isLogin)} 
    />
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;