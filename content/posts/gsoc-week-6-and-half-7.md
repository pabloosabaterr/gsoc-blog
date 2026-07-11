+++
date = '2026-07-10T23:49:31+02:00'
draft = false
title = 'GSoC Week 6 and Half 7'
+++

—*"Poco a poco se anda lejos"*

This week I was at a campsite for a few days, but that doesn't mean that I stopped :).

![me coding at a campsite](/images/camping.jpeg)

It is already the *mid term evaluation*, this means that we are half done with
the project time.

I strongly think that I will be able to finish the whole project on time and
even have some extra time to work on an idea I have related to my GSoC
project

I'm waiting for the Goal 1 series which is finishing the end to end of the
object-info protocol and the %(objectsize) placeholder. Once this series is
at least on "next" I will send the next one which is the %(objecttype)
support. This series will have a much more fast pace because it is muuuuch
smaller than the Goal 1 series.

## %(objecttype) support series

Because the object-info protocol infrastructure is already built from the Goal
1 series this only has to focus on gathering the type and parsing it.

If you want to compare Goal 2 series is *~150* lines vs the *~1000* lines of
the Goal 1 series.

at `protocol-caps.c` only size was supported and to get the size, `odb_read_object_info()`
is called and size gets filled through a pointer, but the return type was actually the
type.

We can also know through the type if the object is not recognized by the server in case
of the type being <0.

```c
    strbuf_addstr(&send_buffer, oid_str);

    object_type = odb_read_object_info(r->objects, &oid, &object_size);
    failed = object_type < 0;

    if (failed) {
        strbuf_addch(&send_buffer, ' ');
        goto write;
    }

    if (info->size)
        strbuf_addf(&send_buffer, " %"PRIuMAX,
                    (uintmax_t)object_size);

    if (info->type)
        strbuf_addf(&send_buffer, " %s", type_name(object_type));
```

After that we just need to append to the buffer the type if it was asked. This was
a very trivial change. The overhead is barely anything but at most 6 extra bytes
from the "commit" string appended to the buffer.

That's why I think that the hard part of the project is not actually the coding
but rather knowing what everything around it means.

At the project description it was explicitly said to be cautious about the backward
compatibility and I thought of four different cases:

1. **The server doesn't support type (updated client but old server):**

   After we get the server capabilities, the client sees that's type is not
   advertised, filters out type from the request if it was asked by the client
   and returns an empty string where the type would be.

2. **The server supports type but the client doesn't (updated server but old client):**

   The client would get the server capabilities where type will show, I chose
   to let the client know type for testing purposes on the Goal 1 but the client
   doesn't know how to parse the type capability.

   So as far as the client knows type is never advertised and will only ask for
   what it knows. What it doesn't know results in an empty string.

3. **Both support type (everyone is updated)**

   Everything works as expected, the client asks for the type the server supports it
   and sends it.

4. **Both support type but a middleware strips type:**

   This might happen but it will become case 1. or 2. depending of which side
   is affected by the middleware:

   - In case of affecting the client, the client can't ask for type and the
     server won't get the type request.

   - In case of affecting the server, the client never gets the type capability
     advertised and the client never asks for it.

What makes the client-server object-info protocol robust is that is negotiation
based, the server advertises and the client always adapts to what the server
can provide, no one assumes anything.

After this series, we need to discuss the need of supporting more placeholders
like %(deltabase), %(size:disk), %(objectmode)... These options, delta and disk
size, I think that they are not useful to be supported

**why?**

Because the delta or the disk size that you retrieve from the server are not
reliably the exact same that once fetched onto your local.
others like %(objectmode) need Tree context which is not even thought of yet
for the object-info protocol.

The only intrinsic metadata that doesn't change once fetched is size and type.
That's because size and type are object properties while delta and disk size
depend on the way they are packed or your local objects.

Implementing their support is not hard, is just the same as type, but the hard
part is to justify their support and usefulness.

---

However I have not only worked on the GSoC project during these six and a half
weeks I have another series active and I have started with a sketch for my
idea after the project.

## Graph indentation series

This series comes from the bonding period it ended up being messier than
what I initially thought that it would be but now is close to be done.

Before this series graphs had a warning: "vertically adjacent commits DO NOT
mean that they are related" and now after it this rule makes it that vertically
adjacent commits are always related.

Because we are talking about graphs, some visual examples will help:

```
* A
* A
 \
  * A
* B
* B
```

A and B are two unrelated branches that would be rendered in the same column,
this has the problem that you would be confused to know if A and B are related
if you saw them like:

```
* A
* B
```

Now the last commit of a branch that it is a visual root, that means, that it is
an actual root or a commit that looks like a root (have its parents filtered out)
will be indented to remove the ambiguous graph.

```
  * A
* B
```

A bigger example could be with two unrelated branches with merges:

```
*   C
|\
| * D
| * D
|/
 \
  * C <- indented
*   A
|\
| * B
| * B
|/
* A
```

This series has become tricky because there are a lot of edge cases to care about.

## Extending other commands with object-info protocol

Now that after Goal 1 we will have the infrastructure for making object-info
requests from the client many commands could make use of it. For example
what I thought is `git backfill`, I'm not a git backfill user, the biggest
project I've coded at is Git, but I believe that if you use `git backfill` is
because you work at something massive and you care about the size and you may
be interested in an option to preview what will happen after backfilling:

I want to add a `git backfill --dry-run` option for that purpose.

To make it output how many objects will be fetched is easily done because the number
is already known by the current infrastructure, we just need to make the path
where we avoid fetching and we print the preview.

The interesting part is mixing it with object-info to know the total size of those
objects. Sadly the total size may not be the actual size once fetched because of the
deltas and disk size that depends on your local but it works as a limit, we can be sure
that it will not be more than the total size.

To make this possible some of the logic of the transport setup needs to be extracted
from 'cat-file.c' `get_remote_info()` so other commands can reuse it.

Some things that I should care of but I don't really know how to take care of them
is:

For `remote-object-info` the maximum number of OIDs to be sent in a single request is
10k this was previously chosen before I got into the `remote-object-info` series but
should we respect this? given that `git backfill` nature is to be used in massive
repositories is 10k enough to not become dozens if not hundreds of requests?

After adding the --dry-run option it will look similar to:

```
$ git backfill --dry-run
After backfill X objects would be fetched (Y total size)
```

These are the four series I'm working on currently. I wanna try `git worktree`
to be more chill about swapping between them but I haven't done it yet.

I usually work at one, then push it to run CI tests, work for an hour on another branch
or so while the tests run and then come back. I can sometimes be forgetful or get
distracted easily so I bought a small notebook to take notes for when I get back
to it.

---

I think that the work left to do for the remaining GSoC time is:

- For Goal 1 series:

  Send rerolls faster because I think it's close to be done and this series is
  gatekeeping the %(objecttype) support series and the backfill --dry-run series
  because they both depend on the object-info infrastructure.

- For %(objecttype) support series:

  I think this one is very simple there's not much else to do but once at
  the mailing list I'm sure that there will be something to discuss.

- For the graph indentation series:

  Same as Goal 1 series, it is close to be done, keep making fast rerolls and
  addressing the feedback quickly.

- For the backfill --dry-run series:

  I haven't finished this series yet, I have only up to printing the number of
  objects that will be fetched and extracted the transport logic but it lacks
  the integration with object-info to retrieve the total size.


See you next Thursday 16th :)).
