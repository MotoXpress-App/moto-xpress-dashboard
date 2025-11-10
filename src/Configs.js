import React from 'react';
import Sidebar from './components/Sidebar';
import { Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Configs = () => {
    const navigate = useNavigate();

    const configSections = [
        {
            title: 'Precios de Viaje',
            description: 'Configura las tarifas, cuotas y precios de los viajes',
            icon: '💰',
            path: '/configs/precios',
            color: '#0d6efd'
        },
        // Aquí puedes agregar más secciones en el futuro
        // {
        //     title: 'Notificaciones',
        //     description: 'Configura las notificaciones y alertas del sistema',
        //     icon: '🔔',
        //     path: '/configs/notificaciones',
        //     color: '#198754'
        // },
    ];

    return (
        <div>
            <Sidebar />
            <div className="configs-container" style={{ marginLeft: "220px", padding: "20px" }}>
                <h1 className="mb-4">Configuraciones</h1>
                <p className="text-muted mb-4">
                    Selecciona una sección para configurar
                </p>

                <Row>
                    {configSections.map((section, index) => (
                        <Col md={6} lg={4} key={index} className="mb-4">
                            <Card
                                className="h-100 shadow-sm"
                                style={{
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';
                                }}
                                onClick={() => navigate(section.path)}
                            >
                                <Card.Body>
                                    <div
                                        style={{
                                            fontSize: '3rem',
                                            marginBottom: '1rem',
                                            color: section.color
                                        }}
                                    >
                                        {section.icon}
                                    </div>
                                    <Card.Title style={{ color: section.color }}>
                                        {section.title}
                                    </Card.Title>
                                    <Card.Text className="text-muted">
                                        {section.description}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .configs-container {
                        margin-left: 0 !important;
                        padding: 10px !important;
                        padding-top: 60px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Configs;
