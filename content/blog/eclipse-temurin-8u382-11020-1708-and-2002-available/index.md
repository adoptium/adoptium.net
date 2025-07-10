---
title: Eclipse Temurin 8u382, 11.0.20, 17.0.8 and 20.0.2 Available
date: "2023-08-04T12:00:00+00:00"
author: pmc
description: Adoptium is happy to announce the immediate availability of Eclipse Temurin 8u382, 11.0.20, 17.0.8 and 20.0.2.
tags:
  - temurin
  - announcement
  - release-notes
---

Adoptium is happy to announce the immediate availability of Eclipse Temurin 8u382, 11.0.20, 17.0.8 and 20.0.2. As always, all binaries are thoroughly tested and available free of charge without usage restrictions on a wide range of platforms. Binaries, installers, and source code are available from the [Temurin download page](https://adoptium.net/temurin/releases), [official container images](https://hub.docker.com/_/eclipse-temurin) are available at DockerHub, and [installable packages](https://adoptium.net/installation/) are available for various operating systems.

## Security Vulerabilities Resolved

The following table summaries security vulnerabilities fixed in this release cycle. The affected Temurin version streams are noted by an 'X' in the table. Each line shows the [Common Vulnerabilities and Exposures (CVE) vulnerability database](https://nvd.nist.gov/vuln) reference and [Common Vulnerability Scoring System (CVSS) v3.1 base score](https://www.first.org/cvss/v3.1/specification-document) provided by the [OpenJDK Vulnerability Group](https://openjdk.org/groups/vulnerability/). Note that defense-in-depth issues are not assigned CVEs.

| CVE Identifier                                                    | Component           |                                               CVSS Score                                               | v8  | v11 | v17 | v20 |
| :---------------------------------------------------------------- | :------------------ | :----------------------------------------------------------------------------------------------------: | :-: | :-: | :-: | :-: |
| [CVE-2023-22041](https://nvd.nist.gov/vuln/detail/CVE-2023-22041) | hotspot/compiler    | Medium ([5.1](https://www.first.org/cvss/calculator/3.1#CVSS:3.1/AV:L/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N)) |     |  X  |  X  |  X  |
| [CVE-2023-25193](https://nvd.nist.gov/vuln/detail/CVE-2023-25193) | client-libs/2d      |  Low ([3.7](https://www.first.org/cvss/calculator/3.1#CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:N/A:L))   |     |  X  |  X  |  X  |
| [CVE-2023-22044](https://nvd.nist.gov/vuln/detail/CVE-2023-22044) | hotspot/compiler    |  Low ([3.7](https://www.first.org/cvss/calculator/3.1#CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:N/A:N))   |     |     |  X  |  X  |
| [CVE-2023-22045](https://nvd.nist.gov/vuln/detail/CVE-2023-22045) | hotspot/compiler    |  Low ([3.7](https://www.first.org/cvss/calculator/3.1#CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:N/A:N))   |  X  |  X  |  X  |  X  |
| [CVE-2023-22049](https://nvd.nist.gov/vuln/detail/CVE-2023-22049) | core-libs/java.io   |  Low ([3.7](https://www.first.org/cvss/calculator/3.1#CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:L/A:N))   |  X  |  X  |  X  |  X  |
| [CVE-2023-22036](https://nvd.nist.gov/vuln/detail/CVE-2023-22036) | core-libs/java.util |  Low ([3.7](https://www.first.org/cvss/calculator/3.1#CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:N/A:L))   |     |  X  |  X  |  X  |
| [CVE-2023-22006](https://nvd.nist.gov/vuln/detail/CVE-2023-22006) | core-libs/java.net  |  Low ([3.1](https://www.first.org/cvss/calculator/3.1#CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:N/I:L/A:N))   |     |  X  |  X  |  X  |

Users should follow the [Adoptium policy for reporting vulnerability concerns](https://github.com/adoptium/adoptium/security/policy#security-policies-and-procedures) with this release.

## Fixes and Updates

This release contains the following fixes and updates.

- [Temurin 8u382 release notes](https://adoptium.net/temurin/release-notes/?version=jdk8u382-b05), including [fixes in OpenJDK 8u382](https://bugs.openjdk.org/issues/?jql=project+%3D+JDK+AND+fixVersion+%3D+openjdk8u382)

- [Temurin 11.0.20 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-11.0.20+8), including [fixes in OpenJDK 11.0.20](https://bugs.openjdk.org/issues/?jql=project+%3D+JDK+AND+fixVersion+%3D+11.0.20)

- [Temurin 17.0.8 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-17.0.8+7), including [fixes in OpenJDK 17.0.8](https://bugs.openjdk.org/issues/?jql=project+%3D+JDK+AND+fixVersion+%3D+17.0.8)

- [Temurin 20.0.2 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-20.0.2+9), including [fixes in OpenJDK 20.0.2](https://bugs.openjdk.org/issues/?jql=project+%3D+JDK+AND+fixVersion+%3D+20.0.2)

## New and Noteworthy

### New Container Functionality

Temurin container images now have the ability to add additional Certificate Authority (CA) certificates to the truststore at runtime. This is useful for applications that wish to manage a custom list of CA's. This feature is being rolled out across all official images except Windows-based images.

Further details about "Can I add my internal CA certificates to the truststore?" are described on the [Dockerhub documentation page](https://hub.docker.com/_/eclipse-temurin).

### No JDK 20 binaries for Linux PPC64le, s390x, arm32, and limited AIX ppc64 releases

Adoptium is not releasing Temurin 20.0.2 for Linux PPC64le, s390x, arm32, and AIX ppc64 due to issues found in testing. In addition, Adoptium is only be releasing Temurin 8u832 for AIX ppc64 at present as other Java versions on AIX ppc64 have a known issue that is being resolved by a dependency. These platforms may be released at a later date if the issues are resolved in the upstream implementations.

### New AIX version requirement

From this release onwards, all Temurin versions published for AIX now require AIX OS version 7.2.
