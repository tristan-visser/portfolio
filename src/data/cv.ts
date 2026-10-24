export const cv = {
  profile:
    'Final-year Computer Science student at Stellenbosch University. Backend, database and full-stack experience with Electrum and commercial clients. Seeking a graduate software engineering role from January 2027.',
  education: [
    {
      date: '2023 — 2026',
      title: 'BSc Computer Science',
      org: 'Stellenbosch University',
      detail: 'Focus: backend, databases, REST APIs and software engineering. Expected 2026.',
    },
  ],
  experience: [
    {
      date: '2025 — Present',
      title: 'Commercial Web Developer & Technical Consultant',
      org: 'Freelance · Local business clients',
      bullets: [
        'Built and deployed custom web applications with relational databases and secure hosting.',
        'Managed requirements, DNS, responsive UI and ongoing maintenance.',
      ],
    },
    {
      date: '2026',
      title: 'Backend Developer & Scrum Master',
      org: 'Electrum · industry project',
      description:
        'Built a Java dependency graph engine that identifies breaking API changes and opens automated GitHub pull requests for affected repositories, across three Agile sprints.',
    },
  ],
} as const;
