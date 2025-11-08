import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import axios from "axios";
import './Viajes.css';
import TableTravel from "./Page/Travel/TableTravel";

const Viajes = () => {
  const [data, setData] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [typeTravel, setTypeTravel] = useState(1); // 🔹 Por defecto, type_travel = 1
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData(typeTravel);
  }, [typeTravel]);

  const getData = async (type) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/travel?type_travel=${type}`
      );

      setDetalles(response.data.data || []); // el backend devuelve { success, data }

      const campos = [
        "id",
        "user_name",
        "status",
        "from_info",
        "to_info",
        "price",
        "type_travel",
        "id_type_payment",
      ];

      const resultado = (response.data.data || []).map((obj) =>
        Object.fromEntries(campos.map((campo) => [campo, obj[campo]]))
      );

      setData(resultado);
    } catch (error) {
      console.error("Error al obtener los viajes:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Nombres legibles para los tipos de viaje
  const tiposViaje = [
    { id: 1, nombre: "Viajes" },
    { id: 2, nombre: "Envios" },
    { id: 3, nombre: "Fletes liviano" },
    { id: 4, nombre: "Fletes pesados" },
    { id: 5, nombre: "Emergencias motovehicular" },
    { id: 6, nombre: "Gomeria movil" },
  ];

  const headers = [
    { key: "id", label: "ID" },
    { key: "user_name", label: "Nombre" },
    { key: "status", label: "Estado" },
    { key: "from_info", label: "Desde" },
    { key: "to_info", label: "Hasta" },
    { key: "price", label: "Precio" },
    { key: "id_type_payment", label: "Tipo de pago" },
  ];

  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: "220px", padding: "20px" }}>
        <h1 className="title-viajes">Viajes</h1>
        {/* 🔹 Navbar de tipos de viaje */}
        <div className="navbar-viajes">
          {tiposViaje.map((tipo) => (
            <button
              key={tipo.id}
              onClick={() => setTypeTravel(tipo.id)}
              className={`btn-viaje ${typeTravel === tipo.id ? "activo" : ""}`}
            >
              {tipo.nombre}
            </button>
          ))}
        </div>

        {/* 🔹 Tabla de viajes */}
        {loading ? (
          <div className="text-center py-6 text-gray-500">
            Cargando viajes...
          </div>
        ) : (
          <TableTravel data={data} headers={headers} detalles={detalles} />
        )}
      </div>
    </div>
  );
};

export default Viajes;
