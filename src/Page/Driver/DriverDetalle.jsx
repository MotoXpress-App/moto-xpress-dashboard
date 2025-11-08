import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { Form, Row, Col, Image, Button, Modal, ListGroup } from "react-bootstrap";

const DriverDetalle = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

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
  const [saveType, setSaveType] = useState(null); // 'user' o 'driver'

  const handleOpen = (img) => {
    setSelectedImage(img);
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
    setSelectedImage(null);
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
        }
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      }
    };
    fetchUser();
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

  const imageItems = [
    { label: "Licencia Frontal", src: user.driver?.image_license_lead },
    { label: "Licencia Trasera", src: user.driver?.image_license_rear },
    { label: "Seguro", src: user.driver?.image_sure },
    { label: "Registro Moto", src: user.driver?.image_motorcycle_register },
  ];

  const years = Array.from({ length: 26 }, (_, i) => 2000 + i);

  return (
    <div style={{ marginLeft: "250px", padding: "20px" }}>
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

            {/* Imágenes del Driver con Modal */}
            <Row className="mt-4">
              {imageItems.map(
                (item, index) =>
                  item.src && (
                    <Col md={3} className="mb-3" key={index}>
                      <Form.Label>{item.label}</Form.Label>
                      <div
                        style={{
                          width: "200px",
                          height: "200px",
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => handleOpen(item.src)}
                      >
                        <Image
                          src={item.src}
                          thumbnail
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    </Col>
                  )
              )}
            </Row>
          </Form>

          <Button
            variant="success"
            className="mt-3"
            onClick={() => confirmBeforeSave("driver")}
          >
            Guardar Cambios Chofer
          </Button>
        </>
      )}

      {/* Modal para ver imagen grande */}
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Body className="text-center">
          <Image src={selectedImage} style={{ maxWidth: "100%", maxHeight: "80vh" }} />
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación */}
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
    </div>
  );
};

export default DriverDetalle;
