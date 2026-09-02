---
title: JDK 27 Will No Longer Be Built for macOS x64
date: "2026-09-02T12:00:00+00:00"
author: georgeadams
description: Eclipse Temurin JDK 27 will not be published for macOS x64 due to hardware availability and the retirement of the upstream port
tags:
  - temurin
  - announcement
  - end-of-service
---

The Adoptium community is committed to providing high-quality, open-source builds of Eclipse Temurin for the most actively maintained and widely used platforms. As part of that commitment, we are announcing that **Eclipse Temurin JDK 27 will not be built or published for macOS x64 (Intel)**.

## Why we are making this change

There are two main reasons behind this decision:

- **Availability of machines.** Apple has transitioned its entire Mac lineup to Apple Silicon (aarch64), and Intel-based Mac hardware is becoming increasingly difficult to source and maintain for our build, test, and release infrastructure. Without reliable access to this hardware, we cannot sustain the quality bar our community expects.
- **The upstream port is going to be [deprecated for JDK 28.](https://openjdk.org/jeps/541)** The OpenJDK macOS x64 port itself will no longer be actively maintained starting with JDK 28 upstream. Since the upstream maintenance is going to end for the macos x64 port upstream for JDK 28, we propose to stop building that port a release early: JDK 27. Users are advised to use the macos aarch64 JDK 27 port instead.

## What this means for you

Temurin JDK 27 will continue to be available for macOS on Apple Silicon (aarch64). Existing releases of earlier JDK versions on macOS x64 are unaffected by this announcement.

If you are running on an Intel-based Mac, macOS provides the [Rosetta 2](https://support.apple.com/en-us/HT211861) translation layer, but we encourage users to plan their transition to Apple Silicon where possible.

## Your feedback matters

We understand that changes like this can have an impact, and we want to hear from you. If your organisation depends on Temurin for macOS x64, or if you have questions or concerns, please add a comment to the tracking issue so we can gather feedback and understand the needs of the community:

- https://github.com/adoptium/adoptium/issues/344

## Looking Ahead

The Adoptium project remains dedicated to providing reliable, secure, and performant Java builds. By focusing our resources on actively maintained and widely used platforms, we can continue to deliver the highest quality builds for the vast majority of our community.

Thank you for being a part of the Adoptium community.
