---
title: Electrum Dependency Analysis Framework
summary: A full-stack dependency analysis framework that maps Maven graphs, classifies release breakage, and opens version-bump pull requests in dependency order.
role: Backend developer · Scrum Master
team: Team of six
timeline: Industry project · three sprints
year: 2026
stack:
  - Java 21
  - Spring Boot
  - React
  - React Flow
  - Maven
  - GitHub API
  - GitLab CI
status: completed
featured: true
order: 1
cover:
  src: ./images/pomegranate-ui.png
  alt: Pomegranate web interface showing a Maven dependency graph with library nodes and an inspector panel.
  caption: Pomegranate UI — a real Maven dependency graph with the selected artifact's details.
---

## The problem

In a large Maven ecosystem, one library release can ripple through dozens of artifacts. Semantic versioning is a promise, not a proof: even a patch release can break a downstream build or a test without anyone noticing until the next upgrade. Electrum wanted to know what a release affects, what can be updated automatically, and what needs a developer.

The project ran across three Agile sprints with Electrum engineers, in a team of six. I was the Scrum Master and worked primarily on the backend and analysis pipeline.

## What I built

I worked on the services and analysis path behind the product: scenario loading and graph caching, the breakage analysis pipeline, the REST API, and the report generation that turns build evidence into a verdict. That included the Surefire evidence parser, the semantic-versioning honesty audit, the API surface comparison and the JSON report model.

I also worked on the propagation side: generating the GitHub Packages Maven configuration and least-privilege CI/release workflows, and applying the minimal version-bump edits that let a dependent repository open a reviewable pull request.

The React and React Flow interface was built by teammates; the screenshot above is the application those services power.

## The hard part

The product's core claim is a verdict you can trust. A rebuild alone can lie: a dependency can appear to work because a stale binary is still on the classpath, while an inlined constant or return-type change slips through. Semantic versioning alone can lie too: a patch release can still change behaviour in a way that breaks a consumer's tests.

The team built a build-and-see oracle, then added a stale-binary probe, a bytecode API diff and a usage scan to separate real breakage from false alarms. The final report distinguishes `NOT_AFFECTED`, `SAFE_AUTO` and `NEEDS_HUMAN`, with evidence attached.

Propagation was the other hard part. Updating a graph in memory is not the same as updating a real ecosystem: releases have to be published in dependency order, pull requests have to open only after their dependencies are available, and a red CI run has to block the next wave.

## Decisions

- **Real Maven resolution, not XML parsing.** The team ran `mvn dependency:tree` so property interpolation, scopes and transitive resolution matched what Maven actually does.
- **Evidence, not a single oracle.** Rebuilds, stale-binary probes, bytecode diffs and semver honesty checks all feed the same report instead of pretending one signal is enough.
- **A schema-validated report.** The UI, the pull requests and the tests all consume the same contract, which made the pipeline testable against a known answer key.
- **Human merge, always.** The tool opens pull requests and labels them `safe-auto` or `needs-human`; it never merges on its own.

## Outcome

The project matched all 15 seeded, CI-verified breakage cases. The repository carries 270+ backend tests, a React Flow graph UI, Docker packaging and a GitLab CI pipeline. The team also ran the analysis against real open-source projects, including Jackson, commons-configuration, commons-lang3 and OpenFeign.

The final demo showed the full loop: load a real Maven graph, run an analysis, export repositories, publish baselines, open pull requests in dependency order, and let a human merge.

## What I'd do differently

I would invest even earlier in the stale-binary probe and the semver honesty audit. They were the difference between a convincing demo and a verdict an engineer could actually trust.
