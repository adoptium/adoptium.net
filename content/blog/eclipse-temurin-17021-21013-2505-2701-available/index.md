---
title: Eclipse Temurin 17.0.21, 21.0.13, 25.0.5 and 27.0.1 Available
date: "2026-10-30"
author: pmc
description: Adoptium is happy to announce the immediate availability of Eclipse Temurin 17.0.21, 21.0.13, 25.0.5 and 27.0.1. As always, all binaries are thoroughly tested and available free of charge without usage restrictions on a wide range of platforms.
tags:
  - temurin
  - announcement
  - release-notes
---

Adoptium is happy to announce the immediate availability of Eclipse Temurin 17.0.21+9, 21.0.13+9, 25.0.5+8 and 27.0.1.0.2+1. All binaries are thoroughly tested and available free of charge without usage restrictions on a wide range of platforms. Binaries, installers, and source code are available from the [Temurin download page](https://adoptium.net/temurin/releases), [official container images](https://hub.docker.com/_/eclipse-temurin) are available at DockerHub, and [installable packages](https://adoptium.net/installation/) are available for various operating systems.

## Fixes and Updates

This release contains the following fixes and updates.

- [Temurin 17.0.21 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-17.0.21+9)
- [Temurin 21.0.13 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-21.0.13+9)
- [Temurin 25.0.5 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-25.0.5+8)
- [Temurin 27.0.1.0.2 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-27.0.1.0.2+1)

## New and Noteworthy

### CA Certificate Update and eMudhra Compromise

[CVE-2026-114820](https://nvd.nist.gov/vuln/detail/CVE-2026-114820) is fixed as we did a respin of the initial launch of our build pipelines to ensure inclusion of a CA certificates change addressing the eMudhra compromise. See [news post](https://adoptium.net/news/2026/10/temurin-october-2026-emudhra) and [PR #4587](https://github.com/adoptium/temurin-build/pull/4587) for details on regarding the fix. The news post explains how Temurin builds its cacerts trust store from the [Mozilla CA certificate list](https://wiki.mozilla.org/CA), rather than the list bundled with upstream OpenJDK. It also gives guidance on interpreting test results if you are running the upstream test case "CheckCerts". If you want to run a valid test for Temurin binaries, you can edit CheckCerts to comment out line 47 that lists `emSign Root CA - G1`.

If you would like more information regarding the CVE itself, please refer to https://openjdk.org/groups/vulnerability/advisories/2026-10-24.

### Version Availability and Delays

This release covers JDK 17.0.21+9, JDK 21.0.13+9, JDK 25.0.5+8 and JDK 27.0.1.0.2+1. JDK 8 and JDK 11 upstream tags are still not available, resulting in a delay for those versions. For up-to-date status, refer to [temurin issue #317](https://github.com/adoptium/temurin/issues/317).

The Temurin version numbers for JDK 17, JDK 21, and JDK 25 do not match later upstream ga tags, such as jdk-17.0.21.0.2+1, jdk-21.0.13.0.2+1 and jdk-25.0.5.0.2+1. We were able to contain a fix for the eMudhra compromise as part of our Temurin build of the jdk-25.0.5+8 tag because Temurin builds its cacerts trust store from the Mozilla CA certificate list, rather than the list bundled with upstream OpenJDK. A fix for upstream OpenJDK was delivered and tagged with jdk-17.0.21.0.2+1, jdk-21.0.13.0.2+1, and jdk-25.0.5.0.2+1. We chose not wait the extra day to pick up the OpenJDK fix, since it was not relevant for Temurin and we wanted to expedite the release.

We delivered off of the earlier tag to publish patched binaries sooner than later. We will not be respinning against the later tag, as its not relevant to our distribution, and we will be preparing for a November CSPU directly after this October CPU completes.

### AIX Builds Unavailable

AIX builds are not published at this time as the test nodes in the Temurin Compliance project are unavailable. Work is ongoing to restore or replace these nodes to complete compliance testing and publish AIX binaries, but we do not have an ETA at the moment.

### Headless Builds for Linux ppc64le, Linux s390x, and AIX

This release marks the first time that Linux ppc64le, Linux s390x, and AIX are packaged as headless builds. See [headless platform changes announcement](https://adoptium.net/news/2026/05/headless-platform-changes) for details.
