import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import axios from 'axios';
import { Button, Modal, Form, Alert, Badge, Card, Row, Col } from 'react-bootstrap';

const Pagos = () => {
    const [pendingPayments, setPendingPayments] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('transferencia');
    const [paymentNotes, setPaymentNotes] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            // Cargar pagos pendientes
            const paymentsResponse = await axios.get(
                `${process.env.REACT_APP_API_URL}/wallet/payments/pending`
            );
            setPendingPayments(paymentsResponse.data.data || []);

            // Cargar estadísticas
            const statsResponse = await axios.get(
                `${process.env.REACT_APP_API_URL}/wallet/payments/stats`
            );
            setStats(statsResponse.data.data || null);

        } catch (error) {
            console.error('Error al cargar datos:', error);
            setError('Error al cargar los datos de pagos');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (payment) => {
        setSelectedPayment(payment);
        setPaymentMethod('transferencia');
        setPaymentNotes('');
        setError('');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPayment(null);
        setPaymentMethod('transferencia');
        setPaymentNotes('');
        setError('');
    };

    const handleMarkAsPaid = async () => {
        if (!selectedPayment) return;

        try {
            setLoading(true);
            setError('');

            await axios.post(
                `${process.env.REACT_APP_API_URL}/wallet/payments/mark-as-paid`,
                {
                    summary_id: selectedPayment.id,
                    payment_method: paymentMethod,
                    payment_notes: paymentNotes
                }
            );

            setSuccess(`Pago marcado como completado para ${selectedPayment.driver_info.name} ${selectedPayment.driver_info.lastname}`);
            handleCloseModal();
            loadData(); // Recargar datos

            // Limpiar mensaje de éxito después de 3 segundos
            setTimeout(() => setSuccess(''), 3000);

        } catch (error) {
            console.error('Error al marcar pago:', error);
            setError(error.response?.data?.message || 'Error al marcar el pago como completado');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div>
            <Sidebar />
            <div className="pagos-container" style={{ marginLeft: "220px", padding: "20px" }}>
                <h1>Gestión de Pagos</h1>

                {success && (
                    <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                        {success}
                    </Alert>
                )}

                {error && !showModal && (
                    <Alert variant="danger" dismissible onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                {/* Estadísticas */}
                {stats && (
                    <Row className="mb-4">
                        <Col md={4}>
                            <Card className="text-center">
                                <Card.Body>
                                    <Card.Title>Total Pendiente</Card.Title>
                                    <h2 className="text-primary">{formatCurrency(stats.total_amount_pending)}</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="text-center">
                                <Card.Body>
                                    <Card.Title>Pagos Pendientes</Card.Title>
                                    <h2 className="text-warning">{stats.total_pending_payments}</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="text-center">
                                <Card.Body>
                                    <Card.Title>Conductores</Card.Title>
                                    <h2 className="text-info">{stats.total_drivers_pending}</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* Tabla de pagos pendientes */}
                <div className="card">
                    <div className="card-header">
                        <h3>Pagos Pendientes</h3>
                    </div>
                    <div className="card-body">
                        {loading ? (
                            <div className="text-center py-4">Cargando...</div>
                        ) : pendingPayments.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                                No hay pagos pendientes
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Conductor</th>
                                            <th>Email</th>
                                            <th>Teléfono</th>
                                            <th>Semana</th>
                                            <th>Período</th>
                                            <th>Viajes</th>
                                            <th>Total Ganado</th>
                                            <th>Comisión</th>
                                            <th>A Pagar</th>
                                            <th>Cuenta Bancaria</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingPayments.map((payment) => (
                                            <tr key={payment.id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        {payment.driver_info.image && (
                                                            <img
                                                                src={payment.driver_info.image}
                                                                alt={payment.driver_info.name}
                                                                style={{
                                                                    width: '40px',
                                                                    height: '40px',
                                                                    borderRadius: '50%',
                                                                    marginRight: '10px',
                                                                    objectFit: 'cover'
                                                                }}
                                                            />
                                                        )}
                                                        <div>
                                                            <strong>
                                                                {payment.driver_info.name} {payment.driver_info.lastname}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{payment.driver_info.email}</td>
                                                <td>{payment.driver_info.phone || '-'}</td>
                                                <td>
                                                    Semana {payment.week_number}/{payment.year}
                                                </td>
                                                <td>
                                                    <small>
                                                        {formatDate(payment.week_start_date)} -<br />
                                                        {formatDate(payment.week_end_date)}
                                                    </small>
                                                </td>
                                                <td className="text-center">{payment.total_trips}</td>
                                                <td>{formatCurrency(payment.total_earnings)}</td>
                                                <td>{formatCurrency(payment.total_commission)}</td>
                                                <td>
                                                    <strong className="text-success">
                                                        {formatCurrency(payment.net_payment)}
                                                    </strong>
                                                </td>
                                                <td>
                                                    {payment.bank_account ? (
                                                        <small>
                                                            <strong>{payment.bank_account.name_account}</strong><br />
                                                            {payment.bank_account.number_account}<br />
                                                            CUIL/CUIT: {payment.bank_account.cuil_cuit}
                                                        </small>
                                                    ) : (
                                                        <Badge bg="warning">Sin cuenta</Badge>
                                                    )}
                                                </td>
                                                <td>
                                                    <Badge bg="warning">Pendiente</Badge>
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => handleOpenModal(payment)}
                                                    >
                                                        Marcar como Pagado
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal para marcar como pagado */}
                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmar Pago</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {error && (
                            <Alert variant="danger" dismissible onClose={() => setError('')}>
                                {error}
                            </Alert>
                        )}

                        {selectedPayment && (
                            <>
                                <div className="mb-3">
                                    <strong>Conductor:</strong> {selectedPayment.driver_info.name} {selectedPayment.driver_info.lastname}<br />
                                    <strong>Período:</strong> Semana {selectedPayment.week_number}/{selectedPayment.year}<br />
                                    <strong>Monto a pagar:</strong> <span className="text-success fs-5">{formatCurrency(selectedPayment.net_payment)}</span>
                                </div>

                                {selectedPayment.bank_account && (
                                    <div className="mb-3 p-2 bg-light rounded">
                                        <strong>Datos Bancarios:</strong><br />
                                        <small>
                                            Titular: {selectedPayment.bank_account.name_account}<br />
                                            Cuenta: {selectedPayment.bank_account.number_account}<br />
                                            CUIL/CUIT: {selectedPayment.bank_account.cuil_cuit}
                                        </small>
                                    </div>
                                )}

                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Método de Pago</Form.Label>
                                        <Form.Select
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        >
                                            <option value="transferencia">Transferencia Bancaria</option>
                                            <option value="efectivo">Efectivo</option>
                                            <option value="cheque">Cheque</option>
                                            <option value="mercado_pago">Mercado Pago</option>
                                            <option value="otro">Otro</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Notas / Referencia del Pago</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Ej: Transferencia Banco Nación - Ref: 123456"
                                            value={paymentNotes}
                                            onChange={(e) => setPaymentNotes(e.target.value)}
                                        />
                                        <Form.Text className="text-muted">
                                            Opcional. Puedes agregar número de referencia, recibo, etc.
                                        </Form.Text>
                                    </Form.Group>
                                </Form>

                                <Alert variant="info">
                                    <small>
                                        Al confirmar, este pago se marcará como completado y se registrará en el historial.
                                    </small>
                                </Alert>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button
                            variant="success"
                            onClick={handleMarkAsPaid}
                            disabled={loading}
                        >
                            {loading ? 'Procesando...' : 'Confirmar Pago'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .pagos-container {
                        margin-left: 0 !important;
                        padding: 10px !important;
                    }

                    .pagos-container h1 {
                        font-size: 24px;
                        padding-top: 60px;
                    }

                    .pagos-container .table-responsive {
                        font-size: 14px;
                    }

                    .pagos-container .card {
                        margin-bottom: 15px;
                    }
                }

                @media (max-width: 480px) {
                    .pagos-container {
                        padding: 8px !important;
                    }

                    .pagos-container h1 {
                        font-size: 20px;
                    }

                    .pagos-container h2,
                    .pagos-container h3 {
                        font-size: 18px;
                    }

                    .pagos-container .table {
                        font-size: 12px;
                    }

                    .pagos-container .table th,
                    .pagos-container .table td {
                        padding: 6px 4px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Pagos;
