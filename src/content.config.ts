import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const url = z.url();

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1).max(80),
      summary: z.string().min(1).max(240),
      role: z.string().min(1).max(120),
      timeline: z.string().min(1).max(80),
      team: z.string().max(120).optional(),
      year: z.number().int().min(2020).max(2100),
      stack: z.array(z.string().min(1)).min(1).max(12),
      status: z.enum(['live', 'in-progress', 'completed', 'archived']).default('live'),
      featured: z.boolean().default(false),
      order: z.number().int().default(0),
      liveUrl: url.optional(),
      repoUrl: url.optional(),
      cover: z
        .object({
          src: image(),
          alt: z.string().min(1),
          caption: z.string().max(200).optional(),
          narrow: z.boolean().default(false),
        })
        .optional(),
      placeholder: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };
