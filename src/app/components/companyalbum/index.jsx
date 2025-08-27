import style from "../../../../public/assets/css/module/companyalbum/companyalbum.module.css";
import PartnerLogoCarousel from "../section/partnerlogocarousel";
import ProjectCarousel from "../section/projectcarousel";

function CompanyAlbum() {
  return (
    <div className={style.container}>
      <div className={style.companyContainer}>
        <ProjectCarousel style={style} />
        <PartnerLogoCarousel style={style} />
      </div>
    </div>
  );
}

export default CompanyAlbum;
