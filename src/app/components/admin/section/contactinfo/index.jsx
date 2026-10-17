"use client";

import ContactService from "@/app/services/ContactService";
import style from "../../../../../../public/assets/css/module/admin/contact.module.css";
import { useEffect, useState } from "react";

function ContactInfoSection() {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [contactInfo, setContactInfo] = useState({
    id: "",
    address: "",
    phoneNumbers: [""], // en az 1 input
    emailAddress: [""], // en az 1 input
    mailAddressForSend: "",
    googleEmbeddedLink: "",
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    ContactService.getContact()
      .then((response) => {
        if (response.data.status.code === 200) {
          const data = response.data.response;
          setContactInfo({
            ...data,
            phoneNumbers: data.phoneNumbers.length ? data.phoneNumbers : [""],
            emailAddress: data.emailAddress.length ? data.emailAddress : [""],
          });
        } else {
          console.log("something went wrong - ", response.data.status.message);
        }
      })
      .catch((error) => console.log("something went wrong - ", error))
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  };

  const handleListChange = (field, index, value) => {
    const list = [...contactInfo[field]];
    list[index] = value;
    setContactInfo({ ...contactInfo, [field]: list });
  };

  const addListItem = (field) => {
    if (contactInfo[field].length < 3) {
      setContactInfo({ ...contactInfo, [field]: [...contactInfo[field], ""] });
    }
  };

  const removeListItem = (field, index) => {
    const list = [...contactInfo[field]];
    list.splice(index, 1);
    setContactInfo({
      ...contactInfo,
      [field]: list.length ? list : [""], // en az 1 input
    });
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setSaveError("");
    try {
      const response = await ContactService.addOrUpdateContact(contactInfo);
      if (response.data?.status?.code !== 200) {
        setSaveError(response.data?.status?.message || "Məlumat saxlanmadı. Yenidən cəhd edin.");
        return;
      }
      setEditMode(false);
    } catch (error) {
      setSaveError(error?.response?.data?.status?.message || error?.response?.data?.message || "Serverlə əlaqə alınmadı. İnternet bağlantısını yoxlayıb yenidən cəhd edin.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={style.contactForm}>
      <label>Adres</label>
      <input
        type="text"
        name="address"
        value={contactInfo.address}
        onChange={handleInputChange}
        disabled={!editMode || saving}
      />

      <label>Telefon Numaraları</label>
      {contactInfo.phoneNumbers.map((phone, idx) => (
        <div className={style.listInputContainer} key={idx}>
          <input
            type="text"
            value={phone}
            onChange={(e) =>
              handleListChange("phoneNumbers", idx, e.target.value)
            }
            disabled={!editMode || saving}
          />
          {editMode && (
            <>
              <button
                type="button"
                className={style.removeButton}
                onClick={() => removeListItem("phoneNumbers", idx)}
              >
                Sil
              </button>
              {idx === contactInfo.phoneNumbers.length - 1 &&
                contactInfo.phoneNumbers.length < 3 && (
                  <button
                    type="button"
                    className={style.addButton}
                    onClick={() => addListItem("phoneNumbers")}
                  >
                    Ekle
                  </button>
                )}
            </>
          )}
        </div>
      ))}

      <label>Email Adresleri</label>
      {contactInfo.emailAddress.map((email, idx) => (
        <div className={style.listInputContainer} key={idx}>
          <input
            type="email"
            value={email}
            onChange={(e) =>
              handleListChange("emailAddress", idx, e.target.value)
            }
            disabled={!editMode || saving}
          />
          {editMode && (
            <>
              <button
                type="button"
                className={style.removeButton}
                onClick={() => removeListItem("emailAddress", idx)}
              >
                Sil
              </button>
              {idx === contactInfo.emailAddress.length - 1 &&
                contactInfo.emailAddress.length < 3 && (
                  <button
                    type="button"
                    className={style.addButton}
                    onClick={() => addListItem("emailAddress")}
                  >
                    Ekle
                  </button>
                )}
            </>
          )}
        </div>
      ))}

      <label>Mail Gönderim Adresi</label>
      <input
        type="text"
        name="mailAddressForSend"
        value={contactInfo.mailAddressForSend}
        onChange={handleInputChange}
        disabled={!editMode || saving}
      />

      <label>Google Embedded Link</label>
      <input
        type="text"
        name="googleEmbeddedLink"
        value={contactInfo.googleEmbeddedLink}
        onChange={handleInputChange}
        disabled={!editMode || saving}
      />

      {saveError && <p role="alert" style={{color: "#b91c1c", margin: "8px 0"}}>{saveError}</p>}
      {!editMode ? (
        <button className={style.editButton} onClick={() => { setSaveError(""); setEditMode(true); }}>
          Düzenle
        </button>
      ) : (
        <button className={style.saveButton} disabled={saving} onClick={handleSave}>
          Kaydet
        </button>
      )}
    </div>
  );
}

export default ContactInfoSection;
