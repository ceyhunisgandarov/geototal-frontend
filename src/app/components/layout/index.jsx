import Footer from "./footer";
import Navbar from "./navbar";
import style from "../../../../public/assets/css/module/layout/layout.module.css";
import TimeSide from "../time";
import NewNavbar from "./newnavbar";

function Layout({ children, page, locale }) {

  return (
    <>
      <NewNavbar page={page} locale={locale} />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default Layout;
