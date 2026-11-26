---
title: OpenSSF Baseline Level 2 compliance for Eclipse Temurin
date: "2026-11-26"
author: adamfarley
description: Adoptium is proud to announce that Eclipse Temurin has been self-assessed as OpenSSF Baseline Level 2 compliant
tags:
  - announcement
  - security
  - temurin
---

As part of Adoptium's ongoing drive to maintain a high level of security,
we are proud to announce:

As of November 26, 2026, Adoptium has self-assessed project Eclipse Temurin
as compliant with OpenSSF OSPS Baseline version 2025-10-10 level 1 and level 2.

This is a self-assessment, not a third-party certification, and the evidence
is public so you can verify it.

## What is the OSPS Baseline?

The OSPS Baseline is a set of security criteria, organised into three maturity
levels, that open-source projects can use to assess and demonstrate their
security posture. Level 2 is aimed at projects with at least two maintainers
and a consistent user base, and builds on Level 1.

A full breakdown of the OpenSSF OSPS Baseline criteria can be found on the [OpenSSF Baseline web site](https://baseline.openssf.org/versions/2025-10-10).

## Evidence

- [Level 1 evidence table](https://github.com/adoptium/adoptium/issues/378)
- [Level 2 evidence table](https://github.com/adoptium/adoptium/issues/379)

## What this means for you

- Eclipse Temurin now publishes its [Vulnerability Disclosure Reports](https://github.com/adoptium/temurin-vdr-generator/releases) every week.
- Eclipse Temurin clearly defines its project maintainers, and their roles, in a new [Maintainers.md file](https://github.com/adoptium/temurin/blob/main/Maintainers.md).
- The baseline mapping strengthens the evidence behind our [SLSA self-assessment](https://adoptium.net/docs/slsa).

## Next steps

We intend to assess Eclipse Temurin against Level 3 criteria. You can track our progress in [this issue](https://github.com/adoptium/adoptium/issues/267).

Once the Level 3 self-assessment is complete, we will establish a regular cadence of reassessment against later versions of OpenSSF OSPS Baseline, across Levels 1-3.

Questions or feedback? Reach us on [Adoptium Slack](https://adoptium.net/slack).
