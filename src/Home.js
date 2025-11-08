import React from 'react';
//import Sidebar from './Sidebar';
import Sidebar from './components/Sidebar';

const Home = () => {
  return (
    <div className="container mt-5">
      <Sidebar>        
      </Sidebar>
      <h1 className="text-center">Página de Inicio</h1>
      <p className="text-center">
        Bienvenido a la página principal después de iniciar sesión. Aquí puedes agregar más contenido o funcionalidad.
      </p>
      <div className="text-center">
        <button className="btn btn-secondary">
          Opciones
        </button>
      </div>
    </div>
  );
};

export default Home;
