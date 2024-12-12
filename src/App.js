import React, { useState, useEffect } from 'react';
import Login from './component/Login';
import Dashboard from './component/Dashboard';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleLogin = (status) => {
    setIsAuthenticated(status);
  };
  const handleLogout = (status) => {
    setIsAuthenticated(status);
  };

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);


  return (
    <div className="App">
    {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
