---
title: Eclipse Temurin 8u452, 11.0.27, 17.0.15, 21.0.7 and 24.0.1 Available
date: "2025-04-29"
author: pmc
description: Adoptium is happy to announce the immediate availability of Eclipse Temurin 8u452, 11.0.27, 17.0.15, 21.0.7 and 24.0.1. As always, all binaries are thoroughly tested and available free of charge without usage restrictions on a wide range of platforms.
tags:
  - temurin
  - announcement
  - release-notes
---

Adoptium is happy to announce the immediate availability of Eclipse Temurin 8u452-b09, 11.0.27+6, 17.0.15+6, 21.0.7+6 and 24.0.1+9. As always, all binaries are thoroughly tested and available free of charge without usage restrictions on a wide range of platforms. Binaries, installers, and source code are available from the [Temurin download page](https://adoptium.net/temurin/releases), [official container images](https://hub.docker.com/_/eclipse-temurin) are available at DockerHub, and [installable packages](https://adoptium.net/installation/) are available for various operating systems.

## Fixes and Updates

This release contains the following fixes and updates.

* [Temurin 8u452 release notes](https://adoptium.net/temurin/release-notes/?version=jdk8u452-b09)

* [Temurin 11.0.27 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-11.0.27+6)

* [Temurin 17.0.15 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-17.0.15+6)

* [Temurin 21.0.7 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-21.0.7+6)

* [Temurin 24.0.1 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-24.0.1+9)

## New and Noteworthy

### Reversion to previous headless behaviour on Windows

Revert a change to detecting a headless AWT system on Windows that was introduced in the upstream codebase for the `17.0.12` and `21.0.4` releases ([JDK-8185862](https://bugs.openjdk.org/browse/JDK-8185862)). The fix restores JDK `17.0.15` and JDK `21.0.7` releases to the old headless detection mechanism used prior to JDK `17.0.12` and JDK `21.0.4` releases as the new detection change caused regressions on some Windows systems.

See the backout bug for details: [JDK-8348625](https://bugs.openjdk.org/browse/JDK-8348625)

### Removal Of Docker Images For Windows ServerCore & NanoCore 1809

See: https://github.com/adoptium/containers/pull/751

Both ServerCore and NanoCore were end of life in October 2020, so have now been removed.

### Windows aarch64 unavailable for JDK24

Temurin jdk-24.0.1 for the Windows on Aarch64 platform is currently unavailable.  A small number of test failures indicated that there is need to investigate and correct before release. We hope that these issues will be rectified swiftly and a release completed in a future cycle.

### AIX ppc64 JDK24 now available

For AIX we were unable to ship JDK 24+36 in the initial release. For 24.0.1+9 there was an extra patch that we needed to correct this and pass our rigorous testing process. For this reason, the AIX version of Temurin is 24.0.1+9.1 instead of 24.0.1+9. The functionality in this new version is the same as for other platforms. The backported fix in Temurin is [JDK24u PR 180](https://github.com/openjdk/jdk24u/pull/180) from [JBS bug JDK-8353053](https://bugs.openjdk.org/browse/JDK-8353053).
