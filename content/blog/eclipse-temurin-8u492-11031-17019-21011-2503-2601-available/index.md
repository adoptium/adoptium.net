---
title: Eclipse Temurin 8u492, 11.0.31, 17.0.19, 21.0.11, 25.0.3 and 26.0.1 Available
date: "2026-05-15"
author: pmc
description: Adoptium is happy to announce the immediate availability of Eclipse Temurin 8u492, 11.0.31, 17.0.19, 21.0.11, 25.0.3 and 26.0.1. As always, all binaries are thoroughly tested and available free of charge without usage restrictions on a wide range of platforms.
tags:
  - temurin
  - announcement
  - release-notes
---

Adoptium is happy to announce the immediate availability of Eclipse Temurin 8u492-b09, 11.0.31+11, 17.0.19+10, 21.0.11+10, 25.0.3+9 and 26.0.1+8. As always, all binaries are thoroughly tested and available free of charge without usage restrictions on a wide range of platforms. Binaries, installers, and source code are available from the [Temurin download page](https://adoptium.net/temurin/releases), [official container images](https://hub.docker.com/_/eclipse-temurin) are available at DockerHub, and [installable packages](https://adoptium.net/installation/) are available for various operating systems.

## Fixes and Updates

This release contains the following fixes and updates.

- [Temurin 8u492 release notes](https://adoptium.net/temurin/release-notes/?version=jdk8u492-b09)

- [Temurin 11.0.31 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-11.0.31+11)

- [Temurin 17.0.19 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-17.0.19+10)

- [Temurin 21.0.11 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-21.0.11+10)

- [Temurin 25.0.3 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-25.0.3+9)

- [Temurin 26.0.1 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-26.0.1+8)

## New and Noteworthy

### Ubuntu 26.04 LTS Container Support and Default Ubuntu Version Change

Ubuntu 26.04 LTS (Resolute Ringtail) has been released with support until April 2031. We are pleased to announce that Eclipse Temurin now provides container images for Ubuntu 26.04 LTS across all supported architectures.

**Important:** With this release, the default Ubuntu base image for Eclipse Temurin containers has been updated from Ubuntu 24.04 (Noble) to Ubuntu 26.04 (Resolute). This means that untagged or version-only tags (e.g., `eclipse-temurin:26-jdk`) now point to Ubuntu 26.04-based images. If you need to continue using Ubuntu 24.04-based images, please use the explicit `noble` tag (e.g., `eclipse-temurin:26-jdk-noble`).

Container support has been added for Ubuntu 26.04 across the following architectures:
- aarch64 (ARM 64-bit)
- arm (ARM 32-bit)
- ppc64le (PowerPC 64-bit Little Endian)
- s390x (IBM Z)
- x64 (x86-64)

**Note for riscv64 users:** Due to upstream official images limitations, we are currently unable to build riscv64 images for Ubuntu 26.04. If you require riscv64 support, please continue using the `-noble` tag (Ubuntu 24.04) for now.

Docker images are available for all supported JDK versions (8, 11, 17, 21, 25, 26) in both JDK and JRE variants:

```bash
# Default (now Ubuntu 26.04)
docker pull eclipse-temurin:26-jdk
docker pull eclipse-temurin:26-jre

# Explicit Ubuntu 26.04
docker pull eclipse-temurin:26-jdk-resolute
docker pull eclipse-temurin:26-jre-resolute

# Ubuntu 24.04 (if needed)
docker pull eclipse-temurin:26-jdk-noble
docker pull eclipse-temurin:26-jre-noble
```

**Note for CI/CD users:** If your pipelines rely on specific Ubuntu versions or tools that may not yet support Ubuntu 26.04 (such as certain versions of Playwright), you should explicitly specify the `noble` tag to continue using Ubuntu 24.04-based images.

The Docker image tag aliases and base image configurations are managed in the [Temurin Docker repository](https://github.com/adoptium/containers). Specifically, the Ubuntu version mappings are defined in the `config/temurin.yml` file, where the default Ubuntu version and available variants are configured for each JDK version.

For more information about our supported platforms, visit our [Supported Platforms](https://adoptium.net/supported-platforms) page.
