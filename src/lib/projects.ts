import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

export async function getPublishedProjects(): Promise<Project[]> {
  const projects = await getCollection('projects', ({ data }) => !data.draft);

  return projects.sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    if (a.data.order !== b.data.order) return a.data.order - b.data.order;
    return b.data.year - a.data.year;
  });
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const projects = await getPublishedProjects();
  return projects.slice(0, limit);
}

export function projectPath(project: Project): string {
  return `/work/${project.id}/`;
}
