# RTL report card

How data tools behave in Persian. Results: https://hadimobarra.github.io/rtl/

- `translations/audit.py`: checks Persian translation files (Python standard library only). Output in `translations/out`.
- `probe.mjs`, `tools.mjs`: open each tool in English and Persian and record language, direction, mirroring and text. Raw results and screenshots in `results`.
- `superset/`: configuration and Persian test data for a local Superset container.

Pilot of 24 November 2026: Apache Superset 6.1.0 and OpenMetadata 1.12.14, desktop, default settings. Translation files are from each project's main branch on that day and stay under their Apache License 2.0.
