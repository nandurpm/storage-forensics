# Src

## Purpose

Contains the production implementation of Storage Forensics: command handling, domain rules, storage, reports, and local serving as applicable.

## Contents

- `analyze.mjs` — Derives Storage Forensics's summaries and findings from normalized local metadata.
- `cli.mjs` — Implements Storage Forensics's command-line interface and coordinates validation, persistence, report generation, and local serving.
- `fixtures.mjs` — Provides deterministic synthetic fixtures for Storage Forensics's demonstrations and regression tests.
- `render.mjs` — Generates and serves Storage Forensics's demonstration report through a deployment-friendly HTTP host.
- `report.mjs` — Builds Storage Forensics's self-contained report artifacts and browser-side interactions from validated data.

## Responsibilities

Production behavior belongs here. Generated reports, user data, and repository documentation should remain outside this folder.

## Important Notes

- This folder is part of **Storage Forensics** and should be kept consistent with the commands and architecture documented in the root README.
- Paths and file roles listed above reflect the current repository implementation.

