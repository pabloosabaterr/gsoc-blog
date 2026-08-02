+++
date = '2026-08-02T23:51:31+02:00'
draft = false
title = 'Gsoc Week 10'
+++

![last meeting](/images/IMG_6262.jpg)

I'm trying out new techniques for writing, the way I'm going to write this week
consists of writing in my native language (Spanish) and then translating it, I
hope to be able to show more of my personality.

This week I think has been the last of the meetings we've had as a group, these
group meetings we've had one a month, where the 4 GSoC in Git participants and
mentors get together and talk about how our projects are going.

It makes me a bit sad to see that this is coming to an end and at the same time
I look back and feel that I've learned a lot; even though I still make basic
junior mistakes, even if I think I'm cool, at the end of the day I'm still in my
second year of my degree and I have a lot left to learn, I'm not going to become
a genius overnight *I wish...*.

This week started off quiet, my mentors Karthik and Chandra are both tied up
each with their own things, Karthik became a father a few weeks ago and Chandra
is tied up with academic stuff. But it doesn't worry me much, I think I'm
already "independent", I still make mistakes, but I'm able to keep putting out
series on my own. However the mentors' work is fundamental for the rerolls to
move forward quickly and that the two of them have found time to do reviews...
I'm very grateful.

A few days after the v1 I got feedback and got down to work.

Hey, I still have to say that the goal1 series has finally been merged and now
I'm going full throttle with the goal2 series, this series is in principle
muuuuch shorter, because all that infrastructure I needed for goal2 came in
goal1 which took an eternity to get merged, for now I'm forgetting about it but
not for long, I'll tell you why in a bit....

Well, *carrying on since I get distracted even writing on my own*, goal 2 got
feedback and following the usual flow, I fix and send a reroll, afterwards there
were still some nits and fixes left, but it worked, however:

Junio pointed out that there was something about it that didn't work for him,
the way the data moves between the functions wasn't correct. I was using `struct
object_info` to store what the server answers. It's the structure that
`read_object_info()` uses, and, well, I saw sense in it, it has size, type, OID.
But fitting isn't the same as being the right type. The pointers of that
structure exist to tell `read_object_info()` where to write the values; they
aren't the place where the values stay. Since `fetch_object_info()` doesn't call
`read_object_info()`, those pointers weren't telling anyone anything, I was using
them as storage. What gave it away was having an array of `struct object_info`,
one per object. You never need more than one, if you're going to read N objects,
you reuse the same structure pointing it at the N-th variable on each pass of
the loop. An array of them means you've confused "where to write the answer"
with "the answer". The solution is a type of its own for the results, one array
per attribute, plus one flag per attribute saying whether the server answered
it, because the server responds with the same set of attributes for all the
OIDs. That forces changing the signature of `fetch_object_info()`, making
`parse_cmd_remote_object_info()` copy the values into `expand_data`, and along the
way `free_object_info_contents()` is left without its only caller and disappears.

Part of this I inherited from how the code was before I got here and I hadn't
read criticism about that code, so with it working and me understanding it, it
seemed correct to me but when Junio mentioned it, the truth is that what I was
doing really wasn't very correct, although I think I'd probably still fall into
the same thing if I found myself in a similar situation. BUT LET IT BE CLEAR, I
know that I'm the one who takes responsibility for the project and that it isn't
an excuse, but it is a difficulty, and well that's what the review is for, I'm
glad it was questioned and now I do it right.

In case anyone is interested in that thread:
https://lore.kernel.org/git/xmqqzez67yg1.fsf@gitster.g/#t

This means that I'm going to have to do a couple of prep commits to make a
struct of my own for how the information moves along the transport path up to
`fetch_object_info()` but well, today I've put a few hours into it and I have a
big part of it done, a bit of frustration because if I had done it right from
the start this wouldn't have to be in this series, but well, time to suck it up
and leave it right.

I'll probably have the v3 by tomorrow, but I still have to write the commits
properly and give one last look over whether I've done everything they asked me
for, I keep trying things like using a notebook, notion, or just remembering,
none of them quite wins me over but well, I have to organize myself somehow.

Since it's coming to an end I've been thinking about whether to sign up for some
internship or something more afterwards but I don't know how I'm going to manage
university life (partying, yes, I love going out), programming which is what I
usually do in my free time and having to go to university. For now, I don't
think I'll apply to any internship until I know I can juggle things, but, stop
programming? nah, that for sure not.

I hope that for next week's post I can say that v3 is looking good and is
almost finished, there are approximately 2 weeks left and I trust that I can
finish in time.

See you next week,
Pablo
