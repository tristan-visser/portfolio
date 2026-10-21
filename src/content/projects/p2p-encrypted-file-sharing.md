---
title: P2P Encrypted File Sharing
summary: A peer-to-peer file-sharing desktop app with a custom reliable UDP protocol, TCP signalling and end-to-end encryption.
role: Solo developer · Computer Networks
timeline: Coursework
year: 2026
stack:
  - Java
  - JavaFX
  - UDP
  - TCP
  - End-to-end encryption
status: completed
featured: true
order: 2
---

## The problem

Moving a file between two peers sounds trivial until the network is unreliable. The project was to build a peer-to-peer file-sharing application that could transfer files directly between machines, keep the contents private, and stay reliable without falling back to a central server.

## What I built

A JavaFX desktop application with peer discovery, socket lifecycle handling, and end-to-end encryption. The transfer layer uses a custom RBUDP protocol: UDP data blasts for throughput, with TCP signalling for reliable selective retransmission.

I also built the benchmark used to compare the protocol against the alternatives, so the design decisions were measured rather than assumed.

## The hard part

Reliability over UDP without giving up the reason for using UDP in the first place. The protocol had to handle lost packets, out-of-order delivery, peer disconnects and the boundary between signalling and data transfer. Getting selective retransmission right meant being precise about what had actually been received, not just what had been sent.

## Decisions

- **UDP for data, TCP for signalling.** The data path benefits from UDP; the control path benefits from TCP's ordering and reliability.
- **Selective retransmission.** Resending the whole file after a loss would have thrown away the throughput advantage.
- **Encryption at the application layer.** Peers should not have to trust the network to keep the file private.

## Outcome

The project produced a working peer-to-peer file transfer application and a benchmark of the RBUDP protocol against the alternatives.

## What I'd do differently

I would instrument the protocol from the first version, not after it worked. Packet loss and retransmission behaviour are much easier to reason about when the measurements are part of the implementation, not a separate exercise at the end.
