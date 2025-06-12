---
title: Eclipse Temurin 11.0.20.1, 17.0.8.1 now available
date: "2023-08-30T12:00:00+00:00"
author: pmc
description: Adoptium is happy to announce the immediate availability of Eclipse Temurin 11.0.20.1 and 17.0.8.1.
tags:
  - temurin
  - announcement
  - release-notes
---

Adoptium is happy to announce the immediate availability of Eclipse Temurin 11.0.20.1 and
17.0.8.1. This is a small release to fix the following bug:

https://bugs.openjdk.org/browse/JDK-8313765

As an alternative workaround if you experience this problem you can set the
following system property:

```sh
 -Djdk.util.zip.disableZip64ExtraFieldValidation=true
```

However the recommended option is to update to the new version.
