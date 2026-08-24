---
title: Eclipse Temurin Reproducible Verification Builds — July 2026 Update
date: "2026-07-29T12:00:00+00:00"
author: andrewleonard
description:
  An update to the 2024 Temurin Reproducible Verification Builds blog. Eclipse Temurin JDK 21+
  builds are fully reproducible. This blog explains the new automation scripts, how third-party
  organisations can publish signed CycloneDX Attestation (CDXA) documents, and the new
  "Reproduced by a 3rd party" badge on adoptium.net.
tags:
  - temurin
  - reproducible
  - security
  - supply-chain
---

### What is a third-party Reproducible Verification Build?

A third-party reproducible verification build is a re-build of an official software product release, built purely from upstream sources and
securely obtained and verified tooling, in a secure and well defined build environment. Its purpose is to help maintain trust in the supply chain
by providing a mechanism for independent verification of the software integrity of the official releases. The trust of the supply chain is very
important from the perspective of ensuring no vulnerabilities or malware affect the released software.

An important aspect for performing an independent reproducible build is the security and source of the build environment. The upstream product
sources, build scripts and toolchain must be original securely obtained sources, and any system binaries must be securely verified by signatures.
Once completed, a byte-for-byte identical comparison with the official software product release binaries will then validate to a very high degree
the security of the supply chain used and that the official release binary is secure and has not been tampered with.

This is an update to the [2024 Temurin Reproducible Verification Builds blog](https://adoptium.net/blog/2024/08/adoptium-reproducible-verification-builds/),
which described the foundations of the programme. Since then we have introduced dedicated automation scripts, a CycloneDX Attestation (CDXA)
publishing workflow, and a new trust badge on adoptium.net — all covered below.

### Eclipse Temurin JDK 21+ now "Fully Reproducible"

In my earlier blog [Reproducible Builds at Eclipse Adoptium](https://adoptium.net/blog/2022/06/adoptium-reproducible-builds/), I explained
how the Adoptium community has been working to achieve fully "Reproducible Builds" for the Eclipse Temurin JDK 21+ releases,
and how that helps provide better secure supply chain validation, and improved build pipeline quality and script verification.
Eclipse Temurin JDK 21+ releases are now fully reproducible for the platforms x64 Linux, aarch64 Linux, ppc64le Linux, s390x Linux, x64 Windows, x64 Mac and aarch64 Mac,
and we have introduced new [Eclipse AQAvit](https://projects.eclipse.org/projects/adoptium.aqavit) reproducible comparison tests for reproducibility.

### Using a "GCC DevKit" to build Eclipse Temurin

Up until recently Eclipse Temurin Linux builds were compiled using a custom Adoptium build of GCC from source, which due to its unique
source build nature, would mean in order for a third-party to identically re-build, then the very same Adoptium GCC
[compilers](https://ci.adoptium.net/userContent/gcc/) would need to be downloaded. This then presents a potential toolchain vulnerability
in relying on the very same GCC compiler binary. As of Eclipse Temurin JDK 21.0.3, the Adoptium build scripts and pipelines for the Linux
GCC build platforms, have been upgraded to use a "GCC DevKit". This defines an absolute definition of a GCC toolchain,
the GCC and dependency source versions, the sysroot used, and how it is exactly built. Eclipse Adoptium publishes the DevKits that are
used in the repository [https://github.com/adoptium/devkit-binaries/releases](https://github.com/adoptium/devkit-binaries/releases).
Due to the way the DevKit is defined, a third-party can re-build the exact same toolchain purely from GPG-verified sources and GPG-verified
sysroot RPMs. This independent build of the GCC toolchain allows another secure level of validation of the supply chain used to build the
compiler, subsequently used to build the Eclipse Temurin binaries.

## Independently fully reproducible Eclipse Temurin

Combining the use of the "GCC DevKit", the well defined Eclipse Temurin reproducible build pipeline and the generated Software Bill
of Materials (SBOM), allows a documented and independent method for third-parties to perform a reproducible build.
By comparing the independently built binary with the official Eclipse Temurin release, any discrepancies or tampering can be detected,
ensuring that the release has been securely and correctly built. These third-party reproducible builds help maintain trust in the supply chain
by providing a mechanism for independent verification of software integrity of the Eclipse Temurin release binaries.

## How to perform a third-party reproducible verification build

To perform your own reproducible verification build of an Eclipse Temurin JDK 21+ official release, platform-specific scripts are available
in the [`tooling/reproducible/`](https://github.com/adoptium/temurin-build/tree/master/tooling/reproducible) directory of the
`temurin-build` repository:

| Script | Platform |
|---|---|
| `linux_repro_build_compare.sh` | Linux (x64, aarch64, ppc64le, s390x) |
| `macos_repro_build_compare.sh` | macOS (x64, aarch64) |
| `windows_repro_build_compare.sh` | Windows x64 |

Each script reads the SBOM published alongside the official Temurin release to determine the exact compiler toolchain, SDK versions,
build flags, and environment settings used by the Eclipse build infrastructure. It then rebuilds the JDK from upstream OpenJDK community
sources using your own independently secured toolchain, and runs a byte-for-byte comparison against the official binary using `repro_compare.sh`.

Full step-by-step guides for setting up your independent toolchain and running the scripts are available on the Adoptium wiki:

- [All platform verification guides](https://github.com/adoptium/temurin-build/wiki/Temurin-3rd-Party-Reproducible-Verification-Guides)
- [Windows x64 step-by-step guide](https://github.com/adoptium/temurin-build/wiki/Step%E2%80%90by%E2%80%90step:-Temurin-reproducible-verification-instructions-for-Windows-x64)

A successful run produces a `reproducible_evidence.log` confirming 100% reproducibility:

```
Number of differences: 0
ReproduciblePercent = 100 %
Successful 100% Reproducible Verification
Eclipse Temurin version: jdk-21.0.11+10
                   arch: x64
                     os: linux
                 sha256: 51111aa918a1b3e4f59e1ce3179f1a17345a7024825ce98d634820c38d9a46a2
```

## Publishing Your Attestation: CycloneDX Attestation (CDXA)

A successful verification is only as useful as the evidence you publish. To give the community a
permanent, auditable record of third-party verifications, Adoptium has created the
[**temurin-cdxa**](https://github.com/adoptium/temurin-cdxa) repository as a dedicated home for
signed **CycloneDX Attestation (CDXA)** documents.

[CycloneDX](https://cyclonedx.org) is the open SBOM standard already used by Temurin to publish
build provenance for every release. The **Attestation** format (CDXA, schema version 1.6) extends
this by allowing a third party to formally record a verifiable claim — `VERIFIED_REPRODUCIBLE_BUILD`
— against a specific Temurin binary, backed by the `reproducible_evidence.log` produced by the
verification scripts.

### Generating a CDXA.xml

The [`TemurinGenCDXA`](https://github.com/adoptium/temurin-build/blob/master/cyclonedx-lib/src/temurin/sbom/TemurinGenCDXA.java)
Java client automates generation of a correctly structured CDXA document from the evidence log:

```bash
java -cp "build/jar/temurin-gen-cdxa.jar:build/jar/cyclonedx-core-java.jar:..." \
  temurin.sbom.TemurinGenCDXA \
  --verbose \
  --createNewCDXA \
  --cdxa-output-folder build \
  --attesting-org-name 'Your Org Name' \
  --predicate VERIFIED_REPRODUCIBLE_BUILD \
  --evidence reproducible_evidence.log \
  --affirmation-stmt 'Your Org confirms a verified reproducible build. Public signing key at ...'
```

The tool validates the evidence SHA-256 against the live Adoptium API to confirm the hash matches
the official published binary before producing the document.

### Signing and submitting

The generated `CDXA.xml` must be cryptographically signed (producing an accompanying `.xml.sig`
file) and submitted via Pull Request to [`adoptium/temurin-cdxa`](https://github.com/adoptium/temurin-cdxa),
filed under a path convention that embeds the JDK version, architecture, and OS:

```
<major>/<jdk-tag>/<jdk-tag_arch_os_OrgName>.xml
<major>/<jdk-tag>/<jdk-tag_arch_os_OrgName>.xml.sig
```

Full submission requirements and conventions are described in the repository's
[`CONTRIBUTING.md`](https://github.com/adoptium/temurin-cdxa/blob/main/CONTRIBUTING.md).
The attestation record is then permanently associated with the Temurin release for anyone to
inspect and verify.

## The "Reproduced by a 3rd Party" Icon on adoptium.net

Every Temurin binary on the [Temurin Releases page](https://adoptium.net/temurin/releases) carries
trust badges alongside its download entry. When a signed CDXA attestation is merged into
`temurin-cdxa` and its SHA-256 matches a downloadable binary, that release automatically gains the
**"Reproduced by a 3rd party"** badge — no website deployment required.

| Badge | Meaning |
|---|---|
| <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="rgb(83,127,185)"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg> **JCK Certified** | The build has passed the Java SE Technology Compatibility Kit |
| <img src="/images/icons/aqavit-icon.png" width="25" height="25" alt="AQAvit logo" title="This build is AQAvit Verified"/> **AQAvit Verified** | The build has passed the Eclipse AQAvit quality verification suite |
| <img src="/images/icons/reproduced-verified.svg" width="25" height="25" alt="Reproduced by a 3rd party" title="This build is reproduced by a 3rd party"/> **Reproduced by a 3rd party** | At least one independent third party has successfully reproduced this binary byte-for-byte and published a signed CycloneDX Attestation |

IBM and Red Hat are the first Working Group members to have submitted CDXA attestations, covering
JDK 21 and JDK 25 releases on Linux x64 and Windows x64. The verified releases now carry the badge
live on [adoptium.net](https://adoptium.net/temurin/releases?version=25).

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

### Summary

Today's Enterprise Software needs to be more secure and safe from vulnerability attacks than ever before. Providing methods
for ensuring the security of the supply chain and ways of demonstrating the quality of the products delivered are essential.
The ability to perform secure verification using a third-party Eclipse Temurin reproducible build greatly extends the security
and confidence in the supply chains used by the Eclipse Adoptium community. By publishing signed CDXA attestations to the
public `temurin-cdxa` repository, independent verifiers contribute to a permanent, auditable record of trust that benefits
every organisation consuming Temurin binaries.
