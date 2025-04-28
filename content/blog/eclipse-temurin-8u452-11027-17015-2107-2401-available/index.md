---
title: Eclipse Temurin 8u452, 11.0.27, 17.0.15, 21.0.7 and 24.0.1 Available
date: "2025-04-28"
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

Revert JDK-8185862 to restore old java.awt.headless behavior on Windows.
See: https://bugs.openjdk.org/browse/JDK-8348625

The change to headless behaviour in Windows for JDK17 & JDK21 has been reverted.

### Removal Of Docker Images For Windows ServerCore & NanoCore 1809

See: https://github.com/adoptium/containers/pull/751

Both ServerCore and NanoCore were end of life in October 2020, so have now been removed.
