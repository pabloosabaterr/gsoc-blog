+++
date = '2026-08-07T21:08:11+02:00'
draft = false
title = 'GSoC Week 11'
+++

Tic Tac, Tic, Tac... I am already getting emails from GSoC warning me that there
is little time left.

Picking up where I left it last week, a few hours later I sent the v3 and out of
this version came some nits and a small ordering problem.

The past series, the client already had `%(objecttype)` in its list and I did this
for a simple reason, there are 4 possible cases:

- the client knows it but the server does not (new client vs old server)
- the client does not know it but the server does (old client vs new server)
- both know it (everyone is new)
- neither knows it (unsupported capability)

From what we have been building, invented placeholders like `%(IJustInventedThis)`
simply die(), for the placeholders that exist locally there is another behavior:
If it is not supported by the client or the server, the output of these when
expanding them will be an empty string.

For example:

we ask for "%(objectname) %(objectsize) %(objecttype)"
but our server does not support type.

therefore our result will be:

"\<OID\> \<size\> "

The list was designed so that even if new placeholders were added it would be
idempotent, because nothing would happen until a server did advertise that
attribute, that's why having type in there changed no behavior at all.

It was there because it was interesting for the tests, a client did not know how
to parse if a server offered type and it did not know how to ask for it either,
but it did know how to understand if a user wanted it. This way we had tested:

- unknown + unsupported, as `%(deltabase)` is
- known + unsupported, as `%(objecttype)` was (that's why it was on the list)
- known + supported, as `%(objectsize)` is

However with the back and forth of the type series that I am taking advantage of
to leave things clean, this stopped making sense. Using `object_info` and the list
worked because `object_info` already had a type field, so listing type cost
nothing. Now that we dedicate an array per attribute it would mean carrying a
types array that nobody fills, so I preferred to drop it there and implement type
fully later in the series.

Patches 1-5 are preparatory. They don't change what the command does:
- [1/9] is a test cleanup.
- [2/9] fixes a possible bug in case of a malformed response.
- [3/9] and [4/9] refactor how the object data is stored and handled. The
  why about this refactor comes from [1].
- [5/9] drops the last error return left in fetch_object_info().

Patches 6-9 are the actual objecttype support:
- [6/9] teaches the server to answer type.
- [7/9] teaches the client to parse it.
- [8/9] advertises the capability so the client can start asking it.
- [9/9] unifies the default format.

and for the v5 there will be one more preparatory patch that Jeff King made, for a
total of 10 where 6 are prep.

The shape has changed quite a bit, there is no longer an allow-list that we filter
but something simpler which is having our own struct where we have flags if the
client wants X attribute of an object and these are saved in a new struct:

    struct fetch_object_info_results {
        size_t *sizes;
        enum object_type *types;
        uint8_t *unrecognized;
 	    size_t nr;
 	    unsigned wants_size:1;
        unsigned wants_type:1;
    };

instead of having an array of `struct object_info` we save all our data here so we
do not have an array of `object_info` that was not made for that.

The truth is that it has been quiet and there is not much more, I will put in Jeff
King's patch, but there is nothing for now that I have to change.

I think this has been the briefest week of all (taking into account that the last
one I published on Sunday) but it has been very quiet.

---

**Saturday edit**
on friday night I sent the v5 and the static test failed, while all the others
were fine, look, I usually wait for the tests to pass but I was already seeing
everything green and I assumed the rest would go the same way.

However, it was not like that, strangely everything was fine except the static,
which was a bit odd to me because I thought that at least on some platform or
something it should fail too, but no, everything green except the static.

The solution was easy, two forward declarations and fixed.

---

Outside of GSoC these weeks I have been tying up loose ends to go live in Lisbon
this year and everything is going smoothly, for now I already have all the
paperwork done, so by the first days of September I will be there already since
university starts.

I also did a couple of streams programming, I like it quite a lot and I talk, but
to concentrate well I need to be in silence which is a bit counterproductive for
streaming. But well, I have to improve.

I have bought a new book which is a well known one:

[Designing Data-Intensive Applications](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/)

It will arrive next week.

See you next week,

Pablo

[1] https://lore.kernel.org/git/xmqqzez67yg1.fsf@gitster.g/
