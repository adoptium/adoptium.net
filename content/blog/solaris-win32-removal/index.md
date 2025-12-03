---
title: Adoptium's Plan to End Support for Solaris and Windows 32-bit Platforms
date: "2025-12-04T12:00:00+00:00"
author: pmc
description: Adoptium intends to stop publishing Eclipse Temurin on the Solaris and Win32 platforms in 2026
tags:
  - temurin
  - announcement
  - end-of-service
---

The Adoptium community is dedicated to providing high-quality, open-source builds of the Temurin JDK for the most actively maintained and widely used platforms in the industry. As part of our commitment to focus our resources effectively, we are announcing the end of service for the following platform releases.

## Solaris/x64 and Solaris/SPARC

Although Temurin has never had a significant user base on Solaris, we have been fortunate to have had project [sponsorship](https://adoptium.net/sustainers) to cover the costs of the hardware for building, testing, and distributing on the two architectures for which Solaris is available. This sponsor no longer has a requirement for Temurin on Solaris and therefore we have decided to stop shipping Solaris builds of Temurin in 2026. Without funding for the hardware and people stepping up to perform the work required for our test and release process it is not viable to continue to ship on Solaris platforms.

In addition to the funding, supporting Solaris has become increasingly complex from a technical perspective. We can no longer connect Solaris agents directly to our Jenkins CI due to Jenkins’ requirement for agents to support Java 17 at a minimum and we had to implement a separate build and test process to continue to produce those builds (see [this issue](https://github.com/adoptium/infrastructure/issues/3742)). In addition to this, the Solaris platforms are not automated through the [Arctic framework](https://github.com/adoptium/aqa-tests/wiki/Arctic-Project-Guide) which means that some of the compliance testing is significantly more time consuming than on most of our other platforms.

## Windows 32-bit builds (JDK8, 11, and 17)

On Windows 32-bit, Temurin is currently built and released for JDK 8, 11, and 17 but has not been shipped for JDK21 and later where [JEP 449](https://openjdk.org/jeps/449) deprecates the platform. This reflects the fact that all currently supported Windows operating systems are 64-bit and capable of running a 64-bit version of Temurin.

All our testing of these binaries has been conducted on Windows 64-bit machines, and we are starting to see increasing incompatibilities as we move to the latest versions of source code compilers and other tools to maintain currency and security.

Based on this it is our intention to also stop shipping the 32-bit Windows builds of Temurin in 2026. It is likely that typical end user scenarios on in-support operating systems will be able to use a 64-bit Temurin build.

## Your feedback and support are crucial

We have created two issues to gather your feedback specifically for these platforms. We'd especially like to hear from you if you are able to provide additional support by adding a comment to the following issues:

- Solaris: https://github.com/adoptium/temurin-build/issues/4318
- Win32: https://github.com/adoptium/temurin-build/issues/4319
