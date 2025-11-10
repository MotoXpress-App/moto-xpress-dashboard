import React from 'react';
import Sidebar from './components/Sidebar';
import PriceConfig from './components/PriceConfig';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ConfigPrecios = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Sidebar />
            <div className="config-precios-container" style={{ marginLeft: "220px", padding: "20px" }}>
                <div className="d-flex align-items-center mb-4">
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => navigate('/configs')}
                        className="me-3"
                    >
                        ← Volver
                    </Button>
                    <h1 className="mb-0">Configuración de Precios</h1>
                </div>

                <PriceConfig />
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .config-precios-container {
                        margin-left: 0 !important;
                        padding: 10px !important;
                        padding-top: 60px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ConfigPrecios;
