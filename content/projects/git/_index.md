+++
title = 'Git'
description = 'My Google Summer of Code 2026 at Git.'
aliases = ['/series/gsoc-2026/']
summary = 'My Google Summer of Code 2026 at Git: remote-object-info for cat-file, `%(objecttype)` support and graph indentation.'
status = 'Finished'
year = 2026
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

I spent Google Summer of Code 2026 working on [Git](https://git-scm.com/), mentored by [Karthik Nayak](https://www.linkedin.com/in/karthik-nayak/)
and [Chandra](https://www.linkedin.com/in/chand-ra/). The main work was teaching
`git cat-file` to ask a remote about objects without downloading them, and on the
side, making `git log --graph` stop drawing unrelated commits as if they were
connected.

These are my weekly notes from that summer, ending with the final report.
