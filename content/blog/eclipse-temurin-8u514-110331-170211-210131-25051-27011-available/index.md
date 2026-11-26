---
title: Eclipse Temurin 8u514, 11.0.33.1, 17.0.21.1, 21.0.13.1, 25.0.5.1 and 27.0.1.1 Available
date: "2026-11-26"
author: pmc
description: Adoptium is happy to announce the immediate availability of Eclipse Temurin 8u514, 11.0.33.1, 17.0.21.1, 21.0.13.1, 25.0.5.1 and 27.0.1.1. This release includes the fix for CVE-2026-114938 "java4shell" and stricter handling of distrusted CA roots in the cacerts truststore.
tags:
  - temurin
  - announcement
  - release-notes
---

Adoptium is happy to announce the immediate availability of Eclipse Temurin 8u514-b01, 11.0.33.1+1, 17.0.21.1+2, 21.0.13.1+2, 25.0.5.1+2 and 27.0.1.1+4. This is a **Critical Security Patch Update (CSPU)** — a security-only, out-of-band release addressing vulnerabilities disclosed by Oracle. All binaries are thoroughly tested and available free of charge without usage restrictions on a wide range of platforms. Binaries, installers, and source code are available from the [Temurin download page](https://adoptium.net/temurin/releases), [official container images](https://hub.docker.com/_/eclipse-temurin) are available at DockerHub, and [installable packages](https://adoptium.net/installation/) are available for various operating systems.

## CSPU Release Cadence delivers more frequent Security Fixes

This is a security-only CSPU release. All six supported JDK versions receive patches for the vulnerabilities disclosed for this release. The fix for the memory corruption vulnerability CVE-2026-114938 ("java4shell") affects JDK 17 and later on x64 systems; JDK 8 and JDK 11 are not affected by that issue. See our [guidance on java4shell](https://adoptium.net/news/2026/11/temurin-november-2026-cspu-java4shell) for details and interim mitigations.

We are easing into a more regular "CSPU" release cadence, where a "CSPU" release is a security update based off of the quarterly "CPU" releases (April, July, October, January) (see this [OpenJDK mailing list announcement](https://mail.openjdk.org/archives/list/jdk-updates-dev@openjdk.org/thread/SVHDNJDY62MX6YBEA4FSMW4U72H77F6S/) for background). CSPUs will follow a dotted release scheme based off of the previous CPU tags for the CSPU GA tags and should contain only Critical Security Patch Updates (CSPUs).

## Fixes and Updates

This release contains the following fixes and updates.

- [Temurin 8u514 release notes](https://adoptium.net/temurin/release-notes/?version=jdk8u514-b01)

- [Temurin 11.0.33.1 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-11.0.33.1+1)

- [Temurin 17.0.21.1 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-17.0.21.1+2)

- [Temurin 21.0.13.1 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-21.0.13.1+2)

- [Temurin 25.0.5.1 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-25.0.5.1+2)

- [Temurin 27.0.1.1 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-27.0.1.1+4)

## New and Noteworthy

### Stricter handling of distrusted CA roots in the cacerts truststore

Temurin generates its `cacerts` truststore from Mozilla's root certificate data (`certdata.txt`). Mozilla marks some roots with a server distrust-after date, after which TLS server certificates issued by that root are no longer trusted. Our build script already detected this, but a bug in how it tracked certificate state meant the distrust decision was discarded before the certificate was written out. Roots past their distrust date were therefore still included in `cacerts`. The fix is in [temurin-build pull request 4604](https://github.com/adoptium/temurin-build/pull/4604).

This release changes that. Roots whose server distrust-after date has passed are now excluded from the truststore.

#### What this means for you

Four roots that were previously included are now removed from the Temurin `cacerts` file:

- `emSign Root CA - G1`
- `DigiCert Trusted Root G4`
- `Izenpe.com`
- `Autoridad de Certificacion Firmaprofesional CIF A62634068`

The truststore goes from 113 to 109 CA certificates.

TLS connections that depend on certificates chaining to one of these roots may fail validation after upgrading. Check the certificate chains of any servers or services you connect to. If a service still depends on one of these roots, ask its operator to move to a chain that is still trusted.

This is deliberately stricter than Mozilla's policy. Mozilla distrusts only certificates issued after the cutoff, and older certificates remain valid until they expire. Java keystores can't express date-based or partial distrust, so Temurin removes the whole root once its cutoff has passed.

If you need a root that Temurin has removed, you can add it to your own truststore or point the JVM at a custom one with `-Djavax.net.ssl.trustStore`. Do this only if you accept the risk.

The change applies to the default `SERVER_AUTH` trust purpose that Temurin builds use.

### Updated CA Certificates

The CA certificate bundle shipped with Eclipse Temurin has also been refreshed to incorporate the latest Mozilla root-certificate updates.

## How Can You Help

It is Adoptium's priority to deliver security patches as quickly as possible.

1. You can assist in expediting fixes by sponsoring the project through the [Sustainer program](https://www.eclipse.org/sponsor/adoptium/). This enables us have the necessary infrastructure to deliver multiple releases simultaneously, instead of waiting for limited resources.

2. Check if someone has already raised a query on an issue before raising a duplicate. This helps to reduce the noise and allow us to focus on delivering a release.

To follow on-going progress, see the [Temurin issue tracker](https://github.com/adoptium/temurin/issues/326) and the `#release` channel on [Adoptium Slack](https://adoptium.net/slack.html).
