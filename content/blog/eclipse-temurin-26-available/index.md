---
title: Eclipse Temurin 26 Available
date: "2026-04-13"
author: pmc
description: Adoptium is happy to announce the immediate availability of Eclipse Temurin 26. As always, all of our binaries are thoroughly tested and available free of charge without usage restrictions on a wide range of platforms.
tags:
  - temurin
  - announcement
  - release-notes
---

Adoptium is happy to announce the immediate availability of Eclipse Temurin 26+35. As always, all binaries are thoroughly tested and available free of charge without usage restrictions on a wide range of platforms. Binaries, installers, and source code are available from the [Temurin download page](https://adoptium.net/temurin/releases), [official container images](https://hub.docker.com/_/eclipse-temurin) are available at DockerHub, and [installable packages](https://adoptium.net/installation/) are available for various operating systems.

## Fixes and Updates

This release contains the following fixes and updates:

- [Temurin 26 release notes](https://adoptium.net/temurin/release-notes/?version=jdk-26+35)

## New and Noteworthy

### Headless JRE RPM Packages Available For JDK26

For server environments where no graphical components are required, a new headless JRE package is also available. This excludes GUI-related libraries such as AWT and reduces the overall installation footprint.

[source,bash]
----
sudo dnf install temurin-26-jre
----

### Coexistenance of JDK & JRE (via RPM installation) Is Now Prevented

Following the discussion in this Temurin issue, https://github.com/adoptium/installer/issues/1360 from JDK26 onwards, the installation of both the JDK & JRE RPM packages is no longer allowed. This is because the temurin-26-jre package takes the jdk-26-jre.tar.gz and installs it. The tar ball is the result of the legacy-jre-image target, which is a different jlink invocation than the full JDK.

For the JDK it includes all modules for legacy-jre-image it includes an (arbitrary) subset. With JDK 9+ there is no JRE that is a proper subset of the JDK. The lib/modules file differs depending on which modules got linked in. Therefore, there is no way one package can own that file and be a true subset (in terms of RPM packaging). It makes little sense to have two "runtimes" installed at the same time for any major version.

- One, call it **R**, including module set **A**
- Another, call it **R'**, including module set **B**

Where:

- `A ⊂ B`
- `files(R) ∩ files(R') ≠ ∅`


### Contributing To Eclipse Temurin

Looking to make an impact? We’re always looking for new contributors to help shape the future of open-source Java. Whether you’re interested in development, testing, or documentation, your expertise can help us continue to deliver high-quality runtimes to millions. Visit our Contributing page to learn how you can get involved and join our mission today.

### Become An Eclipse Temurin Sustainer

The Eclipse Temurin Sustainer Program invites enterprises to invest in the long-term sustainment of Eclipse Temurin and other Adoptium projects. By becoming a Sustainer, your company ensures that Temurin remains the industry's leading community-driven open source JDK for mission-critical Java workloads. This program supports the vendor-neutral development of runtimes and development kits, infrastructure and tools, quality assurance, enhanced security practices, community engagement, and more. See https://adoptium.net/en-GB/sustainers for more details.
