---
title: Eclipse Temurin 8u452, 11.0.27, 17.0.15, 21.0.7 and 24.0.1 Available
date: "2025-04-29"
author: steelhead31
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

Revert a change to detecting a headless AWT system on Windows that was introduced in `17.0.12` and `21.0.4` releases ([JDK-8185862](https://bugs.openjdk.org/browse/JDK-8185862)). The fix restores JDK `17.0.15` and JDK `21.0.7` releases to the old headless detection mechanism used prior to JDK `17.0.12` and JDK `21.0.4` releases as the new detection change caused regressions on some Windows systems.

See the backout bug for details: [JDK-8348625](https://bugs.openjdk.org/browse/JDK-8348625)

### Removal Of Docker Images For Windows ServerCore & NanoCore 1809

See: https://github.com/adoptium/containers/pull/751

Both ServerCore and NanoCore were end of life in October 2020, so have now been removed.
