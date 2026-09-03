# Product

## How will customers use this product

Teamfluence finds prospects from LinkedIn signals and pushes them into sales workflows. The new product uses the same signal data, but with a different focus: to learn which content actually finds the right people. Not just people who match the ICP, but people who actually want to engage with the customer.

Two new features improve the first phase of the engagement process:

1. Customers can import their own contact list from a CRM or a CSV, enrich it with LinkedIn URLs and verified emails, and cross-reference it against the signals the product captures.

2. Qualified leads can be engaged automatically through connection requests and direct messages. All responses flow into one company-wide inbox, so any team member or the content agency can reply. AI can draft replies from a client-specific FAQ and send them automatically when the match is close enough.

In addition, customers can export qualified leads back to their CRM or download them directly from a self-service section. They can also report which qualified leads continued their journey off-platform. This metric is used to better evaluate content.

The biggest differentiator is content evaluation. The product uses the two key metrics, qualified leads and meetings, to filter which content actually works. It does not just show which post got the most reach. It shows which content found the right people, and which content led to meetings. From this pattern, the product can propose better content for this specific customer and this specific audience. The product learns what content works best, not in general, but for the exact customer base the customer is trying to reach.

## Feature inventory

**A. Core Signal Engine** *(reused from Teamfluence)*
- Browser-extension based capture: profile visits, likes, comments, shares, follows, new connections.
- Three tracked sources: **Team** (own/client posts — no distinction between agency-written and exec-written, both count equally), **Influencers**, **Keywords** — influencer/keyword tracking exists purely for **audience expansion** (finding new people outside your existing network who already care about your topic), not benchmarking.
- Pricing: per-account/team, ~10-seat minimum per client — "whole team, one company voice."

**B. Content & Signal Analytics** *(reused dashboard, extended)*
Confirmed IA from the existing v1 dashboard:
- **Workspace**: Agency Overview (multi-client roll-up: health / performance / activity / process per client) → Overview (single workspace) → Goals.
- **Pulse**: New people · Active posts · Signals — each with tabs **All people / Followers / Leads / Meets** (⚠️ Meets tab already stubbed in the IA but unbuilt — the meeting-attribution gap is a known, anticipated hole).
- **Tracked Content**: Team · Influencers · Keywords — each with its own analytics page.
- **Processes**: Campaigns · Workflows.
- **System**: Health (per-member sync status, LinkedIn connection status, actions/day).
- Recurring page pattern: 3-number header (new people / active posts / signals) → overview cards (reactions, comments, profile views, followers, connections, DMs, with period deltas) → demographics (industry, title, seniority, company size) → geography (map + country/continent) → trend chart → detail table with **ICP match** and **engagement score** columns per person.
- Extension needed: link signals to a specific **content object** (the post that triggered them), not just to source-type, and build out the Meets tab.

**C. Workflow Engine** *(reused as-is)*
- "If this, then that" automation: e.g. new lead → ICP-matching agent → auto-connect/invite.
- Needs to support **multiple ICP-matching profiles** per workflow (see E).

**D. Unified Company Inbox + AI-assisted replies** *(net new)*
- Central inbox for all connection/DM responses, replacing today's setup where responses land in each individual's personal LinkedIn inbox with no central handling.
- Per-client/workspace **FAQ/knowledge base** upload.
- AI drafts replies, confidence-tiered: low/medium confidence → human presses send; high confidence (near-exact canned-answer match) → auto-send.
- The mechanism that closes the loop from signal → conversation → **meeting**, directly feeding the Meets tab.

**E. ABM Account Matching** *(reused as-is)*
- Upload a target account list (companies); match incoming people against it to raise ICP confidence.
- Feeds into a distinct/stricter ICP-matching profile in the workflow engine for account-matched people.

**F. CRM/List Sync — bidirectional**
- *Reused:* qualified leads → CRM export / CSV export (already built).
- *Net new:* import an external prospect list (no LinkedIn data attached) → enrichment resolves LinkedIn profile + email → cross-match against already-captured signals for "hits" → feed into workflows (e.g. auto-invite if not yet connected).

**G. Contact Notes / lightweight CRM** *(net new, low complexity)*
- Free-text notes attached to a contact/person record, for teams without a real CRM — handoff context between the person managing the tool and the salesperson actually reaching out.

**H. Signal Quality / Lead Warmth Scoring** *(net new, cross-cutting)*
- Recency-weighted signals — a like/comment on a months-old post shouldn't score the same as fresh engagement.
- Multi-signal threshold before promoting someone to "new lead" status (don't trust a single signal).
- Automatic low-confidence annotation ("may not be as warm as expected") when the promotion rule isn't met.
- Not a page/feature of its own — a scoring-logic layer threaded through B and C. Affects the credibility of "qualified lead," the product's core value metric.

**I. AI Insights / Content Ideation** *(net new, highest ambition)*
- Structured content briefs (not copy) — what worked, why it worked, why it's culturally relevant right now. Deliberately does not write the post itself; that stays the agency's job.
- Three layers of analysis: (1) tag/metadata trends, (2) deep text/structure analysis of what converted, (3) external trend signal (Reddit, Google Trends, broader web).
- Folded-in influencer/keyword discovery: since the AI is already scanning for trending people/topics, it can propose new LinkedIn influencers/keywords to track, not leave that to manual research.

## Gap analysis vs. Teamfluence today

| # | Feature | Status | Notes |
|---|---|---|---|
| A | Signal Engine (capture, 3 sources) | **Reuse as-is** | Only shift is framing/positioning and pricing packaging (10-seat minimum). |
| B | Analytics Dashboard | **Reuse + extend** | IA and ICP/engagement scoring transfer directly. Extend with content-object linkage and build out the stubbed Meets tab. |
| C | Workflow Engine | **Reuse as-is** | Needs multiple ICP-matching profiles per workflow. |
| D | Unified Inbox + AI replies | **New build** | Biggest net-new engineering item: DM read/reply capability, FAQ data model, AI drafting + confidence scoring, human-in-loop UI. High complexity, high value — closes the Meets gap. |
| E | ABM Account Matching | **Reuse as-is** | Already built; re-skin as client-facing target-account upload tied to workflow ICP profiles. |
| F | CRM Sync — export | **Reuse as-is** | Already built. |
| F | CRM Sync — import + enrichment | **New build** | Reverse direction of existing enrichment tech; moderate complexity, enrichment engine likely reusable via a new ingestion path. |
| G | Contact Notes | **New build, low complexity** | Simple data model + UI addition. Good early/easy win. |
| H | Signal Quality / Warmth Scoring | **New build, cross-cutting** | Scoring-logic design more than UI work; important to get right early since it underpins "qualified lead" credibility. |
| I | AI Insights / Content Ideation | **New build, highest ambition** | Phase (1)+(2) are moderate difficulty with current LLMs; (3) external web/trend scanning is highest complexity/cost — closer to its own product, recommend treating as a distinct roadmap phase. |

**Overall read:**
- **~40% direct port** (signal engine, dashboard core, workflow engine, ABM, CRM export) — de-risked, already proven in production.
- **~30% moderate new build** (unified inbox, CRM import/enrichment, warmth scoring) — extensions of existing tech/data models, not greenfield.
- **~30% genuinely new, higher-risk** (AI content ideation, especially external trend-scanning) — most of the differentiation lives here, but also the most scope discipline is needed to avoid overbuilding before v1 ships.

**Suggested phasing:**
- **v1** — reposition + port (A, B, C, E, F-export, G) + close the Meets loop with a simple manual "mark as meeting" before building the full inbox.
- **v2** — Unified Inbox (D) + CRM import (F) + warmth scoring (H).
- **v3** — AI Insights (I).
