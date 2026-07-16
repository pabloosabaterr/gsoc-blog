+++
date = '2026-07-16T00:20:57+02:00'
draft = false
title = 'GSoC Weeks 7 and 8'
+++

—*"El que algo quiere algo le cuesta"*

This past week and a half has been exhausting; I still don't have the Goal1
series merged into `next`.

This weekend, I had both my graph and Goal1 series pushed to the mailing list,
and since the list is less active on weekends, I had some spare time.

I had been meaning to review
[Tian's series](https://lore.kernel.org/git/20260714032525.1611141-1-cat@malon.dev/)
from a while ago, but I hadn't found the time to do it properly. This weekend
was finally the time.

I wanted to do a thorough review, but until now, I had never reviewed further
than just reading the code, maybe pulling it locally, and testing on the tip of
the series. This time, I wanted to review it commit by commit.

My first (and not very clever) thought was to run `git rebase -i $base` and mark
everything as `edit`. But that sounded very impractical, and having to type
`edit` manually... No, it couldn't be that.

What I ended up doing was running `git switch --detach <commit>`. This way, I
could break and mess around with Tian's commits as much as I wanted to get to
the bottom of everything.

The experience... was tricky. I think it's a very intricate topic where you must
be very careful about what you're doing. I originally meant to spend just one
evening on it, but I ended up needing the next morning as well.

I really enjoyed that, now that I feel much more comfortable with the Git
codebase, I can actually do deep reviews. It's something I like because I get to
see how others code, and I always end up learning new stuff.

After the weekend, some more nits landed on the graph series, but other than
that, the series seems to be done. I hope to see a "Will merge to next" at next
**What's cooking on Git**.

You can check out the graph series here:

[graph series](https://lore.kernel.org/git/20260714-ps-pre-commit-indent-v12-0-d50938e006df@gmail.com/)

We went from one commit to seven, but I'm very proud of how the final result
turned out.

The rest of the week was dedicated mainly to two series:

1. I "finished" the `git backfill --dry-run` option series (it's on GitHub).
   There might still be some edge cases, and some of the code is rough, but it
   is RFC material—which is exactly what I wanted. The happy path works, along
   with some edge cases that I caught while testing.
   [github series](https://github.com/pabloosabaterr/git/pull/7/changes)

2. The rest of my effort and the main focus this week, has been fast-tracking
   Goal1 to try and finish it once and for all.

   I'm a bit worried about time; there's only one month left, and this series is
   blocking Goal2, which has been sitting on my GitHub for many weeks. I'm a bit
   frustrated about that, though I can't say it's unfair because the feedback
   I'm getting is spot-on regarding things I actually need to fix.

   Anyway, it does what it's supposed to do. The remaining things to cover are
   just nits, making the protocol less ambiguous and not overly trusting.

   In the last version, Junio suggested there should be a cheap way of requesting
   a bare OID so we could have an existence test, if you want to know if there's
   an object on the remote, you could just send a bare OID.

   However, the server side wasn't ready for this. it was designed to always
   work with at least one requested attribute ("size" in this case). Because of
   that, I had to add a new patch to get the server side behaving how we want.
   Now the series is a mix of server- and client-side changes, sadly.

   As of today, I spent the whole
   day (and by whole day, I mean *the whole day*, haha) reviewing and cleaning up
   the Goal1 series so the next reroll can (hopefully!) be the last. I'm almost
   done, but I still have to finish the last two commits of the series. That
   will definitely be a task for tomorrow because today I'm so f* tired. After
   that, I'm really confident it will be ready or *como muchísimo* (exagerated
   "at most"), just some tiny nits.

This morning while I was coding, I've been in a voice channel on the Git
Discord server talking with whoever wanted to join. Tian and Siddharth joined :).

To sum up, this week has been tough, I've been coding non-stop, but I think it
will all be worth it.

See you next Thursday,
Pablo
