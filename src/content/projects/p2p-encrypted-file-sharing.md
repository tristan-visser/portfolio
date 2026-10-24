---
title: P2P File Sharing & RBUDP
summary: A peer-to-peer file-sharing application with hybrid RSA/AES encryption, and a custom reliable UDP protocol benchmarked against TCP.
cvSummary: Encrypted P2P file sharing with a custom reliable UDP protocol, benchmarked against TCP.
role: RBUDP, GUI and experiments · team of four
team: Team of four
timeline: Coursework
year: 2026
stack:
  - Java
  - JavaFX
  - UDP
  - TCP
  - RSA / AES
  - Tailscale
status: completed
featured: true
order: 3
cover:
  src: ./images/p2p-demo.png
  alt: Two P2P file-sharing windows side by side — Alice sharing a folder of files, and Bob downloading one file with progress and pause/resume controls.
  caption: Alice shares a folder; Bob finds and downloads a file directly, with pause/resume progress.
---

## The problem

Moving a file between two peers sounds trivial until the network is unreliable. This project covered two related problems: a transfer protocol that could move a file quickly without giving up reliability, and a peer-to-peer file-sharing application where clients find each other through a server but transfer the file directly.

Both were team projects in CS313 Computer Networks. The work covered the RBUDP transfer layer, the JavaFX clients, the encrypted peer protocol, and the experiments used to compare the design against TCP.

## What I built

For the RBUDP transfer application, I worked on the sender and receiver, file chunking with 32-bit sequence numbers, blast-based transmission, selective retransmission of missing packets, out-of-order and duplicate handling, MD5 integrity checks, and the JavaFX progress interface. I also worked on the experiments that compared throughput, packet size and packet loss behaviour against TCP.

For the peer-to-peer file-sharing application, I worked on the backend and the report. The server registers clients and brokers introductions but never stores file lists or sees file contents. Search results are aggregated through the server, while downloads happen over a direct peer-to-peer TCP connection.

The security model uses hybrid RSA + AES encryption: a per-download AES message key is encrypted with the uploader's RSA public key, forwarded by the server without being readable, and then used to encrypt the file chunks. The server is an introduction service, not a trusted party that can read the data.

## The hard part

Reliability over UDP without giving up the reason for using UDP. The protocol has to handle lost packets, out-of-order delivery, duplicates and peer disconnects, and selective retransmission only works if the receiver is precise about what it actually has.

The peer-to-peer side has a different hard part: making the server useful without making it powerful. It has to introduce peers and route searches, but it should not know who has which files or be able to read a transfer. That constraint shapes the protocol, the encryption and the trust model.

## Decisions

- **UDP for data, TCP for signalling.** The data path benefits from UDP; the control path benefits from TCP's ordering and reliability.
- **Selective retransmission.** Resending the whole file after a loss would throw away the throughput advantage.
- **Hybrid RSA + AES.** RSA exchanges the per-download key; AES encrypts the file chunks. The server forwards the encrypted key without being able to read it.
- **Measure the design.** The project included experiments for TCP vs RBUDP throughput, transfer rate, packet size and packet-loss behaviour, rather than relying on intuition.

## Outcome

The project delivered a working RBUDP file-transfer application and a peer-to-peer file-sharing application, built by a team of four. The experiments compared the protocol against TCP and documented how packet size and loss affect the result.

## What I'd do differently

I would instrument the protocol from the first version, not after it worked. Packet loss and retransmission behaviour are much easier to reason about when the measurements are part of the implementation, not a separate exercise at the end.
