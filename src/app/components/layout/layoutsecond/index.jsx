import style from "../../../../../public/assets/css/module/layout/layout.module.css";
import Footer from "../footer";
import Navbar from "../navbar";

function LayoutSecond({ children, page, locale }) {

  return (
    <div className={style.layoutWrapper}>
      <Navbar page={page} locale={locale} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default LayoutSecond;
