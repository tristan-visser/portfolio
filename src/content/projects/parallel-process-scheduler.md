---
title: Parallel Process Scheduler
summary: A multi-threaded CPU scheduler in C and OpenMP with IPC mailboxes, graph-based cycle detection and deadlock prevention.
role: Coursework project
timeline: Coursework
year: 2026
stack:
  - C
  - OpenMP
  - Linux
  - Multi-threading
status: completed
featured: false
order: 7
---

## The problem

Scheduling looks like a queue until multiple processes need to share resources without deadlocking. The project was to simulate priority, round-robin and first-come-first-served scheduling while handling the coordination problems that appear once processes can wait on each other.

## What I built

A multi-threaded scheduler in C using OpenMP to simulate Priority, Round-Robin and FCFS resource allocation. I implemented inter-process communication mailboxes and graph-based cycle detection for deadlock prevention, then worked through the synchronisation bottlenecks that showed up under load.

## The hard part

The scheduler is only correct if the coordination is correct. The hard part was keeping the resource graph and the process state consistent while threads were making progress, and finding the synchronisation bugs that only appeared under specific interleavings.

## Decisions

- **C and OpenMP.** The project needed direct control over threads and shared memory, not a managed runtime.
- **Mailboxes for IPC.** They gave the scheduler a clear message boundary instead of sharing more state between processes.
- **Cycle detection before allocation.** Checking the resource graph before granting a request prevents the deadlock instead of recovering from it.

## Outcome

The project produced a working multi-threaded scheduler with the three scheduling policies, IPC mailboxes, and deadlock detection.

## What I'd do differently

I would build a deterministic test harness for the interleavings before optimising anything. Concurrency bugs are much easier to reproduce when the scheduler's decisions are recorded and replayable.
