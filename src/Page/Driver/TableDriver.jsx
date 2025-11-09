import React from 'react';
import { Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "../../components/Table.css"

const TableDriver = (props) => {
    const navigate = useNavigate();

    // 🔹 Funciones auxiliares
    const getKey = (header) => (typeof header === 'string' ? header : header.key);
    const getLabel = (header) => (typeof header === 'string' ? header.toUpperCase() : header.label);

    // 🔹 Cuando se hace clic en una fila
    const handleFilaClick = (fila) => {
        navigate(`/choferes/${fila.id}`);
    };

    // 🔹 Renderizar celda con formato especial
    const renderCell = (col, fila) => {
        const key = getKey(col);
        const value = fila[key];

        if (key === 'id') {
            return <Badge bg="dark" className="px-2 py-1">#{value}</Badge>;
        } else if (key === 'email') {
            return <span className="text-success">{value}</span>;
        } else if (key === 'name' || key === 'lastname') {
            return <strong>{value}</strong>;
        }

        return value;
    };

    return (
        <div className="tabla-container">
            <h1 className="mb-4">Choferes</h1>
            <table className="tabla tabla-choferes">
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
                            className="fila-hover"
                        >
                            {props.headers.map((col, colIndex) => (
                                <td key={colIndex}>{renderCell(col, fila)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableDriver;
