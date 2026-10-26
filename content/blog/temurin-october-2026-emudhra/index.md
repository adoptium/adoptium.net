---
title: October 2026 Eclipse Temurin releases address the eMudhra CA compromise
date: "2026-10-26"
author: pmc
description: The October 2026 Eclipse Temurin releases remove the roots that signed the compromised eMudhra intermediate CA certificates from the Temurin trust store. This post explains what changed, which versions to use, and how to verify your runtime.
tags:
  - temurin
  - security
  - announcement
---

The private keys of several eMudhra intermediate CA certificates have been compromised. Details are in the [public disclosure](https://emudhra.we-have-a-problem.com/) and the [OpenJDK advisory](https://openjdk.org/emudhra). Java runtimes that still trust the affected roots could accept fraudulent certificates for TLS connections, and potentially signed code.

**The October 2026 Eclipse Temurin releases address this issue.** We are actively releasing binaries with the fix for the eMudhra compromise. JDK 27, JDK 25, JDK 21, and JDK 17 release pipelines have been launched and binaries are published as testing completes.  You can keep track of the progress by following the [October 2026 release status issue](https://github.com/adoptium/temurin/issues/317).  As of October 26, 2026, we are awaiting the upstream build tags to be available in order to launch release pipelines for JDK 8 and JDK 11.

If you can wait for these releases, upgrading is the simplest and recommended mitigation.  However, there is other helpful guidance to mitigate this issue.  Please see the guidance at https://openjdk.org/emudhra with a caveat regarding the CheckCerts.java file provided.  It is specific to a particular implementation of a fix and checks for roots that were not compromised.

```java
// Other eMudhra roots, not related to the compromised intermediates
        "emSign Root CA - G1",
        "emSign Root CA - G2"
```

## What changed

Temurin builds its `cacerts` trust store from the [Mozilla CA certificate list](https://wiki.mozilla.org/CA), rather than the list bundled with upstream OpenJDK. The October 2026 Temurin builds use NSS 3.131.1 CA certificate data, in which the root certificates that signed the compromised intermediates have been removed:

- `emSign ECC Root CA - G3`
- `AAA Certificate Services`

Temurin's trust store also does not include `emSign Root CA - G2`.

## A note on `emSign Root CA - G1`

The updated OpenJDK advisory and its `CheckCerts` tool now flag four eMudhra-related roots, including `emSign Root CA - G1`. Mozilla still trusts G1 following its own analysis in [Mozilla bug 2083449](https://bugzilla.mozilla.org/show_bug.cgi?id=2083449), so it remains in the Temurin trust store, and [CheckCerts](https://cr.openjdk.org/~mr/CheckCerts.java) will correctly report it being present, but inappropriately report it as a BAD ROOT.  We will continue to follow Mozilla's decisions, and will update the trust store if they change.

## Verifying your runtime

Run the Temurin installation that runs your application against the test hosts documented at [emudhra.we-have-a-problem.com](https://emudhra.we-have-a-problem.com/). A protected runtime must reject every test certificate chain. Also confirm that ordinary HTTPS connections still succeed. These checks cover the TLS-issuing intermediates. They do not independently validate Java signed-code handling of the two code-signing intermediates.

You can also use the `CheckCerts` tool from the [OpenJDK advisory](https://openjdk.org/emudhra) to list any affected roots in your runtime's trust store, bearing in mind the note regarding the eMudhra root, `emSign Root CA - G1`, not related to the compromised intermediates.

## Which Temurin versions contain the fix?

Releases produced as part of the October 2026 release activities have a fix for the eMudhra issue.  The versions of Temurin with a fix are:

- JDK 27.0.1.0.2+1
- JDK 25.0.5+8
- JDK 21.0.13+9
- JDK 17.0.21+9
- JDK 11 - awaiting upstream tags
- JDK 8 - awaiting upstream tags

The Temurin binaries that we released last week for JDK 25 and JDK 21 have been fixed by updating our certdata.txt to the NSS_3_131_1_RTM nss tag via [temurin-build/pull/4587](https://github.com/adoptium/temurin-build/pull/4587).  Temurin differs from upstream OpenJDK in that Temurin binaries use Mozilla certs and with the 3.131.1 nss release of the certs data, the root certs that signed compromised intermediate certs have been removed from the trust store.

We will be delivering binaries out of our various distribution channels:

- Binaries are available from the [Temurin download page](https://adoptium.net/temurin/releases)
- Installable packages are updated at the same time as the binaries, follow instructions from [Adoptium package repositories](https://adoptium.net/installation/) documentation.
- Container images are available once all of the binaries of a particular JDK version are published and can be found at [Docker Hub](https://hub.docker.com/_/eclipse-temurin).

If you cannot upgrade right away, the OpenJDK advisory describes interim mitigations.

## Release notes

Full details for each release are in the [Temurin release notes](https://adoptium.net/temurin/release-notes/).

> When available, download and install an updated runtime from your preferred vendor. The runtime’s release note should document that it fixes issue JDK-8395690, CVE 2026-114820.

## How Can You Help

It is Adoptium's priority to deliver security patches as quickly as possible.  

1. You can assist in expediting fixes by sponsoring the project through the [Sustainer program](https://www.eclipse.org/sponsor/adoptium/).  This enables us have the necessary infrastructure to deliver multiple releases simultaneously, instead of waiting for limited resources.  

2. Check if someone has already raised a query on an issue before raising a duplicate.  This helps to reduce the noise and allow us to focus on delivering a release.

To follow on-going progress, see the [Temurin issue tracker](https://github.com/adoptium/temurin/issues/317) and the `#release` channel on [Adoptium Slack](https://adoptium.net/slack.html).
