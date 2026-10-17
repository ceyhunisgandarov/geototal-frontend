import PageHeading from "@/app/components/pageheading";
import Layout from "@/app/components/layout";
import ProjectsComponent from "@/app/components/projectscomponent";
import Banner from "@/app/components/section/banner";

function ProjectsContainer({page, initialData}) {
  return (
    <Layout page={page}>
      <Banner page={page}/>
      <PageHeading page="projects" />
      <ProjectsComponent initialData={initialData} />
    </Layout>
  );
}

export default ProjectsContainer;
