const e=`# DoryVR

Status: In progress
tag: Design

# DoryVR: Data Storytelling and Learning Tool in Mixed Reality

Subtitle: Creating a custom XR environment to enhance data storytelling for graduate students
Eyebrow: Product Lead · 2024 Spring
Cover: ../../img/design/DoryVR-page-cover.svg

## Project Meta

| Field | Details |
|---|---|
| Role | Product Lead |
| Keywords | Product Strategy, Mixed Reality, Experiential Design and Testing |
| Timeline | 2024 Spring, 3 months |
| Team | 2 Engineers, 1 Tech Researcher, 2 UXD |

---

## Project Overview

### Preparing Students for the Hybrid Workplace Through Better VR Data Storytelling

XR is becoming increasingly important in the hybrid workplace, with over half of companies already exploring VR in their operations (PwC, 2022). To prepare students for this shift, Heinz College at CMU launched the "Communication in VR" course, focusing on data storytelling in immersive media. However, with inadequate tools, students relied on screenshots, multiple notepads, and 2D images to present 3D data, which often led to visual clutter, reduced clarity, and low engagement.

### Project Goal

Our team aims to create a custom XR experience to enhance data storytelling for students in the "Communication in VR" course at Heinz College.

We plan to design an app that supports sharing a variety of media types, allowing students to explore, present, and discuss both 2D and 3D data. By leveraging VR's immersive capabilities, we hope to improve student engagement, promote interaction, and integrate a self-reflection process for presenters.

:::goal
HMW: Create a custom VR environment that enhances data storytelling, promotes peer interaction, and improves student engagement and self-reflection?
:::

### Impact and Outcomes

**User Testing:** Across 3 rounds of usability testing with Heinz College students, participants reported higher engagement and greater clarity when presenting complex data in VR. Students especially valued the interactive dashboards and the ability to switch between AR and VR modes to reduce motion sickness.

**Next Step:** Following the course, our client expressed strong interest in integrating DoryVR into future VR communication classes as a teaching aid. We also documented design guidelines and a scalable system to support further development, ensuring that future teams can extend the platform for broader classroom and workplace applications.

---

## Solution Overview

### Introducing DoryVR: Revolutionizing Data Presentations and VR Learning

- **Individual Dashboards**, giving users control over their slideshows and data while providing feedback on presentations
- **Levels of Immersion**, allowing users to switch seamlessly between Virtual Reality and Augmented Reality
- **Scalable and Interactive Data Visualization**, enabling dynamic data visualizations and engaging storytelling

---

## Research

### What Are Ways to Enhance Student Engagement and Understanding in Data Storytelling Within a VR Environment?

In the research phase, we identified two main focuses: how do we make the process behind learning how to storytell with data in VR more involved for students? And what are students' behaviors and learning processes behind VR communication and data storytelling?

To answer those questions, we adopted various approaches, including literature review, expert interview, competitive analysis, interviews, and field observations.

### 01: 2D Data Limits Engagement and Clarity

Students struggle with visual clutter and information overload when presenting 3D data on 2D slides, reducing engagement and making it harder to communicate effectively, as well as students' ability to explore.

### 02: Students Lack Control and Tailored Feedback

Current VR tools give all users the same view, leaving presenters without individualized control or speaker notes. Students also reported wanting more personalized feedback for self-improvement.

### 03: VR Offers Immersion but Raises Accessibility Concerns

While VR enables richer spatial storytelling, many students experience motion sickness. AR provides a more accessible alternative by blending virtual content into physical spaces.

## How Might We

### How Might We...

- Make XR data storytelling and presentation adaptable to new behavioral norms in the VR space?
- Use the advantages of XR to give students a more hands-on, nuanced data storytelling experience?
- Leverage the advantages of XR to provide students with a fully immersive learning experience?

Based on our research insights and three key questions, our team used **crazy 8** to brainstorm design solutions on a virtual wall to discuss and compare ideas. We then conducted a **design charrette for 8 ideas**, sketching on a whiteboard to refine our concepts. This process allowed us to narrow our focus for the lo-fi prototyping stage.

---

## Exploration

### Challenge 1: How We Creatively Prototyped VR Data Storytelling Experience

Without sufficient tech support, crafting an immersive experience in an interactive way was pretty challenging. We used **Minecraft** to build out our "data presentation table" to quickly simulate a 3D environment.

During our testings, users felt constrained and overwhelmed, which showed us that imagining 3D storytelling is very different from experiencing it. To address this, we prototyped an open-air auditorium on the ocean, creating a sense of infinite space and focus.

In our final prototype we moved into Unity, using real datasets and interactive features like highlighting and toggling to make data storytelling both immersive and effective.

---

## Design

### 01: Individual Dashboards

Students struggle with visual clutter and information overload when presenting 3D data on 2D slides, reducing engagement and making it harder to communicate effectively, as well as students' ability to explore.

### 02: Scalable Interactive Data

Experience data beyond 2D screens as students interact with 3D scatter plots and spatial GIS maps. By dragging files from the dashboard, they can scale, highlight, and zoom, switching between a table view and a room view for a fully immersive experience.

### 03: Switching the Levels of Immersion for Better Accessibility

Hybrid working and learning are becoming more common, but interpersonal interaction is missing. DoryVR addresses this by allowing users to easily switch levels of immersion, making meetings more accessible and connected.

---

## Outcomes

### What Was the Outcome?

We tested the solution with a new group of students and received 100% positive feedback. When we presented it to our client, she was pleased with the immersive data interaction and how it enhanced student engagement in class.

After showcasing the concept prototype in Unity, we handed off the Unity project and implementation plan to the client, who will take over from here.

> "This is super helpful because right now I was told that it's hard to switch slides now. It's easier to control now."

> "The walk-in mode is very immersive, interesting, and playful. I like the option to scale your own data and engage with your own dataset."

> "I really like this feature [Dashboard], having the transcript and feedback would be good for learning."

---

## My Learnings

### Importance of Checking Testing Details

There was a miscommunication between me and the engineer — I didn't know we only had an iOS version, so I didn't include that in the screener. This led to serious issues with recruiting participants as not all of them had phones with iOS. Although we found ways to help each participant obtain a device, this was a lesson to check every single detail of the testing process.

### Being a Support for the Team as Well as Being Supported by the Team

I joined the team as the sole researcher, while the rest of the team members had been collaborating with each other for a long time. Because it was such a small team, I decided to start by learning contextual information and identifying what people were frustrated or concerned about before making any research plans. This not only helped me adjust research focus and synthesize results that were more useful for each member but also helped in gaining support and trust from them.
`;export{e as default};
