import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login'; // Importa tu componente de Login
import Home from './Home';   // Otro componente, por ejemplo, una página principal
import Usuarios from './Usuarios';
import Choferes from './Choferes';
import Viajes from './Viajes';
import Configs from './Configs';
import Pagos from './Pagos';
import 'bootstrap/dist/css/bootstrap.min.css';
import UsuarioDetalle from './Page/User/UsuarioDetalle';
import ChoferesDetalle from './Page/Driver/DriverDetalle';
import ViajeDetalle from './Page/Travel/TravelDetalle';

const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated'));

  // Cargar estado desde localStorage una vez
  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(auth);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  function PrivateRoute({ children }) {
    return isAuthenticated ? children : <Navigate to="/login" />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/home" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>} />
        <Route path="/usuarios" element={
          <PrivateRoute>
            <Usuarios/>
          </PrivateRoute>} />
        <Route path="/choferes" element={
          <PrivateRoute>
            <Choferes />
          </PrivateRoute>} />
        <Route path="/viajes" element={
          <PrivateRoute>
            <Viajes />
          </PrivateRoute>} />
        <Route path="/configs" element={
          <PrivateRoute>
            <Configs/>
          </PrivateRoute>} />
        <Route path="/pagos" element={
          <PrivateRoute>
            <Pagos/>
          </PrivateRoute>} />

        {/* page */}
        <Route path="/usuario/:id" element={
          <PrivateRoute>
            <UsuarioDetalle/>
          </PrivateRoute>} />
        
        
        <Route path="/choferes/:id" element={
          <PrivateRoute>
            <ChoferesDetalle/>
          </PrivateRoute>} />
        
        
        <Route path="/viajes/:id" element={
          <PrivateRoute>
            <ViajeDetalle/>
          </PrivateRoute>} />
      </Routes>
    </Router >
  );
}

export default App;
