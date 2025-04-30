---
title: AQAvit in 2025
date: "2025-05-02T12:20:00+00:00"
author: shelleylambert
description: This post highlights the recent new features, innovations, and tools in the AQAvit toolkit and looks forward to planned features for 2025.
tags:
  - aqavit
---

## What is AQAvit Again?
AQAvit is a project dedicated to quality assurance, verifying that OpenJDK binaries are production-ready and meet a stringent quality bar, including good performance, exceptional security, resilience, and the ability to pass a wide variety of application test suites and a broad set of workloads in diverse environments.

The AQAvit project exists not only to test Temurin binaries but offers a useful test suite, tools, and processes that all OpenJDK distributors can utilize and can contribute towards.

## Recent Innovations in AQAvit
The small but mighty team of contributors that work on AQAvit features continues to deliver valuable features and improvements.  The first quarter of 2025 was no exception and we will look at a few of the most interesting and impactful contributions, and why they are considered so important.

### Automated Re-Runs 
Auto-retry features for failed and unstable test pipelines now automatically re-execute failed test cases, significantly reducing human effort and machine time.  TODO: describe the 2 different types.

### Change-Based Testing (CBT) - Phase 1
Enables smarter testing by executing only the tests relevant to changed code areas. This cuts resource usage without sacrificing test coverage and quality.  TODO: Describe how phase 1 identifies what has changed upstream and the 'crude' correlation to test targets.  Hint at Phase 2 features, which gives a more precise correlation to test material (code coverage information).

### GUI Test Automation
Leveraging Amazon’s open-sourced Arctic tool, previously manual GUI testing is now automated.  TODO: link to documentation and thank David from Amazon for walking us through it.

### Improved Test Traceability & Reproducibility
Expanded support for reproducible testing through better SHA tracking and test material versioning, helping identify rare, hard-to-replicate bugs, a major boost for long-term test reliability and secure supply chains.  TODO: show TAP file snippet and describe how that can be 'fed back' into the system to reproduce the test environment.

### Performance Benchmarking Enhancements
Introduced interleaved benchmark testing and configurable visual indicators (“traffic lights”) to help detect regressions more accurately and quickly.  TODO: show screenshots of the "Traffic Lights".

## Data-driven Decisions
As per the original [AQAvit manifesto](https://github.com/adoptium/aqa-tests/blob/master/docs/pages/Manifesto.md), we continue to gather meaningful data to improve the AQAvit project and measure the value of our work.  These metrics drive decisions in the project.  

A recent example, we started gathering information during release periods on how many 'human interventions' were required either when unexpected testcase failures occurred or in the event of infrastructure issues.  With the new auto-rerun features, we radically reduce the effort required to triage our test pipelines.

## Looking Forward to the Remainder of 2025

### Trestle Initiative (Q3)
Aims to bridge upstream OpenJDK projects with Adoptium’s broad testing infrastructure for major feature validation.

### AI-Powered Tooling via GSoC (Q2–Q3)
Ongoing research includes CommitHunter (AI-based commit debugger) and GlitchWitcher (AI bug predictor), developed through Google Summer of Code collaborations

### Open-source Program Participation
As mentioned earlier, AQAvit actively seeks new contributions by participating in open-source programs like Google Summer of Code and Semesters of Code.  The AQAvit committers mentor new contributors to bring in new features, reduce technical debt, and generally improve the state of the project.  We look forward to the enthusiasm and creativity of new contributors and are motivated by what can be accomplished together.