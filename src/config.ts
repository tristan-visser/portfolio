export const site = {
  name: 'Tristan Visser',
  title: 'Tristan Visser — Computer Science graduate',
  description:
    'Final-year BSc Computer Science student at Stellenbosch University. I build backend systems, relational databases and full-stack web applications. Open to graduate software engineering roles from 2027.',
  url: 'https://tristanvisser.co.za',
  repoUrl: 'https://github.com/tristan-visser/portfolio',
  locale: 'en-ZA',
  lang: 'en-ZA',
  email: 'hello@tristanvisser.co.za',
  location: 'Stellenbosch / Cape Town, South Africa',
  availability: 'Open to graduate roles · 2027',
  university: 'Stellenbosch University',
  degree: 'BSc Computer Science',
  graduation: '2026',
  currentFocus: 'Finishing my BSc and looking for a graduate software engineering role from 2027.',
  socials: {
    github: 'https://github.com/tristan-visser',
    linkedin: 'https://www.linkedin.com/in/tristan-visser/',
  },
  nav: [
    { label: 'Work', href: '/work/' },
    { label: 'About', href: '/about/' },
    { label: 'Contact', href: '/contact/' },
  ],
  // Public Turnstile site key. Set this after creating the widget.
  turnstileSiteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? '',
  // Optional Cloudflare Web Analytics token. Leave empty until launch.
  analyticsToken: '',
  // Set to true only for preview deployments. The production build
  // refuses to ship placeholder projects.
  allowPlaceholderContent: false,
} as const;

export const socialLinks = [
  site.socials.github
    ? { label: 'GitHub', href: site.socials.github, icon: 'github' as const }
    : null,
  site.socials.linkedin
    ? { label: 'LinkedIn', href: site.socials.linkedin, icon: 'linkedin' as const }
    : null,
  { label: 'Email', href: `mailto:${site.email}`, icon: 'mail' as const },
].filter((link): link is NonNullable<typeof link> => link !== null);

export const skills = [
  {
    label: 'Languages',
    items: ['Java', 'Python', 'JavaScript', 'SQL', 'C'],
  },
  {
    label: 'Backend and data',
    items: ['PostgreSQL', 'Supabase', 'REST APIs', 'Node.js', 'Express.js'],
  },
  {
    label: 'Frontend',
    items: ['React.js', 'Next.js', 'Tailwind CSS', 'HTML', 'CSS', 'WordPress'],
  },
  {
    label: 'Systems and tools',
    items: [
      'C/OpenMP',
      'Multi-threading',
      'UDP/TCP',
      'Linux/Bash',
      'Git',
      'CI/CD',
      'Cloudflare',
      'Vercel',
    ],
  },
] as const;
