import { site, socialLinks } from '@/config';
import type { Project } from '@/lib/projects';

type SeoInput = {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  noindex?: boolean;
};

export type JsonLd = Record<string, unknown>;

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}

export function pageTitle(title?: string): string {
  return title ? `${title} · ${site.name}` : site.title;
}

export function personSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${site.url}/#person`,
    name: site.name,
    url: site.url,
    email: `mailto:${site.email}`,
    jobTitle: 'Computer Science student',
    description: site.description,
    knowsAbout: [
      'Java',
      'Python',
      'JavaScript',
      'SQL',
      'C',
      'PostgreSQL',
      'REST APIs',
      'React',
      'Node.js',
      'Cloudflare',
    ],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: site.university,
    },
    sameAs: socialLinks.filter((link) => link.icon !== 'mail').map((link) => link.href),
  };
}

export function websiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: site.lang,
    publisher: { '@id': `${site.url}/#person` },
  };
}

export function profilePageSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${site.url}/about/#profile`,
    url: absoluteUrl('/about/'),
    name: `About ${site.name}`,
    mainEntity: { '@id': `${site.url}/#person` },
    isPartOf: { '@id': `${site.url}/#website` },
  };
}

export function contactPageSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${site.url}/contact/#page`,
    url: absoluteUrl('/contact/'),
    name: `Contact ${site.name}`,
    mainEntity: { '@id': `${site.url}/#person` },
    isPartOf: { '@id': `${site.url}/#website` },
  };
}

export function projectSchema(project: Project, canonical: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${canonical}#project`,
    name: project.data.title,
    description: project.data.summary,
    url: canonical,
    dateCreated: String(project.data.year),
    creator: { '@id': `${site.url}/#person` },
    keywords: project.data.stack,
    ...(project.data.repoUrl ? { codeRepository: project.data.repoUrl } : {}),
    ...(project.data.liveUrl ? { sameAs: [project.data.liveUrl] } : {}),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; href: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function pageSchemaGraph(input: SeoInput): JsonLd[] {
  const graph: JsonLd[] = [personSchema(), websiteSchema()];

  if (input.canonical === absoluteUrl('/about/')) {
    graph.push(profilePageSchema());
  }

  return graph;
}
