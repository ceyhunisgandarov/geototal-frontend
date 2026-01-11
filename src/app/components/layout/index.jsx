import Footer from "./footer";
import Navbar from "./navbar";
import style from "../../../../public/assets/css/module/layout/layout.module.css";
import TimeSide from "../time";
import NewNavbar from "./newnavbar";
import ModernNavbar from "./modernnavbar";
import ModernFooter from "./modernfooter";

function Layout({ children, page, locale }) {
  
  return (
    <>
      <ModernNavbar page={page} locale={locale} />
      <main>{children}</main>
      <ModernFooter />
    </>
  );
}

export default Layout;
