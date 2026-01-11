import style from "../../../../../public/assets/css/module/layout/layout.module.css";
import Footer from "../footer";
import ModernFooter from "../modernfooter";
import Navbar from "../navbar";

function LayoutSecond({ children, page, locale }) {

  return (
    <div className={style.layoutWrapper}>
      <Navbar page={page} locale={locale} />
      <main>{children}</main>
      <ModernFooter />
    </div>
  );
}

export default LayoutSecond;
