import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { Row, Col, Card, Image, ListGroup, Table, Badge } from "react-bootstrap";
import '../../Viajes.css';

const TravelDetalle = () => {
  const { id } = useParams();
  const [travel, setTravel] = useState(null);

  const tiposViaje = [
    { id: 1, nombre: "Viajes", icon: "🚗", color: "primary" },
    { id: 2, nombre: "Envios", icon: "📦", color: "info" },
    { id: 3, nombre: "Fletes liviano", icon: "🚚", color: "warning" },
    { id: 4, nombre: "Fletes pesados", icon: "🚛", color: "danger" },
    { id: 5, nombre: "Emergencias motovehicular", icon: "🚨", color: "danger" },
    { id: 6, nombre: "Gomeria movil", icon: "🔧", color: "secondary" },
  ];

  const tiposPayment = [
    { id: 1, nombre: 'Efectivo', icon: '💵', color: 'success' },
    { id: 2, nombre: 'Tarjeta de crédito', icon: '💳', color: 'primary' },
    { id: 3, nombre: 'Tarjeta de débito', icon: '💳', color: 'info' },
    { id: 4, nombre: 'Mercado Pago', icon: '💰', color: 'warning' },
    { id: 5, nombre: 'Transferencia bancaria', icon: '🏦', color: 'secondary' }
  ];

  useEffect(() => {
    const fetchTravel = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/travel/find-by-id/${id}`);
        setTravel(response.data.data);
      } catch (error) {
        console.error("Error al obtener detalle del viaje:", error);
      }
    };
    fetchTravel();
  }, [id]);

  // Funciones de formateo
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price || 0);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Obtener badge de estado con color
  const getStatusBadge = (status) => {
    if (!status) return <Badge bg="secondary" className="fs-5 px-3 py-2">Sin estado</Badge>;

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
          className="fs-5 px-3 py-2"
        >
          {statusInfo.icon} {statusInfo.label}
        </Badge>
      );
    }

    // Fallback para estados no mapeados
    return <Badge bg="secondary" className="fs-5 px-3 py-2">{status}</Badge>;
  };

  if (!travel) return <p className="m-5">Cargando detalle del viaje...</p>;

  const { user_name, user_image, from_info, to_info, status, type_travel, id_type_payment, price, created_at, updated_at, travel_history, payment_history, driver, user_info } = travel;

  const tipoViaje = tiposViaje.find((t) => t.id === Number(type_travel)) || { nombre: "Desconocido", icon: "❓", color: "secondary" };
  const tipoPago = tiposPayment.find((t) => t.id === Number(id_type_payment)) || { nombre: "Desconocido", icon: "❓", color: "secondary" };

  return (
    <div className="travel-detail-container" style={{ marginLeft: "250px", padding: "20px" }}>
      <Sidebar />

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h2 className="mb-0">Detalle del Viaje <Badge bg="dark" className="fs-4">#{travel.id}</Badge></h2>
        {getStatusBadge(status)}
      </div>

      {/* --- Información general --- */}
      <Card className="mt-3 shadow-sm border-0">
        <Card.Header className="title-travel" style={{ backgroundColor: '#1f71dd', color: 'white' }}>
          <h5 className="mb-0">📋 Información del viaje</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4} className="text-center border-md-end mb-4 mb-md-0">
              <Image
                src={user_image}
                roundedCircle
                width="120"
                height="120"
                alt="User"
                className="mb-3"
                style={{ border: '4px solid #1f71dd' }}
              />
              <h5 className="text-primary">{user_name}</h5>
              <p className="mb-1 text-muted"><small>📧 {user_info[0].email}</small></p>
              <p className="text-muted"><small>📱 {user_info[0].phone}</small></p>
            </Col>
            <Col md={8}>
              <Row className="mb-3">
                <Col md={12} className="mb-3">
                  <div className="p-3 bg-light rounded">
                    <div className="mb-2">
                      <strong className="text-success">📍 Desde:</strong>
                      <p className="mb-0 ms-3">{from_info}</p>
                    </div>
                    <div>
                      <strong className="text-danger">📍 Hasta:</strong>
                      <p className="mb-0 ms-3">{to_info}</p>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Tipo de viaje:</strong><br />
                      <Badge bg={tipoViaje.color} className="mt-2 fs-6 px-3 py-2">
                        {tipoViaje.icon} {tipoViaje.nombre}
                      </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Tipo de pago:</strong><br />
                      <Badge bg={tipoPago.color} className="mt-2 fs-6 px-3 py-2">
                        {tipoPago.icon} {tipoPago.nombre}
                      </Badge>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Precio:</strong><br />
                      <h4 className="text-success mb-0 mt-2">{formatPrice(price)}</h4>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Creado:</strong><br />
                      <small className="text-muted">🕒 {formatDateTime(created_at)}</small>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Actualizado:</strong><br />
                      <small className="text-muted">🕒 {formatDateTime(updated_at)}</small>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* --- Información del conductor --- */}
      {driver && driver.length > 0 && (
        <Card className="mt-4 shadow-sm border-0">
          <Card.Header style={{ backgroundColor: '#28a745', color: 'white' }}>
            <h5 className="mb-0">🏍️ Conductor asignado</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4} className="text-center border-md-end mb-4 mb-md-0">
                <Image
                  src={driver[0].image}
                  roundedCircle
                  width="120"
                  height="120"
                  alt="Driver"
                  className="mb-3"
                  style={{ border: '4px solid #28a745' }}
                />
                <h5 className="text-success">{driver[0].name} {driver[0].lastname}</h5>
                <p className="mb-1 text-muted"><small>📧 {driver[0].email}</small></p>
                <p className="text-muted"><small>📱 {driver[0].phone}</small></p>
              </Col>
              <Col md={8}>
                {driver[0].driver && driver[0].driver.length > 0 && (
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong className="text-primary">🆔 Registro:</strong>
                      <Badge bg="secondary" className="ms-2">{driver[0].driver[0].registration_number}</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong className="text-primary">🏍️ Moto:</strong>
                      <span className="ms-2">{driver[0].driver[0].brand_motorcycle} {driver[0].driver[0].model_motorcycle}</span>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong className="text-primary">📅 Año:</strong>
                      <Badge bg="info" className="ms-2">{driver[0].driver[0].year_motorcycle}</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong className="text-primary">⚙️ Cilindrada:</strong>
                      <span className="ms-2">{driver[0].driver[0].displacement}</span>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong className="text-primary">🏦 Cuenta bancaria:</strong>
                      {driver[0].driver[0].bank_account ? (
                        <Badge bg="success" className="ms-2">✓ Registrada</Badge>
                      ) : (
                        <Badge bg="warning" text="dark" className="ms-2">⚠ No registrada</Badge>
                      )}
                    </ListGroup.Item>
                  </ListGroup>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* --- Historial de estados --- */}
      {travel_history && travel_history.length > 0 && (
        <Card className="mt-4 shadow-sm border-0">
          <Card.Header style={{ backgroundColor: '#6c757d', color: 'white' }}>
            <h5 className="mb-0">📜 Historial de estados</h5>
          </Card.Header>
          <Card.Body>
            <div className="timeline">
              {travel_history.map((item, index) => (
                <div key={item.id} className="timeline-item mb-3">
                  <Row>
                    <Col xs={12} md={3} className="text-start text-md-end mb-2 mb-md-0">
                      <small className="text-muted">
                        <strong>🕒 {formatDateTime(item.timestamp)}</strong>
                      </small>
                    </Col>
                    <Col xs={1} md={1} className="text-center d-none d-md-block">
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: index === 0 ? '#28a745' : '#6c757d',
                        margin: '0 auto',
                        position: 'relative'
                      }}>
                        {index !== travel_history.length - 1 && (
                          <div style={{
                            width: '2px',
                            height: '60px',
                            backgroundColor: '#dee2e6',
                            position: 'absolute',
                            left: '5px',
                            top: '12px'
                          }}></div>
                        )}
                      </div>
                    </Col>
                    <Col xs={12} md={8}>
                      <div className="p-3 bg-light rounded">
                        <div className="mb-2">
                          {getStatusBadge(item.status)}
                        </div>
                        <p className="mb-0 text-muted"><small>{item.description || 'Sin descripción'}</small></p>
                      </div>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* --- Información de pago --- */}
      {payment_history && payment_history.length > 0 && (
        <Card className="mt-4 shadow-sm border-0">
          <Card.Header style={{ backgroundColor: '#ffc107', color: '#000' }}>
            <h5 className="mb-0">💳 Información de pago</h5>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <strong className="text-primary" style={{ minWidth: '200px' }}>🆔 ID Pago:</strong>
                <Badge bg="dark">{payment_history[0].id_payment}</Badge>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <strong className="text-primary" style={{ minWidth: '200px' }}>💰 Tipo de pago:</strong>
                <Badge bg={tipoPago.color}>
                  {tipoPago.icon} {tipoPago.nombre}
                </Badge>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <strong className="text-primary" style={{ minWidth: '200px' }}>📊 Estado:</strong>
                {payment_history[0].status === 'approved' ? (
                  <Badge bg="success" className="fs-6">✓ Aprobado</Badge>
                ) : payment_history[0].status === 'pending' ? (
                  <Badge bg="warning" text="dark" className="fs-6">⏳ Pendiente</Badge>
                ) : (
                  <Badge bg="danger" className="fs-6">✗ {payment_history[0].status}</Badge>
                )}
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <strong className="text-primary" style={{ minWidth: '200px' }}>💵 Importe:</strong>
                <span className="text-success fs-4 fw-bold">
                  {payment_history[0].data?.transaction_amount
                    ? formatPrice(payment_history[0].data.transaction_amount)
                    : '-'}
                  <small className="text-muted ms-2">{payment_history[0].data?.currency_id || ''}</small>
                </span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <strong className="text-primary" style={{ minWidth: '200px' }}>🔧 Método:</strong>
                <span>{payment_history[0].data?.payment_method_id || '-'}</span>
              </ListGroup.Item>
              {payment_history[0].data?.card?.last_four_digits && (
                <>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    <strong className="text-primary" style={{ minWidth: '200px' }}>💳 Tarjeta:</strong>
                    <Badge bg="secondary">
                      **** **** **** {payment_history[0].data.card.last_four_digits}
                    </Badge>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    <strong className="text-primary" style={{ minWidth: '200px' }}>👤 Titular:</strong>
                    <span>{payment_history[0].data.card.cardholder?.name || '-'}</span>
                  </ListGroup.Item>
                </>
              )}
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <strong className="text-primary" style={{ minWidth: '200px' }}>📅 Fecha de aprobación:</strong>
                <small className="text-muted">
                  {payment_history[0].data?.date_approved
                    ? formatDateTime(payment_history[0].data.date_approved)
                    : '-'}
                </small>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      )}

      <style>{`
        @media (max-width: 768px) {
          .travel-detail-container {
            margin-left: 0 !important;
            padding: 10px !important;
          }

          .travel-detail-container h2 {
            font-size: 20px;
            padding-top: 60px;
          }

          .travel-detail-container .badge {
            font-size: 12px !important;
            padding: 6px 10px !important;
          }

          .border-md-end {
            border-right: none !important;
            border-bottom: 1px solid #dee2e6;
            padding-bottom: 15px;
          }
        }

        @media (max-width: 480px) {
          .travel-detail-container {
            padding: 8px !important;
          }

          .travel-detail-container h2 {
            font-size: 18px;
          }

          .travel-detail-container h5 {
            font-size: 16px;
          }

          .travel-detail-container .card-header h5 {
            font-size: 14px;
          }

          .travel-detail-container .fs-4 {
            font-size: 1.1rem !important;
          }

          .travel-detail-container .fs-5 {
            font-size: 0.9rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TravelDetalle;
