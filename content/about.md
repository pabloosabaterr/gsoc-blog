+++
title = 'About'
description = 'Who Pablo Sabater is and where to find him.'
+++

{{< portrait >}}
Hi, I'm Pablo. I'm a Computer Science and Engineering student at the University of
Murcia, in Spain, spending this semester on Erasmus at NOVA in Lisbon. I like understanding
how things work underneath, and then building my own version to check that I
really did.
{{< /portrait >}}

Most of what I do lives close to the machine: compilers, languages, systems
programming and the tools developers use every day. This site is where I write
about that, and about anything else I want to remember.

## Things I've made

**[Orn](/projects/orn/)** is a systems language
where every type is a range. There are no built-in types: a value is described
by the set of integers it can hold, and the compiler tracks that set through the
program. Inside `if i < 10`, a `0..1000` becomes `0..9` at compile time, with no
runtime cost. Arithmetic never overflows silently, because the result has to fit
the range you declared, and names like `u8` are just standard library aliases for
`0..255`. The compiler is written in C and it's still early; the
[Orn Book](https://pabloosabaterr.github.io/Orn-rework/) has the grammar and the
current design.

**[Git patches](/projects/git/)**, from my GSoC 2026 work on the object-info
protocol and graph rendering. The [final report](/posts/gsoc-2026-final-report/)
sums it up.

## Elsewhere

[GitHub](https://github.com/pabloosabaterr) ·
[LinkedIn](https://www.linkedin.com/in/pablosabaterjimenez/)

Email: <pablo@pablosabater.dev> or <pabloosabaterr@gmail.com>
