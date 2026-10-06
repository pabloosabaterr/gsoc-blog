+++
title = 'GSoC 2026 with Git'
date = 2026-08-24T20:27:00+02:00
description = 'A look back at my Google Summer of Code 2026 at Git: remote-object-info in cat-file, %(objecttype) support, graph indentation and the people who made it possible.'
tags = ['gsoc', 'open-source']
projects = ['Git']
toc = true
+++

> **Note**
>
> This is a quick look at the work done. I suggest getting into the threads of the two
> series, reading my [blog](https://pablosabater.dev) or my [proposal](https://pablosabater.dev/proposal.pdf) if you want more detailed information.
> I consider this a more intimate writing recapping what I did this summer.

## Complete and extend the remote-object-info command for git cat-file

Sometimes it is only needed to know something *about* an object, its size, its type, etc.
Before this project, it was not possible to know that without downloading it. Git's
v2 protocol had a server-side `object-info` capability since 2021, but no client used it.

This project finishes that. `git cat-file --batch-command` now understands a `remote-object-info` command that asks a remote for object metadata over the v2 protocol
and prints it, without downloading it.

Two patch series came out of the summer:

| Series | Patches | Final iteration | Status |
| --- | --- | --- | --- |
| [`cat-file: add remote-object-info to batch-command`](https://lore.kernel.org/git/20260724-ps-eric-work-rebase-v21-0-ba67f024fdff@gmail.com/) | 13 | v21 | merged into `master` |
| [`cat-file: extend remote-object-info to support %(objecttype)`](https://lore.kernel.org/git/20260808-objecttype-support-v6-0-e5cdaf27a49c@gmail.com/) | 10 | v6 | will merge into `master` |

---

## About the project

### About `cat-file` and `object-info` protocol

`git cat-file` prints information about objects in a cloned repository locally, you can get lots of
information such as the size, type, size:disk, delta. But it had no way of gathering that information from a remote,
you had to download that object beforehand using `git cat-file`.

Protocol v2 already had the server half of this. Support for answering object
size requests landed in `a2ba162cda` (object-info: support for retrieving object
info, 2021-04-20). What was missing was any client that used it.

### Prior work

This project continues the work of Calvin Wan and Eric Ju. They introduced `remote-object-info` into `cat-file`, but the work had stalled and wasn't ready yet. The code worked in the ideal path
but lacked proper supported handling, the transport was piggy-backing on fetch and there were some
logic issues.

### The problem

Well, there was a lot of previous work done. This has been a multi-GSoC project,
and I had to rebase everything up to today's `master`. Some things were easy and some
were not, especially the ODB-related code, as there had been a lot of refactoring
related to ODB code, a lot of functions moved, and whole files removed.

### The goal

Get `remote-object-info` merged with `%(objectsize)` working end to end, then
extend it to support `%(objecttype)` as well.

> You can see more about the problems if you read my blog or my proposal.

---

## What was implemented

### Goal 1 series: `remote-object-info` in `--batch-command` (v21, 13 patches)

Completes Eric's work and gets it to `master`.

The main contribution on top of the inherited series is a rework of placeholder
validation: instead of a hardcoded list, an allow-list is used to filter what it
supports instead of accepting the same placeholders as local. Also, with this allow-list,
placeholders known in local but unsupported by the remote will return an empty string, as suggested by Jeff King.

The idea of the allow-list evolved to a list that initially accepts everything but once the
connection with the remote is established, the remote returns what it supports, and after
receiving it, the client would trim the allow-list to only contain what the server supports.
Later on, when printing the data, the requested data that had no match in the allow-list meant it
was unsupported and therefore an empty string is printed.

This series was originally intended to be client-side only, but it was decided to add a server-side
patch where we would allow a request without attributes such as size, type, ... This would
serve as an existence check.

<https://lore.kernel.org/git/20260724-ps-eric-work-rebase-v21-0-ba67f024fdff@gmail.com/>

### Goal 2 series: end-to-end for `%(objecttype)` (v6, 10 patches)

Type was the next attribute that we wanted to add support for. I thought at first that
after type the rest would follow the same path, but after working on it, I realized that
the rest of the attributes depend on how the object is packed; they are not intrinsic
to the object. So we discarded support for them.

This series relies heavily on the previous one *obviously*, but I didn't want to make it **just** work.
Of the 10 patches, 6 are preparatory patches that clean, trim ambiguity and fix
the current work.

This series extends the object-info protocol to support the type attribute, and handles it both on the server
and the client: advertising it, parsing it, sending the data, ... To later, in the last patch, unify the
default format to match the local `info` command one.

For this patch I could count on the expertise of Jeff King and Junio, who noted that the use of an array of
object_info was not good. This structure is used to mark what the user wants to get and to later hold the
object being printed, so using an array of it breaks the intended use of it. Instead, this new structure
was created:

```c
struct fetch_object_info_results {
	size_t *sizes;
	enum object_type *types;
	uint8_t *unrecognized;
	size_t nr;
	unsigned wants_size:1;
	unsigned wants_type:1;
};
```

Instead of having the indirections of having to allocate object_info and then for each field, we have the data contiguously in its own attribute array, we also split from using object_info marked pointer to bit fields that mark what the user wants.

<https://lore.kernel.org/git/20260808-objecttype-support-v6-0-e5cdaf27a49c@gmail.com/>

### Backward compatibility

The server-side needed to have backward compatibility with the 2021 work, and we
also had to think about different client versions and different servers:

- the client knows it but the server does not (new client vs old server)
- the client does not know it but the server does (old client vs new server)
- both know it (everyone is new)
- neither knows it (unsupported capability)

---

## Learning from git

Well, TBH it has been a very rewarding experience. I've learned a lot and imma skip the
obvious: better logic, a broader perspective, etc.

- I learned how to work on a mailing list and with people. I always code alone, so this was
  a new experience for me.
- I learned how git works under the hood.
- I went through review loops and learned to review other people's code.
- I learned protocol stuff, like not being ambiguous (yes, I know that it is obvious). This comes
  from the number parsing function: I made a function that was too broad, you could parse HEX
  when there was no need, we only wanted to parse the size in base 10.

## Could it have been done better?

Hummmmm, yes I do think that. I have two itches. The first is the object-info protocol, having to rely
on the previous protocol and not starting from the beginning of it made the protocol with type look like:

```
command=object-info
object-format=$(test_oid algo)
0001
size
type
oid $two_oid
oid $two_oid
0000
EOF
```

The new line after size, although not something to cry about, ideally should be `size type` on the same line.

```c
struct fetch_object_info_results {
	size_t *sizes;
	enum object_type *types;
	uint8_t *unrecognized;
	size_t nr;
	unsigned wants_size:1;
	unsigned wants_type:1;
};
```

For this same data structure mentioned before, unrecognized could be optimized to be a true bit array, instead of wasting 7 bits for each one.

## How do I plan to keep working

Right now I have the idea to add the `dry-run` option for `git backfill`, the object-info protocol could be used to fetch
the size of those objects to give the user the number of objects to be fetched with an estimate of the size that they will
take.

I have also read that it could be interesting for VFS, but for that, sadly, I'm completely ignorant and I will have to study it.

## Not just GSoC

This summer I didn't just make the project, in fact I worked on other areas such as the graph one. I really like this one because what I did was very visual and cool looking:

`git log --graph` had a problem with visual roots that made the graph *sometimes* ambiguous, as two completely unrelated commits could be rendered one below the other seeming that they are related when in reality they are not:

The idea is to indent/shift the visual roots that can cause that given ambiguity, fixing a long-known rule: *vertically contiguous commits don't have to mean a relation between them*.

Before indentation:

```
* A
* B1
* B2
* C1
* C2
```

After indentation:

```
  * A
* B1
 \
  * B2
* C1
* C2
```

You can see more about how this works at:

<https://lore.kernel.org/git/20260714-ps-pre-commit-indent-v12-0-d50938e006df@gmail.com/>

---

And lastly, at the end of this GSoC period I wanted to do a favour for the next contributors that come to
Git and maybe not that new but curious, a tool called [WhatToGit](https://github.com/pabloosabaterr/WhatToGit)

This tool gathers all the markers in the codebase such as `TODO`, `NEEDSWORK`, etc., and `#leftoverbits` on the mailing list into documents so it is easier to know literal pieces of wanted work.

---

This is the part for which I wanted to write this whole thing instead of just sending a link
to the work.

I cannot express how grateful I am to Karthik and Chandra. This summer has been "un antes y un
después" for me, a turning point forward. They have been great mentors and have helped me as much
as I needed. More than that, they have been friends this summer.

I consider myself to be very intense and passionate about what I do, so I was worried about spamming too
much, talking too much, etc. Those are things I tend to do when I'm nervous. I liked that they had
no problems with it. (Also, my idea brainstorms at 3am have been for the good.)

I also want to be thankful to Tian Yuchen, another GSoC contributor this summer along with me at
Git. He's been someone I've talked to a lot throughout this summer and I'm sad that I won't be
seeing him at the Git Merge this year, maybe one day.

I also want to thank everyone who has reviewed my work or helped in any way, and Paco, my friend who told
me about GSoC.
