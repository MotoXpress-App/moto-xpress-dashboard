import React from 'react';
//import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "./Table.css";

const App = (props) => {
    const navigate = useNavigate();

    // 🔹 Funciones auxiliares
    const getKey = (header) => (typeof header === 'string' ? header : header.key);
    const getLabel = (header) => (typeof header === 'string' ? header.toUpperCase() : header.label);

    // 🔹 Cuando se hace clic en una fila
    const handleFilaClick = (fila) => {
        // Redirige a una nueva ruta (por ejemplo /usuario/123)
        navigate(`/usuario/${fila.id}`);
    };

    return (
        <div className="tabla-container">
            <h1>Usuarios</h1>
            <table className="tabla">
                <thead>
                    <tr>
                        {props.headers.map((header, index) => (
                            <th key={index}>{getLabel(header)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((fila, rowIndex) => (
                        <tr
                            key={rowIndex}
                            onClick={() => handleFilaClick(fila)}
                            style={{ cursor: 'pointer' }}
                        >
                            {props.headers.map((col, colIndex) => (
                                <td key={colIndex}>{fila[getKey(col)]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default App;
