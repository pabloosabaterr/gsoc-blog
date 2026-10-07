+++
title = 'Orn'
description = 'Orn, a range-based systems programming language.'
summary = "A range-based systems programming language. I'm not building it to be useful, but to explore an idea."
weight = 1
[[links]]
  name = 'Repository'
  url = 'https://github.com/pabloosabaterr/Orn-rework'
[[links]]
  name = 'Orn Book'
  url = 'https://pabloosabaterr.github.io/Orn-rework/'
+++

Orn is a range-based systems programming language. I'm not building it to be
useful, but to explore an idea: there are no built-in types. A value is described
by the set of integers it can hold, and the compiler tracks that set through the
program.

```
u8 :: 0..255;

classify :: (i: 0..1000) 0..2 {
    if i < 10 {
        0       // here i : 0..9
    } else {
        1       // here i : 10..1000
    }
};
```

Comparisons narrow ranges at compile time, with no runtime cost. Arithmetic never
overflows silently, because the result has to fit the range you declared, and
names like `u8` are just standard library aliases. The compiler is written in C
and it's still early.
