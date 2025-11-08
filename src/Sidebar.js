import React from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Importamos `useNavigate` para redirigir

const Sidebar = () => {
  
  // Obtener el tipo de usuario desde el localStorage
  const clientType = localStorage.getItem('clientType');
  const navigate = useNavigate();  // Usamos `useNavigate` para redirigir a otra página

  // Función para cerrar sesión
  const handleLogout = () => {
    // Limpiar el localStorage (puedes eliminar más datos si es necesario)
    localStorage.removeItem('clientType');

     localStorage.clear();

    // Redirigir al usuario a la página de login
    navigate('/login');
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      {/*<div className="sidebar bg-dark text-white" style={{ width: '250px', height: '100vh' }}>*/}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '250px',
          height: '100vh',
          backgroundColor: '#333',
          color: 'white',
          padding: '20px',
          zIndex: 10
        }}
      >
        <h3 className="text-center p-4">MotoXpress</h3>
        <ul className="nav flex-column">
          {/* Condición para Administrador */}
               {/*<li className="nav-item">
                <Link to="/home" className="nav-link text-white">Home</Link>
              </li>
               */}
              <li className="nav-item">
                <Link to="/usuarios" className="nav-link text-white">Usuarios</Link>
              </li>
              <li className="nav-item">
                <Link to="/choferes" className="nav-link text-white">Choferes</Link>
              </li>
              <li className="nav-item">
                <Link to="/viajes" className="nav-link text-white">Viajes</Link>
              </li>
              <li className="nav-item">
                <Link to="/configs" className="nav-link text-white">Configuraciones</Link>
              </li>
              <li className="nav-item">
                <Link to="/Login" className="nav-link text-white">Salir</Link>
              </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="content p-4" style={{ flex: 1 }}>
        {/* Aquí se renderizará el contenido de las otras páginas */}
      </div>
    </div>
  );
};

export default Sidebar;
