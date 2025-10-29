---
title: Eclipse Temurin 8u472, 11.0.29, 17.0.17, 21.0.9 and 25.0.1 Available
date: "2025-10-29"
author: pmc
description: Adoptium is happy to announce the immediate availability of Eclipse Temurin 8u472, 11.0.29, 17.0.17, 21.0.9 and 25.0.1. As always, all binaries are thoroughly tested and available free of charge without usage restrictions on a wide range of platforms.
tags:
  - temurin
  - announcement
  - release-notes
---

Adoptium is happy to announce the immediate availability of Eclipse Temurin 8u472-b08, 11.0.29+7, 17.0.17+10, 21.0.9+10 and 25.0.1+8. As always, all binaries are thoroughly tested and available free of charge without usage restrictions on a wide range of platforms. Binaries, installers, and source code are available from the [Temurin download page](https://adoptium.net/temurin/releases), [official container images](https://hub.docker.com/_/eclipse-temurin) are available at DockerHub, and [installable packages](https://adoptium.net/installation/) are available for various operating systems.

## Fixes and Updates

This release contains the following fixes and updates.

- [Temurin 8u472 release notes](https://adoptium.net/temurin/release-notes/?version=jdk8u472-b08)

- [Temurin 11.0.29 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-11.0.29+7)

- [Temurin 17.0.17 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-17.0.17+10)

- [Temurin 21.0.9 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-21.0.9+10)

- [Temurin 25.0.1 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-25.0.1+8)

## New and Noteworthy

### Changes to Windows build toolchain

The Microsoft VS2022 toolchain used for the Windows builds of jdk17, jdk21 and jdk25, has been upgraded to the latest Visual Studio 2022 version 17.12.12 (C/C++ Compiler version 19.42.34444, MSVC toolset version 14.42.34433).

### UBI container images are now UBI10 only, which removes x86-64-v2 support

JDK25 UBI container images are exclusively published with UBI10 and not UBI9. This will impact anyone who is running on an x86-64-v2 system which is [no longer supported by UBI10/RHEL10/CentOS Stream 10](https://access.redhat.com/solutions/7066628). JDK21 and earlier versions will continue to be published with UBI9 images for the foreseeable future.
