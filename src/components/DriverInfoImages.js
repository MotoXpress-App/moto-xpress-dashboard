import { useState } from "react";
import { Row, Col, Image, Form, Modal } from "react-bootstrap";

function DriverInfoImages({ driver }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOpen = (img) => {
    setSelectedImage(img);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  const imageItems = [
    { label: "Licencia Frontal", src: driver.driver.image_license_lead },
    { label: "Licencia Trasera", src: driver.driver.image_license_rear },
    { label: "Seguro", src: driver.driver.image_sure },
    { label: "Registro Moto", src: driver.driver.image_motorcycle_register },
  ];

  return (
    <>
      <Row className="mb-3">
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

      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Body className="text-center">
          <Image
            src={selectedImage}
            style={{ maxWidth: "100%", maxHeight: "80vh" }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DriverInfoImages;