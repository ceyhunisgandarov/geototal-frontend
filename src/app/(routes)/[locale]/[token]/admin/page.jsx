import AdminHomePage from "@/app/containers/adminhomepage";

export default function AdminPage({ params }) {
  const { token } = params;

  return <AdminHomePage page={`/${token}/admin`} />;
}

