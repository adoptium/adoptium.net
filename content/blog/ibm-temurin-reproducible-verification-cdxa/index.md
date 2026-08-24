---
title: "IBM's Independent Verification of Eclipse Temurin Reproducible Builds: A 3rd Party CDXA Attestation Story"
date: "2026-07-29T12:00:00+00:00"
author: andrewleonard
description:
  IBM, as a member of the Eclipse Adoptium Working Group, has independently verified Eclipse Temurin
  JDK 21 and JDK 25 releases on Windows x64 and Linux x64, publishing signed CycloneDX Attestation
  (CDXA) documents to the temurin-cdxa repository — alongside Red Hat — as one of the first
  3rd party verifiers of the new Reproducible Verification Builds capability.
tags:
  - temurin
  - reproducible
  - security
  - supply-chain
---

## Background

With the **July 2026 release of Eclipse Temurin**, the Adoptium project launched its new
[**3rd Party Reproducible Verification Builds**](https://adoptium.net/blog/2026/07/adoptium-reproducible-verification-builds/)
capability — enabling any motivated third party to independently confirm that an official Temurin
binary is a byte-for-byte match for what you would get if you rebuilt it yourself from the same
source and toolchain recipe encoded in its published SBOM.

As a founding member of the [Eclipse Adoptium Working Group](https://adoptium.net/en-GB/members/),
IBM — alongside **Red Hat**, another Adoptium Working Group member — has been one of the first
independent organisations to exercise this new capability end-to-end: setting up our own internal
infrastructure, running automated verification builds, generating signed CycloneDX Attestation
(CDXA) documents, and submitting them to the public
[`temurin-cdxa`](https://github.com/adoptium/temurin-cdxa) repository.

This post describes how IBM approached it, what we built internally to automate the process, and
what it means for the broader Temurin supply chain trust story.

---

## What Is Reproducible Verification?

A **reproducible build** is one where, given the same source code and the same build environment, any
party can independently produce a byte-for-byte identical binary. For Temurin this means:

1. The SBOM published alongside every Temurin release encodes the _exact_ compiler toolchain, SDK
   versions, build flags, and environment settings used by the official Eclipse build infrastructure.
2. A willing third party follows that recipe — using their **own independently secured toolchain** —
   and rebuilds the JDK from scratch.
3. A scripted comparison (`repro_compare.sh`) checks every file in the expanded archive for
   byte-for-byte identity against the official Temurin binary.
4. A **100% identical** result constitutes a verified attestation that the official binary genuinely
   corresponds to the published source.

This is distinct from simply _trusting_ the Adoptium supply chain. Reproducible Verification allows
**any motivated third party** to independently confirm what Adoptium already believes to be true —
providing an additional, independently sourced layer of trust.

---

## IBM's Independently Secured Toolchains

A core requirement for a meaningful 3rd party verification is that the verifier's toolchain is
**independently secured** — not obtained from Adoptium, but built or installed from primary sources
and verified against the SBOM specifications.

### GCC DevKit: Built from Source at IBM

For Linux x64 verification, Temurin uses a **GCC DevKit** — a precisely specified GCC toolchain
defined by exact source versions, sysroot RPMs, and build flags. The SBOM for each release records
which DevKit version was used.

IBM built our own internal GCC DevKit entirely from source:

- Source versions matched exactly those specified in the Temurin release SBOM
- GPG-verified sources and sysroot RPMs were obtained independently
- The resulting DevKit was built within IBM's own internal secure build environment

This means our Linux verification used a GCC compiler that IBM compiled from source — entirely
independently of Adoptium's own DevKit binaries — yet byte-for-byte reproducible because both
were built from the same precisely specified recipe.

### Microsoft Visual Studio: Independently Installed

For Windows x64 verification, Temurin uses **Microsoft Visual Studio Build Tools**. The SBOM
records the exact Visual Studio version (and component versions) used in the official build.

IBM independently installed the official Microsoft Visual Studio Build Tools edition, matching
the precise version specified in the Temurin release SBOM. This installation was performed on
IBM-managed Windows infrastructure, entirely independently of Adoptium's own build machines.

---

## IBM's Internal Automation: Jenkins-Based Verification Pipeline

Rather than running one-off manual verifications, IBM built an **internal Jenkins automation
pipeline** to systematically verify Temurin releases as they are published.

### What the pipeline does

For each target release (JDK 21 and JDK 25, Windows x64 and Linux x64), the Jenkins jobs automate
the following end-to-end workflow:

1. **Fetch the release SBOM** from `api.adoptium.net` for the target JDK version, platform, and
   architecture
2. **Fetch the official Temurin binary** from the Adoptium API
3. **Invoke the platform verification script** from the
   [`temurin-build`](https://github.com/adoptium/temurin-build) repository, passing the IBM-built
   toolchain:

   - Linux x64: `linux_repro_build_compare.sh` — using the IBM-built GCC DevKit
   - Windows x64: `windows_repro_build_compare.sh` — using the IBM-installed Visual Studio Build Tools

4. **The script rebuilds the JDK from upstream OpenJDK sources** using the exact toolchain and flags
   described in the SBOM, then runs `repro_compare.sh` to perform a file-by-file byte comparison
   against the official binary
5. **On a 100% successful match**, the script produces a `reproducible_evidence.log` recording the
   full verification result, including the SHA-256 of the verified binary
6. **Automatically invoke `TemurinGenCDXA`** to generate a `CDXA.xml` CycloneDX Attestation document
   from the evidence log, attesting `VERIFIED_REPRODUCIBLE_BUILD` on behalf of IBM

A successful pipeline run produces output confirming 100% reproducibility:

```
Number of files: 108721

2026-04-17T21:26:20+0000 : Comparing expanded JDKs from jdk-21.0.11+9-ea-beta
                           with reproJDK/jdk-21.0.11+9-ea-beta ...
2026-04-17T21:27:09+0000 : diff complete - rc=0.

Number of differences: 0
ReproduciblePercent = 100 %
Successful 100% Reproducible Verification
Eclipse Temurin version: jdk-21.0.11+9-ea-beta
                   arch: x64
                     os: linux
                 sha256: 51111aa918a1b3e4f59e1ce3179f1a17345a7024825ce98d634820c38d9a46a2
```

### Why automate it?

Manual one-off verifications are valuable but fragile. By building a Jenkins pipeline, IBM can:

- **Verify every CPU release** of the target platforms without manual intervention
- **Produce a consistent, auditable trail** of verification runs tied to specific build numbers
- **Respond quickly** when a new Temurin release is published, keeping attestations current
- **Scale to additional platforms** as the Temurin reproducible verification support expands

---

## Generating and Signing the CDXA Attestation

After a successful verification run, the pipeline automatically calls the
[`TemurinGenCDXA`](https://github.com/adoptium/temurin-build/blob/master/cyclonedx-lib/src/temurin/sbom/TemurinGenCDXA.java)
Java client to generate a correctly structured **CycloneDX Attestation (CDXA)** document:

```bash
java -cp "build/jar/temurin-gen-cdxa.jar:build/jar/cyclonedx-core-java.jar:..." \
  temurin.sbom.TemurinGenCDXA \
  --verbose \
  --createNewCDXA \
  --cdxa-output-folder build \
  --attesting-org-name 'IBM' \
  --predicate VERIFIED_REPRODUCIBLE_BUILD \
  --evidence reproducible_evidence.log \
  --affirmation-stmt 'IBM confirms a verified reproducible build of Eclipse Temurin. IBM public signing key available at ...'
```

`TemurinGenCDXA` validates the evidence SHA-256 against the live Adoptium API before producing the
document — an additional cross-check that the evidence log refers to the genuine published binary.

The resulting `CDXA.xml` is then **manually cryptographically signed** with the "IBM Adoptium Team"
GPG key, producing the accompanying `.xml.sig` file, and filed under the path convention required
by the `temurin-cdxa` repository:

```
<major>/<jdk-tag>/<jdk-tag_arch_os_IBM>.xml
<major>/<jdk-tag>/<jdk-tag_arch_os_IBM>.xml.sig
```

For example:

```
21/jdk-21.0.11+10/jdk_21_0_11_10_x64_linux_IBM.xml
21/jdk-21.0.11+10/jdk_21_0_11_10_x64_linux_IBM.xml.sig
25/jdk-25.0.4+7/jdk_25_0_4_7_x64_windows_IBM.xml
25/jdk-25.0.4+7/jdk_25_0_4_7_x64_windows_IBM.xml.sig
```

---

## Submitting to temurin-cdxa

The signed CDXA documents are submitted via **Pull Request** to the public
[`adoptium/temurin-cdxa`](https://github.com/adoptium/temurin-cdxa) repository. Full submission
requirements and conventions are described in the repository's
[`CONTRIBUTING.md`](https://github.com/adoptium/temurin-cdxa/blob/main/CONTRIBUTING.md).

This repository is the permanent, publicly auditable record of all third-party verifications of
Temurin releases. Anyone can inspect the signed attestations, verify the signatures, and trace the
chain from the official SBOM through to the IBM verification evidence.

IBM and Red Hat have submitted verified attestations for the following releases:

| JDK Version | Platform | Architecture | IBM | Red Hat |
|---|---|---|---|---|
| jdk-21.0.11+10 | Linux | x64 | ✅ | — |
| jdk-21.0.11+10 | Windows | x64 | ✅ | — |
| jdk-21.0.11+10 | Windows | aarch64 | ✅ | — |
| jdk-21.0.12+8 | Linux | x64 | ✅ | — |
| jdk-21.0.12+8 | Windows | x64 | ✅ | — |
| jdk-25.0.2+10 | Windows | x64 | ✅ | ✅ |
| jdk-25.0.3+9 | Linux | x64 | ✅ | — |
| jdk-25.0.3+9 | Windows | x64 | ✅ | ✅ |
| jdk-25.0.4+7 | Linux | x64 | ✅ | — |
| jdk-25.0.4+7 | Windows | x64 | ✅ | — |

---

## Visibility on adoptium.net: The "Reproduced by a 3rd Party" Icon

One of the most immediately user-visible outcomes of IBM's verification work is the new badge that
now appears on the [Temurin Releases page](https://adoptium.net/temurin/releases).

Every Temurin binary carries trust badges alongside its download entry. With IBM's submissions to
`temurin-cdxa`, the releases we have verified now display the third badge:

| Badge | Meaning |
|---|---|
| **JCK Certified** | The build has passed the Java SE Technology Compatibility Kit |
| **AQAvit Verified** | The build has passed the Eclipse AQAvit quality verification suite |
| **Reproduced by a 3rd party** ⭐ | At least one independent third party has successfully reproduced this binary byte-for-byte and published a signed CycloneDX Attestation |

The badge is **entirely data-driven**: it appears automatically on any download row for which a
merged CDXA attestation in `temurin-cdxa` matches the binary's SHA-256 checksum — no website
deployment required. IBM's verified JDK 21 and JDK 25 releases on Windows x64 and Linux x64 now
carry this badge.

---

## Why This Matters for the Java Ecosystem

IBM is one of the largest users and contributors to the Java ecosystem, and we take supply chain
integrity seriously. The goal of publishing these attestations is not just to meet an internal
compliance bar, but to **contribute to a public record of trust** that benefits every organisation
consuming Temurin binaries.

Alongside Red Hat, who have similarly been submitting attestations for JDK 25 Windows x64, IBM's
participation demonstrates that the programme is gaining real traction across the Adoptium Working
Group membership. By sharing our approach — end-to-end automation from independent toolchain setup
through to signed attestation submission — we hope to lower the barrier for other organisations to
do the same. The more independent verifiers that participate, the stronger the supply chain
assurance for the entire Java community.

Modern software supply chain attacks can produce binaries that are indistinguishable from legitimate
ones unless you can verify the build end-to-end. Eclipse Temurin is one of the most widely deployed
JDK distributions in the world, with **over 300 million downloads in 2025** consumed across
GitHub Actions, Docker Hub, Homebrew, and Linux package managers in every major enterprise. IBM's
independent verification is a concrete contribution to ensuring that trust is well-founded.

---

## Getting Involved

This programme succeeds through **community participation**. IBM and Red Hat have led the way as
the first Working Group members to submit attestations, but we actively encourage other organisations
— particularly those who run their own Java infrastructure or operate in regulated industries — to
participate.

To get started:

1. **Read the platform-specific wiki guide** for your operating system:
   - [All platform guides](https://github.com/adoptium/temurin-build/wiki/Temurin-3rd-Party-Reproducible-Verification-Guides)
   - [Windows x64 step-by-step guide](https://github.com/adoptium/temurin-build/wiki/Step%E2%80%90by%E2%80%90step:-Temurin-reproducible-verification-instructions-for-Windows-x64)
2. **Set up your own independently secured toolchain** (GCC DevKit from source for Linux, official
   Microsoft Visual Studio for Windows)
3. **Run the verification script** against any current Temurin LTS or feature release
4. **Generate and sign a CDXA.xml** using `TemurinGenCDXA`
5. **Submit a Pull Request** to [`temurin-cdxa`](https://github.com/adoptium/temurin-cdxa)

Questions or non-100% results? Please consult the
[problem diagnosis and reporting guidance](https://github.com/adoptium/temurin-build/wiki/Temurin-3rd-Party-Reproducible-Verification-Guides#reporting-reproducible-verification-problems-or-failures)
before opening an issue.

---

## Summary of Resources

| Resource | Link |
|---|---|
| All platform verification guides | [temurin-build wiki](https://github.com/adoptium/temurin-build/wiki/Temurin-3rd-Party-Reproducible-Verification-Guides) |
| Windows x64 step-by-step guide | [wiki](https://github.com/adoptium/temurin-build/wiki/Step%E2%80%90by%E2%80%90step:-Temurin-reproducible-verification-instructions-for-Windows-x64) |
| Verification scripts | [`tooling/reproducible/`](https://github.com/adoptium/temurin-build/tree/master/tooling/reproducible) |
| CDXA generation tooling | [`cyclonedx-lib/`](https://github.com/adoptium/temurin-build/tree/master/cyclonedx-lib) |
| Public attestation repository | [temurin-cdxa](https://github.com/adoptium/temurin-cdxa) |
| CDXA contribution guide | [CONTRIBUTING.md](https://github.com/adoptium/temurin-cdxa/blob/main/CONTRIBUTING.md) |
| Adoptium binary & SBOM API | [api.adoptium.net](https://api.adoptium.net) |

---

## About the Author

**Andrew Leonard** is the Eclipse Temurin Build & Distribution Lead at IBM and a member of the
Eclipse Adoptium PMC. He leads the engineering work on Temurin's build pipelines, reproducible
build tooling, and supply chain security initiatives.
