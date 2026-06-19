const e=`# Pin-MI

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

In fields like counseling, customer service, and user research, strong communication skills are essential but ==hard to train without regular practice.== Pin-MI is a video-call tool that solves this with interactive role-playing, quick notes ("Pins"), structured self-reflection, and real-time peer feedback, ==making training easier and more effective.==

### Project Goal

Pin-MI has shown value in training for motivational interviewing, but now we're exploring broader uses, like user interview training or suicide hotline counseling. However, ==users often find Pin-MI confusing and difficult to use==, so it's also important to improve usability to make Pin-MI more user-friendly and intuitive.

:::goal
HMW: Expand Pin-MI to support broader communication skills training while improving usability for a more intuitive, accessible experience?
Users: Students learning user interviews and customer service representatives looking to practice communication skills.
Needs: Finding resources, balancing life priorities, and a low-pressure environment to practice.
:::

### Impact

:::metrics
+23% · Perceived usefulness
+20% · Pinning effectiveness
75% · Success Rate
:::

In final prototype testing, perceived usefulness for learning interview skills rose from 4.39 to 5.78 (out of 7). 3 out of 4 users completed the session and created at least one Pin without help, with Pinning scores increasing from 4.32 to 5.23.

---

## Solution Preview

Using Pin-MI is very challenging and confusing for new users — the interface lacks clear entry points, the role-play flow is cognitively demanding, and ==the reflection phase feels disconnected from the practice session.==

The redesign introduces ==three key improvements==: a centralized My Practice hub for session access and continuous learning, simplified icon-and-text Pinning to reduce cognitive load during role-play, and a streamlined reflection view with focused questions and a unified, editable Pin list.

:::before-after
Previous: ../../img/design/Pin-mi-img2.svg
New: ../../img/design/Pin-mi-img4.svg
PreviousLabel: The previous host view makes it difficult to remove or edit Pins and take general notes during a session.
NewLabel: The redesigned host view introduces icon-and-text tags, making it easy to mark thoughts without disrupting the conversation.
:::

Alongside the session improvements, the reflection phase was redesigned to feel like a ==natural continuation of practice.== Learners can now review all their Pins in one place, respond to direct prompts, and leave with actionable takeaways rather than incomplete notes.

:::before-after
Previous: ../../img/design/Pin-mi-img3.svg
New: ../../img/design/Pin-mi-img5.svg
PreviousLabel: Users frequently skipped reflection, missed Pins, and had no clear guidance on what to write.
NewLabel: Reflection is simplified with focused questions and a single editable Pin list — structured, clear, and easy to navigate.
:::

---

## Research

### Understanding the Problem and Testing with Users

I started with a **heuristic evaluation** to surface usability bugs and design opportunities, then worked directly with the engineer to resolve technical issues before testing. Once the product was stable, I ran an **unmoderated usability test** with 60 participants ==to assess Pin-MI's effectiveness for teaching interview skills==, comparing it against a control group of students practicing unbiased questioning and empathy.

:::gallery
../../img/design/Pin-mi-img6.svg | Heuristic Evaluation: Surfacing usability bugs and design gaps before testing with new users.
../../img/design/Pin-mi-img7.svg | Idea Prioritization: Mapping concepts against user impact and feasibility to narrow our focus.
:::

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

After the testing, I believed users were confused by Pin-MI due to vague instructions and an unintuitive layout. Therefore, ==clear guidance at each step== — through direct cues or subtle hints — would help them navigate better. In this iteration, I focused on tutorials, contextual guidance, and a clearer layout with visual reminders to clarify each feature.

:::callout Design Goal
Help users understand Pin-MI's functions and flow through clearer guidance, reduced confusion, and lighter cognitive load during role-play.
:::

:::concepts
== Provide Better Guidance to Reduce Confusion
To resolve the problem of user confusion and frustration (e.g. not knowing how to proceed, mis-clicks on Pins, confusion with what the tool is for), I decided to use tutorials and contextual guidance to provide clearer explanation.
-- Card-tutorial to introduce Pin-MI before users start | Pin-mi-img8.svg
-- Contextual help for specific features | Pin-mi-img9.svg | natural
== Encourage Users to Engage with Pin Reflections Using Nudges
Currently, students skip reflections due to multiple reasons: they don't make Pins during interviews, lack of clear instruction causes confusion, and there's no clear indicator that they can move on to the next Pin.
-- Before · Users don't click on the next Pin because it doesn't seem clickable | Pin-mi-img10.svg
-- After · Visual differences between "filled" and "unfilled" Pins, and navigation buttons | Pin-mi-img11.svg
-- Before · Doesn't tell users what to complete in the instruction | Pin-mi-img12.svg
-- After · Action-based instruction that clearly indicated what content is expected | Pin-mi-img13.svg
== How Might We Reduce the Cognitive Load During Role-play?
Students faced significant cognitive challenges during the Role-play Session. I tested two approaches: one offering full context and informative Pins for reflection, and the other focused on quick actions to lighten the mental load. A key testing question: is text-based Pins truly helpful for learners to reflect later?
-- Idea 1 · Provide full context & information | Pin-mi-img14.svg
-- Idea 2 · Quick feedback through buttons | Pin-mi-img15.svg
:::

### Oops... it's even more confusing

I conducted Think-Aloud usability tests with 4 participants acting as the "Host" in Pin-MI, and learned the following:

:::insights
Step-by-step guide landed well | Users generally believed that the revised version flows well and loved the step-by-step guide at the beginning.
Fatigue from added cognitive load | Sessions ran longer than expected; the tutorials added cognitive load rather than improving understanding.
Writing reflections remained hard | While users preferred the simpler Role-play V2 and valued making Pins, they still found it hard to write reflective content during the session.
:::

### A Pivot Towards Removing Unnecessary Instruction

Stepping back from the results, I realized the core issue wasn't about surface clarity but ==cognitive overload.== Users were asked to absorb information before the session, process more during role-play, reflect in real time, and hold meaningful discussions all at once. Instead of patching surface-level confusion, ==I shifted focus to reducing friction across the entire workflow.==

:::callout Revised Design Goal
Streamline workflows across roles, simplify note-taking and reflection, and promote continuous learning so that users can enjoy a smoother experience and complete tasks more efficiently for higher-quality learning.
:::

---

## Design

### Design feature 1: Introduce a "My Practice Page" for Structured and Continuous Learning

**Insight:** In the first iteration, I only included a basic download button for session records, but both user testing and stakeholder discussion highlighted that learning needs ==ongoing access to past recordings and notes== to reinforce knowledge and support growth.

**Solution:** The "My Practice" page is where learners understand how Pin-MI works, see session prep steps, and access past practice history. The host can easily start new sessions here, gaining ownership of the process.

![](../../img/design/Pin-mi-img16.svg)

:::feature-screens
../../img/design/Pin-mi-img18.svg
- Directly starting or joining a session.
- Only hosts can start a session; Participants and Trainers receive invitation.
- Check previous session and download notes.
../../img/design/Pin-mi-img19.svg | Past Sessions
../../img/design/Pin-mi-img20.svg | New Users
:::

### Design feature 2: Quality Feedback vs Focused Session — Introducing the 3rd Role "Trainer"

**Insight:** Pinning during conversation is too demanding, as learners juggle tasks and can't fully engage. It's necessary to simplify note-taking in role-play, prioritizing a seamless role-play and note-taking experience.

**Solution:** I introduced a third role: Trainer. By having the Trainer solely focus on listening and giving objective feedback, ==the host and participant can concentrate on their roles without the added burden.== In the future, AI could take over, offering personalized and accessible feedback.

![](../../img/design/Pin-mi-img21.svg)

Based on insights from user testing, I explored several ways for users to create Pins, including icon tags, text-based tags, and direct text input. Through iteration, I found that combining icons and text tags provided the best clarity. I also added an optional field for users who wanted to include additional descriptions.

:::image-box Design Options
../../img/design/Pin-mi-img22.svg
:::

The frames should also be tailored to each person's role. Participants don't need to provide much feedback, so their interface can be simpler. Trainers are expected to give detailed, informative feedback, so it's important to design a layout that makes inputting feedback easy and efficient.

:::image-tabs
Host | ../../img/design/Pin-mi-img23.svg | Pin with tags + session notes for Host
Participant | ../../img/design/Pin-mi-img24.svg | Only quick Pins for Participants
Trainer | ../../img/design/Pin-mi-img25.svg | Informative feedback for Trainer
:::

### Design feature 3: Simplified Collaborative Reflection and Feedback

**Insight:** Students often skip reflections because they didn't create Pins during role-play, the instructions are unclear, and they can only see one Pin at a time.

**Solution:** Reflection questions should be simple and focused on feedback. ==A list of Pins makes more sense than navigating through each one individually.==

:::feature-tabs
== Self Reflection | ../../img/design/Pin-mi-img26.svg
- A list of all the Pins made.
- Ask clear and straightforward question.
- Visual indicators for whether a Pin is completed and whether Host wants to share.
== Peer-feedback | ../../img/design/Pin-mi-img27.svg
- Color indicating Pin ownership.
- Each Pin has tags that indicate who pinned it and the tag type.
- Ask clear and direct questions.
:::

---

## Outcomes

### What Was the Outcome?

I tested the solution with a group of 4 students. Our results proved that Pin-MI is effective for training broader users, particularly students learning how to conduct user interviews. Pin-MI is also easier to use: ==3 out of 4 users completed the session and created at least one Pin without help==, compared to less than 50% (estimated) previous success rate.

### What's Next?

For the next step of the project, we were going to the implementation phase, starting with revising some of the key features before making large changes to the site. We also wanted to incorporate the use of AI for future implementation of the trainer role.

---

## My Learnings

### Balancing Stakeholders' Needs in an Educational Tool

Teachers value the reflection process and need evidence of it; students want something simpler and rarely feel motivated to reflect. These goals pulled in opposite directions, and ==no single design decision could satisfy both.== The real work was listening carefully to each stakeholder, separating core needs from preferences, and ==making deliberate trade-offs rather than trying to please everyone at once.==
`;export{e as default};
