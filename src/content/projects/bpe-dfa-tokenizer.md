---
title: BPE DFA Tokenizer
summary: A deterministic finite automata engine for BPE subword tokenization, built to parse the token dictionaries used by language models.
role: Solo developer · Theory of Automata
timeline: Coursework
year: 2026
stack:
  - Python
  - Java
  - DFA
  - Regular languages
status: completed
featured: true
order: 3
---

## The problem

Modern language models split text into subword tokens using byte-pair encoding. The project was an automata theory exercise: build the matching machinery from deterministic finite automata and transducers instead of calling a tokenizer library.

## What I built

BPE subword tokenization DFAs and transducers that parse subword byte streams for LLM dictionaries such as GPT-2 and Whisper. I implemented compact delayed-input automata with default-transition optimisations to reduce the memory footprint during pattern matching.

The result is a tokenizer engine that matches real dictionary behaviour while keeping the state machine small enough to be practical.

## The hard part

The token dictionaries are large, and a naive automaton is memory-hungry. The interesting work was representing the same language with fewer states and transitions without changing the matching behaviour, especially around byte streams and the points where a token can end.

## Decisions

- **Build the automata from the token dictionary.** Hard-coding tokenization rules would not have generalised to a different model.
- **Delayed input and default transitions.** The compression matters when the dictionary is large and the automaton is loaded into memory.
- **Test against real tokenizer dictionaries.** Toy strings would not have exposed the edge cases in the byte-level vocabulary.

## Outcome

The project produced a working tokenizer engine and a compact automaton representation, tested against real tokenizer dictionaries.

## What I'd do differently

I would separate the automaton construction from the matching runtime earlier. The two concerns have different performance profiles, and keeping them together made the first round of profiling harder than it needed to be.
