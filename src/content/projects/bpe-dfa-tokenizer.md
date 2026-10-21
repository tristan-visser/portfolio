---
title: BPE DFA Tokenizer
summary: A BPE tokenization DFA and compact delayed-input automaton, with differential tests, benchmarks and two theoretical extensions.
role: Pair project · implementation and evaluation
team: Pair
timeline: Coursework
year: 2026
stack:
  - Python
  - Java
  - DFA
  - Graphviz
  - pytest
status: completed
featured: false
order: 4
cover:
  src: ./images/bpe-compact.svg
  alt: Compact delayed-input deterministic finite automaton for a BPE tokenizer, with numbered states and token transitions.
  caption: Compact delayed-input DFA for the Palermo BPE dictionary.
  narrow: true
---

## The problem

Modern language models split text into subword tokens using byte-pair encoding. The canonical tokenization of a string is determined by the order of the merge rules, and for a proper BPE dictionary that set of tokenizations is a regular language. The project was to build the matching machinery from deterministic finite automata and transducers, rather than calling a tokenizer library.

It was a pair project for CS345. The brief asked for a baseline token DFA, a tokenizer transducer, a compact delayed-input automaton, correctness evidence and controlled experiments.

## What I built

The project implemented a merge-dictionary parser and validator, two canonical reference tokenizers, the baseline token-DFA construction, a compact delayed-input automaton with the four optimisations from the literature, and a string-to-tokenization transducer. We added Graphviz and JSON export, a command-line interface, and two extensions: deciding equivalence between BPE dictionaries with a counterexample, and token-level pattern matching over a token stream.

The test suite covers the parser, both automata, the transducer, the extensions, property-based checks and a set of pathological cases. The final suite reports 547 passing tests.

## The hard part

The token alphabet grows with the dictionary, and a dense automaton can contain far too many transitions to be practical. The interesting work was preserving the same language while representing it with fewer states and transitions: delayed input, default transitions, clean-copy reuse and compressed reject transitions. The compact machine is only useful if it is still equivalent to the baseline, so every optimisation had to be checked against a product-automaton equivalence test.

The other hard part was evidence. The project needed differential tests against independent reference tokenizers, exhaustive bounded tests, property-based tests and measurements, not just a demo that tokenized one string.

## Decisions

- **Build the automata from the dictionary.** Hard-coding tokenization rules would not generalise to a different model.
- **Correctness before compression.** Every compact variant is compared to the baseline with a product-automaton equivalence check.
- **Measure the representation, not just the output.** The benchmarks cover states, transitions, construction time, memory and tokenization throughput on GPT-2 and Whisper dictionaries.
- **Two extensions instead of one shallow feature.** Dictionary equivalence and token-level pattern matching both exercise the automata rather than sitting beside them.

## Outcome

The project delivered a working baseline DFA, a compact delayed-input automaton, a subsequential transducer, two extensions, a 547-test suite and a benchmark suite with reproducible results and figures. The compact construction matches the baseline while using fewer explicit states and transitions.

## What I'd do differently

I would separate the automaton construction from the matching runtime earlier. The two concerns have different performance profiles, and keeping them together made the first round of profiling harder than it needed to be.
