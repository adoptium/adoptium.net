---
title: Eclipse Temurin 27 Available
date: "2026-10-01"
author: pmc
description: Adoptium is happy to announce the immediate availability of Eclipse Temurin 27. As always, all of our binaries are thoroughly tested and available free of charge without usage restrictions on a wide range of platforms.
tags:
  - temurin
  - announcement
  - release-notes
---

Adoptium is happy to announce the immediate availability of Eclipse Temurin 27+35. As always, all binaries are thoroughly tested and available free of charge without usage restrictions on a wide range of platforms. Binaries, installers, and source code are available from the [Temurin download page](https://adoptium.net/temurin/releases), [official container images](https://hub.docker.com/_/eclipse-temurin) are available at DockerHub, and [installable packages](https://adoptium.net/installation/) are available for various operating systems.

## Fixes and Updates

This release contains the following fixes and updates:

- [Temurin 27 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-27+35)

## Overview of Java 27 Features

Some of the features available in this release include the following:

- [JEP 523: Make G1 the Default Garbage Collector in All Environments](https://openjdk.org/jeps/523)

- [JEP 527: Post-Quantum Hybrid Key Exchange for TLS 1.3](https://openjdk.org/jeps/527)

- [JEP 531: Lazy Constants (Third Preview)](https://openjdk.org/jeps/531)

- [JEP 532: Primitive Types in Patterns, instanceof, and switch (Fifth Preview)](https://openjdk.org/jeps/532)

- [JEP 533: Structured Concurrency (Seventh Preview)](https://openjdk.org/jeps/533)

- [JEP 534: Compact Object Headers by Default](https://openjdk.org/jeps/534)

- [JEP 536: JFR In-Process Data Redaction](https://openjdk.org/jeps/536)

- [JEP 537: Vector API (Twelfth Incubator)](https://openjdk.org/jeps/537)

- [JEP 538: PEM Encodings of Cryptographic Objects (Third Preview)](https://openjdk.org/jeps/538)

For a complete list of the enhancements (including ones that only impact developers of OpenJDK), [see the JDK 27 overview over at OpenJDK](https://openjdk.org/projects/jdk/27/).

## New and Noteworthy

### Shenandoah GC Caution on RISC-V

If your RISC-V hardware does not have Zba extensions, we do not advise using the Shenandoah GC policy in JDK 27. Shenandoah is a garbage collection policy enabled by passing `-XX:+UseShenandoahGC` when launching the JVM. SIGILL crashes occur when using Shenandoah on RISC-V hardware without Zba extensions, so we do not recommend using that GC policy on affected hardware. JDK 28 is not affected by this issue, and a fix will be included in a later JDK 27 update release.

### macOS x64 Not Available for JDK 27

As announced in [JDK 27 Will No Longer Be Built for macOS x64](https://adoptium.net/blog/2026/09/jdk27-macos-x64-removal/), Eclipse Temurin JDK 27 is not published for macOS x64 (Intel). Users on Intel-based Macs should migrate to macOS aarch64 builds, or continue using an earlier JDK version on macOS x64. See the linked announcement for full details and the community tracking issue.

### Contributing To Eclipse Temurin

Looking to make an impact? We're always looking for new contributors to help shape the future of open-source Java. Whether you're interested in development, testing, or documentation, your expertise can help us continue to deliver high-quality runtimes to millions. Visit our Contributing page to learn how you can get involved and join our mission today.

### Become An Eclipse Temurin Sustainer

The Eclipse Temurin Sustainer Program invites enterprises to invest in the long-term sustainment of Eclipse Temurin and other Adoptium projects. By becoming a Sustainer, your company ensures that Temurin remains the industry's leading community-driven open source JDK for mission-critical Java workloads. This program supports the vendor-neutral development of runtimes and development kits, infrastructure and tools, quality assurance, enhanced security practices, community engagement, and more. See https://adoptium.net/en-GB/sustainers for more details.
