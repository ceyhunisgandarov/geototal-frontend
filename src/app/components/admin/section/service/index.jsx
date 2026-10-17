"use client";

import { useState, useEffect } from "react";
import style from "../../../../../../public/assets/css/module/admin/service.module.css"; // CSS modulunu src/assets altında saxla
import ServicesService from "@/app/services/ServicesService";
import AdminIcon from "../icon"; // AdminIcon default export olmalıdır

function ServiceAdmin() {
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const [services, setServices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [id, setId] = useState(0);
  const [currentService, setCurrentService] = useState({
    serviceName: "",
    serviceNameEn: "",
    serviceNameRu: "",
    serviceNameKy: "",
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

  const deleteService = async (service) => {
    if (deletingId !== null || !confirm(`“${service.serviceName}” xidməti və bütün hissələri silinsin?`)) return;
    setDeletingId(service.id); setDeleteError("");
    try {
      const {data} = await ServicesService.deleteService(service.id);
      if (data?.status?.code !== 200) { setDeleteError(data?.status?.message || "Xidmət silinmədi."); return; }
      setServices(items => items.filter(item => item.id !== service.id));
    } catch (error) { setDeleteError(error?.response?.data?.status?.message || "Serverlə əlaqə alınmadı. Yenidən cəhd edin."); }
    finally { setDeletingId(null); }
  };

  const openAddModal = () => {
    setSaveError("");
    setIsAdd(true);
    setId(0);
    setCurrentService({
      serviceName: "",
      serviceNameEn: "",
      serviceNameRu: "",
      serviceNameKy: "",
      pathName: "",
      serviceImageFile: null,
      serviceParts: [],
    });
    setModalOpen(true);
  };

  const openUpdateModal = (service) => {
    setSaveError("");
    setIsAdd(false);
    setCurrentService({
      serviceName: service.serviceName,
      serviceNameEn: service.serviceNameEn,
      serviceNameRu: service.serviceNameRu,
      serviceNameKy: service.serviceNameKy,
      pathName: service.pathName || "",
      serviceImageFile: null,
      serviceParts: (service.serviceParts || []).map(part => ({ ...part, serviceImageFile: null })),
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
          partName: "", partNameEn: "", partNameRu: "", partNameKy: "",
          serviceTextAz: "",
          serviceTextEn: "",
          serviceTextRu: "",
          serviceTextKy: "",
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
    setCurrentService((prev) => ({
      ...prev,
      serviceParts: prev.serviceParts.map((part, i) =>
        i === index ? { ...part, [field]: value } : part
      ),
    }));
  };

  const handleSubmit = async () => {
    if (saving) return;
    setSaveError("");
    if (!currentService.serviceName || !currentService.serviceNameEn || !currentService.serviceNameRu || !currentService.pathName) {
      setSaveError("Xidmətin AZ, EN, RU adlarını və səhifə ünvanını doldurun.");
      return;
    }

    for (let i = 0; i < currentService.serviceParts.length; i++) {
      const part = currentService.serviceParts[i];
      if (!part.partName || !part.serviceTextAz || !part.serviceTextEn || !part.serviceTextRu) {
        setSaveError(`${i + 1}-ci hissənin adını və AZ, EN, RU mətnlərini doldurun.`);
        return;
      }
    }

    setSaving(true);
    try {
      const reqService = {
        serviceName: currentService.serviceName,
        serviceNameEn: currentService.serviceNameEn,
        serviceNameRu: currentService.serviceNameRu,
        serviceNameKy: currentService.serviceNameKy,
        pathName: currentService.pathName,
      };

      const reqServiceParts = currentService.serviceParts.map((part) => ({
        id: part.id,
        partName: part.partName,
        partNameEn: part.partNameEn, partNameRu: part.partNameRu, partNameKy: part.partNameKy,
        serviceTextAz: part.serviceTextAz,
        serviceTextEn: part.serviceTextEn,
        serviceTextRu: part.serviceTextRu,
        serviceTextKy: part.serviceTextKy,
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
        fetchServices();
        closeModal();
      } else {
        setSaveError(response.data.status.message || "Xidmət saxlanmadı.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSaveError(error?.response?.data?.status?.message || error?.response?.data?.message || "Serverlə əlaqə alınmadı. İnternet bağlantısını yoxlayıb yenidən cəhd edin.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={style.serviceAdminWrapper}>
      <div className={style.header}>
        <h1>Services Admin</h1>
        <button onClick={openAddModal}>Add Service</button>
      </div>

      {deleteError && <p role="alert" style={{color:"#b91c1c"}}>{deleteError}</p>}
      <div className={style.servicesWrap}>
        {services.map((service) => (
          <div key={service.id} className={style.serviceCard}>
            <AdminIcon
              path={service.serviceImageUrl}
              name={service.serviceName}
              background="light"
            />
            <button disabled={deletingId !== null} onClick={() => openUpdateModal(service)}>Update</button>
            <button disabled={deletingId !== null} onClick={() => deleteService(service)}>Delete Service</button>
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
                type="text"
                placeholder="Service Name KY"
                value={currentService.serviceNameKy ?? ""}
                onChange={(e) => setCurrentService((prev) => ({...prev, serviceNameKy: e.target.value}))}
              />
              <input
                type="file"
                accept=".svg, .png, .jpg"
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
                {["En", "Ru", "Ky"].map(language => (
                  <label key={language}>Part Name ({language.toUpperCase()})
                    <input name={`partName${language}`} maxLength={255} value={part[`partName${language}`] ?? ""}
                      onChange={e => updatePartField(index, `partName${language}`, e.target.value)} />
                  </label>
                ))}
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
                <textarea
                  placeholder="Service Text KY"
                  value={part.serviceTextKy ?? ""}
                  onChange={(e) => updatePartField(index, "serviceTextKy", e.target.value)}
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

            {saveError && <p role="alert" style={{color: "#b91c1c", margin: "8px 0"}}>{saveError}</p>}
            <div className={style.modalActions}>
              <button disabled={saving} onClick={handleSubmit}>{isAdd ? "Add" : "Update"}</button>
              <button disabled={saving} onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceAdmin;
