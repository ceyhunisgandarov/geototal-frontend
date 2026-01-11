import Layout from "@/app/components/layout";
import ProjectsComponent from "@/app/components/projectscomponent";
import Banner from "@/app/components/section/banner";

function ProjectsContainer({page}) {
  return (
    <Layout page={page}>
      <Banner page={page}/>
      <ProjectsComponent />
    </Layout>
  );
}

export default ProjectsContainer;
