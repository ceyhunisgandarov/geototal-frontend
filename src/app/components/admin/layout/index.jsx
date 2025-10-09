import AdminNavbar from "./navbar";
import AdminFooter from "./footer";

function AdminLayout({ children, page, locale, handleClick }) {
  return (
    <>
      <AdminNavbar page={page} locale={locale} handleClick={handleClick} />
      <main>{children}</main>
      <AdminFooter />
    </>
  );
}

export default AdminLayout;
