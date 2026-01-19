import Layout from "@/app/components/layout";
import Banner from "@/app/components/section/banner";
import ProjectSection from "@/app/components/section/project";

function ProjectContainer({ page, project }) {
  return (
    <Layout page={page}>
      <Banner page="projects" />
      <ProjectSection project={project} />
    </Layout>
  );
}

export default ProjectContainer;
