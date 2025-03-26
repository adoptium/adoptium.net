---
title: Eclipse Temurin 24 Available
date: "2025-03-26T12:00:00+00:00"
author: pmc
description: Adoptium is excited to announce the immediate availability of Eclipse Temurin 24.
tags:
  - temurin
  - announcement
  - release-notes
---

Adoptium is happy to announce the immediate availability of Eclipse Temurin 24+36. As always, all binaries are thoroughly tested and available free of charge without usage restrictions on a wide range of platforms. Binaries, installers, and source code are available from the [Temurin download page](https://adoptium.net/temurin/releases), [official container images](https://hub.docker.com/_/eclipse-temurin) are available at DockerHub, and [installable packages](https://adoptium.net/installation/) are available for various operating systems.

## Fixes and Updates

* [Temurin 24 Release Notes](https://adoptium.net/temurin/release-notes/?version=jdk-24+36), including [fixes in OpenJDK 24](https://bugs.openjdk.org/issues/?jql=project+%3D+JDK+AND+fixVersion+%3D+24)

## Overview of Java 24 Features

As mentioned in this Adoptium blog post [Eclipse Temurin JDK 24.0.0+36 enables JEP 493](https://adoptium.net/blog/2025/03/eclipse-temurin-jdk24-JEP493-enabled/),

* [JEP 493: Linking Runtime Images without JMODs](https://openjdk.org/jeps/493)

is available in this release. Some other features available in this release include the following:

* [JEP 472: Prepare to Restrict the Use of JNI](https://openjdk.org/jeps/472)

* [JEP 475: Late Barrier Expansion for G1](https://openjdk.org/jeps/475)

* [JEP 478: Key Derivation Function API (Preview)](https://openjdk.org/jeps/478)

* [JEP 479: Remove the Windows 32-bit x86 Port](https://openjdk.org/jeps/479)

* [JEP 483: Ahead-of-Time Class Loading & Linking](https://openjdk.org/jeps/483)

* [JEP 484: Class-File API](https://openjdk.org/jeps/484)

* [JEP 485: Stream Gatherers](https://openjdk.org/jeps/485)

* [JEP 486: Permanently Disable the Security Manager](https://openjdk.org/jeps/486)

* [JEP 494: Module Import Declarations (Second Preview)](https://openjdk.org/jeps/494)

For a complete list of the enhancements (including ones that only impact developers of OpenJDK), [see the JDK 24 overview over at OpenJDK](https://openjdk.org/projects/jdk/24/).

## New and Noteworthy

### ppc64 AIX unavailable for JDK 24

Temurin jdk-24+36 for the AIX platform is currently unavailable.  A small number of test failures indicated that there is need to investigate and update the upstream codebase.  We hope that this platform on JDK 24 will be ready for release for the April CPU.

### Linux installation packages changes

For JDK 24 onwards, a change has been made for the RPM distribution filenames uploaded to packages.adoptium.net, to align with other JDK vendors RPM file naming. Adoptium will now use the

&lt;java&gt;-&lt;feature version&gt;&lt;-vendor&gt;

naming convention designed by http://www.jpackage.org/.

e.g, following the previous conventions for Temurin, the release RPM would have looked like the below:

temurin-24-jdk-24.0.0.0.0.36-0.x86_64.rpm

Whereas from JDK24 onwards, the package filenames will look like this:

java-24-temurin-jdk-24.0.0.0.0.36-0.x86_64.rpm

This change is only being made for the currently supported RPM based distributions available via the package repositories listed below.

| Distribution   | Versions              |
|----------------|-----------------------|
| CentOS         | 7, 9, 10              |
| Rocky          | 8                     |
| RHEL           | 7, 8, 9               |
| Fedora         | 40, 41, 42 |
| OracleLinux    | 7, 8                   |
| Amazon Linux   | 2                     |
| openSUSE       | 15.3, 15.4, 15.5      |
| SLES           | 12, 15                |

It is also worth noting, that the existing installation instructions do not require updating, and that both dnf install java-24-temurin-jdk and dnf install temurin-24-jdk have the same results.

Package names for Alpine & Debian based distributions have not been updated.
