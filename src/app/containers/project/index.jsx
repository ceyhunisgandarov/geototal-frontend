import Layout from "@/app/components/layout";
import Banner from "@/app/components/section/banner";
import ProjectSection from "@/app/components/section/project";

function ProjectContainer({ page, project, initialData }) {
  return (
    <Layout page={page}>
      <Banner page="projects" />
      <ProjectSection key={project} project={project} initialData={initialData} />
    </Layout>
  );
}

export default ProjectContainer;
