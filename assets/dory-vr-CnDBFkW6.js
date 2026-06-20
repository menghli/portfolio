const e=`# DoryVR

Status: In progress
tag: Design

# DoryVR: Data storytelling and learning tool in mixed reality

Subtitle: Creating a custom XR environment to enhance data storytelling for graduate students
Eyebrow: Product Lead · 2024 Spring
Cover: ../../img/design/dory-vr/DoryVR-page-cover.svg

## Project Meta

| Field | Details |
|---|---|
| Role | Product Lead |
| Keywords | Product Strategy, Mixed Reality, Experiential Design and Testing |
| Timeline | 2024 Spring, 3 months |
| Team | 2 Engineers, 1 Tech Researcher, 2 UXD |

---

## Project Overview

### Preparing students for the hybrid workplace through better VR data storytelling

XR is becoming increasingly important in the hybrid workplace, with over half of companies already exploring VR in their operations (PwC, 2022). To prepare students for this shift, Heinz College at CMU launched the "Communication in VR" course, focusing on data storytelling in immersive media. However, with inadequate tools, students relied on screenshots, multiple notepads, and 2D images to present 3D data, which often led to ==visual clutter, reduced clarity, and low engagement==.

### Project goal

Our team aims to create a custom XR experience to enhance data storytelling for students in the "Communication in VR" course at Heinz College.

We plan to design an app that supports sharing a variety of media types, allowing students to explore, present, and discuss both 2D and 3D data. By leveraging VR's immersive capabilities, we hope to ==improve student engagement, promote interaction, and integrate a self-reflection process for presenters==.

:::goal
HMW: Create a custom VR environment that enhances data storytelling, promotes peer interaction, and improves student engagement and self-reflection?
:::

### Impact and outcomes

:::findings
USER TESTING | 3 rounds of usability testing with Heinz College students; participants reported higher engagement and greater clarity presenting complex data in VR, and valued the AR/VR mode switching.
NEXT STEP | Client plans to integrate DoryVR into future VR communication classes; design guidelines and a scalable system were documented to support future development.
:::

---

## Solution Overview

### Introducing DoryVR: Revolutionizing data presentations and VR learning

- **Individual Dashboards**, giving users control over their slideshows and data while providing feedback on presentations
- **Levels of Immersion**, allowing users to switch seamlessly between Virtual Reality and Augmented Reality
- **Scalable and Interactive Data Visualization**, enabling dynamic data visualizations and engaging storytelling

:::youtube
https://youtu.be/79jqLshvO5Q?si=IKBw8BPBcMb2cTIf
:::

---

## Research

### What are ways to enhance student engagement and understanding in data storytelling within a VR environment?

Our research centered on two questions: ==how to make VR data storytelling more active for students, and how students actually learn to communicate in immersive environments==.

We explored both through literature review, expert interviews, competitive analysis, and field observations.

:::research-findings
== 01 | full
2D data limits engagement and clarity
Students struggle with visual clutter and information overload when presenting 3D data on 2D slides, reducing engagement and making it harder to communicate effectively.
DoryVR-img1.svg
== 02 | split
Students lack control and tailored feedback
Current VR tools give all users the same view, leaving presenters without individualized control or speaker notes. Students reported wanting more personalized feedback for self-improvement.
DoryVR-img2.svg | Students present in an unconventional classroom setting: the woods
== 03 | full
VR offers immersion but raises accessibility concerns
While VR enables richer spatial storytelling, many students experience motion sickness. AR provides a more accessible alternative by blending virtual content into physical spaces.
DoryVR-img3.svg
:::

From these insights, we ran a crazy 8 brainstorm and a design charrette to generate and converge on ideas for lo-fi prototyping.

![Crazy 8 Ideation](../../img/design/dory-vr/DoryVR-img4.svg)
![Design Charrette](../../img/design/dory-vr/DoryVR-img5.svg)

## How Might We

### How might we...

:::priority-blocks
Adapt to new norms | Make XR data storytelling adaptable to the behavioral norms emerging in immersive spaces. | layers
Hands-on storytelling | Use XR's advantages to give students a more active, nuanced way to explore and present data. | chart
Fully immersive learning | Leverage XR to create a learning experience that goes beyond the screen. | expand
:::

---

## Exploration

:::challenge-cards
== Challenge 1: How we creatively prototyped VR data storytelling experience
Without sufficient tech support, crafting an immersive experience in an interactive way was pretty challenging. We used **Minecraft** to build out our "data presentation table" to quickly simulate a 3D environment.
During our testings, users felt constrained and overwhelmed, which showed us that ==imagining 3D storytelling is very different from experiencing it==. To address this, we prototyped an open-air auditorium on the ocean, creating ==a sense of infinite space and focus==.
In our final prototype we moved into Unity, using real datasets and interactive features like highlighting and toggling to make data storytelling ==both immersive and effective==.
--side DoryVR-img6.svg | Lo-fi prototype in Minecraft + DoryVR-img7.svg | Final prototype in Unity
== Challenge 2: How we "pivoted" to create better experience delivering 3D data information
After testing the Minecraft prototype, users enjoyed the interactive style but found the data visualizations unhelpful—for example, comparing bar graphs was difficult. Our client also challenged us to rethink: ==what are some types of data, and how can they be displayed or manipulated in VR?==
Actually, as illustrated below, ==not all data are suitable for 3D display==. For instance, pie charts are perceived most accurately when displayed on 2D flat screens. However, viewing a scatterplot with 3 dimensions on a 2D screen would be problematic.
--side DoryVR-img8.svg | The perception of 3D pie charts is not ideal + DoryVR-img9.svg | Datasets with 3 or more dimensions would be great in VR
We imported 3D dataset models and added interactions like highlighting and toggling visibility. With other features like adjustable immersion levels enabling AR viewing, these enhancements ==greatly improved the experience in both VR and AR==.
--stack DoryVR-img10.svg + DoryVR-img11.svg
== Challenge 3: How we adapted data storytelling for XR for better user control and self-learning
From our user study, we identified several pain points in how people currently present, such as ==no control of the slides, over-emphasis on reciting notes, and action/emotion disconnection== in sharing content. So, how can we empower users to equip them a sense of control and connection with the audience when presenting data in this class?
We tested our initial storyboards and learnt the key user needs & features:
* ✅ Control over all presentation materials and elements. Timers are great.
* ✅ Additional resources (e.g. datasets) should be stored separately.
* ✅ ==Improve through self-paced reflection and time-stamped feedback.==
* ⚠️ Make sure that slides are synced for the audience.
* ⚠️ Interface needs to be simplified to reduce cognitive load.
--side DoryVR-img12.svg | Individual Dashboard + DoryVR-img13.svg | Self-reflection
== Challenge 4: How we ensured an accessible & immersive experience
VR meetings aren't for everyone. Students reported ==motion sickness and fatigue during 80-minute sessions==, and with attendance split between in-person and remote, one solution didn't fit all. We explored letting users control their level of immersion by switching between VR and AR.
We analyzed three scenarios to find where this added real value. In-person users could overlay 3D data in AR while staying present in the room; remote users could reduce immersion when comfort became an issue. Hybrid setups proved too visually complex, so we focused on the first two.
Testing revealed something unexpected: ==participants kept imagining immersion switching working alongside other features==. They wanted data to explore, not just observe. That insight led us to ==connect dashboards, 3D materials, and view modes into a single integrated experience==.
--side DoryVR-img14.svg | Level of immersion User Flow + DoryVR-img15.svg | Connecting the Dashboard with Virtual Materials
:::

---

## Design

:::design-sticky
== 01 | Individual dashboards
Students struggle with visual clutter and information overload when presenting 3D data on 2D slides, reducing engagement and making it harder to communicate effectively, as well as students' ability to explore.
-- DoryVR_Dashboard.mp4 | Individual Dashboard Design
-- DoryVR_VR_dashboard.mp4 | Using Dashboard in VR setting
-- DoryVR_reflectionVR.mp4 | Students can watch videos and reflect on their presentation
== 02 | Scalable interactive data
Experience data beyond 2D screens as students interact with 3D scatter plots and spatial GIS maps. By dragging files from the dashboard, they can scale, highlight, and zoom, switching between a table view and a room view for a fully immersive experience.
-- DoryVR_Data_dash.mp4 | Using dashboard to navigate to different modes
-- DoryVR_small viz.mp4 | Walk-through Experience Mode
-- DoryVR_central.mp4 | Centralized Presentation Mode
== 03 | Switching levels of immersion
Hybrid working and learning are becoming more common, but interpersonal interaction is missing. DoryVR addresses this by allowing users to easily switch levels of immersion, making meetings more accessible and connected.
-- DoryVR-adjust.mp4 | Switching the Level of Immersion
-- DoryVR_AR.mp4 | Data Presentation in AR Experience
:::

---

## Outcomes

### What was the outcome?

We tested the solution with a new group of students and received ==100% positive feedback==. When we presented it to our client, she was pleased with the immersive data interaction and how it enhanced student engagement in class.

After showcasing the concept prototype in Unity, we handed off the Unity project and implementation plan to the client, who will take over from here.

> "This is super helpful because right now I was told that it's hard to switch slides now. It's easier to control now."

> "The walk-in mode is very immersive, interesting, and playful. I like the option to scale your own data and engage with your own dataset."

> "I really like this feature [Dashboard], having the transcript and feedback would be good for learning."

---

## My Learnings

### Being a support for the team as well as being supported by the team

I joined the team as the sole researcher, while the rest of the team members had been collaborating with each other for a long time. Because it was such a small team, I decided to start by ==learning contextual information and identifying what people were frustrated or concerned about== before making any research plans. This not only helped me adjust research focus and synthesize results that were more useful for each member but also helped in ==gaining support and trust from them==.
`;export{e as default};
