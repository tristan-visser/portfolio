---
title: Hackathon Hosting Platform
summary: A full-stack hackathon platform with accounts, groups and teams, a collaborative editor, sandboxed Python evaluation and live leaderboards.
cvSummary: Hackathon platform with teams, collaborative editing and sandboxed Python judging.
role: Full-stack developer · team of four
team: Team of four
timeline: Coursework
year: 2026
stack:
  - React 19
  - Vite
  - Express
  - Prisma
  - SQLite
  - WebSockets
  - Node.js
  - Docker
status: completed
featured: true
order: 2
cover:
  src: ./images/hackathon-code-editor.png
  alt: Hackathon platform code editor showing a Python submission, a file explorer, and the problem statement.
  caption: The collaborative editor, showing the problem statement, virtual file system and Python submission in one view.
gallery:
  - src: ./images/hackathon-leaderboard.png
    alt: Hackathon platform leaderboard showing a live event timer, team members, problem tabs and ranked teams by tests passed and runtime.
    caption: The live leaderboard, showing tests passed, runtime and team rankings.
---

## The problem

A recurring hackathon needs more than a registration form. Participants need accounts, groups and teams. Organisers need to publish problems and test cases. Teams need to write and submit code together, have it evaluated automatically, and see where they stand on a leaderboard. All of that has to happen without letting a submission take over the server.

This was a four-person full-stack project for CS343. I worked across the backend and frontend, with a focus on authentication, sessions, groups, problem management and the security surfaces around the editor.

## What I built

I worked on the authentication and session layer: registration, login, JWT-based authentication, sliding 30-minute sessions and re-authentication. I built group administration, invites and icon upload, and the problem-authoring flow with problem sequencing and test-case management.

I also worked on the contract between the client and server: the domain schema, the REST and WebSocket protocol, and the database schema and entity-relationship diagram. On the security side, I closed codebase access holes in the virtual file system and editor, added security headers and rate limiting, and set up the CI pipeline, git hooks and dependency allow-list.

The result is a platform with a React client, an Express API, Prisma and SQLite for persistence, native WebSockets for real-time features, and a Docker-backed Python submission runner.

## The hard part

The hard part is trust. A hackathon platform runs code submitted by other people, so the editor and virtual file system cannot expose the server's codebase, and the runner cannot let a submission reach the network, write outside its workspace or exhaust the host. The sandbox has to be a real boundary, not a checkbox.

The same is true of sessions and permissions. A group admin can invite users and manage a hackathon; a team member can edit their team's code; a visitor cannot. Those rules have to hold on the server, not just in the UI.

## Decisions

- **Native WebSockets over a polling layer.** Real-time collaboration and evaluation progress are part of the product, so the server needed a push channel rather than a timer.
- **Prisma and SQLite.** A small relational schema with migrations kept the data model explicit and the setup reproducible.
- **JWT with sliding sessions.** The client can stay signed in for 30 minutes of activity, then has to re-authenticate.
- **A Docker sandbox with explicit limits.** No network, a read-only root filesystem, a small writable `/tmp`, memory and CPU limits, no Linux capabilities and an unprivileged user.
- **A dependency allow-list.** The project deliberately kept its runtime dependencies small and checked them in CI.

## Outcome

The project delivered a working full-stack platform: accounts and sessions, groups and teams, problem and test-case management, a collaborative editor with a virtual file system, automated Python evaluation, and a leaderboard. It was built and reviewed by a team of four, with a test suite and CI pipeline.

## What I'd do differently

I would treat the sandbox and the access-control model as first-class features from the first sprint, not as a hardening pass near the end. The security boundary is part of the product design, and it is much easier to build around it than to retrofit it.
