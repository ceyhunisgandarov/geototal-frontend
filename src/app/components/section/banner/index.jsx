import style from "../../../../../public/assets/css/module/banner/banner.module.css";

function Banner({ page }) {
  let bannerHeader = "";

  switch (page) {
    case "aboutus":
      bannerHeader = "About Us";
      break;
    case "products":
      bannerHeader = "Products";
      break;
    case "services":
      bannerHeader = "Products";
      break;
    case "contact":
      bannerHeader = "Products";
      break;
    default:
      bannerHeader = "Error";
      break;
  }

  return (
    <div
      className={style.container}
      style={{
        backgroundImage: `url("/images/banners/${page}.png")`,
      }}
    >
      <div className={style.overlay}>
        <p>
          {bannerHeader}
          <span className={style.underline}></span>
        </p>
      </div>
    </div>
  );
}

export default Banner;
