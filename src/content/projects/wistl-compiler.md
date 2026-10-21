---
title: WISTL Compiler
summary: A compiler for WISTL, a small LL(1) teaching language, from scanner and parser to type checking and JVM class-file generation.
role: Coursework project
timeline: Coursework · 2025
year: 2025
stack:
  - C
  - JVM
  - LL(1)
  - EBNF
  - Make
status: completed
featured: false
order: 8
cover:
  src: ./images/wistl-pipeline.svg
  alt: WISTL compiler pipeline from source through scanner, LL(1) parser, symbol table and type checker, JVM code generation, to a class file.
  caption: The compiler pipeline — scanner, LL(1) parser, type checker and JVM code generation.
---

## The problem

WISTL is a small imperative teaching language with a proper grammar, types, arrays, functions and procedures. The project was to write a compiler for it in C: read a source file, check it, and produce something the JVM can actually run. The interesting part is not a single stage; it is making the whole pipeline agree on what a program means.

## What I built

The compiler covers the full pipeline: a scanner that turns source into tokens, an LL(1) recursive-descent parser that builds the syntax tree, a hash-table symbol table, a type checker that validates expressions, statements, arrays and function or procedure calls, and a code generator that emits JVM class files.

The project also has a command-line compiler entry point, structured error reporting and the supporting build and test scaffolding needed to work through the compiler in stages.

## The hard part

Type checking is where a compiler stops being a parser. The checker has to distinguish scalars from arrays, functions from procedures, and a call with too few arguments from a call with too many. It has to catch unknown identifiers and duplicate definitions, and it has to do all of that while keeping the error messages useful enough that a student can fix the program.

The code generator has its own set of constraints: a JVM class file has a constant pool, bytecode offsets and a stack model, and the compiler has to keep them consistent while generating code for expressions, control flow and calls. Writing that in C adds the usual memory-management discipline.

## Decisions

- **C, not a managed language.** The project was deliberately close to the metal: manual allocation, explicit data structures and no runtime safety net.
- **LL(1) recursive descent.** The grammar is designed for it, and a hand-written parser makes the error messages and the type-checking hooks easier to control.
- **A hash-table symbol table.** Scope and lookup are central to the type checker, so the symbol table is a real data structure rather than a linear list.
- **JVM class files as the target.** The output is executable, not an interpreter's internal representation, which forces the code generator to respect a real bytecode format.
- **Incremental stages.** Scanner, parser, type checker and code generator were built and tested in sequence, so each stage had a stable contract before the next one depended on it.

## Outcome

The project delivered a working compiler that scans, parses, type-checks and generates JVM class files for WISTL programs. It was the main project for CS244 and the first time I had to make an entire language pipeline fit together end to end.

## What I'd do differently

I would build a golden-file test harness for scanner and parser errors before starting the code generator. Compiler errors are the interface a user sees most often, and it is much easier to keep them consistent when the expected output is part of the test suite from the beginning.
