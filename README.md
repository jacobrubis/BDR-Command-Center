# BDR-Command-Center

A self-contained, browser-based operations dashboard built for enterprise sales development. No framework. No backend. No build step. Pure HTML, CSS, and JavaScript — deployable as static files to any host, including GitHub Pages.

Built by Jacob Rubis, BDR at ServiceNow (GBA Commercial Illinois & Midwest), as a personal productivity tool and proof of concept for AI-augmented sales workflows.

---

## What it is

The BDR Command Center is a 9-page dashboard that replaces scattered CRM views, spreadsheets, and manual prep with a single interface designed around how a BDR actually works. It covers the full workflow from inbound lead management through account intelligence, buying group coverage, campaign tracking, and AE alignment.

Every page is a single HTML file with all CSS and JavaScript inline. Nothing to install. Open in a browser and it works.

---

## Pages

| Page | What it does |
|---|---|
| `index.html` | Daily command center — KPI strip, AI daily brief, top-of-mind notes (full CRUD), recommended actions |
| `campaigns.html` | Campaign manager with 6-step wizard, contact tagging, campaign type logic, and lock rules by buying group |
| `buying-groups.html` | Stakeholder coverage tracker with AI signals, role assignment, ML-recommended members, org chart view |
| `leads.html` | SLA-tracked inbound leads with countdown timers, source filters, right-panel activity feed, and quick-view modals |
| `territory-leads.html` | 200 territory-level contacts with collapsible filter panel, ZoomInfo-style accordion filters, company/contact tagging, and campaign assignment |
| `accounts.html` | 340 real accounts across 7 AEs with industry column, Big Bet flags, Do Not Contact tags, AE filter chips |
| `opportunities.html` | Pipeline tracker with product summary cards, stage tabs, AE filters, and live opportunity update feed |
| `book-of-business.html` | Pod-level performance view — pipeline attainment bar, rep bars, meetings by rep, stage breakdown |
| `ae-alignment.html` | 1:1 prep hub — AE pod selector, meeting history, biweekly bullets, inbound lead routing, and Claude-powered recap generator |

---

## Features

**AI-Powered Recap Generator**
The AE Alignment page calls the Anthropic API directly from the browser to generate a biweekly summary email from Jacob to any AE in the pod. Input the AE, date range, and optional context — it outputs a ready-to-send update in first person, grounded in real activity data from the dashboard.

**Buying Group Intelligence**
Each buying group has a 5-role coverage map (Champion, Economic Buyer, Influencer, Ratifier, User), an org chart, confirmed member table, and an ML-recommended member list with accept/deny workflow and role assignment modal.

**Campaign Wizard**
A 6-step new campaign flow covering type selection, configuration, account assignment, research upload, contact tagging (AI suggestions or manual list), and sequence generation. Supports all 6 campaign types with lock rules for contact tags tied to specific buying groups.

**Territory Leads**
A full ZoomInfo-style prospecting view with 200 fictional leads, collapsible filter panel (buying group, AE, job level, department, industry, source, campaign status), company view toggle, and bulk tagging for campaign assignment.

**SLA Tracking**
Every inbound lead carries a countdown timer. Critical leads (under 4 hours or overdue) surface in a right-panel card stack and color-coded rows. The Leads page opens on SLA Critical by default.

---

## Design System

The dashboard uses a custom design system built on CSS variables, with no external UI library.

| Token | Value | Usage |
|---|---|---|
| `--ink` | `#032D42` | ServiceNow Infinite Blue — primary backgrounds, buttons |
| `--wasabi` | `#63DF4E` | ServiceNow Wasabi Green — accents, active states, badges |
| `--ink-nav` | `#01161f` | Top navigation bar |
| Sidebar | `#0d1f2b` | Collapsing 44px → 180px on hover |
| Font | DM Sans + DM Mono | Google Fonts |

AE colors are consistent across every page — each of the 7 AEs in the pod has a dedicated hex used for bubbles, pills, bar charts, and filter chips.

---

## Architecture

Every page follows the same shell:

```
Fixed top nav (44px)
  └── Fixed sidebar (44px collapsed, 180px expanded on hover)
       └── Main content area
            ├── Sticky page header (title, KPIs, cross-page ptabs, stage tabs)
            └── Page body (varies per page)
```

Data lives in JavaScript arrays at the top of each file. The dashboard is intentionally static — no API calls except the Claude recap generator. This makes it portable, fast, and zero-dependency outside of Google Fonts.

---

## Stack

- Vanilla HTML / CSS / JavaScript
- No framework, no bundler, no dependencies
- Google Fonts (DM Sans, DM Mono)
- Anthropic API (Claude Sonnet) for the recap generator on `ae-alignment.html`
- GitHub Pages for hosting

---

## Background

This project started as a personal workflow tool and grew into a full system over roughly 18 months. The core goal was to close the gap between what CRM shows and what a BDR actually needs to know on any given morning — who to call, what to say, which leads are expiring, and what each AE needs from you before the next 1:1.

It's also a live demonstration of what an AI-native sales workflow looks like in practice: tools built by the person using them, grounded in real data, designed for speed.

---

## Usage

Or visit the live site at [jacobrubis.github.io/BDR-Command-Center](https://jacobrubis.github.io/BDR-Command-Center).

---

## Notes

All account names, contact names, opportunity data, and lead records in this dashboard are either real accounts from the territory (company names only, no personal data) or fictional for demonstration purposes. No proprietary ServiceNow data is included.

---

*Built by Jacob Rubis · ServiceNow BDR · GBA Commercial Illinois & Midwest*
