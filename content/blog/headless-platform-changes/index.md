---
title: Exploring Packaging Changes to Temurin JDK on AIX, Linux ppc64le and Linux s390x
date: "2026-04-22"
author: pmc
description: We are proposing changes to how Eclipse Temurin runtimes are packaged on selected platforms and are seeking community feedback.
tags:
  - temurin
  - discussion
  - packaging
  - platforms
---

The Adoptium community is committed to delivering high-quality Eclipse Temurin builds for the most widely used and actively maintained platforms. As part of this, we regularly review how our binaries are packaged and distributed to ensure they align with modern usage.

We are opening a discussion on a proposal to evolve runtime packaging for a small number of platforms where usage patterns are heavily backend-focused.

## Platforms in Scope

This proposal specifically targets:

- **AIX ppc64**
- **Linux ppc64le**
- **Linux s390x**

These platforms are predominantly used for server-side and enterprise workloads, where GUI support is rarely required.

## Proposal Overview

We are exploring a shift toward **more streamlined runtime distributions** on these platforms, with a focus on:

- Prioritising **headless or minimal runtime configurations**
- Reducing overlap between existing runtime variants
- Aligning delivered artifacts with typical production usage

This would affect how runtimes are **packaged and distributed**, not the underlying OpenJDK functionality.

## Rationale

Across the Java ecosystem, usage has shifted toward:

- Cloud and container-based deployments
- Backend services with no GUI requirements
- Increased emphasis on smaller, more efficient runtime images

Maintaining multiple overlapping runtime variants introduces additional build, test, and maintenance overhead. As seen in previous platform decisions, focusing effort where it delivers the most value helps improve overall quality and sustainability. As this proposal involves removing the gui related components, such as libawt_xawt.so on the Linux platforms, it would align these builds more closely with the existing Alpine Linux distributions, which already exclude this library. In practice, this means the resulting runtimes would be comparable in functionality to Alpine-based Temurin builds. For typical backend workloads, including those using ImageIO, no impact is expected. However, this will be validated through targeted testing to ensure compatibility and avoid regressions.

## What This Means

No decisions have been made at this stage. This is an early proposal intended to gather feedback.

If adopted, the changes would aim to:

- Simplify the set of runtime packages on these platforms
- Improve maintainability of build and test pipelines

Full-featured runtimes would continue to be considered where there is a clear need.

## Feedback Requested

We are particularly interested in feedback on:

- Current usage of GUI features on these platforms
- Requirements for full vs headless runtimes
- Potential impact to existing deployments and automation

If your organisation depends on these platforms, please share your use cases and requirements in the discussion.

## Join the Discussion

We encourage all users and contributors to participate:

See: https://github.com/adoptium/adoptium/issues/273

## Summary

This proposal reflects an ongoing effort to align Eclipse Temurin distributions with modern deployment patterns, while ensuring that project resources are focused where they provide the greatest benefit.

By starting with AIX ppc64, Linux ppc64le, and Linux s390x, we aim to evaluate this approach on platforms where it is most applicable.

We welcome your feedback.
