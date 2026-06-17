# Pin-MI

Status: In progress
tag: Design

# Redesigning the Experiential Learning of Interview Skills through Role-play

Subtitle: Expanding Pin-MI's usability and scope for broader communication skills training
Eyebrow: CMU COEX LAB · 2024 Summer
Cover: ../../img/design/PinMI-page-cover.svg

## Project Meta

| Field | Details |
|---|---|
| Role | UX Designer |
| Keywords | Website Audit, Usability Testing, Product Strategy |
| Timeline | 2024 Summer |
| Team | 1 Engineer, 1 PM, 1 UXD |

---

## Project Overview

### What is Pin-MI?

In fields like counseling, customer service, and user research, strong communication skills are essential but hard to train without regular practice. Pin-MI is a video-call tool that solves this with interactive role-playing, quick notes ("Pins"), structured self-reflection, and real-time peer feedback, making training easier and more effective.

### Project Goal

Pin-MI has shown value in training for motivational interviewing, but now we're exploring broader uses, like user interview training or suicide hotline counseling. However, users often find Pin-MI confusing and difficult to use, so it's also important to improve usability to make Pin-MI more user-friendly and intuitive.

**How might we expand Pin-MI to support broader communication skills training while improving usability for a more intuitive, accessible experience?**

**Target Users:** Students learning user interviews and customer service representatives looking to practice communication skills.

**Key User Needs:** Finding resources, balancing life priorities, and a low-pressure environment to practice.

### Impact

:::metrics
+23% · Perceived usefulness
+20% · Pinning effectiveness
75% · Success Rate
:::

In final prototype testing, perceived usefulness for learning interview skills rose from 4.39 to 5.78 (out of 7). 3 out of 4 users completed the session and created at least one Pin without help, with Pinning scores increasing from 4.32 to 5.23.

---

## Solution Overview

### Framing the Problem

Using Pin-MI is very challenging and confusing for new users — the interface lacks clear entry points, the role-play flow is cognitively demanding, and the reflection phase feels disconnected from the practice session.

### 01: A Central Hub for Structured and Continuous Learning

The "My Practice" page is a central hub where learners understand how Pin-MI works and view past practice. Learners can also start new sessions directly from this page or receive invitations from the hosts.

### 02: Make a Reflective Pin with Simple Tags for Focused Sessions

Introduced tags for learners to quickly mark reflection points, helping hosts stay focused. Added a "Trainer" role with tailored interfaces for each role to reduce cognitive load.

### 03: Simplified Collaborative Reflection and Feedback

Reflection is simplified with clear, feedback-focused questions. All Pins appear in a single, editable list with checkmarks for completed items, reducing extra navigation.

---

## Research

### Understanding Current User Flow and Design Audit

We started with a **heuristic evaluation** to uncover bugs, usability issues, and design opportunities. Before diving into usability testing with our new audience (a group of students learning how to conduct user interviews), I took the chance to fix those bugs and technical issues with the engineer. Once that was done, we were ready to test how effective Pin-MI could be for teaching general interview skills.

### Usability Testing: Identify User Pain Points

We ran an **unmoderated usability test** with 60 participants comparing Pin-MI with a control group to identify usability issues and assess its impact on interview and customer service skills. Students from a User Research course trying to practice unbiased questioning and empathy participated as our target group.

### Overall, we learned 4 key insights to drive our design direction

:::findings
COGNITIVE LOAD | Pinning while having a back-and-forth conversation is too cognitively demanding.
CLARITY & UNDO | Users are confused and frustrated about using Pin-MI because of a lack of clarity and undo functionality.
REFLECTION GAPS | Students skip reflections because they didn't make Pins during role-play and instructions are unclear.
SESSION ACCESS | Lack of access to previous sessions hinders continuous learning and peer support.
:::

---

## Exploration

### From Findings to Insights

After the testing, I believed users were confused by Pin-MI due to vague instructions and an unintuitive layout. Therefore, clear guidance at each step — through direct cues or subtle hints — would help them navigate better. In this iteration, I focused on tutorials, contextual guidance, and a clearer layout with visual reminders to clarify each feature.

:::callout Design Goal
Help users understand Pin-MI's functions and flow through clearer guidance, reduced confusion, and lighter cognitive load during role-play.
:::

### Concept 1: Provide Better Guidance to Reduce Confusion

To resolve the problem of user confusion and frustration (e.g. not knowing how to proceed, mis-clicks on Pins, confusion with what the tool is for), I decided to use tutorials and contextual guidance to provide clearer explanation.

### Concept 2: Encourage Users to Engage with Pin Reflections Using Nudges

Currently, students skip reflections due to multiple reasons: they don't make Pins during interviews, lack of clear instruction causes confusion, and there's no clear indicator that they can move on to the next Pin.

### Concept 3: How Might We Reduce the Cognitive Load During Role-play?

Students faced significant cognitive challenges during the Role-play Session. I tested two approaches: one offering full context and informative Pins for reflection, and the other focused on quick actions to lighten the mental load.

A key testing question: is text-based Pins truly helpful for learners to reflect later?

### Oops... it's even more confusing

I conducted Think-Aloud usability tests with 4 participants acting as the "Host" in Pin-MI, and learned the following:

- Users generally believed that the revised version flows well and loved the step-by-step guide at the beginning.
- Sessions ran longer than expected, leading to fatigue; the tutorials added cognitive load rather than improving understanding.
- While users preferred the simpler Role-play V2 and valued making Pins, they still found it hard to write reflective content during the session.

### A Pivot Towards Removing Unnecessary Instruction

After not-so-good results from user testing, I stepped back to think about why users need Pins, what their main goals are, and how Pins could truly support reflection. I realized the core issue was that we were asking users to handle too much at once: absorbing information before the session, processing more during role-play, reflecting in real time, and trying to hold meaningful discussions.

Instead of fixing surface-level issues, I decided to rethink the entire experience. The goal should be removing barriers and reducing cognitive load for students to continuously learn, instead of making more Pins or just having a better understanding of the tool.

:::callout Revised Design Goal
Streamline workflows across roles, simplify note-taking and reflection, and promote continuous learning so that users can enjoy a smoother experience and complete tasks more efficiently for higher-quality learning.
:::

---

## Design

### DESIGN FEATURE 1: Introduce a "My Practice Page" for Structured and Continuous Learning

**Insight:** In the first iteration, I only included a basic download button for session records, but both user testing and stakeholder discussion highlighted that learning needs ongoing access to past recordings and notes to reinforce knowledge and support growth.

**Solution:** The "My Practice" page is where learners understand how Pin-MI works, see session prep steps, and access past practice history. The host can easily start new sessions here, gaining ownership of the process.

:::compare Before | After
- Users can't access previous sessions
- Need to pre-assign room and role before joining
- Start session and resume on the same page
---
1. Directly starting or joining a session.
2. Only hosts can start a session; Participants and Trainers receive invitation.
3. Check previous session and download notes.
:::

### DESIGN FEATURE 2: Quality Feedback vs Focused Session — Introducing the 3rd Role "Trainer"

**Insight:** Pinning during conversation is too demanding, as learners juggle tasks and can't fully engage. It's necessary to simplify note-taking in role-play, prioritizing a seamless role-play and note-taking experience.

**Solution:** I introduced a third role: Trainer. By having the Trainer solely focus on listening and giving objective feedback, the host and participant can concentrate on their roles without the added burden. In the future, AI could take over, offering personalized and accessible feedback.

Based on insights from user testing, I explored several ways for users to create Pins, including icon tags, text-based tags, and direct text input. Through iteration, I found that combining icons and text tags provided the best clarity. I also added an optional field for users who wanted to include additional descriptions.

The frames should also be tailored to each person's role. Participants don't need to provide much feedback, so their interface can be simpler. Trainers are expected to give detailed, informative feedback, so it's important to design a layout that makes inputting feedback easy and efficient.

### DESIGN FEATURE 3: Simplified Collaborative Reflection and Feedback

**Insight:** Students often skip reflections because they didn't create Pins during role-play, the instructions are unclear, and they can only see one Pin at a time.

**Solution:** Reflection questions should be simple and focused on feedback. A list of Pins makes more sense than navigating through each one individually.

**Self Reflection Key Features:**

1. Users can click on the Pins (or create more) to see the content.
2. A list of all the Pins made in the same view.
3. Ask clear and direct questions.
4. Visual indicators for whether a Pin is completed and whether Host wants to share.

**Peer-feedback Key Features:**

1. Color indicating Pin ownership.
2. Each Pin has tags that indicate who pinned it and the tag type.
3. Ask clear and direct questions.

---

## Outcomes

### What Was the Outcome?

I tested the solution with a group of 4 students. Our results proved that Pin-MI is effective for training broader users, particularly students learning how to conduct user interviews. Pin-MI is also easier to use: 3 out of 4 users completed the session and created at least one Pin without help, compared to less than 50% (estimated) previous success rate.

### What's Next?

For the next step of the project, we were going to the implementation phase, starting with revising some of the key features before making large changes to the site. We also wanted to incorporate the use of AI for future implementation of the trainer role.

---

## My Learnings

### Balancing Stakeholders' Needs in an Educational Tool

Pin-MI stands out from typical video platforms by allowing students to interview each other while building interview skills. However, while teachers value the reflection process and require evidence of it, students prefer a simpler, more engaging experience and often lack motivation for reflection tasks. Balancing these needs was challenging, and I learned the importance of listening to stakeholders, understanding core needs, and setting clear priorities.

### Realizing Technical Limitations and Designing Within Constraints

From user testing to workflow redesign, I collaborated closely with two front-end engineers to address technical issues and assess feasibility. For an early-stage tool like Pin-MI, technical glitches were the main challenge, so we prioritized and clarified bugs together. We also explored future features, balancing user needs, business goals, and technical feasibility. While we initially considered speaker identification, testing showed it wasn't essential to users and was technically challenging, so we chose to drop it.
