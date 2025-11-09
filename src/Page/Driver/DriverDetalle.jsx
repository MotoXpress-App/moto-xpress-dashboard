import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { Form, Row, Col, Image, Button, Modal, ListGroup } from "react-bootstrap";
import TableTravel from "../Travel/TableTravel";
import "../../Viajes.css";

const DriverDetalle = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [travel, setTravel] = useState([]);
  const [typeTravel, setTypeTravel] = useState(null); // Se inicializa según el rol
  const [availableTypes, setAvailableTypes] = useState([]); // Tipos disponibles según el rol

  // Estados de Wallet
  const [walletData, setWalletData] = useState(null);
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [weeklySummaries, setWeeklySummaries] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);

  // Estados para validación y estado del conductor
  const [driverStatus, setDriverStatus] = useState(null);
  const [imageValidations, setImageValidations] = useState({
    image_license_lead: false,
    image_license_rear: false,
    image_sure: false,
    image_motorcycle_register: false
  });

  // Estados base
  const [formData, setFormData] = useState({ name: "", lastname: "", phone: "" });
  const [driverData, setDriverData] = useState({
    registration_number: "",
    brand_motorcycle: "",
    model_motorcycle: "",
    year_motorcycle: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Modal para ver imágenes
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Modal de confirmación
  const [confirmModal, setConfirmModal] = useState(false);
  const [changesList, setChangesList] = useState([]);
  const [saveType, setSaveType] = useState(null); // 'user', 'driver', 'status', 'validations'

  // Modal de confirmación para estado
  const [confirmStatusModal, setConfirmStatusModal] = useState(false);

  // Modal de confirmación para validaciones
  const [confirmValidationsModal, setConfirmValidationsModal] = useState(false);
  const [validationChangesList, setValidationChangesList] = useState([]);

  const handleOpen = (img) => {
    setSelectedImage(img);
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  // Función para determinar tipos de viajes según el rol
  const getTravelTypesByRole = (roles) => {
    if (!roles || roles.length === 0) return [];

    // Buscar el rol del chofer (rol 2, 3, 5 o 6)
    const driverRole = roles.find(r => [2, 3, 5, 6].includes(r.id));

    if (!driverRole) return [];

    const rol = driverRole.id;
    let types = [];

    if (rol === 2) {
      types = [1, 2];
    } else if (rol === 3) {
      types = [4];
    } else if (rol === 5) {
      types = [3, 5];
    } else if (rol === 6) {
      types = [1, 2, 6];
    }

    return types;
  };

  // Obtener usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/driver/find-by-id/${id}`
        );
        const data = response.data;
        setUser(data);
        setFormData({
          name: data.name || "",
          lastname: data.lastname || "",
          phone: data.phone || "",
        });
        if (data.driver) {
          setDriverData({
            registration_number: data.driver.registration_number || "",
            brand_motorcycle: data.driver.brand_motorcycle || "",
            model_motorcycle: data.driver.model_motorcycle || "",
            year_motorcycle: data.driver.year_motorcycle || "",
          });

          // Cargar estado del conductor
          // El id_status está dentro de driver_validate
          const statusId = data.driver_validate?.id_status || data.driver?.id_driver_status || data.driver?.id_status || 2;
          const statusNumber = parseInt(statusId);
          setDriverStatus(statusNumber);

          // Debug: Ver qué campos retorna el backend
          console.log("Driver data from backend:", data.driver);
          console.log("Driver validate from backend:", data.driver_validate);
          console.log("Estado cargado (raw):", statusId, "-> (número):", statusNumber);

          // Cargar validaciones de imágenes
          // driver_validate es un objeto separado con los nombres de imágenes
          if (data.driver_validate) {
            const validations = {
              image_license_lead: Boolean(data.driver_validate.image_license_lead),
              image_license_rear: Boolean(data.driver_validate.image_license_rear),
              image_sure: Boolean(data.driver_validate.image_sure),
              image_motorcycle_register: Boolean(data.driver_validate.image_motorcycle_register)
            };

            console.log("Validaciones cargadas:", validations);
            setImageValidations(validations);
          }
        }

        // Determinar tipos de viajes disponibles según el rol
        const types = getTravelTypesByRole(data.roles);
        setAvailableTypes(types);

        // Establecer el primer tipo como seleccionado por defecto
        if (types.length > 0) {
          setTypeTravel(types[0]);
        }
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      }
    };
    fetchUser();
  }, [id]);

  // Obtener historial de viajes cuando cambie el tipo
  useEffect(() => {
    if (!typeTravel || !id) return;

    const fetchTravel = async () => {

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/travel/all-by-id-driver/${id}?type_travel=${typeTravel}`
        );
        setTravel(response.data.data || []);
      } catch (error) {
        console.error("Error al cargar viajes:", error);
      }
    };

    fetchTravel();
  }, [typeTravel, id]);

  // Obtener datos de la billetera del conductor
  useEffect(() => {
    if (!id) return;

    const fetchWalletData = async () => {
      try {
        // Resumen de wallet
        const summaryResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/wallet/${id}/summary`
        );
        setWalletData(summaryResponse.data.data || null);

        // Transacciones de la semana actual
        const transactionsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/wallet/${id}/transactions/week`
        );
        setWalletTransactions(transactionsResponse.data.data || []);

        // Resúmenes semanales históricos
        const weeklySummariesResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/wallet/${id}/weekly-summaries?limit=5`
        );
        setWeeklySummaries(weeklySummariesResponse.data.data || []);

        // Pagos pendientes del conductor
        const pendingResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/wallet/${id}/payments/pending`
        );
        setPendingPayments(pendingResponse.data.data || []);

      } catch (error) {
        console.error("Error al cargar datos de wallet:", error);
      }
    };

    fetchWalletData();
  }, [id]);

  if (!user) return <p>Cargando usuario...</p>;

  // Manejadores de cambios
  const handleUserChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleDriverChange = (e) => {
    setDriverData({ ...driverData, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Función para obtener diferencias
  const getChanges = (original, updated) => {
    const changes = [];
    for (const key in updated) {
      if (updated[key] !== (original[key] || "")) {
        changes.push({ field: key, old: original[key] || "(vacío)", new: updated[key] });
      }
    }
    return changes;
  };

  // Mostrar modal de confirmación antes de guardar
  const confirmBeforeSave = (type) => {
    let changes = [];
    if (type === "user") {
      const base = { name: user.name, lastname: user.lastname, phone: user.phone };
      changes = getChanges(base, formData);
      if (imageFile) {
        changes.push({ field: "Imagen", old: user.image ? "Existe" : "(sin imagen)", new: imageFile.name });
      }
    } else {
      const base = {
        registration_number: user.driver.registration_number,
        brand_motorcycle: user.driver.brand_motorcycle,
        model_motorcycle: user.driver.model_motorcycle,
        year_motorcycle: user.driver.year_motorcycle,
      };
      changes = getChanges(base, driverData);
    }

    if (changes.length === 0) {
      alert("No se detectaron cambios para actualizar.");
      return;
    }

    setChangesList(changes);
    setSaveType(type);
    setConfirmModal(true);
  };

  // Guardar cambios luego de confirmar
  const handleConfirmSave = async () => {
    setConfirmModal(false);
    if (saveType === "user") {
      await handleSaveUser();
    } else if (saveType === "driver") {
      await handleSaveDriver();
    }
  };

  // --- Guardar usuario ---
  const handleSaveUser = async () => {
    try {
      const data = new FormData();
      data.append(
        "user",
        JSON.stringify({
          id: user.id,
          name: formData.name,
          lastname: formData.lastname,
          phone: formData.phone,
        })
      );
      if (imageFile) data.append("image", imageFile);

      await axios.put(`${process.env.REACT_APP_API_URL}/user/updateImage`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Usuario actualizado correctamente ✅");
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      alert("Error al guardar los cambios del usuario ❌");
    }
  };

  // --- Guardar chofer ---
  const handleSaveDriver = async () => {
    try {
      const data = new FormData();
      data.append(
        "driver",
        JSON.stringify({
          id_user: user.id,
          registration_number: driverData.registration_number,
          brand_motorcycle: driverData.brand_motorcycle,
          model_motorcycle: driverData.model_motorcycle,
          year_motorcycle: parseInt(driverData.year_motorcycle),
        })
      );

      await axios.put(`${process.env.REACT_APP_API_URL}/driver/update-driver`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Información del conductor actualizada correctamente ✅");
    } catch (error) {
      console.error("Error al actualizar chofer:", error);
      alert("Error al guardar los cambios del conductor ❌");
    }
  };

  // --- Confirmar antes de actualizar estado ---
  const confirmBeforeUpdateStatus = () => {
    const currentStatus = parseInt(user.driver_validate?.id_status || user.driver?.id_driver_status || user.driver?.id_status);

    if (driverStatus === currentStatus) {
      alert("No se detectaron cambios en el estado.");
      return;
    }

    setConfirmStatusModal(true);
  };

  // --- Actualizar estado del conductor ---
  const handleUpdateStatus = async () => {
    setConfirmStatusModal(false);

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/driver/update-status`,
        {
          id_user: user.id,
          id_driver_status: driverStatus
        }
      );
      alert("Estado del conductor actualizado correctamente ✅");

      // Recargar datos del usuario
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/driver/find-by-id/${id}`
      );
      console.log("Datos recargados después de actualizar estado:", response.data);
      setUser(response.data);

      // Actualizar validaciones y estado si existen
      if (response.data.driver_validate) {
        const reloadedValidations = {
          image_license_lead: Boolean(response.data.driver_validate.image_license_lead),
          image_license_rear: Boolean(response.data.driver_validate.image_license_rear),
          image_sure: Boolean(response.data.driver_validate.image_sure),
          image_motorcycle_register: Boolean(response.data.driver_validate.image_motorcycle_register)
        };
        setImageValidations(reloadedValidations);

        // Actualizar también el estado del conductor
        const newStatusId = response.data.driver_validate.id_status;
        if (newStatusId) {
          setDriverStatus(parseInt(newStatusId));
        }
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("Error al actualizar el estado del conductor ❌");
    }
  };

  // --- Confirmar antes de actualizar validaciones ---
  const confirmBeforeUpdateValidations = () => {
    const changes = [];
    const currentValidations = user.driver_validate || {};

    // Comparar cada validación
    const validationLabels = {
      image_license_lead: 'Licencia Frontal',
      image_license_rear: 'Licencia Trasera',
      image_sure: 'Seguro',
      image_motorcycle_register: 'Registro de Moto'
    };

    Object.keys(imageValidations).forEach(key => {
      const currentValue = Boolean(currentValidations[key]);
      const newValue = imageValidations[key];

      if (currentValue !== newValue) {
        changes.push({
          field: validationLabels[key],
          old: currentValue ? 'Aprobado' : 'Pendiente',
          new: newValue ? 'Aprobado' : 'Pendiente'
        });
      }
    });

    if (changes.length === 0) {
      alert("No se detectaron cambios en las validaciones.");
      return;
    }

    setValidationChangesList(changes);
    setConfirmValidationsModal(true);
  };

  // --- Actualizar validaciones de imágenes ---
  const handleUpdateValidations = async () => {
    setConfirmValidationsModal(false);

    try {
      const payload = {
        id_user: user.id,
        image_license_lead: imageValidations.image_license_lead,
        image_license_rear: imageValidations.image_license_rear,
        image_sure: imageValidations.image_sure,
        image_motorcycle_register: imageValidations.image_motorcycle_register
      };

      console.log("Enviando validaciones al backend:", payload);

      await axios.put(
        `${process.env.REACT_APP_API_URL}/driver/update-validate`,
        payload
      );
      alert("Validación de documentos actualizada correctamente ✅");

      // Recargar datos del usuario
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/driver/find-by-id/${id}`
      );
      console.log("Datos recargados después de actualizar validaciones:", response.data.driver_validate);
      setUser(response.data);

      // Actualizar también el estado de validaciones y estado del conductor
      if (response.data.driver_validate) {
        const reloadedValidations = {
          image_license_lead: Boolean(response.data.driver_validate.image_license_lead),
          image_license_rear: Boolean(response.data.driver_validate.image_license_rear),
          image_sure: Boolean(response.data.driver_validate.image_sure),
          image_motorcycle_register: Boolean(response.data.driver_validate.image_motorcycle_register)
        };
        console.log("Validaciones recargadas:", reloadedValidations);
        setImageValidations(reloadedValidations);

        // Actualizar también el estado del conductor
        const newStatusId = response.data.driver_validate.id_status;
        if (newStatusId) {
          setDriverStatus(parseInt(newStatusId));
        }
      }
    } catch (error) {
      console.error("Error al actualizar validaciones:", error);
      alert("Error al actualizar la validación de documentos ❌");
    }
  };

  // --- Manejador de cambio de validación de imagen ---
  const handleImageValidationChange = (imageName, value) => {
    setImageValidations({
      ...imageValidations,
      [imageName]: value
    });
  };

  const years = Array.from({ length: 26 }, (_, i) => 2000 + i);

  // Funciones de formateo
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionTypeLabel = (type) => {
    const types = {
      'travel_earning': 'Ganancia de viaje',
      'weekly_payment': 'Pago semanal',
      'commission': 'Comisión',
      'adjustment': 'Ajuste'
    };
    return types[type] || type;
  };

  const getPaymentMethodLabel = (method) => {
    const methods = {
      'efectivo': 'Efectivo',
      'tarjeta': 'Tarjeta',
      'transferencia': 'Transferencia',
      'mercado_pago': 'Mercado Pago',
      'cheque': 'Cheque',
      'otro': 'Otro'
    };
    return methods[method] || method;
  };

  const getStatusLabel = (statusId) => {
    // Convertir a número por si viene como string
    const id = parseInt(statusId);

    const statuses = {
      1: 'Activo',
      2: 'Pendiente',
      3: 'Desactivado',
      4: 'Baneado',
      5: 'Deudor'
    };
    return statuses[id] || 'Desconocido';
  };

  const getStatusBadge = (statusId) => {
    // Convertir a número por si viene como string
    const id = parseInt(statusId);

    const badges = {
      1: 'success',   // Activo
      2: 'warning',   // Pendiente
      3: 'secondary', // Desactivado
      4: 'danger',    // Baneado
      5: 'danger'     // Deudor
    };
    return badges[id] || 'secondary';
  };

  // Helper para obtener el estado de validación de una imagen
  const getImageValidationStatus = (imageName) => {
    if (!user?.driver_validate) return false;

    // driver_validate es un objeto separado que contiene los nombres de imágenes directamente
    return Boolean(user.driver_validate[imageName]);
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

  // Filtrar solo los tipos disponibles para este chofer
  const tiposViajeDisponibles = tiposViaje.filter(tipo => availableTypes.includes(tipo.id));

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
    <div className="driver-detail-container" style={{ marginLeft: "250px", padding: "20px" }}>
      <Sidebar />
      <h1>Detalle de Usuario</h1>

      {/* --- Información del usuario --- */}
      <h3>Información Personal</h3>
      <Form>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              {(previewImage || user.image) && (
                <Image
                  src={previewImage || user.image}
                  thumbnail
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                  onClick={() => handleOpen(previewImage || user.image)}
                />
              )}
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleUserChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                name="lastname"
                value={formData.lastname}
                onChange={handleUserChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control value={user.email} disabled />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                name="phone"
                value={formData.phone}
                onChange={handleUserChange}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <Button variant="primary" className="mt-3" onClick={() => confirmBeforeSave("user")}>
        Guardar Cambios Usuario
      </Button>

      {/* --- Roles --- */}
      <h3 className="mt-4">Roles</h3>
      <ul>
        {user.roles?.map((r) => (
          <li key={r.id}>{r.name}</li>
        ))}
      </ul>

      {/* --- Estado del Conductor --- */}
      {user.driver && (
        <>
          <h3 className="mt-4">Estado del Conductor</h3>
          <Form>
            <Row className="align-items-center">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Estado Actual</Form.Label>
                  <div>
                    <span className={`badge bg-${getStatusBadge(user.driver_validate?.id_status)} fs-5 px-3 py-2`}>
                      {getStatusLabel(user.driver_validate?.id_status)}
                    </span>
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Cambiar Estado</Form.Label>
                  <Form.Select
                    value={driverStatus}
                    onChange={(e) => setDriverStatus(parseInt(e.target.value))}
                  >
                    <option value={1}>Activo</option>
                    <option value={2}>Pendiente</option>
                    <option value={3}>Desactivado</option>
                    <option value={4}>Baneado</option>
                    <option value={5}>Deudor</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Solo los conductores con estado "Activo" pueden iniciar sesión.
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6} className="d-flex align-items-end">
                <Button
                  variant="primary"
                  onClick={confirmBeforeUpdateStatus}
                  disabled={driverStatus === parseInt(user.driver_validate?.id_status)}
                >
                  Actualizar Estado
                </Button>
              </Col>
            </Row>
          </Form>
        </>
      )}

      {/* --- Conductor --- */}
      {user.driver && (
        <>
          <h3 className="mt-4">Información de Conductor</h3>
          <Form>
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Registro</Form.Label>
                  <Form.Control
                    name="registration_number"
                    value={driverData.registration_number}
                    onChange={handleDriverChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Marca Moto</Form.Label>
                  <Form.Control
                    name="brand_motorcycle"
                    value={driverData.brand_motorcycle}
                    onChange={handleDriverChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Modelo Moto</Form.Label>
                  <Form.Control
                    name="model_motorcycle"
                    value={driverData.model_motorcycle}
                    onChange={handleDriverChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Año</Form.Label>
                  <Form.Select
                    name="year_motorcycle"
                    value={driverData.year_motorcycle}
                    onChange={handleDriverChange}
                  >
                    <option value="">Seleccionar año</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Imágenes del Driver con Modal y Validación */}
            <h4 className="mt-4">Documentos del Conductor</h4>
            <Row className="mt-4">
              {/* Licencia Frontal */}
              {user.driver.image_license_lead && (
                <Col md={3} className="mb-3">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <strong>Licencia Frontal</strong>
                      {getImageValidationStatus('image_license_lead') ? (
                        <span className="badge bg-success">Aprobado</span>
                      ) : (
                        <span className="badge bg-warning">Pendiente</span>
                      )}
                    </div>
                    <div
                      className="card-body"
                      style={{ cursor: "pointer", padding: "10px" }}
                      onClick={() => handleOpen(user.driver.image_license_lead)}
                    >
                      <Image
                        src={user.driver.image_license_lead}
                        thumbnail
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div className="card-footer">
                      <Form.Check
                        type="checkbox"
                        label="Documento Aprobado"
                        checked={imageValidations.image_license_lead}
                        onChange={(e) =>
                          handleImageValidationChange("image_license_lead", e.target.checked)
                        }
                      />
                    </div>
                  </div>
                </Col>
              )}

              {/* Licencia Trasera */}
              {user.driver.image_license_rear && (
                <Col md={3} className="mb-3">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <strong>Licencia Trasera</strong>
                      {getImageValidationStatus('image_license_rear') ? (
                        <span className="badge bg-success">Aprobado</span>
                      ) : (
                        <span className="badge bg-warning">Pendiente</span>
                      )}
                    </div>
                    <div
                      className="card-body"
                      style={{ cursor: "pointer", padding: "10px" }}
                      onClick={() => handleOpen(user.driver.image_license_rear)}
                    >
                      <Image
                        src={user.driver.image_license_rear}
                        thumbnail
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div className="card-footer">
                      <Form.Check
                        type="checkbox"
                        label="Documento Aprobado"
                        checked={imageValidations.image_license_rear}
                        onChange={(e) =>
                          handleImageValidationChange("image_license_rear", e.target.checked)
                        }
                      />
                    </div>
                  </div>
                </Col>
              )}

              {/* Seguro */}
              {user.driver.image_sure && (
                <Col md={3} className="mb-3">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <strong>Seguro</strong>
                      {getImageValidationStatus('image_sure') ? (
                        <span className="badge bg-success">Aprobado</span>
                      ) : (
                        <span className="badge bg-warning">Pendiente</span>
                      )}
                    </div>
                    <div
                      className="card-body"
                      style={{ cursor: "pointer", padding: "10px" }}
                      onClick={() => handleOpen(user.driver.image_sure)}
                    >
                      <Image
                        src={user.driver.image_sure}
                        thumbnail
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div className="card-footer">
                      <Form.Check
                        type="checkbox"
                        label="Documento Aprobado"
                        checked={imageValidations.image_sure}
                        onChange={(e) =>
                          handleImageValidationChange("image_sure", e.target.checked)
                        }
                      />
                    </div>
                  </div>
                </Col>
              )}

              {/* Registro Moto */}
              {user.driver.image_motorcycle_register && (
                <Col md={3} className="mb-3">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <strong>Registro Moto</strong>
                      {getImageValidationStatus('image_motorcycle_register') ? (
                        <span className="badge bg-success">Aprobado</span>
                      ) : (
                        <span className="badge bg-warning">Pendiente</span>
                      )}
                    </div>
                    <div
                      className="card-body"
                      style={{ cursor: "pointer", padding: "10px" }}
                      onClick={() => handleOpen(user.driver.image_motorcycle_register)}
                    >
                      <Image
                        src={user.driver.image_motorcycle_register}
                        thumbnail
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div className="card-footer">
                      <Form.Check
                        type="checkbox"
                        label="Documento Aprobado"
                        checked={imageValidations.image_motorcycle_register}
                        onChange={(e) =>
                          handleImageValidationChange("image_motorcycle_register", e.target.checked)
                        }
                      />
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </Form>

          <div className="mt-3">
            <Button
              variant="success"
              className="me-2"
              onClick={() => confirmBeforeSave("driver")}
            >
              Guardar Cambios Chofer
            </Button>
            <Button
              variant="primary"
              onClick={confirmBeforeUpdateValidations}
            >
              Actualizar Validación de Documentos
            </Button>
          </div>
        </>
      )}

      {/* --- Historial de viajes --- */}
      {user.driver && availableTypes.length > 0 && (
        <>
          <h3 style={{ marginTop:'30px' }}>Historial de viajes</h3>

          {/* 🔹 Navbar de tipos de viaje - Solo muestra los tipos permitidos para este chofer */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            {tiposViajeDisponibles.map((tipo) => (
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
          {travel.length > 0 ? (
            <TableTravel data={travel} headers={headers}/>
          ) : (
            <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '20px' }}>
              No hay viajes de este tipo para este chofer.
            </p>
          )}
        </>
      )}

      {/* --- Sección de Wallet / Billetera --- */}
      {user.driver && walletData && (
        <>
          <h3 style={{ marginTop: '30px' }}>Billetera del Conductor</h3>

          {/* Cards con resumen de billetera */}
          <Row className="mb-4">
            <Col md={3}>
              <div className="card text-center">
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted">Ganancias esta semana</h6>
                  <h4 className="text-primary">{formatCurrency(walletData.current_week_earnings)}</h4>
                  <small className="text-muted">{walletData.trips_this_week || 0} viajes</small>
                </div>
              </div>
            </Col>
            <Col md={3}>
              <div className="card text-center">
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted">Ganancias totales</h6>
                  <h4 className="text-success">{formatCurrency(walletData.total_earnings)}</h4>
                </div>
              </div>
            </Col>
            <Col md={3}>
              <div className="card text-center">
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted">Saldo disponible</h6>
                  <h4 className="text-info">{formatCurrency(walletData.available_balance)}</h4>
                </div>
              </div>
            </Col>
            <Col md={3}>
              <div className="card text-center">
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted">Comisión pendiente</h6>
                  <h4 className="text-warning">{formatCurrency(walletData.pending_commission)}</h4>
                </div>
              </div>
            </Col>
          </Row>

          {/* Pagos pendientes */}
          {pendingPayments.length > 0 && (
            <div className="alert alert-warning mb-4">
              <h5>⚠️ Pagos Pendientes</h5>
              <p>Este conductor tiene <strong>{pendingPayments.length}</strong> pago(s) pendiente(s):</p>
              <ul>
                {pendingPayments.map((payment) => (
                  <li key={payment.id}>
                    Semana {payment.week_number}/{payment.year} - {formatCurrency(payment.net_payment)}
                    ({formatDate(payment.week_start_date)} a {formatDate(payment.week_end_date)})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Transacciones de la semana actual */}
          <h4 className="mt-4">Transacciones de esta semana</h4>
          {walletTransactions.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-sm table-striped">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Método</th>
                    <th className="text-end">Monto</th>
                    <th className="text-end">Comisión</th>
                  </tr>
                </thead>
                <tbody>
                  {walletTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td><small>{formatDateTime(transaction.created_at)}</small></td>
                      <td><small>{getTransactionTypeLabel(transaction.transaction_type)}</small></td>
                      <td><small>{transaction.description}</small></td>
                      <td><small>{getPaymentMethodLabel(transaction.payment_method)}</small></td>
                      <td className="text-end">
                        <strong className={transaction.amount >= 0 ? 'text-success' : 'text-danger'}>
                          {formatCurrency(transaction.amount)}
                        </strong>
                      </td>
                      <td className="text-end">
                        <small className="text-muted">{formatCurrency(transaction.commission_amount)}</small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No hay transacciones esta semana.</p>
          )}

          {/* Resúmenes semanales históricos */}
          <h4 className="mt-4">Historial de Pagos Semanales</h4>
          {weeklySummaries.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-sm table-hover">
                <thead>
                  <tr>
                    <th>Semana</th>
                    <th>Período</th>
                    <th>Viajes</th>
                    <th className="text-end">Ganancias</th>
                    <th className="text-end">Comisión</th>
                    <th className="text-end">Pago Neto</th>
                    <th>Estado</th>
                    <th>Fecha de Pago</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklySummaries.map((summary) => (
                    <tr key={summary.id}>
                      <td>
                        <strong>Semana {summary.week_number}/{summary.year}</strong>
                      </td>
                      <td>
                        <small>
                          {formatDate(summary.week_start_date)} - {formatDate(summary.week_end_date)}
                        </small>
                      </td>
                      <td className="text-center">{summary.total_trips}</td>
                      <td className="text-end">{formatCurrency(summary.total_earnings)}</td>
                      <td className="text-end text-muted">{formatCurrency(summary.total_commission)}</td>
                      <td className="text-end">
                        <strong>{formatCurrency(summary.net_payment)}</strong>
                      </td>
                      <td>
                        {summary.payment_status === 'paid' ? (
                          <span className="badge bg-success">Pagado</span>
                        ) : (
                          <span className="badge bg-warning">Pendiente</span>
                        )}
                      </td>
                      <td>
                        <small>{formatDate(summary.payment_date)}</small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No hay historial de pagos semanales.</p>
          )}

          <div className="mt-3">
            <small className="text-muted">
              <strong>Nota:</strong> La semana comienza cada lunes a las 00:00.
              Los pagos se generan automáticamente pero deben ser procesados manualmente por el administrador.
            </small>
          </div>
        </>
      )}

      {/* Modal para ver imagen grande */}
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Body className="text-center">
          <Image src={selectedImage} style={{ maxWidth: "100%", maxHeight: "80vh" }} />
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación para cambios de usuario/conductor */}
      <Modal show={confirmModal} onHide={() => setConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Actualización</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Se detectaron los siguientes cambios:</p>
          <ListGroup>
            {changesList.map((c, i) => (
              <ListGroup.Item key={i}>
                <strong>{c.field}:</strong> {c.old} → <span style={{ color: "green" }}>{c.new}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <p className="mt-3 text-center">
            ¿Estás seguro de que deseas aplicar estos cambios?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmSave}>
            Confirmar y Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación para cambio de estado */}
      <Modal show={confirmStatusModal} onHide={() => setConfirmStatusModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Cambio de Estado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Estás a punto de cambiar el estado del conductor:</p>
          <div className="alert alert-info">
            <strong>Estado actual:</strong>{' '}
            <span className={`badge bg-${getStatusBadge(user?.driver_validate?.id_status)}`}>
              {getStatusLabel(user?.driver_validate?.id_status)}
            </span>
            <br />
            <strong>Nuevo estado:</strong>{' '}
            <span className={`badge bg-${getStatusBadge(driverStatus)}`}>
              {getStatusLabel(driverStatus)}
            </span>
          </div>
          {parseInt(driverStatus) !== 1 && (
            <div className="alert alert-warning">
              <strong>⚠️ Advertencia:</strong> Solo los conductores con estado "Activo" pueden iniciar sesión en la aplicación.
            </div>
          )}
          <p className="mt-3 text-center">
            ¿Estás seguro de que deseas cambiar el estado?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmStatusModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateStatus}>
            Confirmar Cambio de Estado
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación para validaciones de imágenes */}
      <Modal show={confirmValidationsModal} onHide={() => setConfirmValidationsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Actualización de Documentos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Se detectaron los siguientes cambios en las validaciones:</p>
          <ListGroup>
            {validationChangesList.map((c, i) => (
              <ListGroup.Item key={i}>
                <strong>{c.field}:</strong>{' '}
                <span className={c.old === 'Aprobado' ? 'text-success' : 'text-warning'}>
                  {c.old}
                </span>
                {' → '}
                <span className={c.new === 'Aprobado' ? 'text-success' : 'text-warning'}>
                  <strong>{c.new}</strong>
                </span>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <p className="mt-3 text-center">
            ¿Estás seguro de que deseas actualizar las validaciones de los documentos?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmValidationsModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateValidations}>
            Confirmar Actualización
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        @media (max-width: 768px) {
          .driver-detail-container {
            margin-left: 0 !important;
            padding: 10px !important;
          }

          .driver-detail-container h1,
          .driver-detail-container h3,
          .driver-detail-container h4 {
            padding-top: 60px;
            font-size: 20px;
          }

          .driver-detail-container h3 {
            font-size: 18px;
          }

          .driver-detail-container h4 {
            font-size: 16px;
          }

          .driver-detail-container .btn {
            width: 100%;
            margin-bottom: 10px;
          }

          .driver-detail-container .card {
            margin-bottom: 15px;
          }
        }

        @media (max-width: 480px) {
          .driver-detail-container {
            padding: 8px !important;
          }

          .driver-detail-container h1 {
            font-size: 18px;
          }

          .driver-detail-container h3 {
            font-size: 16px;
          }

          .driver-detail-container h4 {
            font-size: 14px;
          }

          .driver-detail-container form .row {
            margin: 0;
          }

          .driver-detail-container .table {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default DriverDetalle;
