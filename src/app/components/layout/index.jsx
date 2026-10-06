import ModernNavbar from "./modernnavbar";
import ModernFooter from "./modernfooter";

function Layout({ children, page, locale }) {
  
  return (
    <>
      <ModernNavbar page={page} locale={locale} />
      <main>{children}</main>
      <ModernFooter locale={locale}/>
    </>
  );
}

export default Layout;
