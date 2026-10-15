---
title: Eclipse Temurin 8u504, 11.0.32.1, 17.0.20.1, 21.0.12.1, 25.0.4.1 and 26.0.2.1 Available
date: "2026-09-02"
author: pmc
description: Adoptium is happy to announce the immediate availability of Eclipse Temurin 8u504, 11.0.32.1, 17.0.20.1, 21.0.12.1, 25.0.4.1 and 26.0.2.1. As always, all binaries are thoroughly tested and available free of charge without usage restrictions on a wide range of platforms.
tags:
  - temurin
  - announcement
  - release-notes
---

Adoptium is happy to announce the immediate availability of Eclipse Temurin 8u504-b01, 11.0.32.1+1, 17.0.20.1+1, 21.0.12.1+1, 25.0.4.1+1 and 26.0.2.1+1. This is a **Critical Security Patch Update (CSPU)** — a security-only, out-of-band release addressing vulnerabilities disclosed by Oracle. All binaries are thoroughly tested and available free of charge without usage restrictions on a wide range of platforms. Binaries, installers, and source code are available from the [Temurin download page](https://adoptium.net/temurin/releases), [official container images](https://hub.docker.com/_/eclipse-temurin) are available at DockerHub, and [installable packages](https://adoptium.net/installation/) are available for various operating systems.

## CSPU Release Cadence delivers more frequent Security Fixes

This is a security-only CSPU release. All six supported JDK versions receive patches for the vulnerabilities listed below.

We are easing into a more regular "CSPU" release cadence, where a "CSPU" release is a security update based off of the quarterly "CPU" releases (April, July, October, January) (see this [OpenJDK mailing list announcement](https://mail.openjdk.org/archives/list/jdk-updates-dev@openjdk.org/thread/SVHDNJDY62MX6YBEA4FSMW4U72H77F6S/) for background). CSPUs will follow a dotted release scheme based off of the previous CPU tags for the CSPU GA tags and should contain only Critical Security Patch Updates (CSPUs).

## Fixes and Updates

This release contains the following fixes and updates.

- [Temurin 8u504 release notes](https://adoptium.net/temurin/release-notes/?version=jdk8u504-b01)

- [Temurin 11.0.32.1 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-11.0.32.1+1)

- [Temurin 17.0.20.1 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-17.0.20.1+1)

- [Temurin 21.0.12.1 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-21.0.12.1+1)

- [Temurin 25.0.4.1 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-25.0.4.1+1)

- [Temurin 26.0.2.1 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-26.0.2.1+1)

## New and Noteworthy

### Updated CA Certificates

The CA certificate bundle shipped with Eclipse Temurin has been refreshed to incorporate the latest Mozilla root-certificate updates. This ensures that TLS connections made using the built-in `cacerts` truststore remain valid against current certificate authorities without any manual intervention required from users.

### Oracle Linux 9 and 10 Installer Support

Native installable packages are now published for **Oracle Linux 9** and **Oracle Linux 10** for all supported JDK versions (8, 11, 17, 21, 25, 26). Packages can be installed through the [Adoptium package repositories](https://adoptium.net/installation/linux/) in the usual way.

### Container Entrypoint Stability

A change to CA certificate sub-directory processing in the Linux container entrypoints was introduced earlier in the release cycle and subsequently reverted to preserve downstream merge compatibility. The net result for users is that container entrypoint behaviour is unchanged from the previous release. Users relying on custom CA certificates mounted into containers should continue to follow the [documented guidance](https://hub.docker.com/_/eclipse-temurin).
