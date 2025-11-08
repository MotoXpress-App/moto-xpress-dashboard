import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { Row, Col, Card, Image, ListGroup, Table } from "react-bootstrap";
import '../../Viajes.css';

const TravelDetalle = () => {
  const { id } = useParams();
  const [travel, setTravel] = useState(null);

  const tiposViaje = [
    { id: 1, nombre: "Viajes" },
    { id: 2, nombre: "Envios" },
    { id: 3, nombre: "Fletes liviano" },
    { id: 4, nombre: "Fletes pesados" },
    { id: 5, nombre: "Emergencias motovehicular" },
    { id: 6, nombre: "Gomeria movil" },
  ];

  const tiposPayment = [
    { id: 1, nombre: 'Efectivo'},
    { id: 2, nombre: 'Tarjeta de crédito'},
    { id: 3, nombre: 'Tarjeta de débito'},
    { id: 4, nombre: 'Mercado Pago'},
    { id: 5, nombre: 'Transferencia bancaria'}
  ]

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

  if (!travel) return <p className="m-5">Cargando detalle del viaje...</p>;

  const { user_name, user_image, from_info, to_info, status, type_travel, id_type_payment, price, created_at, updated_at, travel_history, payment_history, driver, user_info } = travel;

  const tipoViajeNombre = tiposViaje.find((t) => t.id === Number(type_travel))?.nombre || "Desconocido";
  const tipoPagoNombre = tiposPayment.find((t) => t.id === Number(id_type_payment))?.nombre || "Desconocido";

  return (
    <div style={{ marginLeft: "250px", padding: "20px" }}>
      <Sidebar />
      <h2>Detalle del Viaje #{travel.id}</h2>

      {/* --- Información general --- */}
      <Card className="mt-3 shadow-sm">
        <Card.Header as="h5" className="title-travel">Información del viaje</Card.Header>
        <Card.Body>
          <Row>
            <Col md={4} className="text-center">
              <Image
                src={user_image}
                roundedCircle
                width="120"
                height="120"
                alt="User"
              />
              <p className="mt-2"><strong>{user_name}</strong></p>
              <p>{user_info[0].email}</p>
              <p>{user_info[0].phone}</p>
            </Col>
            <Col md={8}>
              <p><strong>Desde:</strong> {from_info}</p>
              <p><strong>Hasta:</strong> {to_info}</p>
              <p><strong>Estado:</strong> {status}</p>
              <p><strong>Tipo de viaje:</strong> {tipoViajeNombre}</p>
              <p><strong>Tipo de pago:</strong> {tipoPagoNombre}</p>
              <p><strong>Precio:</strong> {price}</p>
              <p><strong>Creado:</strong> {created_at}</p>
              <p><strong>Última actualización:</strong> {updated_at}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* --- Información del conductor --- */}
      {driver && driver.length > 0 && (
        <Card className="mt-4 shadow-sm">
          <Card.Header as="h5" className="title-travel">Conductor asignado</Card.Header>
          <Card.Body>
            <Row>
              <Col md={4} className="text-center">
                <Image
                  src={driver[0].image}
                  roundedCircle
                  width="120"
                  height="120"
                  alt="Driver"
                />
                <p className="mt-2"><strong>{driver[0].name} {driver[0].lastname}</strong></p>
                <p>{driver[0].email}</p>
                <p>{driver[0].phone}</p>
              </Col>
              <Col md={8}>
                {driver[0].driver && driver[0].driver.length > 0 && (
                  <>
                    <p><strong>Registro:</strong> {driver[0].driver[0].registration_number}</p>
                    <p><strong>Moto:</strong> {driver[0].driver[0].brand_motorcycle} {driver[0].driver[0].model_motorcycle}</p>
                    <p><strong>Año:</strong> {driver[0].driver[0].year_motorcycle}</p>
                    <p><strong>Cilindrada:</strong> {driver[0].driver[0].displacement}</p>
                    <p><strong>Cuenta bancaria:</strong> {driver[0].driver[0].bank_account ? "Sí" : "No"}</p>
                  </>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* --- Historial de estados --- */}
      {travel_history && travel_history.length > 0 && (
        <Card className="mt-4 shadow-sm">
          <Card.Header as="h5"  className="title-travel">Historial de estados</Card.Header>
          <Card.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Estado</th>
                  <th>Descripción</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {travel_history.map((item) => (
                  <tr key={item.id}>
                    <td>{item.status}</td>
                    <td>{item.description}</td>
                    <td>{new Date(item.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* --- Información de pago --- */}
      {payment_history && payment_history.length > 0 && (
        <Card className="mt-4 shadow-sm">
          <Card.Header as="h5"  className="title-travel">Información de pago</Card.Header>
          <Card.Body>
            <ListGroup>
              <ListGroup.Item><strong>ID Pago:</strong> {payment_history[0].id_payment}</ListGroup.Item>
              <ListGroup.Item><strong>Tipo de pago:</strong> {tipoPagoNombre}</ListGroup.Item>
              <ListGroup.Item><strong>Estado:</strong> {payment_history[0].status}</ListGroup.Item>
              <ListGroup.Item><strong>Método:</strong> {payment_history[0].data?.payment_method_id}</ListGroup.Item>
              <ListGroup.Item><strong>Importe:</strong> {payment_history[0].data?.transaction_amount} {payment_history[0].data?.currency_id}</ListGroup.Item>
              <ListGroup.Item><strong>Tarjeta:</strong> **** **** **** {payment_history[0].data?.card?.last_four_digits}</ListGroup.Item>
              <ListGroup.Item><strong>Titular:</strong> {payment_history[0].data?.card?.cardholder?.name}</ListGroup.Item>
              <ListGroup.Item><strong>Fecha de aprobación:</strong> {new Date(payment_history[0].data?.date_approved).toLocaleString()}</ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default TravelDetalle;
