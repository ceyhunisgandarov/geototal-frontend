"use client";
import style from "../../../../../../public/assets/css/module/admin/products.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import ProductService from "@/app/services/ProductService";

function ProductsAdmin() {
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageFiles, setImageFiles] = useState([]); // Çoklu resimler
  const [updateId, setUpdateId] = useState(0);
  const [pdfFile, setPdfFile] = useState(null);
  const [oldImageUrls, setOldImageUrls] = useState([]); // yeni state
  const [reqProduct, setReqProduct] = useState({
    brand: "",
    model: "",
    category: "",
    descriptionAz: "",
      seoDescriptionAz: "", seoTitleAz: "",
      seoDescriptionEn: "", seoTitleEn: "",
      seoDescriptionRu: "", seoTitleRu: "",
      seoDescriptionKy: "", seoTitleKy: "",

    descriptionEn: "",
    descriptionRu: "",
    descriptionKy: "",
    bestseller: false,
    stock: 0,
  });

  useEffect(() => {
    refreshProducts();
  }, []);

  const refreshProducts = () => {
    ProductService.getProducts()
      .then((response) => {
        if (response.data.status.code === 200) {
          setProducts(response.data.response || []);

        } else {
          console.log("something went wrong-", response.data.status.message);
        }
      })
      .catch((error) => console.log("something went wrong-", error));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setSaveError("");
    try {
      const response = await ProductService.addOrUpdateProduct(reqProduct, imageFiles, pdfFile, oldImageUrls, updateId);
      if (response.data?.status?.code !== 200) {
        setSaveError(response.data?.status?.message || "Məlumat saxlanmadı. Yenidən cəhd edin.");
        return;
      }
      refreshProducts(); setShowModal(false);
    } catch (error) {
      setSaveError(error?.response?.data?.status?.message || error?.response?.data?.message || "Serverlə əlaqə alınmadı. İnternet bağlantısını yoxlayıb yenidən cəhd edin.");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    if (deletingId !== null || !confirm("Bu qeydi silmək istəyirsiniz?")) return;
    setDeletingId(id);
    setDeleteError("");
    try {
      const { data } = await ProductService.deleteProduct(id);
      if (data?.status?.code !== 200) {
        setDeleteError(data?.status?.message || "Qeyd silinmədi.");
        return;
      }
      setProducts(items => items.filter(item => item.id !== id));
    } catch (error) {
      setDeleteError(error?.response?.data?.status?.message || "Serverlə əlaqə alınmadı. Yenidən cəhd edin.");
    } finally {
      setDeletingId(null);
    }
  };

  const openModal = (product = null) => {
    setSaveError("");
    setPdfFile(null);
    setOldImageUrls([]);
    setUpdateId(product?.id || 0);
    if (product) {
      // Backend’den gelen ürün
      setSelectedProduct(product);

      // Sadece reqProduct alanlarını doldur
      setReqProduct({
        brand: product.brand || "",
        model: product.model || "",
        category: ({TOTAL_STATION: "TS", AUTO_LEVEL: "AL", ACCESSORIES: "ACC", CONTROLLER: "CONT", SOFTWARE: "SOFT", LASER_SCANNER: "LS"})[product.category] || product.category || "",
        descriptionAz: product.descriptionAz || "",
      seoDescriptionAz: product.seoDescriptionAz ?? "", seoTitleAz: product.seoTitleAz ?? "",
      seoDescriptionEn: product.seoDescriptionEn ?? "", seoTitleEn: product.seoTitleEn ?? "",
      seoDescriptionRu: product.seoDescriptionRu ?? "", seoTitleRu: product.seoTitleRu ?? "",
      seoDescriptionKy: product.seoDescriptionKy ?? "", seoTitleKy: product.seoTitleKy ?? "",

        descriptionEn: product.descriptionEn || "",
        descriptionRu: product.descriptionRu || "",
        descriptionKy: product.descriptionKy || "",
        bestseller: product.bestseller || false,
        stock: product.stock || 0,
      });

      if (product.images) {
        const imagesWithPreview = product.images.map((img) => ({
          file: null,
          preview: img,
          name: img,
        }));
        setImageFiles(imagesWithPreview);

      }
    } else {
      // Yeni ürün ekleme
      setSelectedProduct(null);
      setReqProduct({
        brand: "",
        model: "",
        category: "",
        descriptionAz: "",
      seoDescriptionAz: "", seoTitleAz: "",
      seoDescriptionEn: "", seoTitleEn: "",
      seoDescriptionRu: "", seoTitleRu: "",
      seoDescriptionKy: "", seoTitleKy: "",

        descriptionEn: "",
        descriptionRu: "",
        descriptionKy: "",
        bestseller: false,
        stock: 0,
      });
      setImageFiles([]);
      setOldImageUrls([]);
    }

    setShowModal(true);
  };

  return (
    <div className={style.container2}>
      {deleteError && <p role="alert" style={{color: "#b91c1c"}}>{deleteError}</p>}
      {products.length === 0 && <p>Hələ qeyd yoxdur.</p>}
      <div className={style.grid2}>
        {products.map((product) => (
          <div key={product.id} className={style.card2}>
            <Image
              width={200}
              height={200}
              src={
                product.imageUrl !== null
                  ? `${product.images[0]}`
                  : "/images/admin/question.png"
              }
              alt={product.model}
              className={style.image2}
            />
            <h3 className={style.productName}>{product.brand}</h3>
            <p className={style.desc2}>{product.model}</p>
            <div className={style.btnContainer}>
              <button
                className={style.addButton}
                onClick={() => {
                  setUpdateId(product.id);
                  openModal(product);
                }}
              >
                Edit Product
              </button>
              <button
                className={style.deleteButton}
                disabled={deletingId !== null}
                onClick={() => deleteProduct(product.id)}
              >
                Delete Product
              </button>
            </div>
          </div>
        ))}

        {/* Add new card */}
        <div className={style.card2} onClick={() => openModal()}>
          <div className={style.image2} style={{ fontSize: "3rem" }}>
            +
          </div>
          <button
            className={style.addButton}
            onClick={() => {
              setUpdateId(0);
              openModal();
            }}
          >
            Add new product
          </button>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className={style.modalOverlay}>
          {console.log(updateId, "- id")}

          <div className={style.modalContent}>
            <h2>{selectedProduct?.id ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit} className={style.form}>
              <input
                type="text"
                placeholder="Brand"
                value={reqProduct.brand} // <-- burayı değiştir
                onChange={(e) =>
                  setReqProduct({
                    ...reqProduct,
                    brand: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Model"
                value={reqProduct.model} // <-- burayı değiştir
                onChange={(e) =>
                  setReqProduct({
                    ...reqProduct,
                    model: e.target.value,
                  })
                }
              />

<div style={{gridColumn: "1 / -1", width: "100%"}}>
<h3>SEO başlığı</h3>
 {['Az','En','Ru','Ky'].map(language => <label key={language} style={{display:'block'}}>SEO başlığı ({language.toUpperCase()})
 <input value={reqProduct[`seoTitle${language}`] ?? ''} onChange={e=>setReqProduct(previous=>({...previous,[`seoTitle${language}`]:e.target.value}))} /></label>)}
 <h3>SEO təsviri</h3>
 <p>Axtarış nəticələri üçün qısa, tamamlanmış cümlələr yazın. Boş qalsa, səhifənin mətnindən avtomatik hazırlanacaq.</p>
 {['Az', 'En', 'Ru', 'Ky'].map(language => (
  <label key={language} style={{display: "block", marginBottom: 12}}>
   SEO təsviri ({language.toUpperCase()})
   <textarea name={`seoDescription${language}`} rows={3} style={{display: "block", width: "100%"}}
    value={reqProduct[`seoDescription${language}`] ?? ""}
    onChange={e => setReqProduct(previous => ({...previous, [`seoDescription${language}`]: e.target.value}))} />
   <small>{(reqProduct[`seoDescription${language}`] ?? "").length} simvol · Qısa təsvir tövsiyə olunur; mətn avtomatik kəsilmir.</small>
  </label>
 ))}
</div>
              <select
                value={reqProduct.category} // <-- burayı değiştir
                onChange={(e) =>
                  setReqProduct({
                    ...reqProduct,
                    category: e.target.value,
                  })
                }
              >
                <option value="">-- Select Category --</option>
                <option value="TS">TOTAL_STATION</option>
                <option value="GNSS">GNSS</option>
                <option value="AL">AUTO_LEVEL</option>
                <option value="ACC">ACCESSORIES</option>
                <option value="CONT">CONTROLLER</option>
                <option value="SOFT">SOFTWARE</option>
                <option value="LS">LASER_SCANNER</option>
              </select>

              <textarea
                placeholder="Description (Az)"
                value={reqProduct.descriptionAz} // <-- burayı değiştir
                onChange={(e) =>
                  setReqProduct({
                    ...reqProduct,
                    descriptionAz: e.target.value,
                  })
                }
              />

              <textarea
                placeholder="Description (En)"
                value={reqProduct.descriptionEn}
                onChange={(e) =>
                  setReqProduct({
                    ...reqProduct,
                    descriptionEn: e.target.value,
                  })
                }
              />
              <textarea
                placeholder="Description (Ru)"
                value={reqProduct.descriptionRu}
                onChange={(e) =>
                  setReqProduct({
                    ...reqProduct,
                    descriptionRu: e.target.value,
                  })
                }
              />
              <textarea
                placeholder="Description (Ky)"
                value={reqProduct.descriptionKy}
                onChange={(e) => setReqProduct({...reqProduct, descriptionKy: e.target.value})}
              />
              <label>
                Bestseller:
                <input
                  type="checkbox"
                  checked={reqProduct.bestseller}
                  onChange={(e) =>
                    setReqProduct({
                      ...reqProduct,
                      bestseller: e.target.checked,
                    })
                  }
                />
              </label>
              <input
                type="number"
                placeholder="Stock"
                value={reqProduct.stock}
                onChange={(e) =>
                  setReqProduct({
                    ...reqProduct,
                    stock: e.target.value,
                  })
                }
              />
              <label
                className={`${style.fileLabel} ${
                  pdfFile ? style.fileSelected : ""
                }`}
              >
                <Image
                  src={
                    pdfFile
                      ? "/images/icons/file-success.png" // seçiləndə
                      : "/images/icons/file-icon.png" // default
                  }
                  alt="file-image"
                  width={200}
                  height={200}
                  className={style.iconImage}
                />

                {/* <span>{pdfFile ? pdfFile.name : "Upload Brochure PDF"}</span> */}

                <input
                  type="file"
                  accept="application/pdf"
                  style={{ display: "none" }}
                  onChange={(e) => setPdfFile(e.target.files[0])}
                />
              </label>

              {/* Image Preview & Add */}
              {/* Image Preview & Add */}
              <div className={style.imagePreviewContainer}>
                {imageFiles &&
                  imageFiles.map((img, index) => (
                    <div key={index} className={style.imageWrapper}>
                      <img
                        src={
                          img.preview ||
                          (img.file
                            ? URL.createObjectURL(img.file)
                            : "/images/admin/question.png")
                        }
                        alt={`image-${index}`}
                        width={40}
                        height={40}
                        onClick={() =>
                          document.getElementById(`imageInput-${index}`).click()
                        }
                        style={{
                          cursor: "pointer",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                        }}
                      />
                      <input
                        id={`imageInput-${index}`}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;

                          setOldImageUrls((prev) => [...prev, img.name]);

                          setImageFiles((prev) => {
                            const newArr = [...prev];
                            newArr[index] = {
                              ...newArr[index],
                              file,
                              preview: URL.createObjectURL(file),
                            };
                            return newArr;
                          });
                        }}
                      />
                    </div>
                  ))}

                {imageFiles.length < 4 && (
                  <div className={style.imageWrapper}>
                    <div
                      className={style.addImageButton}
                      onClick={() =>
                        document.getElementById("addImageInput").click()
                      }
                    >
                      <Image
                        src="/images/icons/image-icon.png"
                        alt="image-icon"
                        className={style.iconImage}
                        width={200}
                        height={200}
                      />
                    </div>
                    <input
                      id="addImageInput"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        setImageFiles((prev) => [
                          ...prev,
                          { file, preview: URL.createObjectURL(file) },
                        ]);
                      }}
                    />
                  </div>
                )}
              </div>
              {saveError && <p role="alert" style={{color: "#b91c1c", margin: "8px 0"}}>{saveError}</p>}
              <div className={style.btnContainer}>
                <button type="submit" disabled={saving} className={style.addButton}>
                  Save
                </button>
                <button
                  type="button"
                  className={style.deleteButton}
                  disabled={saving}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsAdmin;
