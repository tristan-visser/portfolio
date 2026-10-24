---
title: Parallel Othello MCTS
summary: A distributed Monte Carlo Tree Search Othello player in C and MPI, reaching 1.3 million simulations per second at eight processes.
cvSummary: Distributed MCTS Othello player in C/MPI, reaching 1.3M simulations/sec at 8 processes.
role: Coursework project
timeline: Coursework
year: 2026
stack:
  - C
  - MPI
  - Docker
  - Python
status: completed
featured: false
order: 4
cover:
  src: ./images/othello-scaling.svg
  alt: Line chart showing MCTS search speed rising from 432,674 nodes per second with one process to 1,338,165 with eight processes.
  caption: Average MCTS search speed by MPI rank count, from the project's 10-run ensemble (4.0s per move).
---

## The problem

Othello is a small board with a large search space. The project was to build a player that uses Monte Carlo Tree Search to choose a move within a strict wall-clock limit, then parallelise the search across MPI ranks without letting the ranks disagree about the tree or the clock.

The player had to communicate with the provided referee, maintain its own board state, and return a legal move before the time limit.

## What I built

A C implementation of the four-phase MCTS loop: selection with UCT, expansion, a mobility-biased rollout, and backpropagation from the root player's perspective. The tree lives in a flat arena of up to 1,000,001 nodes, with parent and child links stored as array indices rather than pointers, so the hot search loop does not call `malloc` or `free`.

The parallel version uses root parallelisation. Each MPI rank builds its own tree from the same root board, then shares root-child statistics asynchronously through non-blocking `MPI_Isend`/`MPI_Irecv`. Rank 0 blends those statistics into each rank's UCT scores as a virtual prior, and at the end of the turn gathers the authoritative visit counts and picks the move with the robust-child rule. A wall-clock stop flag is broadcast at batch boundaries so every rank exits the search together.

## The hard part

Parallel search is easy to make faster and hard to make trustworthy. The ranks need to share enough information to benefit from each other's work without corrupting their local tree statistics or blocking the search loop on communication. The end-of-turn gather has to be deterministic enough to pick a move, and the time management has to leave enough room for the final collective.

The arena size was the other constraint. An earlier version exhausted its node budget in under a second and left most of the four-second window unused; increasing the arena to one million nodes let the search consume the full budget.

## Decisions

- **Root parallelisation.** Each rank searches independently, with periodic statistic sharing, rather than sharing one tree with locks.
- **Non-blocking MPI in the search loop.** `MPI_Isend`/`MPI_Irecv` with `MPI_Test`-only polling keeps workers from stalling on communication.
- **A flat arena.** Array indices instead of pointers make allocation predictable and keep the hot loop cache-friendly.
- **Robust-child selection.** Most visits wins; ties break on the highest value, then the smallest move index.
- **A mobility-biased rollout.** The heuristic gives the rollout a positional signal, which is why the UCT exploration constant is 1.25 rather than the textbook √2.

## Outcome

The player reached an average of **1.34 million nodes per second at eight MPI ranks** in a ten-run ensemble, with individual runs peaking above 1.7 million. At eight ranks it evaluated over **204 million simulations per turn** and won 100% of its matches against the provided random baseline. The project includes a Docker match runner and a reproducible performance harness.

## What I'd do differently

I would test against stronger opponents earlier, not only the random baseline. A 100% win rate against a random player proves the plumbing works; it does not tell you whether the search is actually making good chess-like decisions under pressure.
