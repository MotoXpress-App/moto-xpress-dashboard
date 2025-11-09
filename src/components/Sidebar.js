import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';  // Importamos `useNavigate` para redirigir
import "./Sidebar.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detecta cambio de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Botón hamburguesa visible solo en móvil */}
      {isMobile && (
        <button className="hamburger-btn" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      )}

      <div className={`sidebar ${isOpen ? "open" : ""} ${isMobile ? "mobile" : ""}`}>
        <nav className="menu">
          <Link to="/home" className="nav-link text-white">
            <img 
              src={require("../images/logo_transparent.png")} 
              alt="Logo" 
              className="logo" 
            />
          </Link>
          <Link to="/usuarios" className="nav-link text-white">Usuarios</Link>
          <Link to="/Choferes" className="nav-link text-white">Choferes</Link>
          <Link to="/Viajes" className="nav-link text-white">Viajes</Link>
          <Link to="/pagos" className="nav-link text-white">Pagos</Link>
          <Link to="/configs" className="nav-link text-white">Configs</Link>
          <Link to="/Login" className="nav-link text-white">Salir</Link>
        </nav>
      </div>
    </>
  );
}
