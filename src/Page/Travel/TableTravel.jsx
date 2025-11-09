import React from 'react';
import { Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "../../components/Table.css";

const TableTravel = (props) => {
    const navigate = useNavigate();

    // 🔹 Funciones auxiliares
    const getKey = (header) => (typeof header === 'string' ? header : header.key);
    const getLabel = (header) => (typeof header === 'string' ? header.toUpperCase() : header.label);

    // 🔹 Cuando se hace clic en una fila
    const handleFilaClick = (fila) => {
        navigate(`/viajes/${fila.id}`);
    };

    // 🔹 Obtener badge de estado con color
    const getStatusBadge = (status) => {
        if (!status) return <Badge bg="secondary" className="fs-6 px-3 py-2">Sin estado</Badge>;

        // Mapeo específico de estados del backend
        const statusMap = {
            'Created': { bg: 'warning', text: 'dark', icon: '📝', label: 'Creado' },
            'Accepted': { bg: 'info', text: 'white', icon: '👍', label: 'Aceptado' },
            'Progress': { bg: 'primary', text: 'white', icon: '🚗', label: 'En Progreso' },
            'Finalized': { bg: 'success', text: 'white', icon: '✓', label: 'Finalizado' },
            'Finalized not destination': { bg: 'warning', text: 'dark', icon: '⚠', label: 'Finalizado sin destino' },
            'Cancell in progress': { bg: 'danger', text: 'white', icon: '✗', label: 'Cancelado en proceso' },
            'Cancelled': { bg: 'danger', text: 'white', icon: '✗', label: 'Cancelado' }
        };

        const statusInfo = statusMap[status];

        if (statusInfo) {
            return (
                <Badge
                    bg={statusInfo.bg}
                    text={statusInfo.text}
                    className="fs-6 px-3 py-2"
                >
                    {statusInfo.icon} {statusInfo.label}
                </Badge>
            );
        }

        // Fallback para estados no mapeados
        return <Badge bg="secondary" className="fs-6 px-3 py-2">{status}</Badge>;
    };

    // 🔹 Obtener badge de tipo de pago con color
    const getPaymentTypeBadge = (typeId) => {
        const tiposPayment = {
            1: { nombre: 'Efectivo', color: 'success' },
            2: { nombre: 'Tarjeta Crédito', color: 'primary' },
            3: { nombre: 'Tarjeta Débito', color: 'info' },
            4: { nombre: 'Mercado Pago', color: 'warning' },
            5: { nombre: 'Transferencia', color: 'secondary' }
        };

        const tipo = tiposPayment[typeId] || { nombre: 'Desconocido', color: 'secondary' };
        return <Badge bg={tipo.color} className="px-2 py-1">{tipo.nombre}</Badge>;
    };

    // 🔹 Formatear precio
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(price || 0);
    };

    // 🔹 Renderizar celda con formato especial según el tipo
    const renderCell = (col, fila) => {
        const key = getKey(col);
        const value = fila[key];

        if (key === 'status') {
            return getStatusBadge(value);
        } else if (key === 'id_type_payment') {
            return getPaymentTypeBadge(value);
        } else if (key === 'price') {
            return <strong className="text-success">{formatPrice(value)}</strong>;
        } else if (key === 'id') {
            return <Badge bg="dark" className="px-2 py-1">#{value}</Badge>;
        } else if (key === 'user_name') {
            return <strong>{value}</strong>;
        } else if (key === 'from_info' || key === 'to_info') {
            return <small className="text-muted">{value}</small>;
        }

        return value;
    };

    return (
        <div className="tabla-container">
            <table className="tabla tabla-viajes">
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
                            className="fila-viaje-hover"
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

export default TableTravel;
