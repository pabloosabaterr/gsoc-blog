+++
date = '2026-06-09T20:07:19+02:00'
draft = false
title = 'GSoC Week 2 First Feedback Round'
+++

*— "No por mucho madrugar amanece más temprano"*

This week I finally sent what I consider my first version to the mailing
list, well technically it's **v12**, but it's the first one for me.

## Getting to v12

The process was more tedious than what I expected, not because of the code itself, but
because I'm starting from someone else's commits and it hits different
than starting from scratch. When it's my own patch I know what to
do but here it was reading what was done and the feedback from previous versions.

Karthik gave me his first private review of last week's work and I started working
on it.
Saturday night I almost lost half my changes... it wasn't very funny at that
moment but my face after realizing I had obliterated half the rebase by mistake
must have been worth to see.

At the end, starting from 8 commits we landed on 12, wanting to keep it concise and
focused on end-to-end support for `%(objectsize)`. The commits I added are:

- A memory leak fix.
- Splitting a move + refactor into two separate commits.
- My two commits for the allow-list.

## What do we have now

If you read last week's post, this is (very simplified) how it's behaving now:

![simple-schema](/simple-schema-week-2.png)

The client asks for size and type, the server only supports size, so it returns
the size and an empty string for the unsupported placeholder.

## New problems: unsupported vs empty-valued

Karthik had a point: we're building end-to-end support for
`%(objecttype)` and `%(objectsize)`, and the empty string behavior
works fine for both of them but *what about other placeholders?*

The short answer is that is not great for all of them. `%(objectmode)`
and `%(rest)` can return an empty string. So now we have a conflict between:

- A placeholder the server **doesn't support** -> returns empty string.
- A placeholder the server **supports**, but its value **is empty** -> returns empty string.

The empty string approach was suggested by [Jeff King][2] and
it honors what `for-each-ref` does for known but inapplicable atoms, but it
seems like it might not be the right fit here, other thing that we could do is to
use a placeholder, something like `"???"`, the placeholder needs to be noticeable and can't
be a plausible value for any other placeholders.

This first round to the mailing list comes with the empty string behavior
anyway. We thought it would be better to get more eyes on the series, but I've
left this open question in the cover letter [1] in case someone has a better idea
or thinks that the placeholder would be better.
Hearing opinions would be great.

## Apart from GSoC

I also updated my Git this week.

I like to code and make "empty" commits maybe a word or two to distinguish them
to later come and write them properly, with all this rebasing I was doing I wanted a
way to edit commits directly without having to get into the interactive rebase every time.
Turns out there's a new command, `git history`, that does exactly that, *how have you
guys survived without it?*.

As for the graph patch I mentioned last week, it's almost done but I'm a bit
frustated with it, some flags affect the rendering order and makes me hard
to write the expect on tests to show what I want. And then there's Windows... some tests there
seem to just ignore my patch entirely. Oh, I love Windows so much... I'll try
to wrap it up this week.

---

See you next week,

Pablo.

- [v12 cover letter](https://lore.kernel.org/git/20260608-ps-eric-work-rebase-v12-0-5338b766e658@gmail.com/)

[1]: https://lore.kernel.org/git/20260608-ps-eric-work-rebase-v12-0-5338b766e658@gmail.com/

[2]: https://lore.kernel.org/git/20250313060250.GH94015@coredump.intra.peff.net/

