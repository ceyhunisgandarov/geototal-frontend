"use client";
import style from "../../../../../../public/assets/css/module/admin/products.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import ProductService from "@/app/services/ProductService";

function ProductsAdmin() {
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
    descriptionEn: "",
    descriptionRu: "",
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
          setProducts(response.data.response);
          setImageFiles(response.data.response.images);
        } else {
          console.log("something went wrong-", response.data.status.message);
        }
      })
      .catch((error) => console.log("something went wrong-", error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Selected Product:", selectedProduct);
    console.log("New/Updated Images:", imageFiles);
    console.log("Old Images (to be replaced):", oldImageUrls);

    ProductService.addOrUpdateProduct(
      reqProduct,
      imageFiles,
      pdfFile,
      oldImageUrls,
      updateId
    )
      .then((response) => {
        if (response.data.status.code === 200) {
          refreshProducts();
        } else {
          console.log("something went wrong-", response.data.status.message);
        }
      })
      .catch((error) => console.log("something went wrong-", error))
      .finally(() => setShowModal(false)); // ✅ düzeltildi
  };

  const deleteProduct = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      ProductService.deleteProduct(id).then((response) => {
        if (response.data.status.code === 200) {
          refreshProducts();
        } else {
          console.log("something went wrong-", response.data.status.message);
        }
      });
    }
  };

  const openModal = (product = null) => {
    if (product) {
      // Backend’den gelen ürün
      setSelectedProduct(product);

      // Sadece reqProduct alanlarını doldur
      setReqProduct({
        brand: product.brand || "",
        model: product.model || "",
        category: product.category || "",
        descriptionAz: product.descriptionAz || "",
        descriptionEn: product.descriptionEn || "",
        descriptionRu: product.descriptionRu || "",
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
        setOldImageUrls(product.images);
      }
    } else {
      // Yeni ürün ekleme
      setSelectedProduct(null);
      setReqProduct({
        brand: "",
        model: "",
        category: "",
        descriptionAz: "",
        descriptionEn: "",
        descriptionRu: "",
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
      <div className={style.grid2}>
        {products.map((product) => (
          <div key={product.id} className={style.card2}>
            <Image
              width={200}
              height={200}
              src={
                product.imageUrl !== null
                  ? `http://localhost:8080/geototal/user/image/${product.images[0]}`
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
              <label className={style.fileLabel}>
                Upload PDF:
                <input
                  type="file"
                  accept="application/pdf"
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
                      +
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
              <div className={style.btnContainer}>
                <button type="submit" className={style.addButton}>
                  Save
                </button>
                <button
                  type="button"
                  className={style.deleteButton}
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
