+++
title = 'Git'
description = 'My contributions to Git, starting with Google Summer of Code 2026.'
aliases = ['/series/gsoc-2026/']
summary = 'Patches to Git: remote-object-info for cat-file, %(objecttype) support and graph indentation. Started with Google Summer of Code 2026.'
status = 'Ongoing'
since = 2026
weight = 2
[[links]]
  name = 'My fork'
  url = 'https://github.com/pabloosabaterr/git'
[[links]]
  name = 'GSoC proposal'
  url = '/proposal.pdf'
[[links]]
  name = 'WhatToGit'
  url = 'https://github.com/pabloosabaterr/WhatToGit'
+++

I started contributing to [Git](https://git-scm.com/) through Google Summer of
Code 2026, mentored by [Karthik Nayak](https://www.linkedin.com/in/karthik-nayak/)
and [Chandra](https://www.linkedin.com/in/chand-ra/). The main work was teaching
`git cat-file` to ask a remote about objects without downloading them, and on the
side, making `git log --graph` stop drawing unrelated commits as if they were
connected.

These are my weekly notes from that summer and what came after.
