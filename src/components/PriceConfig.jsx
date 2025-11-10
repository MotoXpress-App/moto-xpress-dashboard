import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Alert, Modal, ListGroup, Spinner } from 'react-bootstrap';
import axios from 'axios';

const PriceConfig = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [priceData, setPriceData] = useState({
        id: null,
        cuota_solicitud: '',
        tarifa_minima: '',
        tarifa_base: '',
        tiempo_minuto: '',
        distancia_km: '',
        tarifa_tiempo_espera: '',
        rol_travel_1: '',
        rol_travel_2: '',
        rol_travel_3: '',
        rol_travel_4: '',
        rol_travel_5: '',
        rol_travel_6: ''
    });
    const [originalData, setOriginalData] = useState({});
    const [formData, setFormData] = useState({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [changesList, setChangesList] = useState([]);

    // Cargar datos de precios al montar el componente
    useEffect(() => {
        fetchPrices();
    }, []);

    const fetchPrices = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/travel/price`);

            if (response.data.success) {
                const data = response.data.data;
                setPriceData(data);
                setOriginalData(data);
                setFormData(data);
            }
        } catch (err) {
            console.error('Error al cargar precios:', err);
            setError('Error al cargar los precios. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value === '' ? '' : parseFloat(value)
        });
    };

    // Obtener etiquetas legibles para los campos
    const getFieldLabel = (fieldName) => {
        const labels = {
            cuota_solicitud: 'Cuota de Solicitud',
            tarifa_minima: 'Tarifa Mínima',
            tarifa_base: 'Tarifa Base',
            tiempo_minuto: 'Tiempo por Minuto',
            distancia_km: 'Distancia por KM',
            tarifa_tiempo_espera: 'Tarifa Tiempo de Espera',
            rol_travel_1: 'Rol Travel 1',
            rol_travel_2: 'Rol Travel 2',
            rol_travel_3: 'Rol Travel 3',
            rol_travel_4: 'Rol Travel 4',
            rol_travel_5: 'Rol Travel 5',
            rol_travel_6: 'Rol Travel 6'
        };
        return labels[fieldName] || fieldName;
    };

    // Detectar cambios entre original y formData
    const getChanges = () => {
        const changes = [];
        for (const key in formData) {
            if (key === 'id') continue; // Ignorar el ID

            const originalValue = originalData[key];
            const newValue = formData[key];

            // Comparar valores
            if (parseFloat(originalValue) !== parseFloat(newValue)) {
                changes.push({
                    field: getFieldLabel(key),
                    fieldName: key,
                    old: originalValue,
                    new: newValue
                });
            }
        }
        return changes;
    };

    // Confirmar antes de guardar
    const handleSubmit = (e) => {
        e.preventDefault();

        const changes = getChanges();

        if (changes.length === 0) {
            setError('No se detectaron cambios para guardar.');
            return;
        }

        setChangesList(changes);
        setShowConfirmModal(true);
    };

    // Guardar cambios confirmados
    const handleConfirmSave = async () => {
        try {
            setShowConfirmModal(false);
            setLoading(true);
            setError(null);
            setSuccess(null);

            // Crear objeto solo con los campos modificados
            const updatedFields = { id: formData.id };
            changesList.forEach(change => {
                updatedFields[change.fieldName] = formData[change.fieldName];
            });

            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/travel/price`,
                updatedFields
            );

            if (response.data.success) {
                setSuccess(response.data.message || 'Los precios se actualizaron correctamente');
                // Actualizar los datos originales con los nuevos
                setOriginalData(response.data.data);
                setPriceData(response.data.data);
                setFormData(response.data.data);

                // Limpiar mensaje de éxito después de 5 segundos
                setTimeout(() => setSuccess(null), 5000);
            }
        } catch (err) {
            console.error('Error al actualizar precios:', err);
            setError(
                err.response?.data?.message ||
                'Error al actualizar los precios. Por favor, intenta de nuevo.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Cancelar cambios
    const handleCancel = () => {
        setFormData(originalData);
        setError(null);
        setSuccess(null);
    };

    if (loading && !formData.id) {
        return (
            <Card>
                <Card.Body className="text-center py-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                    <p className="mt-3">Cargando precios...</p>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Configuración de Precios de Viaje</h5>
            </Card.Header>
            <Card.Body>
                {error && (
                    <Alert variant="danger" onClose={() => setError(null)} dismissible>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
                        {success}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    {/* Tarifas Básicas */}
                    <h6 className="text-primary border-bottom pb-2 mb-3">Tarifas Básicas</h6>
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Cuota de Solicitud ($)</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    name="cuota_solicitud"
                                    value={formData.cuota_solicitud}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    disabled={loading}
                                />
                                <Form.Text className="text-muted">
                                    Cargo por solicitar un viaje
                                </Form.Text>
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Tarifa Mínima ($)</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    name="tarifa_minima"
                                    value={formData.tarifa_minima}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    disabled={loading}
                                />
                                <Form.Text className="text-muted">
                                    Precio mínimo por viaje
                                </Form.Text>
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Tarifa Base ($)</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    name="tarifa_base"
                                    value={formData.tarifa_base}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    disabled={loading}
                                />
                                <Form.Text className="text-muted">
                                    Tarifa base del servicio
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Tarifas por Tiempo y Distancia */}
                    <h6 className="text-primary border-bottom pb-2 mb-3 mt-4">Tarifas por Tiempo y Distancia</h6>
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Tiempo por Minuto ($)</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    name="tiempo_minuto"
                                    value={formData.tiempo_minuto}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    disabled={loading}
                                />
                                <Form.Text className="text-muted">
                                    Costo por minuto de viaje
                                </Form.Text>
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Distancia por KM ($)</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    name="distancia_km"
                                    value={formData.distancia_km}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    disabled={loading}
                                />
                                <Form.Text className="text-muted">
                                    Costo por kilómetro recorrido
                                </Form.Text>
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Tiempo de Espera ($)</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    name="tarifa_tiempo_espera"
                                    value={formData.tarifa_tiempo_espera}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    disabled={loading}
                                />
                                <Form.Text className="text-muted">
                                    Tarifa por tiempo de espera
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Roles de Viaje */}
                    <h6 className="text-primary border-bottom pb-2 mb-3 mt-4">Multiplicadores de tipos de Viaje</h6>
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Viaje</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="1"
                                    name="rol_travel_1"
                                    value={formData.rol_travel_1}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Envios</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="1"
                                    name="rol_travel_2"
                                    value={formData.rol_travel_2}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Flete liviano</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="1"
                                    name="rol_travel_3"
                                    value={formData.rol_travel_3}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Flete pesado</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="1"
                                    name="rol_travel_4"
                                    value={formData.rol_travel_4}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Emergencia motovehicular</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="1"
                                    name="rol_travel_5"
                                    value={formData.rol_travel_5}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Gomeria movil</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="1"
                                    name="rol_travel_6"
                                    value={formData.rol_travel_6}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                                <Form.Text className="text-muted">
                                    Costo del parche
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Botones de acción */}
                    <div className="d-flex gap-2 justify-content-end">
                        <Button
                            variant="secondary"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancelar Cambios
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Guardando...
                                </>
                            ) : (
                                'Guardar Cambios'
                            )}
                        </Button>
                    </div>
                </Form>
            </Card.Body>

            {/* Modal de Confirmación */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Actualización de Precios</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-3">Se detectaron los siguientes cambios:</p>
                    <ListGroup>
                        {changesList.map((change, index) => (
                            <ListGroup.Item key={index}>
                                <strong>{change.field}:</strong>{' '}
                                <span className="text-muted">${change.old}</span>
                                {' → '}
                                <span className="text-success fw-bold">${change.new}</span>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <Alert variant="warning" className="mt-3 mb-0">
                        <small>
                            Estos cambios afectarán el cálculo de precios para todos los viajes futuros.
                        </small>
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleConfirmSave}>
                        Confirmar y Guardar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
};

export default PriceConfig;
