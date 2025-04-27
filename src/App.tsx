import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Nav from './components/Nav';
import Articles from './pages/Articles';
import AddArticle from './pages/AddArticle';
import EditArticle from './pages/EditArticle';

const App = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(localStorage.getItem('authorized_user') === 'true');

  // Listen to storage changes (if multiple tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthorized(localStorage.getItem('authorized_user') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();

    if (!isAuthorized && location.pathname !== '/login') {
      return <Navigate to="/login" replace />;
    }
    if (isAuthorized && location.pathname === '/login') {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <Nav />
      <main>
        <AuthWrapper>
          <Routes>
            <Route index path='/' element={<Home />} />
            <Route path='/login' element={<Login setIsAuthorized={setIsAuthorized} />} /> {/* 👈 Pass setter */}
            <Route path='/articles' element={<Articles />} />
            <Route path='/add/article' element={<AddArticle />} />
            <Route path='/edit/article/:id' element={<EditArticle />} />
          </Routes>
        </AuthWrapper>
      </main>
    </BrowserRouter>
  );
};

export default App;
