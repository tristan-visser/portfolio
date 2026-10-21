---
title: Electrum Dependency Analysis Framework
summary: A graph-based dependency engine that detects breaking API changes across repositories and opens pull requests for affected dependents.
role: Backend developer · industry project
timeline: Industry project
year: 2026
stack:
  - Java
  - REST APIs
  - GitHub API
  - CI/CD
  - Agile / Scrum
  - Semantic Versioning
status: completed
featured: true
order: 1
---

## The problem

When a library changes its public API, the repositories that depend on it can break without anyone noticing until a build fails or a release goes out. Electrum wanted a way to map those dependencies and surface the breakage earlier.

The project ran across three Agile sprints with Electrum engineers, so the work had to fit an existing engineering process, not just produce a demo.

## What I built

I worked on a Java dependency graph engine that models repositories and their dependencies, detects breaking API changes, and triggers automated GitHub pull requests for the affected repositories. The engine updates its in-memory graph incrementally and runs as part of CI change propagation.

The result is a workflow that turns a dependency change into a reviewable pull request in the repository that needs to respond to it.

## The hard part

The graph is the easy part to draw and the hard part to keep correct. Dependencies change, versions move, and a version bump is not the same thing as a breaking API change. The engine had to distinguish a real break from a change that does not affect the public surface, then avoid opening noisy pull requests for repositories that are not actually affected.

## Decisions

- **Incremental graph updates.** Rebuilding the graph on every change would have been simpler to write and much slower to run. The engine applies changes to the existing graph instead.
- **GitHub pull requests as the output.** The result lands in the workflow engineers already use, with the change, the reason and the affected repository in one place.
- **CI as the trigger.** The analysis is part of the change propagation path rather than a separate tool someone has to remember to run.

## Outcome

The project delivered a working dependency graph engine and an automated pull-request flow, developed and reviewed with Electrum engineers over three sprints.

## What I'd do differently

I would spend more time on the "is this actually breaking?" classifier before building the pull-request automation around it. The quality of the signal matters more than the speed of the notification.
