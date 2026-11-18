---
title: Eclipse Temurin guidance for CVE-2026-114938 "java4shell"
date: "2026-11-28"
author: pmc
description: The ongoing November 2026 CSPU release includes the fix for CVE-2026-114938. Read up on some guidance to mitigate and which platforms and versions are affected.
tags:
  - temurin
  - security
  - announcement
---

A memory corruption vulnerability in OpenJDK 17 and later allows an unauthenticated remote attacker to achieve arbitrary code execution on x64 systems. The CPU on the affected system must support the AVX-512 VBMI instruction set for it to be affected. Details are in the [public disclosure](https://calif.io/java4shell) and on [OpenJDK's security advisory](https://openjdk.org/groups/vulnerability/advisories/2026-11-17).

**The November 2026 Eclipse Temurin releases address this issue.** We are actively releasing binaries with the fix for this issue. JDK 27, JDK 25, JDK 21, and JDK 17 release pipelines have been launched and binaries are published as testing completes. You can keep track of the progress by following the [November 2026 release status issue](https://github.com/adoptium/temurin/issues/326).

If you can wait for these releases, upgrading is the simplest and recommended mitigation. In the interim, disabling the base64 intrinsic can be used to mitigate this issue. Add `-XX:-UseBASE64Intrinsics` to your start-up script or Java command-line to disable the affected code path.

## Which Temurin versions contain the fix?

Releases produced as part of the November 2026 release activities have a fix for the java4shell issue. The versions of Temurin with a fix are:

- JDK 27.0.1.1+4
- JDK 25.0.5.1+2
- JDK 21.0.13.1+2
- JDK 17.0.21.1+2
- JDK 11 - not affected
- JDK 8 - not affected

We will be delivering binaries out of our various distribution channels:

- Binaries are available from the [Temurin download page](https://adoptium.net/temurin/releases)
- Installable packages are updated at the same time as the binaries, follow instructions from [Adoptium package repositories](https://adoptium.net/installation/) documentation.
- Container images are available once all of the binaries of a particular JDK version are published and can be found at [Docker Hub](https://hub.docker.com/_/eclipse-temurin).

If you cannot upgrade right away, consider the interim mitigation by adding `-XX:-UseBASE64Intrinsics` as a startup flag.

## How Can You Help

It is Adoptium's priority to deliver security patches as quickly as possible.

1. You can assist in expediting fixes by sponsoring the project through the [Sustainer program](https://www.eclipse.org/sponsor/adoptium/). This enables us have the necessary infrastructure to deliver multiple releases simultaneously, instead of waiting for limited resources.

2. Check if someone has already raised a query on an issue before raising a duplicate. This helps to reduce the noise and allow us to focus on delivering a release.

To follow on-going progress, see the [Temurin issue tracker](https://github.com/adoptium/temurin/issues/326) and the `#release` channel on [Adoptium Slack](https://adoptium.net/slack.html).
