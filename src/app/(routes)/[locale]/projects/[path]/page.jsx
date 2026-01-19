"use client";

import ProjectContainer from "@/app/containers/project";
import { useParams } from "next/navigation";

function ProjectPage() {
  const params = useParams();
  const { locale, path } = params;

  return (
    <ProjectContainer page={`/projects/${path}/`} project={path} />
  );
}

export default ProjectPage;
