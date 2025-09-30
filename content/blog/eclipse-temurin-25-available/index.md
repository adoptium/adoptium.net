---
title: Eclipse Temurin 25 Available
date: "2025-09-30"
author: pmc
description: Adoptium is happy to announce the immediate availability of Eclipse Temurin 25. As always, all of our binaries are thoroughly tested and available free of charge without usage restrictions on a wide range of platforms.
tags:
  - temurin
  - announcement
  - release-notes
---

Adoptium is happy to announce the immediate availability of Eclipse Temurin 25+36. As always, all binaries are thoroughly tested and available free of charge without usage restrictions on a wide range of platforms. Binaries, installers, and source code are available from the [Temurin download page](https://adoptium.net/temurin/releases), [official container images](https://hub.docker.com/_/eclipse-temurin) are available at DockerHub, and [installable packages](https://adoptium.net/installation/) are available for various operating systems.

## Fixes and Updates

This release contains the following fixes and updates:

- [Temurin 25 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-25+36)

## New and Noteworthy

### JDK25 on Linux/glibc build changes

We are now building JDK25 on Linux/glibc platforms with a GCC14 devkit.

### Jmods folder now omitted by default

Since we enable JEP 493 for builds later than JDK 24, it's enabled for JDK 25 as well. This means that there will be no jmods folder by default in the JDK download. See [this news item](https://adoptium.net/news/2025/03/eclipse-temurin-jdk24-JEP493-enabled) for details.

### JDK25+36 release does not include aarch64 Windows

Aarch64 Windows will not be published as part of the release activities. There are many openjdk testcase failures that need further investigation, explanation, and potentially exclusion if they are to be considered non-blocking. See [this issue](https://github.com/adoptium/aqa-tests/issues/6623) for investigation details.

### Changes in tooling used in Windows builds

VS2022 build MS-SDK linker version 14.37 causes zGC OOM failures, so we moved to 14.29. See [this issue](https://github.com/adoptium/aqa-tests/issues/6592) for details.
