+++
date = '2026-06-02T14:51:28+02:00'
draft = false
title = 'GSoC Week 1 Coding Period'
+++

*— "A donde fueres, haz lo que vieres"*

I believe that being able to see something helps a lot with the comprehension
so expect a lot of schemas about what I do from now on.

First, I'll explain what this project consists of in simple terms.

This project is the continuation of Eric Ju's and Calvin Wan's work on
`remote-object-info` for the `cat-file` command *plus* extending it to support
`%(objecttype)`.

## What does `remote-object-info` do?

When you use `git cat-file --batch-command` with `info`, it only queries locally.
If the OID doesn't exist in your local repo it returns `<OID> missing` and
doesn't fetch anything. `remote-object-info` aims to extend this to make fetching
the object metadata remotely from the server viable, without having to download
them beforehand. *Why fetch the full object when you just want its size or type?*

The project goes back to 2021 with [Calvin's protocol v2 extension][1] for
`object-info` and last year [Eric's series][2] that brings that extension up to the
client side at the `cat-file --batch-command`. Eric's work never got merged due
to unresolved issues. Here is where I start.

## What I did this week

Well Git is always very active and from last year until today, a lot has
happened and Eric's series had some conflicts that needed to be resolved before
starting with the project.

I had already started some days ahead of the coding period because I wanted to
resolve all the conflicts to start from day 0 coding and thinking what I have
to do.

The first part of my project consists of addressing the feedback left
from Eric's v11, mostly style, but one important part about how the unsupported
placeholders are handled.

### Static allow-list for remote placeholders

Eric's code used `strstr()` to validate the placeholders, which was not enough.
Unsupported placeholders like `%(objecttype)` [caused segfaults][4] or dies directly.
The idea is to replace this with an allow-list in `expand_atom()` that returns
an empty string for unsupported placeholders, [as Jeff King suggested][3].

I first thought of a simple static list where the supported placeholders were.

**But this static allow-list has a problem**

The backward and future compatibility of this approach is very poor if not
non-existent.

![scheme_a](/staticsheme.png)

This static approach is only reliable if the client and the server support
the same capabilities.

### Dynamic allow-list

![client-server-schema](/client-server-schema.png)

We have to think about the client as an **"all-knower"** it knows every
placeholder option and it can ask whatever it wants and the server as an
**"authority"** that the client has to obey.

So the client is the one who needs to adapt to what the server can provide
without the need of the user to know what the server advertises.

This approach solves the *client vs different servers* making servers that
only support size and future ones that support more options can be fetched
by the same client.

This hasn't been posted on the mailing list yet so it might change. But I really
think this is the right approach, though with the empty strings we now have a
problem: *known but unsupported vs empty data*. Placeholders like `%(rest)` and
`%(objectmode)` can return an empty string, so, how do we differentiate unsupported
placeholders that return an empty string vs the ones which their data is
genuinely empty?
Even if these placeholders are out of the scope currently, they will be implemented
in the future so we have to think about this, as this will be the foundation for
the rest of the placeholders.

---

Also, I still have a pending patch about indentation of visual roots
at `git log --graph`, which I'm giving its final tweaks with the help of my
great mentors Karthik and Chandra but I'll keep this post focused on GSoC.

I enjoy making reviews also, it's really cool to discuss and learn, so I try to
read what is sent to the mailing list.

## What to expect

If this continues, the client could fill the allow-list to handle every
placeholder as if it was local leaving only the server side work to implement
for `%(objecttype)` and the rest of options that will come in the future.

Once we have the client side done, I'll start with the server side to implement
`%(objecttype)`, and who knows, if there is time I want to add more support for
more metadata.

---

I'm having lots of fun already and I'm very thankful to both my mentors
Karthik and Chandra who are very supportive and helpful.

See you next week,

Pablo.

[1]: https://lore.kernel.org/git/20220728230210.2952731-1-calvinwan@google.com/#t
[2]: https://lore.kernel.org/git/20250221190451.12536-1-eric.peijian@gmail.com/
[3]: https://lore.kernel.org/git/20250313060250.GH94015@coredump.intra.peff.net/
[4]: https://lore.kernel.org/git/20250224234720.GC729825@coredump.intra.peff.net/
