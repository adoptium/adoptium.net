---
title: Eclipse Temurin 8u482, 11.0.30, 17.0.18, 21.0.10 and 25.0.2 Available
date: "2026-02-05"
author: pmc
description: Adoptium is happy to announce the immediate availability of Eclipse Temurin 8u482, 11.0.30, 17.0.18, 21.0.10 and 25.0.2. As always, all binaries are thoroughly tested and available free of charge without usage restrictions on a wide range of platforms.
tags:
  - temurin
  - announcement
  - release-notes
---

Adoptium is happy to announce the immediate availability of Eclipse Temurin 8u482-b08, 11.0.30+7, 17.0.18+8, 21.0.10+7 and 25.0.2+10. As always, all binaries are thoroughly tested and available free of charge without usage restrictions on a wide range of platforms. Binaries, installers, and source code are available from the [Temurin download page](https://adoptium.net/temurin/releases), [official container images](https://hub.docker.com/_/eclipse-temurin) are available at DockerHub, and [installable packages](https://adoptium.net/installation/) are available for various operating systems.

## Fixes and Updates

This release contains the following fixes and updates.

- [Temurin 8u482 release notes](https://adoptium.net/temurin/release-notes/?version=jdk8u482-b08)

- [Temurin 11.0.30 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-11.0.30+7)

- [Temurin 17.0.18 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-17.0.18+8)

- [Temurin 21.0.10 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-21.0.10+7)

- [Temurin 25.0.2 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-25.0.2+10)

## New and Noteworthy

### Removal of x32 Windows, sparcv9 Solaris, and x64 Solaris

For various reasons explained in detail in this blog post, [Adoptium's Plan to End Support for Solaris and Windows 32-bit Platforms](https://adoptium.net/news/2025/12/solaris-win32-removal), we have removed 3 platforms from our delivery plan, 32-bit Windows, Solaris/SPARC, and Solaris/x64.

### JDK8 Mac compiler options changes

To align with an upstream OpenJDK change which sets -mmacosx-version-min=11.00.00, we have modified our build scripts to no longer override that value, but rather to use the upstream value instead. The implication of this is that the JDK 8 Temurin x64 Mac builds we produce will no longer run on very old macOS versions. We do not expect this change to impact many consumers, as our binaries continue to run well on macOS 12+ as listed in our [Supported Platforms](https://adoptium.net/en-GB/supported-platforms) documentation.

### Linux installer updates

In recent JDK releases, the project moved from relying on the systems own FreeType library to using a bundled, in-tree copy to improve consistency, security, and build reproducibility across all platforms and versions. Shipping a known, vetted FreeType version within the JDK avoids subtle rendering differences and breakages caused by distro-specific patches or version mismatches, while also allowing timely fixes for font-related vulnerabilities. This change helps ensure predictable text rendering and more reliable cross-platform behavior for Java applications. As such, the linux installer packages for RPM based distros have been updated to remove this dependency. Debian based packages will follow suit in future releases.

### Introduction of new system and security property (com.sun.security.allowedAIALocations)

The introduction of com.sun.security.allowedAIALocations allows users to apply filtering rules against URIs obtained from the authority info access extension on X.509 certificates. More details of this new and noteworthy change can be found in the upstream [OpenJDK release notes for JDK 25](https://jdk.java.net/25/release-notes#JDK-8368032). It may impact those using certificates that lack a proper SAN extension.

To address the java.lang.management system tests that were failing in our verification runs, we mitigated by adding a JVM option, -Djdk.rmi.ssl.client.enableEndpointIdentification=false to our test client. The correct fix going forward will be to reissue the certificates with the proper SAN extension.

### Update GCC DevKits with --enable-linker-build-id option

We have updated our GCC DevKits used to create our JDK 21 and up Linux builds with the `--enable-linker-build-id` option. This change enables additional debugging information because with that option GCC with ELF and Binutils supports generation of "build-id" sections when using separate debuginfo.  By adding `build-id` to `libjvm.so` it's now possible to use perf probes on the JVM, including HotSpot SDT events. See the [tracking issue](https://github.com/adoptium/temurin-build/issues/4223) for details.

### Windows aarch64 unavailable for JDK25

Once again, Temurin jdk-25.0.2 for the Windows on Aarch64 platform is currently unavailable. We expect that fixes to the issues will be rectified upstream and we will plan to include this platform as part of our the April 2026 release period.
