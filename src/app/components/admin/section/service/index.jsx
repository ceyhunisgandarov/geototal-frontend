"use client";

import { useState, useEffect } from "react";
import style from "../../../../../../public/assets/css/module/admin/service.module.css"; // CSS modulunu src/assets altında saxla
import ServicesService from "@/app/services/ServicesService";
import AdminIcon from "../icon"; // AdminIcon default export olmalıdır

function ServiceAdmin() {
  const [services, setServices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [id, setId] = useState(0);
  const [currentService, setCurrentService] = useState({
    serviceName: "",
    serviceNameEn: "",
    serviceNameRu: "",
    pathName: "",
    serviceImageFile: null,
    serviceParts: [],
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await ServicesService.getServices();
      if (response.data.status.code === 200) {
        setServices(response.data.response);
      }
    } catch (error) {
      console.log("Something went wrong - ", error);
    }
  };

  const openAddModal = () => {
    setIsAdd(true);
    setCurrentService({
      serviceName: "",
      serviceNameEn: "",
      serviceNameRu: "",
      pathName: "",
      serviceImageFile: null,
      serviceParts: [],
    });
    setModalOpen(true);
  };

  const openUpdateModal = (service) => {
    setIsAdd(false);
    setCurrentService({
      serviceName: service.serviceName,
      serviceNameEn: service.serviceNameEn,
      serviceNameRu: service.serviceNameRu,
      pathName: service.pathName || "",
      serviceImageFile: null,
      serviceParts: service.serviceParts || [],
    });
    setId(service.id);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const addPart = () => {
    if (currentService.serviceParts.length >= 3) return;
    setCurrentService((prev) => ({
      ...prev,
      serviceParts: [
        ...prev.serviceParts,
        {
          partName: "",
          serviceTextAz: "",
          serviceTextEn: "",
          serviceTextRu: "",
          serviceImageFile: null,
        },
      ],
    }));
  };

  const deletePart = (index) => {
    setCurrentService((prev) => ({
      ...prev,
      serviceParts: prev.serviceParts.filter((_, i) => i !== index),
    }));
  };

  const updatePartField = (index, field, value) => {
    setCurrentService((prev) => {
      const parts = [...prev.serviceParts];
      parts[index][field] = value;
      return { ...prev, serviceParts: parts };
    });
  };

  const handleSubmit = async () => {
    if (!currentService.serviceName || !currentService.serviceNameEn || !currentService.serviceNameRu || !currentService.pathName) {
      alert("All service fields are required!");
      return;
    }

    for (let i = 0; i < currentService.serviceParts.length; i++) {
      const part = currentService.serviceParts[i];
      if (!part.partName || !part.serviceTextAz || !part.serviceTextEn || !part.serviceTextRu) {
        alert(`All fields of Part ${i + 1} are required!`);
        return;
      }
    }

    try {
      const reqService = {
        serviceName: currentService.serviceName,
        serviceNameEn: currentService.serviceNameEn,
        serviceNameRu: currentService.serviceNameRu,
        pathName: currentService.pathName,
      };

      const reqServiceParts = currentService.serviceParts.map((part) => ({
        partName: part.partName,
        serviceTextAz: part.serviceTextAz,
        serviceTextEn: part.serviceTextEn,
        serviceTextRu: part.serviceTextRu,
      }));

      const servicePartImages = currentService.serviceParts.map(
        (part) => part.serviceImageFile || null
      );

      const serviceImage = currentService.serviceImageFile;

      const response = await ServicesService.addOrUpdateService(
        reqService,
        serviceImage,
        reqServiceParts,
        servicePartImages,
        id
      );

      if (response.data.status.code === 200) {
        alert(`${isAdd ? "Added" : "Updated"} successfully!`);
        fetchServices();
        closeModal();
      } else {
        alert("Something went wrong: " + response.data.status.message);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Submit failed. Check console for details.");
    }
  };

  return (
    <div className={style.serviceAdminWrapper}>
      <div className={style.header}>
        <h1>Services Admin</h1>
        <button onClick={openAddModal}>Add Service</button>
      </div>

      <div className={style.servicesWrap}>
        {services.map((service) => (
          <div key={service.id} className={style.serviceCard}>
            <AdminIcon
              path={service.serviceImageUrl}
              name={service.serviceName}
              background="light"
            />
            <button onClick={() => openUpdateModal(service)}>Update</button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className={style.customModalOverlay} onClick={closeModal}>
          <div className={style.customModal} onClick={(e) => e.stopPropagation()}>
            <h2>{isAdd ? "Add Service" : "Update Service"}</h2>

            <div className={style.formGroup}>
              <input
                type="text"
                placeholder="Path Name"
                value={currentService.pathName}
                onChange={(e) =>
                  setCurrentService((prev) => ({ ...prev, pathName: e.target.value }))
                }
              />
              <input
                type="text"
                placeholder="Service Name"
                value={currentService.serviceName}
                onChange={(e) =>
                  setCurrentService((prev) => ({ ...prev, serviceName: e.target.value }))
                }
              />
              <input
                type="text"
                placeholder="Service Name EN"
                value={currentService.serviceNameEn}
                onChange={(e) =>
                  setCurrentService((prev) => ({ ...prev, serviceNameEn: e.target.value }))
                }
              />
              <input
                type="text"
                placeholder="Service Name RU"
                value={currentService.serviceNameRu}
                onChange={(e) =>
                  setCurrentService((prev) => ({ ...prev, serviceNameRu: e.target.value }))
                }
              />

              <input
                type="file"
                accept=".svg"
                onChange={(e) => setCurrentService((prev) => ({ ...prev, serviceImageFile: e.target.files[0] }))}
              />
            </div>

            <h3>Service Parts</h3>
            {currentService.serviceParts.map((part, index) => (
              <div key={index} className={style.partGroup}>
                <input
                  type="text"
                  placeholder="Part Name"
                  value={part.partName}
                  onChange={(e) => updatePartField(index, "partName", e.target.value)}
                />
                <textarea
                  placeholder="Service Text AZ"
                  value={part.serviceTextAz}
                  onChange={(e) => updatePartField(index, "serviceTextAz", e.target.value)}
                />
                <textarea
                  placeholder="Service Text EN"
                  value={part.serviceTextEn}
                  onChange={(e) => updatePartField(index, "serviceTextEn", e.target.value)}
                />
                <textarea
                  placeholder="Service Text RU"
                  value={part.serviceTextRu}
                  onChange={(e) => updatePartField(index, "serviceTextRu", e.target.value)}
                />
                <label className={style.imageUploadLabel}>
                  {part.serviceImageFile ? (
                    <img src={URL.createObjectURL(part.serviceImageFile)} alt="Service Part" className={style.thumbnail} />
                  ) : part.serviceImageUrl ? (
                    <img src={part.serviceImageUrl} alt="Service Part" className={style.thumbnail} />
                  ) : (
                    <div className={style.thumbnailPlaceholder}>+</div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => updatePartField(index, "serviceImageFile", e.target.files[0])}
                  />
                </label>
                <button type="button" onClick={() => deletePart(index)}>Delete Part</button>
              </div>
            ))}

            {currentService.serviceParts.length < 3 && (
              <button type="button" onClick={addPart}>Add Part</button>
            )}

            <div className={style.modalActions}>
              <button onClick={handleSubmit}>{isAdd ? "Add" : "Update"}</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceAdmin;
