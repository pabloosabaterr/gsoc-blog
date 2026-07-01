+++
date = '2026-07-01T14:34:54+02:00'
draft = false
title = 'GSoC Week 4 & 5 Coding Period'
+++

—*"A dios rogando y con el mazo dando"*

The first part of the project which consisted of finishing what Eric Ju
started, adding `remote-object-info` to `--batch-command` on `git cat-file`.
We started with a v11 and we are at a v15 currently, where things are actually
working.

It's close to midterm so let's do a quick summary of how this first part works:

## What does `remote-object-info` do?

Sometimes you want to know metadata about an object but you do not like having
to download them. The server support for object-info was already merged in 2021
with the `object-info` capability in v2 protocol but there is no client-side
implementation currently.

That's where we come in with our new `remote-object-info`, this new command will
let you query remotes for object info, similar to what you can do locally with
`info`.

The way you would do this is:

```
$ git cat-file --batch-command="%(objectname) %(objectsize)"
  remote-object-info "https://example.com/repo" <oid>
```

## Where did I start and what has been done

Eric and Calvin made the foundation: the transport, the plumbing, the protocol
handshake, etc. Their work covered most of the end to end for the client side
and `%(objectsize)` atom.

However there were things to work at before calling it a day:

1. Segfault on uninitialized data. Atoms like `%(objecttype)` were recognized by
   `expand_atom()` but the remote never gave data for them.

2. Local queries were being blocked. Unknown atoms returned with 0 and died
   killing the whole process even if other commands like `info` could handle
   those placeholders.

My first fix (talked about in previous posts) was to add a static allow-list.
A hardcoded array of supported atoms, so when we were in "remote" mode we
would check this list, unsupported atoms return 1 with an empty string.

But as we talked about this hardcoded solution didn't quite complete the job
as good as I wanted. It works today because the only option is a server
supporting object-info with size or it doesn't support it at all.

**But what about the future?**

We need to think about cases like a server with a version that supports size
and a version that supports size + more metadata. Then how do we handle these?
we need to support up to what the newest server supports but if we allow the
client to request metadata that it does not support we end up failing.

What I needed for the solution was already there, on the handshake, the server
tells us already the metadata that object-info supports. Knowing this we
jump to the last commit of the series:

Making the allow-list dynamic.

Knowing what the server supports, we filter what the client asks to only
request to the server what it supports. If we end up having nothing to
request we can completely skip requesting the server.

## What do we have to do to support %(objecttype)?

The process after the allow-list has become very trivial, we need to teach
the server how to get the metadata that it needs, how to advertise it and
for the client, teach it how to parse the server response and add our new
atom to the allow-list.

## How will the object-info protocol look?

For the more formal guys this is how I plan to leave the object-info
protocol:

The response of object-info is a list of the requested object ids and associated requested information, each separated by a single space.

```
output = info flush-pkt

info = PKT-LINE(attrs LF)
       *PKT-LINE(obj-info LF)

attrs = attr | attrs SP attrs

obj-type = "blob" | "tree" | "commit" | "tag"

obj-size = 1*DIGIT

obj-val = obj-size | obj-type

attr = "size" | "type"

obj-info = obj-id SP [obj-val *(SP obj-val)]
```

If the server does not recognize the object id, the response will be obj-id SP
regardless of the number of attributes requested.

## What I've learned

Well, when I started all my code was a solo-job this means I used the PRs
because I knew it was the "correct" way and I felt cool like "oh wow, this
looks like a real job".

Working with Karthik and Chandra has taught me a lot, **consistency matters
a lot** and have I said that **consistency matters a lot**?
Most of my doubts were answered with:

*What do other relevant areas do?*

I learned to read code and understand it faster, working solo, (unless you
turbo vibe code things) you know all the codebase, so having to work on an already
started series has made me read code that I didn't write nor I was familiar with,
and that's without talking about that I had to bring this series up to master
dealing with conflicts.

These are things that were new to me.

I've had to "learn" how to investigate about how the things I'm dealing with
work, read others' series to understand their changes and how they
affect my series.

Now I think that if I had to start over again, it wouldn't take me as long as it
took me on the first time.

I'm still "wow" with how others on the mailing list are able to review and
understand code as fast as they do, that makes me want to improve to get to their
level.

## What will come next?

I think everything's going as the timeline expects. Hopefully the first part gets
the OK this v15, maybe a v16 because of some nits, but it's close to being "done".

After that the next series is the end to end `%(objecttype)` support which after
the first series which is big, this second one is far smaller.

If there is time to do more we would need to discuss some things:

1. Are more atoms like `%(size:disk)` worth implementing? I'm not saying that
   implementing them is challenging, it's the exact same process as the one
   done for `%(objecttype)`. But other atoms and their metadata are server-intrinsic,
   What I mean is that it is metadata that once fetched it will change,
   differently from name, size and type the rest of them are not guaranteed to
   be the same after being fetched.
   If the motivation is to check before fetching for example, why would we
   want to check something that will become meaningless.
   I'm just not sure about them.

2. Firstly, I'm not a `git backfill` user but I saw a series about it some
   months ago and thought that this `object-info` infrastructure that we are
   building here could be used for a `git backfill <path> --dry-run` option.
   It would work similarly but instead of fetching the missing blobs it would
   tell you how much space it would take and how many blobs would be fetched:

```
$ git backfill src/ --dry-run
  backfilling src/ would take 47 MiB and would fetch 50 blobs
```

## Apart from GSoC

I still feel a bit intimidated by the mailing list, even if I now like it, I still
feel that what I send needs to be serious and perfect (even though I make the
most stupid mistakes like failing to remove cc from trailers)

I've been talking with Yuchen, another GSoC at Git contributor and he's very
nice. *Now I can send him CS memes* ;)).

We talked about our GSoC projects and a project I have which is a search
engine for git's commits using singular value decomposition. I have to study
some more linear algebra to implement the known optimizations but I like the
idea where it is going.

I also want to see Siddhart and Jayatheerth at Lisboa where Git Merge will
be held.

These last weeks I've been busy with the paperwork of Erasmus because my next
year I'll be studying abroad at Lisboa for a whole year.

I also want to start grinding LeetCodes to get better at DSA and algorithms.

---

Well, see you next week with more about my GSoC journey. As always any idea,
feedback or opinion is always welcome.


