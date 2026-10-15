---
title: Eclipse Temurin 8u502, 11.0.32, 17.0.20, 21.0.12, 25.0.4 and 26.0.2 Available
date: "2026-08-04"
author: pmc
description: Adoptium is happy to announce the immediate availability of Eclipse Temurin 8u502, 11.0.32, 17.0.20, 21.0.12, 25.0.4 and 26.0.2. As always, all binaries are thoroughly tested and available free of charge without usage restrictions on a wide range of platforms.
tags:
  - temurin
  - announcement
  - release-notes
---

Adoptium is happy to announce the immediate availability of Eclipse Temurin 8u502-b07, 11.0.32+9, 17.0.20+8, 21.0.12+8, 25.0.4+7 and 26.0.2+10. As always, all binaries are thoroughly tested and available free of charge without usage restrictions on a wide range of platforms. Binaries, installers, and source code are available from the [Temurin download page](https://adoptium.net/temurin/releases), [official container images](https://hub.docker.com/_/eclipse-temurin) are available at DockerHub, and [installable packages](https://adoptium.net/installation/) are available for various operating systems.

## Fixes and Updates

This release contains the following fixes and updates.

- [Temurin 8u502 release notes](https://adoptium.net/temurin/release-notes/?version=jdk8u502-b07)

- [Temurin 11.0.32 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-11.0.32+9)

- [Temurin 17.0.20 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-17.0.20+8)

- [Temurin 21.0.12 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-21.0.12+8)

- [Temurin 25.0.4 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-25.0.4+7)

- [Temurin 26.0.2 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-26.0.2+10)

## New and Noteworthy

### Windows aarch64 Not Included for JDK 25 and JDK 26

Eclipse Temurin does not currently ship Windows aarch64 binaries for JDK 25 or JDK 26. Work to deliver these builds is ongoing; users who require Windows aarch64 support for those versions should watch the [Adoptium blog](https://adoptium.net/blog/) for announcements when availability changes.

### Ubuntu 26.04 LTS Package Support

Native installable packages (`.deb`) for Ubuntu 26.04 LTS (Resolute Ringtail) are now available for all supported JDK versions (8, 11, 17, 21, 25, 26). Ubuntu 26.04 packages can be installed through the [Adoptium package repositories](https://adoptium.net/installation/linux/) in the usual way. Users running Ubuntu 24.04 (Noble Numbat) or earlier are unaffected; their packages continue to be provided as before.

### Updated CA Certificates

The CA certificate bundle bundled with Eclipse Temurin has been refreshed to incorporate the latest Mozilla root-certificate updates. This ensures that TLS connections made with the built-in `cacerts` truststore remain valid against current certificate authorities without requiring any manual intervention.

### Reproducible Build Improvements

Several improvements have been made to the reproducible-build verification tooling in this release cycle:

- Windows aarch64 cross-compiled targets are now handled by `windows_repro_build_compare.sh`, extending reproducibility verification to that platform combination.
- The Linux and macOS `repro_build_compare.sh` script now correctly clones the upstream OpenJDK GA tag, fixing a regression that caused incorrect source checkouts in comparison runs.
- Pandoc version validation in the SBOM reproducibility check for JDK 25+ has been tightened, allowing the check to pass with a broader range of compatible Pandoc versions while still enforcing correctness.

### Build Reliability: Boot JDK Download Retry Logic

The build tooling now retries failed `curl` commands when downloading the boot JDK. This reduces transient build failures caused by temporary network issues in CI environments, improving overall release reliability.

### Linux arm32 Not Included for JDK 8

Eclipse Temurin will not be shipping a JDK 8 build for Linux Arm32 during this release cycle due to concerns raised during the quality assurance process. We hope to resolve these concerns as soon as possible.
