const e=`# Work 365: A UX strategy to reduce friction and scale onboarding

Status: In progress
tag: Design

# Work 365: A UX strategy to reduce friction and scale onboarding

Subtitle: A two-phase UX strategy to reduce friction and scale onboarding for a complex B2B platform
Eyebrow: Capstone Project · 2026 Spring
Cover: ../../img/design/work365/Work365-page-cover.svg

## Project Meta

| Field | Details |
|---|---|
| Role | Research Lead and Designer |
| Keywords | B2B Design, UX Strategy, AI Integration, Onboarding |
| Timeline | Jan 2026 – May 2026 |
| Team | Team of 4 — Product, UX, and Engineer |

---

## Project Overview

### The Platform

Work 365 is a subscription management and billing automation platform used by CSPs, built natively on the Microsoft Power Platform and integrating with Dynamics 365, Microsoft Partner Center, and Microsoft Azure.

### Project Goal

As the platform expanded, users faced increasing challenges with navigation complexity, system visibility, and a steep learning curve. Despite being a platform people relied on daily, ==even experienced users struggled to complete routine tasks== without getting lost or dependent on support.

> *"Everything's dependent on everything."*

:::goal
HMW: Design a more learnable, scalable Work 365 experience that reduces friction in critical workflows and empowers users to onboard and operate independently?
Users: CSP customers and internal Work 365 users.
Needs: Reduce time-to-independence, minimize workflow errors, and decrease support dependency.
:::

### Impact and Outcomes

:::metrics
4/5 · Task Success Rate (Phase 1)
10 → 4 · Clicks to Complete Key Workflow
3/3 · Positive Usability Tests (Phase 2)
:::

The sponsor expressed clear intent to move both phases forward, and early clients responded with enthusiasm to the onboarding assistant as a solution to a pain point they had lived with for years. For a platform that serves CSPs managing thousands of subscriptions daily, reducing onboarding time and workflow errors has ==direct revenue and retention implications==.

---

## Research

We ran a design audit to identify existing usability issues, a competitive analysis to understand how similar platforms handle complexity, and 6 interviews with a mix of customers and internal employees to understand how people actually use the platform day to day. ==Three themes emerged consistently.==

:::auto-gallery
Work365-img1.svg | Market Positioning Matrix
Work365-img2.svg | Onboarding Assistant Key Use Flow
Work365-img3.svg | Onboarding Service Blueprint
Work365-img4.svg | Onboarding Key Tasks
:::

:::findings
ONBOARDING CHALLENGES | Users struggle with complex terminology and system setup. Errors and reliance on support teams cause delays and limit their ability to move forward independently. · *"I didn't even know what half the terms meant. I had to ask someone every time I got stuck."*
SUBSCRIPTION FLOW ISSUES | Limited visibility into system events and multi-step workflows make tasks harder than they need to be, forcing users into manual tracking. · *"I have no idea what's happening in the background. I just hope it processed correctly."*
MENTAL OVERLOAD | The platform's high degree of customization requires extreme familiarity to use effectively. Most users develop rigid workflow dependencies just to cope. · *"There are so many options but I only ever use three of them. The rest just gets in the way."*
:::

---

## Exploration

### Proposed UX Strategy

The platform's complexity meant a single redesign wouldn't be enough — we needed ==immediate impact while showing the strategy could scale==. Three principles guided every decision:

:::priority-blocks
Design for learnability | | learn
Simplify complex workflows | | funnel
Provide guided visibility | | eye
:::

:::phase-split
PHASE 1 | Targets the **existing platform**, reducing friction in subscription management to create replicable patterns.
PHASE 2 | Extends the strategy into a **new system**, showing what a scalable, AI-supported experience could look like.
:::

---

## Design Decisions

Not everything that surfaced in research made it into the design. Two areas came up early and both required a deliberate call to step back.

:::challenge-cards
== Knowing what not to chase
Nested navigation was one of the first things users mentioned. It was genuinely confusing, and my instinct was to fix it. But once I mapped it out, it became clear that a fix scoped to subscription management alone would leave the rest of the platform untouched. A platform-wide redesign was out of scope, and the sponsors were clear: they wanted patterns that could be replicated across workflows, not a one-off solution. I let go of the navigation problem and ==redirected focus toward something more transferable==.
== Not every insight needs to become a feature
The dashboard came up in research too. Users were pulling data into external tools because the built-in visibility just was not enough. I found it genuinely interesting and spent some time thinking through what better dashboard design could look like. But when I brought it to the PM, it was clear ==this was not where the product needed to go right now==. I made the call to move on and put that energy toward areas with more immediate impact.
:::

---

## Solution Overview

### Phase 1: Smart Assist Panel

The Smart Assist Panel is built directly into the existing interface, giving users a way to complete subscription tasks without losing context. It ==proactively surfaces subscriptions that need attention== and supports both individual and bulk editing ==without requiring users to switch tabs or navigate away==.

:::before-after
Previous: Work365-img7.svg
New: Work365-video1.mp4
PreviousLabel: Users had to click through the full subscription list to make changes on items.
NewLabel: The Smart Assist Panel surfaces expiring subscriptions proactively and supports inline editing without leaving the page.
:::

:::image-stack
Work365-img8.svg
Work365-img9.svg
:::

:::divider
 
:::

## Design

### Phase 2: Prolonged onboarding

:::metrics
8+ steps · To complete initial platform setup
3+ months · Average time before a client operates independently
6 hrs · Of guided training required before clients can operate independently
:::

### Phase 2 Solution: AI-driven onboarding assistant

The onboarding assistant is a standalone web app built to address ==the above problems about onboarding==: new customers spending months getting up to speed on a platform they rely on daily. It centralizes documentation, learning modules, ticketing, and an AI assistant into ==a single structured workflow==, replacing the fragmented mix of emails, tutorials, and manual support handoffs that currently defines the onboarding experience.

**How we built it**

![](../../img/design/work365/Work365-img5.svg)

![](../../img/design/work365/Work365-img10.svg)

![](../../img/design/work365/Work365-img11.svg)

Our 3 usability tests showed strongly positive feedback from both sponsors and early clients, with users highlighting the AI assistant and modular learning structure as the most valuable parts of the experience.

---

## Outcomes

> *"I can see this speeding things up for clients — and it is something that could be applied across the entire system."*
> — Sponsor Review

### Next steps

All deliverables are being packaged for handoff to the Iotap product and engineering team, with documentation clear enough to remain useful through future team changes.

:::phase-split
PHASE 1 | Evaluate feasibility within the existing **Power Apps environment**. No major architectural changes required.
PHASE 2 | Requires engineering work on data integration, authentication, and multi-tenancy, plus broader client testing before production.
:::

---

## My Learnings

### Designing within real constraints

Work 365 runs on Power Apps and Dynamics 365, and that changes everything. Ideas that felt strong in Figma had to hold up inside an existing system with real engineering limits and hundreds of active subscriptions. ==Some things I liked didn't make the cut.== What I ended up with was more conservative than I originally wanted, but also ==more honest about what could actually ship==. That tradeoff felt like the more important thing to get right.
`;export{e as default};
